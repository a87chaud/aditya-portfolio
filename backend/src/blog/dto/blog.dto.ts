export interface BlogPostDto {
  id?: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}
