export interface User {
  username: string;
  id: string;
}

export interface Project {
  id: string;
  name: string;
  field: string;
  createdAt: Date;
  userId: string;
  papers: ProjectPaper[];
}

export interface ProjectPaper {
  id: string;
  name: string;
  file: File;
  url: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  url: string;
  publishedDate: string;
  citations: number;
  journal?: string;
}