import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './post.schema';
import { Model } from 'mongoose';
import { CreatePostDto, DeletePostDto, DeleteResponseDto, ResponsePostDto, UpdatePostDto } from './dto/post.dto';
import { UserFromToken } from 'src/user/dto/user.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>
    ) { }
    
    async getAll(id_array?: string[]): Promise<ResponsePostDto[]> {
        return id_array ? (await this.postModel.find({ _id: { $in: id_array } })) : (await this.postModel.find());
    }
    
    async getById(id: string): Promise<ResponsePostDto> {
        const post = await this.postModel.findById(id);
        if (!post) throw new BadRequestException("This post does not exist")

        return new ResponsePostDto({ ...post.toObject() });
    }
    
    async create(post: CreatePostDto, req: Request): Promise<ResponsePostDto> {
        const user: UserFromToken = req['user'];
        const newPost = await this.postModel.create({ ...post, author: user._id });
        return new ResponsePostDto({ ...newPost.toObject() });
    }
    
    async update(post: UpdatePostDto, req: Request): Promise<ResponsePostDto> {
        const reqUser: UserFromToken = req['user'];
        if (reqUser.role !== "ADMIN") {
            if (!reqUser.posts.includes(post.id)) throw new ForbiddenException("You do not have permissions to do this");
        }
        const newFields = {};

        for (const prop in post) {
            if (post[prop]) newFields[prop] = post[prop];
        }
        if (!Object.keys(newFields).length) throw new BadRequestException("You're trying to update, but you haven't specified anything");

        const updatedPost = await this.postModel.findOneAndUpdate({ _id: post.id }, newFields, { new: true });
        if (!updatedPost) throw new BadRequestException("This post does not exist");

        return new ResponsePostDto({ ...updatedPost.toObject() });
    }
    
    async delete(post: DeletePostDto, req: Request): Promise<DeleteResponseDto> {
        const reqUser: UserFromToken = req['user'];
        if (reqUser.role !== "ADMIN") {
            if (!reqUser.posts.includes(post.id)) throw new ForbiddenException("You do not have permissions to do this");
        }

        const deletedPost = await this.postModel.findOneAndDelete({ _id: post.id });
        if (!deletedPost) throw new BadRequestException("This post does not exist");
        return { message: 'Post deleted successfully' };
    }
}
