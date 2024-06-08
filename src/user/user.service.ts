import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto, UserFromToken } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async signUp(username: string, password: string): Promise<{ token: string }> {
        const findUser = await this.userModel.findOne({ username });
        if (findUser) {
            throw new UnauthorizedException('User with this username already exists.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.userModel.create({
            username: username,
            password: hashedPassword,
        });
        const { password: newUserPassword, ...user } = newUser.toObject();
        const token = this.jwtService.sign(user, { secret: this.configService.get<string>("JWT_SECRET_KEY") });
        return { token };
    }
    
    async logIn(username: string, password: string): Promise<{ token: string }> {
        const findUser = await this.userModel.findOne({ username });
        if (!findUser) throw new UnauthorizedException('Invalid credentials.');
        const isPasswordMatched = await bcrypt.compare(password, findUser.password); 
        if (!isPasswordMatched) {
            throw new UnauthorizedException('Invalid credentials.');
        }
        const { password: findUserPassword, ...user } = findUser.toObject();
        const token = this.jwtService.sign(user, { secret: this.configService.get<string>("JWT_SECRET_KEY") });
        return { token };
    }

    async updateToken(req: Request): Promise<{ token: string }> {
        const oldTokenUser: UserFromToken = req['user'];
        console.log(oldTokenUser);
        const { password, ...user } = (await this.userModel.findById(oldTokenUser._id)).toObject();
        if (!user) throw new UnauthorizedException("Your token is not authorized");
        const token = this.jwtService.sign(user, { secret: this.configService.get<string>("JWT_SECRET_KEY") });
        return { token };
    }

    async getUsers(id_array?: string[]): Promise<UserFromToken[]> {
        // getting all users or users by id array
        const users = id_array ? (await this.userModel.find({ _id: { $in: id_array } })) : (await this.userModel.find());

        // transformation user documents to omit passwords
        return users.map((user: UserDocument) => { const {password, ...userObj} = user.toObject(); return new UserFromToken(userObj) })
    }

    async getUserById(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) throw new BadRequestException("This user does not exist");

        const { password, ...responseUser } = user.toObject();
        return responseUser;
    }

    async updateUser(user: UpdateUserDto, req: Request) {
        const { id, ...userToUpdate } = user;
        const reqUser: UserFromToken = req['user'];
        if (reqUser.role !== "ADMIN") {
            if (id !== reqUser._id.toString()) throw new ForbiddenException("You do not have permissions to do this");
            else if (userToUpdate.role) throw new ForbiddenException("You do not have permissions to do this");
        }
        const newFields = {};

        // adding property to newFields if not empty
        for (const prop in userToUpdate) {
            if (userToUpdate[prop]) {
                newFields[prop] = userToUpdate[prop];
            }
        }
        if (!Object.keys(newFields).length) {
            throw new BadRequestException("You're trying to update, but you haven't specified anything");
        }

        const newUser = await this.userModel.findByIdAndUpdate(id, newFields, { new: true });
        if (!newUser) throw new BadRequestException("This user does not exist");

        const { password, ...updatedUser } = newUser.toObject();
        const token = this.jwtService.sign(updatedUser, { secret: this.configService.get<string>("JWT_SECRET_KEY") });
        return { token };
    }

    async deleteUser(id: string, req: Request) {
        const reqUser: UserFromToken = req['user'];
        if (reqUser.role !== "ADMIN") throw new ForbiddenException("You do not have permissions to do this");
        const userToDelete = await this.userModel.findByIdAndDelete(id);
        if (!userToDelete) throw new BadRequestException("This user does not exist");
        return { message: "User deleted successfully" };
    }
}
