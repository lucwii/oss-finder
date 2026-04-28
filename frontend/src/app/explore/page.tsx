'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecommendationsForm from '@/components/explore/RecommendationsForm';
import RepoGrid from '@/components/explore/RepoGrid';
import { useRecommendations } from '@/hooks/useRecommendations';

export default function ExplorePage() {
  const { results, loading, error, page, totalPages, hasSearched, search, goToPage } =
    useRecommendations();

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page header */}
      <section className="relative pt-32 pb-12 px-6 overflow-hidden">
        <div className="hero-grid absolute inset-0" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block text-xs font-mono text-[#22c55e] tracking-widest uppercase mb-4">
            Repository Explorer
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            Find your next{' '}
            <span className="gradient-text">contribution</span>
          </h1>
          <p className="text-[#a1a1aa] text-lg mb-10 max-w-xl">
            Select a language and skill level to get personalized open source repository recommendations.
          </p>

          <div className="bg-[#111111]/80 backdrop-blur-sm border border-[#27272a] rounded-2xl p-5">
            <RecommendationsForm onSearch={search} loading={loading} />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="flex-1 px-6 pb-20 max-w-4xl mx-auto w-full">
        {hasSearched && !loading && !error && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#a1a1aa] font-mono">
              {results.length === 0
                ? 'No results'
                : `Showing ${results.length} repositor${results.length === 1 ? 'y' : 'ies'}`}
            </p>
            {totalPages > 1 && (
              <span className="text-xs font-mono text-[#3f3f46]">
                Page {page} of {totalPages}
              </span>
            )}
          </div>
        )}

        <RepoGrid
          results={results}
          loading={loading}
          error={error}
          hasSearched={hasSearched}
          page={page}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </section>

      <Footer />
    </main>
  );
}
