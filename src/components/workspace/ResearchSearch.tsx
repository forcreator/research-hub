import { useState, useEffect } from 'react';
import { Search, Loader2, ExternalLink, Download } from 'lucide-react';

interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  url: string;
  pdfUrl?: string;
  source: 'Semantic Scholar' | 'CrossRef';
  year: number;
}

export function ResearchSearch() {
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch from Semantic Scholar API
  const fetchSemanticScholar = async (query: string) => {
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=5&fields=title,authors,abstract,url,openAccessPdf,year`
    );
    const data = await response.json();
    return (data.data || []).map((paper: any) => ({
      id: paper.paperId,
      title: paper.title,
      authors: paper.authors.map((author: any) => author.name),
      abstract: paper.abstract,
      url: paper.url,
      pdfUrl: paper.openAccessPdf?.url || null,
      source: 'Semantic Scholar',
      year: paper.year,
    }));
  };

  // Function to fetch from CrossRef API
  const fetchCrossRef = async (query: string) => {
    const response = await fetch(
      `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=10`
    );
    const data = await response.json();
  
    return (data.message.items || []).map((paper: any) => ({
      id: paper.DOI, // DOI as the unique identifier
      title: paper.title?.[0] || 'No Title Available',
      authors: paper.author
        ? paper.author.map((author: any) => `${author.given} ${author.family}`)
        : ['Unknown Author'],
      abstract: 'Abstract not available', // CrossRef doesn't provide abstracts
      url: paper.URL || '',
      pdfUrl: null, // CrossRef does not provide direct PDF links
      year: paper.created?.['date-parts']?.[0]?.[0] || 'Unknown Year',
      publisher: paper.publisher || 'Unknown Publisher',
      journal: paper['container-title']?.[0] || 'Unknown Journal',
      citationCount: paper['is-referenced-by-count'] || 0, // Citation count
      source: 'CrossRef',
    }));
  };
  

  useEffect(() => {
    const searchPapers = async () => {
      if (!query.trim()) {
        setPapers([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [semanticResults, crossRefResults] = await Promise.all([
          fetchSemanticScholar(query),
          fetchCrossRef(query),
        ]);
        setPapers([...semanticResults, ...crossRefResults]);
      } catch (err) {
        setError('Error fetching research papers. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchPapers, 500); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="h-full bg-white border-l flex flex-col">
      {/* Search Input */}
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-2">Research Papers</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : papers.length > 0 ? (
          <div className="space-y-4">
            {papers.map((paper) => (
              <div key={paper.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{paper.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {paper.authors?.slice(0, 3).join(', ')}
                      {paper.authors?.length > 3 ? ' et al.' : ''}
                    </p>
                    <p className="text-xs text-gray-400">{paper.source}</p>
                  </div>
                  <div className="flex gap-2">
                    {paper.pdfUrl && (
                      <button
                        onClick={() => window.open(paper.pdfUrl, '_blank')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => window.open(paper.url, '_blank')}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            {query ? 'No results found' : 'Enter keywords to search for research papers'}
          </div>
        )}
      </div>
    </div>
  );
}
