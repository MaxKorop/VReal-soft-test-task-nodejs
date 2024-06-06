import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Post } from "../post/post.schema";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    password: string

    @Prop({
        type: String,
        enum: ["User", "ADMIN"],
        default: "USER"
    })
    role: "USER" | "ADMIN"

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
    posts: Post[]
}

export const UserSchema = SchemaFactory.createForClass(User);