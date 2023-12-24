export interface Response<T> {
  status: string;
  result: T extends any[] ? number : undefined | null;
  data: {
    data: T;
  };
}
export interface InfiniteQueryResponse<T> {
  pageParams: any[];
  pages: Response<T[]>[];
}
