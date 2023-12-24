import { InfiniteQueryResponse } from "@/types/response.types";

export const splitPagesData = <T>(
  data: InfiniteQueryResponse<T> | undefined
) => {
  if (!data) return data;
  const pagesData: any[] = data?.pages.map((page) => page.data.data) || [];
  const finalResult: T[] = [].concat(...pagesData);

  return finalResult;
};

export const handleInfiniteScroll = (fn: any, element?: HTMLElement) => {
  const el = element || document.documentElement;
  const onScroll = async () => {
    if (el.scrollHeight - el.scrollTop <= el.clientHeight * 1.5) {
      await fn();
    }
  };

  const addScrollEvent = () => {
    (element || window).addEventListener("scroll", onScroll);
  };

  const removeScrollEvent = () => {
    (element || window).removeEventListener("scroll", onScroll);
  };

  return { addScrollEvent, removeScrollEvent };
};
