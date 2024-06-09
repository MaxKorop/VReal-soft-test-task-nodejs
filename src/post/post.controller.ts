import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBearerAuth, ApiQuery, ApiParam, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { CreatePostDto, DeletePostDto, DeleteResponseDto, ResponsePostDto, UpdatePostDto } from './dto/post.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@ApiTags('Post')
@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) { }
	
	@ApiOkResponse({
		description: 'Returns array of the posts (returns all posts if id array not set)',
		type: [ResponsePostDto],
		status: 200
	})
	@ApiQuery({ name: 'id', description: 'ID array of posts', required: false, type: [String] })
	@Get()
	async getAllPosts(@Query() query?: { idArray: string[] }): Promise<ResponsePostDto[]> {
		return this.postService.getAll(query.idArray);
	}

	@ApiOkResponse({
		description: 'Returns specified post',
		type: ResponsePostDto,
		status: 200
	})
	@ApiParam({ name: 'id', description: 'ID of the post', type: String, required: false })
	@Get(':id')
	async getPostById(@Param('id') id: string): Promise<ResponsePostDto> {
		return this.postService.getById(id);
	}

	@ApiOkResponse({
		description: 'Returns created post',
		type: ResponsePostDto,
		status: 200
	})
	@ApiBearerAuth('JWT-auth')
	@UseGuards(JwtAuthGuard)
	@Post('create')
	async createPost(@Body() body: CreatePostDto, @Request() req: Request): Promise<ResponsePostDto> {
		return this.postService.create(body, req);
	}

	@ApiOkResponse({
		description: 'Returns new version of updated post',
		type: ResponsePostDto,
		status: 200
	})
	@ApiBearerAuth('JWT-auth')
	@UseGuards(JwtAuthGuard)
	@Put('update')
	async updatePost(@Body() body: UpdatePostDto, @Request() req: Request): Promise<ResponsePostDto> {
		return this.postService.update(body, req);
	}

	@ApiOkResponse({
		description: 'Returns message that post was deleted successfully (also deletes it from user.posts)',
		type: DeleteResponseDto
	})
	@ApiBearerAuth('JWT-auth')
	@UseGuards(JwtAuthGuard)
	@Delete('delete')
	async deletePost(@Body() body: DeletePostDto, @Request() req: Request): Promise<DeleteResponseDto> {
		return this.postService.delete(body, req);
	}
}
