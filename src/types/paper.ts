export interface ResearchPaper {
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  year: string;
  publicationDate?: string;
  doi?: string;
  url?: string;
  pdfUrl?: string;
  citations?: number;
  source: Source;
}

export type SortOption = 'date_desc' | 'date_asc' | 'citations_desc';

export type Source = 'PubMed' | 'Semantic Scholar' | 'CORE' | 'arXiv' | 'IEEE' | 'BASE' | 'bioRxiv' | 'medRxiv' | 'CrossRef';

export interface SearchOptions {
  fromYear?: number;
  toYear?: number;
  sources?: Source[];
  limit?: number;
  page?: number;
  sortOption?: SortOption;
} 