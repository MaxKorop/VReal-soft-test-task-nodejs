import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from 'src/user/user.schema';
import { UserModule } from 'src/user/user.module';
import { Model, Types } from 'mongoose';

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>("JWT_SECRET_KEY"),
				signOptions: { expiresIn: '1h' }
			}),
			inject: [ConfigService]
		}),
		MongooseModule.forFeatureAsync([{
			name: Post.name,
			inject: [getModelToken(User.name)],
			imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
			useFactory: async (userModel: Model<User>) => {
				PostSchema.post('save', async function (doc, next) {
					try {
						const userId = doc.author;
						const user = await userModel.findById(userId);
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
							doc.__v += 1;
							await doc.save();
						}
					} catch (error) {
						next(error)
					}
				});
				
				PostSchema.post('findOneAndDelete', async function (doc, next) {
					try {
						console.log(doc.toObject());
						const userId = doc.author;
						const user = await userModel.findById(userId);
						if (user && user.posts.includes(doc._id)) {
							user.posts = user.posts.filter((postId: Types.ObjectId) => postId.toString() !== doc._id.toString());
							await user.save();
						}
						next();
					} catch (error) {
						next(error)
					}
				});
				return PostSchema
			}
		}]),
		UserModule
	],
	controllers: [PostController],
	providers: [PostService],
})
export class PostModule {}
