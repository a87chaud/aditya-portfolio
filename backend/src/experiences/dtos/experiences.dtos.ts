export interface ExperienceDto {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  current: boolean;
  order: number;
}