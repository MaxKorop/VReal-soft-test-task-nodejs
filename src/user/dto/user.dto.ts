import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Types, Schema } from 'mongoose';

export enum Roles {
    USER = "USER",
    ADMIN = "ADMIN"
}

export class AuthDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    @ApiProperty({
        description: "username of user",
        minLength: 2,
        maxLength: 30
    })
	readonly username: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @ApiProperty({
        description: "password of the user",
        minLength: 8,
        maxLength: 20
    })
    readonly password: string
}

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "id of user that will be updated"
    })
    readonly id: string

    @IsString()
    @MinLength(2)
    @MaxLength(30)
    @IsOptional()
    @ApiProperty({
        description: "new username of updated user",
        minLength: 2,
        maxLength: 30,
        required: false
    })
    readonly username?: string

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @IsOptional()
    @ApiProperty({
        description: "new password of user",
        minLength: 8,
        maxLength: 20,
        required: false
    })
    readonly password?: string

    @IsString()
    @MaxLength(50)
    @IsOptional()
    @ApiProperty({
        description: "new aboutMe of user",
        maxLength: 50,
        required: false
    })
    readonly aboutMe?: string

    @IsString({ each: true })
    @IsOptional()
    @ApiProperty({
        description: "new posts of user (add or remove posts of user)",
        required: false
    })
    readonly posts?: Schema.Types.ObjectId[]

    @IsEnum(Roles)
    @IsOptional()
    @ApiProperty({
        description: "new role of user (can be changed by other user with ADMIN role)",
        required: false
    })
    readonly role?: "USER" | "ADMIN"
}

export class DeleteUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "id of user that will be deleted"
    })
	readonly id: string
}

export class UserFromToken {
    _id: Types.ObjectId
    username: string
    aboutMe: string
    role: "USER" | "ADMIN"
    posts: Schema.Types.ObjectId[]

    constructor({
        _id, username, aboutMe, role, posts
    }: {
        _id: Types.ObjectId,
        username: string,
        aboutMe: string,
        role: "USER" | "ADMIN",
        posts: Schema.Types.ObjectId[]
    }) {
        this._id = _id;
        this.username = username;
        this.aboutMe = aboutMe;
        this.role = role;
        this.posts = posts;
    }
}