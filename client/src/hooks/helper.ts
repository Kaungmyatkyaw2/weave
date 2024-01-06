import { Post } from "@/types/post.types";
import { InfiniteQueryResponse } from "@/types/response.types";

export const updateInfiniteQueryPages = <T extends Post>(
  prevData: InfiniteQueryResponse<T>,
  data: T
) => {
  let pages = prevData.pages;

  pages = pages.map((el) => ({
    ...el,
    data: {
      data: el.data.data.map((de) => (de._id == data._id ? data : de)),
    },
  }));

  prevData = {
    ...prevData,
    pages,
  };

  return prevData;
};

export const updateInfiniteQueryPagesOnDelete = <T extends Post>(
  prevData: InfiniteQueryResponse<T>,
  id: string
) => {
  let pages = prevData.pages;

  pages = pages.map((el) => ({
    ...el,
    data: {
      data: el.data.data.filter((de) => de._id != id),
    },
  }));

  prevData = {
    ...prevData,
    pages,
  };

  return prevData;
};
