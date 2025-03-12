import { useEffect, useState, useCallback } from "react";
import { DogCard } from "../components/DogCard";
import { SearchFilters } from "../components/SearchFilters";
import { MatchModal } from "../components/MatchModal";
import { Navbar } from "../components/Navbar";
import { searchDogs, getDogs, getMatch } from "../lib/api";
import { toast } from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { Dog } from "../types";

export function SearchPage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [filters, setFilters] = useState<{
    breeds: string[];
    ageMin?: number;
    ageMax?: number;
    sort: string;
    zipCodes?: string[];
  }>({
    breeds: [],
    sort: "breed:asc",
  });

  const PAGE_SIZE = 20;

  //Fetch dogs based on current filters and page number
  const fetchDogs = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const searchResult = await searchDogs({
          ...filters,
          size: PAGE_SIZE,
          from: ((page - 1) * PAGE_SIZE).toString(),
        });

        const dogsData = await getDogs(searchResult.resultIds);
        setDogs(dogsData);
        setTotalPages(Math.ceil(searchResult.total / PAGE_SIZE));
      } catch (error: unknown) {
        if (error instanceof Error && "response" in error) {
          const err = error as { response?: { status: number } };

          if (err?.response?.status === 401) {
            toast.error(
              "Please enable third party cookies on your browser and login again"
            );
            console.log("Enable third party cookies error", error);
          }
        } else {
          toast.error("Failed to fetch dogs");
          console.log("Failed to fetch dogs", error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    setCurrentPage(1);
    fetchDogs(1);
  }, [filters, fetchDogs]);

  // Handles match generation for favorite dogs shortlisted
  async function handleMatch() {
    if (favorites.size === 0) {
      toast.error("Please like at least one dog");
      return;
    }

    try {
      const { match } = await getMatch(Array.from(favorites));
      const [matchedDogData] = await getDogs([match]);
      setMatchedDog(matchedDogData);
      setShowMatchModal(true);
    } catch (error) {
      toast.error("Failed to generate match");
      console.log("Failed to generate match", error);
    }
  }

  function handlePageChange(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchDogs(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function renderPageNumbers() {
    const pages = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    if (start > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          1
        </button>
      );
      if (start > 2)
        pages.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>
        );
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === i
              ? "bg-purple-600 text-white"
              : "border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1)
        pages.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>
        );
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar favoritesCount={favorites.size} onMatch={handleMatch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchFilters onFiltersChange={setFilters} />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {dogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  isFavorite={favorites.has(dog.id)}
                  onToggleFavorite={(id) => {
                    setFavorites((prev) => {
                      const next = new Set(prev);
                      if (next.has(id)) {
                        next.delete(id);
                      } else {
                        next.add(id);
                      }
                      return next;
                    });
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="First page"
              >
                <ChevronsLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {renderPageNumbers()}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Last page"
              >
                <ChevronsRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </main>

      {showMatchModal && matchedDog && (
        <MatchModal
          dog={matchedDog}
          onClose={() => {
            setShowMatchModal(false);
            setMatchedDog(null);
          }}
        />
      )}
    </div>
  );
}
