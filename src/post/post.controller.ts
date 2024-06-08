import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePostDto, DeletePostDto, ResponsePostDto, UpdatePostDto } from './dto/post.dto';
import { JwtAuthGuard } from 'src/guards/jwt-guard.guard';

@ApiTags('Post')
@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) { }
	
	@Get()
	async getAllPosts(@Query() query?: { idArray: string[] }): Promise<ResponsePostDto[]> {
		return this.postService.getAll(query.idArray);
	}

	@Get(':id')
	async getPostById(@Param('id') id: string): Promise<ResponsePostDto> {
		return this.postService.getById(id);
	}

	@ApiBearerAuth('JWT-auth')
	@UseGuards(JwtAuthGuard)
	@Post('create')
	async createPost(@Body() body: CreatePostDto, @Request() req: Request): Promise<ResponsePostDto> {
		return this.postService.create(body, req);
	}

	@ApiBearerAuth('JWT-auth')
	@UseGuards(JwtAuthGuard)
	@Put('update')
	async updatePost(@Body() body: UpdatePostDto, @Request() req: Request): Promise<ResponsePostDto> {
		return this.postService.update(body, req);
	}

	@ApiBearerAuth('JWT-auth')
	@UseGuards(JwtAuthGuard)
	@Delete('delete')
	async deletePost(@Body() body: DeletePostDto, @Request() req: Request): Promise<{ message: string }> {
		return this.postService.delete(body, req);
	}
}
