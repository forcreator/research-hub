import { ResearchPaper, Source } from '../types/paper';

export interface SearchFilters {
  fromYear?: number;
  toYear?: number;
  sources?: Source[];
}

export interface SearchOptions extends SearchFilters {
  page?: number;
  limit?: number;
  sortOption?: 'date_desc' | 'date_asc' | 'citations_desc';
}

// PubMed E-utilities base URL
const PUBMED_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
// Semantic Scholar API base URL (v1 is deprecated, using graph API)
const SEMANTIC_SCHOLAR_URL = 'https://api.semanticscholar.org/graph/v1';
// Core.ac.uk API base URL (requires free API key)
const CORE_API_URL = 'https://api.core.ac.uk/v3';
const ARXIV_API_URL = 'https://export.arxiv.org/api/query';
const IEEE_API_URL = 'https://api.ieee.org/api/v1';
const BASE_API_URL = 'https://api.base-search.net/cgi-bin/BaseHttpSearchInterface.fcgi';
const BIORXIV_API_URL = 'https://api.biorxiv.org/details/biorxiv';
const MEDRXIV_API_URL = 'https://api.biorxiv.org/details/medrxiv';
const CROSSREF_API_URL = 'https://api.crossref.org/works';

export async function searchPubMed(query: string, options: SearchOptions = {}): Promise<ResearchPaper[]> {
  try {
    const { page = 1, limit = 10 } = options;
    const retstart = (page - 1) * limit;

    // First, search for IDs
    const searchResponse = await fetch(
      `${PUBMED_BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}
      &retmode=json&retmax=${limit}&retstart=${retstart}${
        options.fromYear ? `&mindate=${options.fromYear}` : ''
      }${options.toYear ? `&maxdate=${options.toYear}` : ''}`
    );
    const searchData = await searchResponse.json();
    const ids = searchData.esearchresult.idlist;

    if (ids.length === 0) return [];

    // Then, fetch details for each ID
    const summaryResponse = await fetch(
      `${PUBMED_BASE_URL}/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`
    );
    const summaryData = await summaryResponse.json();

    return Object.values(summaryData.result)
      .filter((paper: any) => paper.title && paper.authors)
      .map((paper: any) => ({
        title: paper.title,
        authors: paper.authors?.map((author: any) => author.name) || [],
        abstract: paper.abstract || '',
        journal: paper.fulljournalname || paper.source,
        year: paper.pubdate?.split(' ')[0] || '',
        doi: paper.articleids?.find((id: any) => id.idtype === 'doi')?.value,
        source: 'PubMed' as const,
        url: `https://pubmed.ncbi.nlm.nih.gov/${paper.uid}`
      }));
  } catch (error) {
    console.error('PubMed search error:', error);
    return [];
  }
}

export async function searchSemanticScholar(query: string, options: SearchOptions = {}): Promise<ResearchPaper[]> {
  try {
    const { limit = 10, page = 1 } = options;
    const offset = (page - 1) * limit;

    const response = await fetch(
      `${SEMANTIC_SCHOLAR_URL}/paper/search?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&fields=title,authors,abstract,venue,year,citationCount,url,openAccessPdf`
    );
    const data = await response.json();

    return (data.data || [])
      .filter((paper: any) => {
        const year = parseInt(paper.year);
        if (options.fromYear && year < options.fromYear) return false;
        if (options.toYear && year > options.toYear) return false;
        return true;
      })
      .map((paper: any) => ({
        title: paper.title || '',
        authors: paper.authors?.map((author: any) => author.name) || [],
        abstract: paper.abstract || '',
        journal: paper.venue || '',
        year: paper.year?.toString() || '',
        doi: paper.doi,
        source: 'Semantic Scholar' as const,
        url: paper.url,
        pdfUrl: paper.openAccessPdf?.url,
        citations: paper.citationCount
      }));
  } catch (error) {
    console.error('Semantic Scholar search error:', error);
    return [];
  }
}

export async function searchCore(query: string, apiKey: string, options: SearchOptions = {}): Promise<ResearchPaper[]> {
  try {
    const { limit = 10, page = 1 } = options;
    const response = await fetch(
      `${CORE_API_URL}/search/works?q=${encodeURIComponent(query)}&pageSize=${limit}&page=${page}${
        options.fromYear ? `&yearFrom=${options.fromYear}` : ''
      }${options.toYear ? `&yearTo=${options.toYear}` : ''}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    const data = await response.json();

    return data.results.map((paper: any) => ({
      title: paper.title,
      authors: paper.authors?.map((author: any) => author.name) || [],
      abstract: paper.abstract || '',
      journal: paper.publisher,
      year: paper.yearPublished?.toString() || '',
      doi: paper.doi,
      source: 'CORE' as const,
      url: paper.downloadUrl
    }));
  } catch (error) {
    console.error('CORE search error:', error);
    return [];
  }
}

export async function searchArXiv(query: string, options: SearchOptions = {}): Promise<ResearchPaper[]> {
  try {
    const { limit = 10, page = 1 } = options;
    const start = (page - 1) * limit;
    
    // Format query according to arXiv API requirements
    const formattedQuery = query.split(' ').join('+AND+');
    
    const response = await fetch(
      `${ARXIV_API_URL}?search_query=all:${encodeURIComponent(formattedQuery)}&start=${start}&max_results=${limit}&sortBy=submittedDate&sortOrder=descending`
    );
    const data = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'text/xml');
    const entries = xmlDoc.getElementsByTagName('entry');
    
    return Array.from(entries).map(entry => {
      const year = entry.querySelector('published')?.textContent?.split('-')[0] || '';
      const pdfLink = entry.querySelector('link[title="pdf"]')?.getAttribute('href')?.replace('http:', 'https:');
      
      return {
        title: entry.querySelector('title')?.textContent?.trim() || '',
        authors: Array.from(entry.getElementsByTagName('author')).map(author => 
          author.querySelector('name')?.textContent || ''
        ),
        abstract: entry.querySelector('summary')?.textContent?.trim() || '',
        journal: 'arXiv',
        year,
        doi: entry.querySelector('doi')?.textContent || undefined,
        source: 'arXiv' as const,
        url: entry.querySelector('id')?.textContent?.replace('http:', 'https:') || undefined,
        pdfUrl: pdfLink
      };
    }).filter(paper => {
      const paperYear = parseInt(paper.year);
      if (options.fromYear && paperYear < options.fromYear) return false;
      if (options.toYear && paperYear > options.toYear) return false;
      return true;
    });
  } catch (error) {
    console.error('arXiv search error:', error);
    return [];
  }
}

export async function searchIEEE(query: string, apiKey: string, options: SearchOptions = {}): Promise<ResearchPaper[]> {
  try {
    const { limit = 10, page = 1 } = options;
    
    const response = await fetch(
      `${IEEE_API_URL}/search/articles?querytext=${encodeURIComponent(query)}&max_records=${limit}&start_record=${(page - 1) * limit}${
        options.fromYear ? `&start_year=${options.fromYear}` : ''
      }${options.toYear ? `&end_year=${options.toYear}` : ''}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      }
    );
    const data = await response.json();
    
    return data.articles.map((article: any) => ({
      title: article.title,
      authors: article.authors.map((author: any) => author.full_name),
      abstract: article.abstract || '',
      journal: article.publication_title,
      year: article.publication_year?.toString() || '',
      doi: article.doi,
      source: 'IEEE' as const,
      url: article.html_url,
      pdfUrl: article.pdf_url,
      citations: article.citing_paper_count
    }));
  } catch (error) {
    console.error('IEEE search error:', error);
    return [];
  }
}

export async function searchBASE(query: string, options: SearchOptions = {}): Promise<ResearchPaper[]> {
  try {
    const { limit = 10, page = 1 } = options;
    
    const response = await fetch(
      `${BASE_API_URL}?func=PerformSearch&query=${encodeURIComponent(query)}&format=json&hits=${limit}&offset=${(page - 1) * limit}`
    );
    const data = await response.json();
    
    return data.response.docs.map((doc: any) => {
      // Check if the link is actually a PDF
      const isPdf = doc.dclink?.toLowerCase().endsWith('.pdf');
      
      return {
        title: doc.dctitle?.[0] || '',
        authors: doc.dcauthor || [],
        abstract: doc.dcdescription?.[0] || '',
        journal: doc.dcpublisher?.[0] || '',
        year: doc.dcyear || '',
        doi: doc.dcidentifier?.find((id: string) => id.startsWith('doi:'))?.replace('doi:', ''),
        source: 'BASE' as const,
        url: doc.dclink,
        // Only set pdfUrl if the link is actually a PDF
        pdfUrl: isPdf ? doc.dclink : undefined
      };
    });
  } catch (error) {
    console.error('BASE search error:', error);
    return [];
  }
}

export async function searchBioRxiv(query: string, options: SearchOptions = {}): Promise<ResearchPaper[]> {
  try {
    const { limit = 10, page = 1 } = options;
    const response = await fetch(
      `${BIORXIV_API_URL}/${encodeURIComponent(query)}/${page}/desc/${limit}`
    );
    const data = await response.json();
    
    return data.collection.map((paper: any) => ({
      title: paper.title,
      authors: paper.authors.split('; '),
      abstract: paper.abstract,
      journal: 'bioRxiv',
      year: new Date(paper.date).getFullYear().toString(),
      doi: paper.doi,
      source: 'bioRxiv' as const,
      url: `https://doi.org/${paper.doi}`,
      pdfUrl: paper.pdf
    }));
  } catch (error) {
    console.error('bioRxiv search error:', error);
    return [];
  }
}

export async function searchMedRxiv(query: string, options: SearchOptions = {}): Promise<ResearchPaper[]> {
  try {
    const { limit = 10, page = 1 } = options;
    const response = await fetch(
      `${MEDRXIV_API_URL}/${encodeURIComponent(query)}/${page}/desc/${limit}`
    );
    const data = await response.json();
    
    return data.collection.map((paper: any) => ({
      title: paper.title,
      authors: paper.authors.split('; '),
      abstract: paper.abstract,
      journal: 'medRxiv',
      year: new Date(paper.date).getFullYear().toString(),
      doi: paper.doi,
      source: 'medRxiv' as const,
      url: `https://doi.org/${paper.doi}`,
      pdfUrl: paper.pdf
    }));
  } catch (error) {
    console.error('medRxiv search error:', error);
    return [];
  }
}

export async function searchCrossRef(query: string, options: SearchOptions = {}): Promise<ResearchPaper[]> {
  try {
    const { limit = 10, page = 1 } = options;
    const response = await fetch(
      `${CROSSREF_API_URL}?query=${encodeURIComponent(query)}&rows=${limit}&offset=${(page - 1) * limit}&select=DOI,title,author,published-print,abstract,reference,URL&mailto=your-email@example.com`
    );
    const data = await response.json();
    
    return data.message.items.map((paper: any) => ({
      title: Array.isArray(paper.title) ? paper.title[0] : paper.title,
      authors: paper.author?.map((author: any) => `${author.given} ${author.family}`).slice(0, 10) || [],
      abstract: paper.abstract || '',
      journal: paper['container-title']?.[0] || '',
      year: paper['published-print']?.['date-parts']?.[0]?.[0]?.toString() || '',
      doi: paper.DOI,
      source: 'CrossRef' as const,
      url: paper.URL,
      citations: paper['is-referenced-by-count']
    }));
  } catch (error) {
    console.error('CrossRef search error:', error);
    return [];
  }
}

export async function searchAllSources(
  query: string,
  options: SearchOptions = {}
): Promise<ResearchPaper[]> {
  // Only use free repositories that don't require API keys
  const searches = [];
  
  // If sources are specified in options, use only those that are free
  const requestedSources = options.sources || [];
  const freeSourcesRequested = requestedSources.length === 0 || requestedSources.some(source => 
    ['PubMed', 'arXiv', 'bioRxiv', 'medRxiv', 'CrossRef'].includes(source)
  );

  if (freeSourcesRequested) {
    if (requestedSources.length === 0 || requestedSources.includes('PubMed')) {
      searches.push(searchPubMed(query, options));
    }
    if (requestedSources.length === 0 || requestedSources.includes('arXiv')) {
      searches.push(searchArXiv(query, options));
    }
    if (requestedSources.length === 0 || requestedSources.includes('bioRxiv')) {
      searches.push(searchBioRxiv(query, options));
    }
    if (requestedSources.length === 0 || requestedSources.includes('medRxiv')) {
      searches.push(searchMedRxiv(query, options));
    }
    if (requestedSources.length === 0 || requestedSources.includes('CrossRef')) {
      searches.push(searchCrossRef(query, options));
    }
  }

  const results = await Promise.all(searches);
  
  return results
    .flat()
    .sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      if (yearA === yearB) {
        const citationsA = a.citations || 0;
        const citationsB = b.citations || 0;
        return citationsB - citationsA;
      }
      return yearB - yearA;
    })
    .slice(0, options.limit || 30);
} 