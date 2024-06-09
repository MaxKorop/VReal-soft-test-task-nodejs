import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger"
import { IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { Types } from "mongoose"

export class ResponsePostDto {
    @ApiResponseProperty({ type: String })
    _id: Types.ObjectId

    @ApiResponseProperty({ type: String })
    title: string

    @ApiResponseProperty({ type: String })
    body: string

    @ApiResponseProperty({ type: Number })
    views: number

    @ApiResponseProperty({ type: Date })
    postedAt: Date

    @ApiResponseProperty({ type: Boolean })
    edited: boolean
    
    @ApiResponseProperty({ type: String })
    author: Types.ObjectId

    constructor({
        _id, title, body, views, postedAt, edited
    }: {
        _id: Types.ObjectId,
        title: string,
        body: string,
        views: number,
        postedAt: Date,
        edited: boolean,
        author: Types.ObjectId,
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
    @ApiProperty({ type: String, description: 'ID of the post to be updated' })
    readonly id: Types.ObjectId

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @ApiProperty({ type: String, description: 'New title of the post', required: false })
    readonly title?: string;

    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(3000)
    @ApiProperty({ type: String, description: 'New body of the post', required: false })
    readonly body?: string;
}

export class DeletePostDto {
    @IsString()
    @IsMongoId()
    @ApiProperty({ type: String, description: 'ID of the post to be deleted' })
    readonly id: Types.ObjectId
}

export class DeleteResponseDto {    
    @ApiResponseProperty({ type: String })
    message: string
}