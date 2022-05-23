import useSWR from "swr";

const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

export function useCollections() {
  const { data, error } = useSWR('/api/collections', fetcher)

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}
