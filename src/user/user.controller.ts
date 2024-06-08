import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthDto, UpdateUserDto, DeleteUserDto, UserFromToken } from './dto/user.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-guard.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) { }

	@Post('signUp')
	async signUp(@Body() body: AuthDto): Promise<{ token: string }> {
		return this.userService.signUp(body.username, body.password);
	}

	@Post('logIn')
	async logIn(@Body() body: AuthDto): Promise<{ token: string }> {
		return this.userService.logIn(body.username, body.password);
	}

	@ApiBearerAuth('JWT-auth')
	@UseGuards(JwtAuthGuard)
	@Get('updateToken')
	async updateToken(@Request() req: Request): Promise<{ token: string }> {
		return this.userService.updateToken(req);
	}

	@ApiQuery({ required: false, type: [String] })
	@Get()
	async getUsers(@Query() query?: { idArray: string[] }): Promise<UserFromToken[]> {
		return this.userService.getUsers(query.idArray);
	}

	@ApiParam({ name: 'id', type: String, required: false })
	@Get(':id')
	async getUserById(@Param('id') id: string): Promise<UserFromToken> {
		return this.userService.getUserById(id);
	}

	@ApiBearerAuth('JWT-auth')
	@UseGuards(JwtAuthGuard)
	@Put('update')
	async updateUser(@Body() body: UpdateUserDto, @Request() req: Request): Promise<{ token: string }> {
		return this.userService.updateUser(body, req);
	}

	@ApiBearerAuth('JWT-auth')
	@UseGuards(JwtAuthGuard)
	@Delete('delete')
	async deleteUser(@Body() body: DeleteUserDto, @Request() req: Request): Promise<{ message: string }> {
		return this.userService.deleteUser(body.id, req);
	}
}
