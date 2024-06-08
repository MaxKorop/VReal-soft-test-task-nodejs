import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
	],
	controllers: [UserController],
	providers: [UserService, JwtStrategy],
})
export class UserModule { }
