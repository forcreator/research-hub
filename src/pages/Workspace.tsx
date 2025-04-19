import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { ResearchPaper, SearchOptions, SortOption, Source } from '@/types/paper';
import { searchAllSources } from '@/services/paperSearch';
import { NotesPanel, NotesPanelRef } from '@/components/NotesPanel';
import { AbstractModal } from '@/components/AbstractModal';

const ITEMS_PER_PAGE = 20;
const SOURCES: Source[] = [
  'PubMed',
  'arXiv',
  'bioRxiv',
  'medRxiv',
  'CrossRef'
];
const CURRENT_YEAR = new Date().getFullYear();
const DEBOUNCE_DELAY = 300;

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Newest First' },
  { value: 'date_asc', label: 'Oldest First' },
  { value: 'citations_desc', label: 'Most Cited' }
] as const;

export function Workspace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const notesPanelRef = useRef<NotesPanelRef>(null);
  const searchTimeoutRef = useRef<number>();

  const [filters, setFilters] = useState<SearchOptions>({
    fromYear: CURRENT_YEAR - 5,
    toYear: CURRENT_YEAR,
    sources: [...SOURCES],
    limit: ITEMS_PER_PAGE,
    sortOption: 'date_desc' as SortOption
  });

  // Memoize the sort function to prevent unnecessary re-renders
  const sortPapers = useCallback((papers: ResearchPaper[], sortOption: SortOption) => {
    const papersCopy = [...papers];

    switch (sortOption) {
      case 'date_desc':
        return papersCopy.sort((a, b) => {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          const yearDiffDesc = yearB - yearA;
          if (yearDiffDesc !== 0) return yearDiffDesc;
          const aDateDesc = a.publicationDate ? new Date(a.publicationDate).getTime() : 0;
          const bDateDesc = b.publicationDate ? new Date(b.publicationDate).getTime() : 0;
          return bDateDesc - aDateDesc;
        });

      case 'date_asc':
        return papersCopy.sort((a, b) => {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          const yearDiffAsc = yearA - yearB;
          if (yearDiffAsc !== 0) return yearDiffAsc;
          const aDateAsc = a.publicationDate ? new Date(a.publicationDate).getTime() : 0;
          const bDateAsc = b.publicationDate ? new Date(b.publicationDate).getTime() : 0;
          return aDateAsc - bDateAsc;
        });

      case 'citations_desc':
        return papersCopy.sort((a, b) => (b.citations || 0) - (a.citations || 0));

      default:
        return papersCopy;
    }
  }, []);

  const performSearch = useCallback(async (query: string, options: SearchOptions) => {
    if (!query.trim()) {
      setPapers([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const results = await searchAllSources(query, options);
      const sortedResults = sortPapers(results, options.sortOption || 'date_desc');
      setPapers(sortedResults);
    } catch (err) {
      setError('Failed to fetch research papers. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, [sortPapers]);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      performSearch(searchQuery, { ...filters, page: currentPage });
    }, DEBOUNCE_DELAY);

    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, filters, currentPage, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery, { ...filters, page: currentPage });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const copyPaperDetails = useCallback((paper: ResearchPaper) => {
    const details = `Title: ${paper.title}
Authors: ${paper.authors.join(', ')}
Journal: ${paper.journal}
Year: ${paper.year}
Source: ${paper.source}
${paper.doi ? `DOI: ${paper.doi}` : ''}
${paper.url ? `URL: ${paper.url}` : ''}

Abstract:
${paper.abstract}`;

    navigator.clipboard.writeText(details);
  }, []);

  const handleCopyToNotes = useCallback((text: string) => {
    if (notesPanelRef.current) {
      notesPanelRef.current.appendToCurrentNote(text);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header with Search */}
        <header className="bg-white shadow-sm flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search for research papers..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="p-4 bg-gray-50 rounded-md space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">From Year</label>
                      <input
                        type="number"
                        value={filters.fromYear}
                        onChange={(e) => setFilters(prev => ({ ...prev, fromYear: parseInt(e.target.value) || undefined }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
            </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">To Year</label>
                      <input
                        type="number"
                        value={filters.toYear}
                        onChange={(e) => setFilters(prev => ({ ...prev, toYear: parseInt(e.target.value) || undefined }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
          </div>
        </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={filters.sortOption}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortOption: e.target.value as SortOption }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
          </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sources</label>
                    <div className="grid grid-cols-3 gap-2">
                      {SOURCES.map(source => (
                        <label key={source} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.sources?.includes(source)}
                            onChange={(e) => {
                              setFilters(prev => ({
                                ...prev,
                                sources: e.target.checked
                                  ? [...(prev.sources || []), source]
                                  : (prev.sources || []).filter(s => s !== source)
                              }));
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">{source}</span>
                        </label>
                      ))}
          </div>
        </div>
            </div>
              )}
            </form>
          </div>
        </header>

        {/* Main Content - Scrollable Papers List */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {isSearching ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : papers.length > 0 ? (
              <>
                <div className="space-y-6">
                  {papers.map((paper, index) => (
                    <div
                      key={index}
                      className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group relative overflow-hidden transform hover:scale-[1.01] motion-reduce:transform-none"
                      onClick={() => setSelectedPaper(paper)}
                    >
                      {/* Background gradient */}
                      <div className="absolute -right-full group-hover:right-0 top-0 h-full w-full bg-gradient-to-l from-blue-50 to-transparent transition-all duration-300 pointer-events-none opacity-60" />
                      
                      {/* Click indicator - moved to top right corner */}
                      <div className="absolute right-4 top-4 transform translate-x-8 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                        <div className="flex items-center gap-2 bg-white shadow-sm px-3 py-1.5 rounded-full border border-blue-100">
                          <span className="text-sm font-medium text-blue-800 whitespace-nowrap">Click to view details</span>
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <svg 
                              className="w-3 h-3 text-blue-600" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                              />
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Main content */}
                      <div className="relative z-10">
                        <div className="flex items-start justify-between group-hover:translate-x-1 transition-transform duration-200">
                          <div className="flex-1 pr-24">
                            <div className="flex items-start justify-between">
                              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {paper.url ? (
                                  <a
                                    href={paper.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-700"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {paper.title}
                                  </a>
                                ) : (
                                  paper.title
                                )}
                              </h3>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyPaperDetails(paper);
                                }}
                                className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Copy paper details"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{paper.authors.join(', ')}</p>
                          </div>
                          <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {paper.source}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">{paper.abstract}</p>
                        <div className="mt-4 text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                          <span>{paper.journal} • {paper.year}</span>
                          {paper.citations && (
                            <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-0.5 rounded">
                              {paper.citations} citations
                            </span>
                          )}
                          {paper.doi && (
                            <a
                              href={`https://doi.org/${paper.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:text-blue-500"
                              onClick={(e) => e.stopPropagation()}
                            >
                              DOI: {paper.doi}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="px-4 py-2 text-gray-700">Page {currentPage}</span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!papers.length || papers.length < ITEMS_PER_PAGE}
                      className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-900">No papers found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start by searching for a topic, author, or keyword above.
                </p>
              </div>
            )}
          </div>
        </main>
        </div>

      {/* Notes Panel - Fixed height with independent scroll */}
      <div className="w-96 h-screen flex-shrink-0 flex flex-col bg-white border-l">
        <NotesPanel ref={notesPanelRef} />
      </div>

      {/* Abstract Modal */}
      <AbstractModal
        paper={selectedPaper}
        onClose={() => setSelectedPaper(null)}
        onCopyToNotes={handleCopyToNotes}
      />
    </div>
  );
}