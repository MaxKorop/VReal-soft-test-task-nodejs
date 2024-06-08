import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Roles } from "./dto/user.dto";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true, minlength: 2, maxlength: 30 })
    username: string

    @Prop({ required: true })
    password: string

    @Prop({ maxlength: 50 })
    aboutMe: string

    @Prop({
        type: String,
        enum: Roles,
        default: "USER"
    })
    role: Roles

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
    posts: mongoose.Schema.Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User);