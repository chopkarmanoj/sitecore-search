// @ts-nocheck
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { WidgetDataType, useSearchResults, widget } from "@sitecore-search/react";
import type { SearchResultsInitialState, SearchResultsStoreState } from "@sitecore-search/react";
import { SparklesIcon } from "@heroicons/react/24/solid";

import Filter from "../components/Filter";
import QueryResultsSummary from "../components/QueryResultsSummary";
import ResultsPerPage from "../components/ResultsPerPage";
import SearchFacets from "../components/SearchFacets";
import SearchPagination from "../components/SearchPagination";
import SortOrder from "../components/SortOrder";
import Spinner from "../components/Spinner";
import OpenAISearch from "../components/OpenAISearch/OpenAISearch";

type ArticleModel = {
  id: string;
  type?: string;
  title?: string;
  name?: string;
  subtitle?: string;
  url?: string;
  description?: string;
  content_text?: string;
  image_url?: string;
  source_id?: string;
};

type ArticleSearchResultsProps = {
  defaultSortType?: SearchResultsStoreState["sortType"];
  defaultPage?: SearchResultsStoreState["page"];
  defaultItemsPerPage?: SearchResultsStoreState["itemsPerPage"];
  defaultKeyphrase?: SearchResultsStoreState["keyphrase"];
};

type InitialState = SearchResultsInitialState<
  "itemsPerPage" | "keyphrase" | "page" | "sortType"
>;

export const SearchResultsComponent = ({
  defaultSortType = "featured_desc",
  defaultPage = 1,
  defaultKeyphrase = "",
  defaultItemsPerPage = 24,
}: ArticleSearchResultsProps) => {
  const {
    widgetRef,
    actions: { onItemClick },
    state: { sortType, page, itemsPerPage },
    queryResult: {
      isLoading,
      isFetching,
      data: {
        total_item: totalItems = 0,
        sort: { choices: sortChoices = [] } = {},
        facet: facets = [],
        content: articles = [],
      } = {},
    },
  } = useSearchResults<ArticleModel, InitialState>({
    query: (query) => {
      query.getRequest().setSources(["1118907"]);
    },
    state: {
      sortType: defaultSortType,
      page: defaultPage,
      itemsPerPage: defaultItemsPerPage,
      keyphrase: defaultKeyphrase,
    },
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [isDataReceived, setIsDataReceived] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const query = router.query.q as string;
      setKeyword(query || "");
    }
  }, [router.isReady, router.query.q]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-white dark:bg-gray-900">
        <Spinner loading />
      </div>
    );
  }

  return (
    <div ref={widgetRef} className="px-6 py-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* AI Section */}
      <section className="max-w-[1400px] mx-auto mb-8 animate-fadeIn">
        <div className="relative rounded-2xl bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-purple-500/10 dark:from-indigo-800/20 dark:via-blue-800/20 dark:to-purple-800/20 p-[2px] shadow-xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <SparklesIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                AI-Powered Insights
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {/* Instantly get context-rich summaries and insights from your search results, powered by AI. */}
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 min-h-[80px] border border-gray-100 dark:border-gray-700">
              <OpenAISearch
                dataForAI={articles}
                searchKeyword={keyword}
                setIsDataReceived={setIsDataReceived}
              />
            </div>
          </div>
        </div>
      </section>

      {isDataReceived && (
        <div className="flex gap-6 max-w-[1400px] mx-auto text-black dark:text-gray-100 text-opacity-75">
          {/* Loading overlay */}
          {isFetching && (
            <div className="absolute inset-0 bg-white dark:bg-gray-900/80 z-30 flex items-center justify-center">
              <Spinner loading />
            </div>
          )}

          {/* Sidebar */}
          <aside className="flex flex-col w-[280px] flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <Filter />
            <SearchFacets facets={facets} />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {totalItems > 0 && (
              <section className="flex justify-between items-center text-sm mb-4">
                <QueryResultsSummary
                  currentPage={page}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  totalItemsReturned={articles.length}
                />
                <SortOrder options={sortChoices} selected={sortType} />
              </section>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <div
                  key={a.id}
                  onClick={() => onItemClick?.(a)}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col overflow-hidden group"
                >
                  <div className="relative w-full h-40 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {a.image_url ? (
                      <img
                        src={a.image_url}
                        alt={a.title || "Article"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="flex items-center justify-center h-full text-gray-500 text-sm">No Image</span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-grow">
                    <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-indigo-500">
                      {a.title || a.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {a.description || a.content_text || "No description available."}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mt-6 text-sm">
              <ResultsPerPage defaultItemsPerPage={defaultItemsPerPage} />
              <SearchPagination currentPage={page} totalPages={totalPages} />
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

const SearchResultsWidget = widget(SearchResultsComponent, WidgetDataType.SEARCH_RESULTS, "content");
export default SearchResultsWidget;
