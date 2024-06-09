import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export enum Roles {
    USER = "USER",
    ADMIN = "ADMIN"
}

export class LogInDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    @ApiProperty({
        description: "The username of user",
        minLength: 2,
        maxLength: 30
    })
	readonly username: string

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    })
    @MinLength(8)
    @MaxLength(20)
    @ApiProperty({
        description: "The password of the user",
        minLength: 8,
        maxLength: 20
    })
    readonly password: string
}

export class SignUpDto extends LogInDto {
    @IsEnum(Roles)
    @IsOptional()
    @ApiProperty({ description: 'The role of the user', enum: Roles, required: false, default: 'USER' })
    readonly role?: Roles = Roles.USER;
}

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "ID of user that will be updated"
    })
    readonly id: string

    @IsString()
    @MinLength(2)
    @MaxLength(30)
    @IsOptional()
    @ApiProperty({
        description: "New username of updated user",
        minLength: 2,
        maxLength: 30,
        required: false
    })
    readonly username?: string

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @IsStrongPassword({
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    })
    @IsOptional()
    @ApiProperty({
        description: "New password of user",
        minLength: 8,
        maxLength: 20,
        required: false
    })
    readonly password?: string

    @IsString()
    @MaxLength(50)
    @IsOptional()
    @ApiProperty({
        description: "New aboutMe of user",
        maxLength: 50,
        required: false
    })
    readonly aboutMe?: string

    @IsString({ each: true })
    @IsOptional()
    @ApiProperty({
        description: "New posts of user (add or remove posts of user)",
        required: false
    })
    readonly posts?: Types.ObjectId[]

    @IsEnum(Roles)
    @IsOptional()
    @ApiProperty({
        description: "New role of user (can be changed by other user with ADMIN role)",
        required: false,
        enum: Roles
    })
    readonly role?: Roles
}

export class DeleteUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "ID of user that will be deleted"
    })
	readonly id: string
}

export class UserFromToken {
    @ApiResponseProperty({ type: String })
    _id: Types.ObjectId

    @ApiResponseProperty({ type: String })
    username: string

    @ApiResponseProperty({ type: String })
    aboutMe: string

    @ApiResponseProperty({ type: String, enum: Roles })
    role: Roles

    @ApiResponseProperty({ type: [String] })
    posts: Types.ObjectId[]

    constructor({
        _id, username, aboutMe, role, posts
    }: {
        _id: Types.ObjectId,
        username: string,
        aboutMe: string,
        role: Roles,
        posts: Types.ObjectId[]
    }) {
        this._id = _id;
        this.username = username;
        this.aboutMe = aboutMe;
        this.role = role;
        this.posts = posts;
    }
}

export class AuthResponseDto {
    @ApiResponseProperty({ type: String })
    token: string
}

export class DeleteResponseDto {
    @ApiResponseProperty({ type: String })
    message: string
}