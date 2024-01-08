import axiosClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = (id: string | undefined) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () =>
      axiosClient()
        .get(`/users/${id}`)
        .then((res) => res.data),
  });
