import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { User, UserSchema } from 'src/user/user.schema';

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
		MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])
	],
	controllers: [PostController],
	providers: [PostService],
})
export class PostModule {}
