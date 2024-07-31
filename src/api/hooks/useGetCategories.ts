import { useQuery } from '@tanstack/react-query';

import type { CategoryData } from '@/types';

import { getBaseUrl, fetchInstance } from '../instance';

export type CategoryResponseData = {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: CategoryData[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  empty: boolean;
};

export const getCategoriesPath = () => `${getBaseUrl()}/api/categories`;

export const getCategories = async () => {
  const response = await fetchInstance.get<CategoryResponseData>(getCategoriesPath());
  return response.data;
};

export const useGetCategories = () =>
  useQuery({
    queryKey: [getCategoriesPath()],
    queryFn: getCategories,
  });
