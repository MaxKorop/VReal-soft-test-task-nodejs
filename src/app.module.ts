import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot(),
		UserModule,
		PostModule,
		MongooseModule.forRoot(process.env.CONNECTION_STRING, {
			dbName: 'VReal-soft'
		})
	],
})
export class AppModule {}
