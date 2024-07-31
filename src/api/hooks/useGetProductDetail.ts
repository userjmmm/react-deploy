import { useSuspenseQuery } from '@tanstack/react-query';

import type { ProductData } from '@/types';

import { getBaseUrl, fetchInstance } from '../instance';

export type ProductDetailRequestParams = {
  productId: string;
};

type Props = ProductDetailRequestParams;

export type GoodsDetailResponseData = ProductData;

export const getProductDetailPath = (productId: string) => `${getBaseUrl()}/api/products/${productId}`;

export const getProductDetail = async (params: ProductDetailRequestParams) => {
  const response = await fetchInstance.get<GoodsDetailResponseData>(
    getProductDetailPath(params.productId),
  );

  return response.data;
};

export const useGetProductDetail = ({ productId }: Props) => {
  return useSuspenseQuery({
    queryKey: [getProductDetailPath(productId)],
    queryFn: () => getProductDetail({ productId }),
  });
};
