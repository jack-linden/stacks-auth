import useSWR from "swr";

const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

export function useCollection(id: string) {
  const { data, error, mutate } = useSWR(
    id ? `/api/collections/${id}` : null,
    fetcher
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate
  };
}
