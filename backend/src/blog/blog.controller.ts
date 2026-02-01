import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../external/jwt-auth-guard.js';
import { BlogService } from './blog.service.js';
import type { BlogPostDto } from './dto/blog.dto.js';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  getAllBlogPosts(): Promise<BlogPostDto[]> {
    return this.blogService.getAllBlogPosts();
  }

  @Get(':id')
  getBlogPostById(@Param('id') id: string): Promise<BlogPostDto> {
    return this.blogService.getBlogPostById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  addBlogPost(
    @Body() newBlogPost: Omit<BlogPostDto, 'id'>,
  ): Promise<BlogPostDto> {
    return this.blogService.addBlogPost(newBlogPost);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  editBlogPost(
    @Param('id') id: string,
    @Body() updatedBlogPost: BlogPostDto,
  ): Promise<BlogPostDto> {
    return this.blogService.editBlogPost(id, updatedBlogPost);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteBlogPost(@Param('id') id: string): Promise<BlogPostDto> {
    return this.blogService.deleteBlogPost(id);
  }
}
