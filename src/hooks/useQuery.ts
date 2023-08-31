import axios from 'axios';
import {
  useQuery as useBaseQuery,
  UseQueryOptions as UseBaseQueryOptions,
} from 'react-query';
import config from 'src/config/config';

interface UseQueryOptions<TQueryFnData>
  extends UseBaseQueryOptions<TQueryFnData> {
  url: string;
  params?: unknown;
}

export function useQuery<TQueryFnData>(options: UseQueryOptions<TQueryFnData>) {
  const { params, url, ...rest } = options;

  return useBaseQuery<TQueryFnData>({
    queryFn: async ({ signal }) => {
      const response = await axios.get(url, {
        params,
        signal,
        baseURL: config.baseUrl,
      });
      return response.data;
    },
    ...rest,
  });
}
