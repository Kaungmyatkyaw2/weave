import { handleInfiniteScroll } from "@/lib/infiniteScroll";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";

const useInfiniteScroll = (
  query: UseInfiniteQueryResult,
  element?: HTMLElement,
  dep?: any[]
) => {
  const defDep = [
    query.hasNextPage,
    query.isFetchingNextPage,
    query.isFetching,
    ...(dep || []),
  ];

  return useEffect(() => {
    if (element === null) return;

    const fn = async () => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        await query.fetchNextPage();
      }
    };

    const { addScrollEvent, removeScrollEvent } = handleInfiniteScroll(
      fn,
      element
    );

    addScrollEvent();

    return removeScrollEvent;
  }, defDep);
};

export default useInfiniteScroll;
