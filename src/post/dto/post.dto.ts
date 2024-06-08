import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { ObjectId } from "mongoose"

export class ResponsePostDto {
    _id: ObjectId
    title: string
    body: string
    views: number
    postedAt: Date
    edited: boolean
    author: ObjectId

    constructor({
        _id, title, body, views, postedAt, edited
    }: {
        _id: ObjectId,
        title: string,
        body: string,
        views: number,
        postedAt: Date,
        edited: boolean,
        author: ObjectId,
    }) {
        this._id = _id;
        this.title = title;
        this.body = body;
        this.views = views;
        this.postedAt = postedAt;
        this.edited = edited;
        this.author = this.author;
    }
}

interface IPostDto {
    title?: string
    body?: string
}

export class CreatePostDto implements IPostDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @ApiProperty({
        type: String,
        description: 'Title of the post',
        minLength: 3,
        maxLength: 50
    })
    readonly title: string

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(3000)
    @ApiProperty({
        type: String,
        description: 'Payload of the post',
        minLength: 5,
        maxLength: 3000
    })
    readonly body: string
}

export class UpdatePostDto implements IPostDto {
    @IsNotEmpty()
    @IsString()
    readonly id: ObjectId

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    readonly title?: string;

    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(3000)
    readonly body?: string;
}

export class DeletePostDto {
    @IsString()
    @ApiProperty({ type: String, description: 'ID of the post to be deleted' })
    readonly id: ObjectId
}