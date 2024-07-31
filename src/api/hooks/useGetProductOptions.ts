import { useSuspenseQuery } from '@tanstack/react-query';

import type { ProductOptionsData } from '@/types';

import {getBaseUrl, fetchInstance } from '../instance';
import type { ProductDetailRequestParams } from './useGetProductDetail';

type Props = ProductDetailRequestParams;

export type ProductOptionsResponseData = ProductOptionsData[];

export const getProductOptionsPath = (productId: string) =>
  `${getBaseUrl()}/api/products/${productId}/options`;

export const getProductOptions = async (params: ProductDetailRequestParams) => {
  const response = await fetchInstance.get<ProductOptionsResponseData>(
    getProductOptionsPath(params.productId),
  );
  return response.data;
};

export const useGetProductOptions = ({ productId }: Props) => {
  return useSuspenseQuery({
    queryKey: [getProductOptionsPath(productId)],
    queryFn: () => getProductOptions({ productId }),
  });
};
