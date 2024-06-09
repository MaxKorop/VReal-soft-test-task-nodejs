import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as SchemaType } from "mongoose";
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

    @Prop({ type: [{ type: SchemaType.Types.ObjectId, ref: 'Post' }] })
    posts: Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User);