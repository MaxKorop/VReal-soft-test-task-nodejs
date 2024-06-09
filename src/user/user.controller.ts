import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, DeleteUserDto, UserFromToken, AuthResponseDto, SignUpDto, LogInDto, DeleteResponseDto } from './dto/user.dto';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) { }

	@ApiOkResponse({
		description: 'Returns token (JWT) which needed to set as Bearer token in Authorization header',
		type: AuthResponseDto,
		status: 201
	})
	@Post('signUp')
	async signUp(@Body() body: SignUpDto): Promise<AuthResponseDto> {
		return this.userService.signUp(body.username, body.password, body.role);
	}

	@ApiOkResponse({
		description: 'Returns token (JWT) which needed to set as Bearer token in Authorization header',
		type: AuthResponseDto,
		status: 201
	})
	@Post('logIn')
	async logIn(@Body() body: LogInDto): Promise<AuthResponseDto> {
		return this.userService.logIn(body.username, body.password);
	}

	@ApiOkResponse({
		description: 'Returns token (JWT) which needed to set as Bearer token in Authorization header',
		type: AuthResponseDto,
		status: 200
	})
	@ApiBearerAuth('JWT-auth')
	@UseGuards(JwtAuthGuard)
	@Get('updateToken')
	async updateToken(@Request() req: Request): Promise<AuthResponseDto> {
		return this.userService.updateToken(req);
	}

	@ApiOkResponse({
		description: 'Returns array of users (returns all users if id array not set)',
		type: UserFromToken,
		status: 200
	})
	@ApiQuery({ name: 'id', description: 'ID array of users', required: false, type: [String] })
	@Get()
	async getUsers(@Query() query?: { idArray: string[] }): Promise<UserFromToken[]> {
		return this.userService.getUsers(query.idArray);
	}

	@ApiOkResponse({
		description: 'Returns specified user',
		type: UserFromToken,
		status: 200
	})
	@ApiParam({ name: 'id', description: 'ID of the user', type: String, required: false })
	@Get(':id')
	async getUserById(@Param('id') id: string): Promise<UserFromToken> {
		return this.userService.getUserById(id);
	}

	@ApiOkResponse({
		description: 'Returns token (JWT) which needed to set as Bearer token in Authorization header',
		type: AuthResponseDto,
		status: 200
	})
	@ApiBearerAuth('JWT-auth')
	@UseGuards(JwtAuthGuard)
	@Put('update')
	async updateUser(@Body() body: UpdateUserDto, @Request() req: Request): Promise<AuthResponseDto> {
		return this.userService.updateUser(body, req);
	}

	@ApiOkResponse({
		description: 'Returns message that user was deleted successfully',
		type: DeleteResponseDto
	})
	@ApiBearerAuth('JWT-auth')
	@UseGuards(JwtAuthGuard)
	@Delete('delete')
	async deleteUser(@Body() body: DeleteUserDto, @Request() req: Request): Promise<DeleteResponseDto> {
		return this.userService.deleteUser(body.id, req);
	}
}
