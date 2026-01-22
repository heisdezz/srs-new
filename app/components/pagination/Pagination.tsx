import { useSearchParams } from "react-router";

/**
 * Custom hook to manage pagination state via URL search params
 */
export function usePagination() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const setPage = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newParams.delete("page");
    } else {
      newParams.set("page", String(page));
    }
    setSearchParams(newParams);
  };

  return { currentPage, setPage };
}

interface PaginationProps {
  totalPages: number;
}

export default function Paginator({ totalPages }: PaginationProps) {
  const { currentPage, setPage } = usePagination();

  if (totalPages <= 1) {
    return (
      <section className="flex items-center justify-center py-4">
        <div className="join">
          <button
            className="join-item btn btn-sm"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            «
          </button>

          <button className="join-item btn btn-sm no-animation">
            Page {currentPage} of {totalPages}
          </button>

          <button
            className="join-item btn btn-sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            »
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center py-4">
      <div className="join">
        <button
          className="join-item btn btn-sm"
          disabled={currentPage <= 1}
          onClick={() => setPage(currentPage - 1)}
        >
          «
        </button>

        <button className="join-item btn btn-sm no-animation">
          Page {currentPage} of {totalPages}
        </button>

        <button
          className="join-item btn btn-sm"
          disabled={currentPage >= totalPages}
          onClick={() => setPage(currentPage + 1)}
        >
          »
        </button>
      </div>
    </section>
  );
}
