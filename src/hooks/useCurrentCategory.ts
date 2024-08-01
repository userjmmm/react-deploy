import { useMemo } from 'react';

import { useGetCategories } from '@/api/hooks/useGetCategories';
import { getCurrentCategory } from '@/components/features/Category/CategoryHeroSection';

type Props = { categoryId: string };

export const useCurrentCategory = ({ categoryId }: Props) => {
  const { data: categories, isLoading, isError } = useGetCategories();

  const isRender = useMemo(() => {
    if (isLoading || isError)
      return false;
    if (!categories)
      return false;
    return true;
  }, [categories, isLoading, isError]);

  const currentTheme = getCurrentCategory(categoryId, categories ?? []);

  return {
    isRender,
    currentTheme,
  };
};
