import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Schema as SchemaType } from "mongoose";

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
    @Prop({ required: true, maxlength: 50, minlength: 3 })
    title: string

    @Prop({ required: true, minlength: 5, maxlength: 3000 })
    body: string

    @Prop({ default: 0 })
    views: number

    @Prop({ default: new Date() })
    postedAt: Date

    @Prop({ default: false })
    edited: boolean

    @Prop({ type: SchemaType.Types.ObjectId, ref: 'User', required: true })
    author: Types.ObjectId
}

export const PostSchema = SchemaFactory.createForClass(Post);