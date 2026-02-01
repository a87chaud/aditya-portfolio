import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogPostDto } from './dto/blog.dto.js';
import { PrismaService } from '../external/prisma.service.js';

@Injectable()
export class BlogService {
  constructor(private prismaService: PrismaService) {}

  async getAllBlogPosts(): Promise<BlogPostDto[]> {
    const posts = await this.prismaService.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return posts.map(this.blogPostDtoMapper);
  }

  async getBlogPostById(id: string): Promise<BlogPostDto> {
    const post = await this.prismaService.blogPost.findUnique({
      where: { id },
    });
    if (!post) throw new NotFoundException();
    return this.blogPostDtoMapper(post);
  }

  async addBlogPost(newPost: Omit<BlogPostDto, 'id'>): Promise<BlogPostDto> {
    const post = await this.prismaService.blogPost.create({ data: newPost });
    if (!post) throw new BadRequestException();
    return this.blogPostDtoMapper(post);
  }

  async editBlogPost(
    id: string,
    updatedPost: Partial<BlogPostDto>,
  ): Promise<BlogPostDto> {
    const post = await this.prismaService.blogPost.update({
      where: { id },
      data: {
        ...updatedPost,
        updatedAt: new Date(),
      },
    });
    if (!post) throw new BadRequestException();
    return this.blogPostDtoMapper(post);
  }

  async deleteBlogPost(id: string): Promise<BlogPostDto> {
    const post = await this.prismaService.blogPost.delete({ where: { id } });
    if (!post) throw new NotFoundException();
    return this.blogPostDtoMapper(post);
  }

  private blogPostDtoMapper(post): BlogPostDto {
    return {
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt ? post.updatedAt.toISOString() : undefined,
    };
  }
}
