import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import { useGetCategories } from '@/api/hooks/useGetCategories';
import { Container } from '@/components/common/layouts/Container';
import { Grid } from '@/components/common/layouts/Grid';
import { getDynamicPath } from '@/routes/path';
import { breakpoints } from '@/styles/variants';

import { CategoryItem } from './CategoryItem';
import { LoadingView } from '@/components/common/View/LoadingView';

export const CategorySection = () => {
  const { data: categories, isLoading, isError } = useGetCategories();

  if (isLoading) {
    return <LoadingView />;
  }
  if (isError) {
    return <ErrorMessage>문제가 발생했습니다. 나중에 다시 시도해주세요.</ErrorMessage>;
  }
  if (!categories || categories.length === 0 ) {
    return <EmptyMessage>카테고리가 없습니다.</EmptyMessage>;
  }

  return (
    <Wrapper>
      <Container>
        <Grid
          columns={{
            initial: 4,
            md: 6,
          }}
        >
          {categories.map((category) => (
            <Link key={category.id} to={getDynamicPath.category(category.id.toString())}>
              <CategoryItem image={category.imageUrl} label={category.name} />
            </Link>
          ))}
        </Grid>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 14px 14px 3px;

  @media screen and (min-width: ${breakpoints.sm}) {
    padding: 45px 52px 23px;
  }
`;
const ErrorMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: red;
`;

const EmptyMessage = styled.div`
  padding: 20px;
  text-align: center;
`;