import type { ChangeEvent, SyntheticEvent } from "react";
import { useCallback } from "react";
import { useRouter } from "next/router";
import type { PreviewSearchInitialState } from "@sitecore-search/react";
import {
  WidgetDataType,
  usePreviewSearch,
  widget,
} from "@sitecore-search/react";
import { ArticleCard, Presence, PreviewSearch } from "@sitecore-search/ui";
import Spinner from "../components/Spinner";

const DEFAULT_IMG_URL = "https://placehold.co/500x300?text=No%20Image";

type ArticleModel = {
  id: string;
  name?: string;
  title?: string;
  image_url: string;
  url: string;
  source_id?: string;
};

type InitialState = PreviewSearchInitialState<"itemsPerPage">;

export const PreviewSearchBasicComponent = ({ defaultItemsPerPage = 6 }) => {
  const router = useRouter();

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    const target = (e.target as HTMLFormElement).querySelector(
      "input"
    ) as HTMLInputElement;
    router.push(`/search?q=${target.value}`);
    target.value = "";
  };

  const {
    widgetRef,
    actions: { onItemClick, onKeyphraseChange },
    queryResult,
    queryResult: { isFetching, isLoading },
  } = usePreviewSearch<ArticleModel, InitialState>({
    state: {
      itemsPerPage: defaultItemsPerPage,
    },
  });

  const loading = isLoading || isFetching;

  const keyphraseHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onKeyphraseChange({ keyphrase: event.target.value });
    },
    [onKeyphraseChange]
  );

  return (
    <PreviewSearch.Root>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="flex justify-center mb-4">
        <PreviewSearch.Input
          className="w-[800px] box-border py-2 px-4 border-2 border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          onChange={keyphraseHandler}
          autoComplete="off"
          placeholder="Type to search..."
        />
      </form>

      {/* Search Content */}
      <PreviewSearch.Content
        ref={widgetRef}
        className="flex justify-center pt-0 w-[800px] bg-gray-100 dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden"
      >
        <Spinner loading={loading} />

        <Presence present={!loading}>
          <PreviewSearch.Results defaultQueryResult={queryResult}>
            {({
              isFetching: loading,
              data: { content: articles = [] } = {},
            }) => (
              <PreviewSearch.Items
                data-loading={loading}
                className="flex flex-[3] bg-white dark:bg-gray-700 overflow-y-auto 
                           data-[loading=false]:grid data-[loading=false]:list-none 
                           data-[loading=false]:m-0 data-[loading=false]:p-4 
                           data-[loading=false]:gap-4 data-[loading=false]:grid-cols-3"
              >
                <Spinner loading={loading} />
                {!loading &&
                  articles.map((article, index) => (
                    <PreviewSearch.Item key={article.id} asChild>
                      <PreviewSearch.ItemLink
                        href={article.url}
                        onClick={() => {
                          onItemClick({
                            id: article.id,
                            index,
                            sourceId: article.source_id,
                          });
                        }}
                        className="flex box-border no-underline w-full text-black dark:text-white focus:shadow-lg transition-shadow"
                      >
                        <ArticleCard.Root
                          className="w-full h-[150px] shadow-md rounded-lg border border-transparent p-3 cursor-pointer block text-center 
             bg-white dark:bg-gray-800 hover:shadow-lg focus-within:shadow-xl transition-all duration-200 flex flex-col"
                        >
                          <div className="flex-shrink-0 relative h-[80px] w-full flex justify-center items-center overflow-hidden rounded-md bg-gray-50 dark:bg-gray-900">
                            <ArticleCard.Image
                              src={article.image_url || DEFAULT_IMG_URL}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <ArticleCard.Title className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2 overflow-hidden">
                            {article.name || article.title}
                          </ArticleCard.Title>
                        </ArticleCard.Root>
                      </PreviewSearch.ItemLink>
                    </PreviewSearch.Item>
                  ))}
              </PreviewSearch.Items>
            )}
          </PreviewSearch.Results>
        </Presence>
      </PreviewSearch.Content>
    </PreviewSearch.Root>
  );
};

const PreviewSearchBasicWidget = widget(
  PreviewSearchBasicComponent,
  WidgetDataType.PREVIEW_SEARCH,
  "content"
);

export default PreviewSearchBasicWidget;
