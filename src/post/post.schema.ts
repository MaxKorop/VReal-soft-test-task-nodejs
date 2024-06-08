import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId, Types } from "mongoose";

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

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    author: Types.ObjectId
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.post('save', async function (doc, next) {
    try {
        const userId = doc.author;
        const user = await mongoose.model('User').findById(userId);
        if (user && !user.posts.includes(doc._id)) {
            user.posts.push(doc._id);
            await user.save();
        }
        next();
    } catch (error) {
        next(error)
    }
});

PostSchema.post('findOneAndUpdate', async function (doc, next) {
    try {
        if (doc) {
            doc.edited = true;
            await doc.save();
        }
    } catch (error) {
        next(error)
    }
});

PostSchema.post('findOneAndDelete', async function (doc, next) {
    try {
        const userId = doc.author;
        const user = await mongoose.model('User').findById(userId);
        if (user && user.posts.includes(doc._id)) {
            user.posts = user.posts.filter((postId: string) => postId !== doc._id);
            await user.save();
        }
        next();
    } catch (error) {
        next(error)
    }
});