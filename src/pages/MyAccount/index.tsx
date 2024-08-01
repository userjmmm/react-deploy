import { Box, Button, HStack, Image, Text, VStack } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

import { RouterPath } from '@/routes/path';
import { authSessionStorage } from '@/utils/storage';
import { fetchInstance,getBaseUrl } from '@/api/instance';

interface WishlistItem {
  wishId: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImageUrl: string;
}

interface WishlistResponseData {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: WishlistItem[];
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
}

export const MyAccountPage = () => {
  const authInfo = JSON.parse(authSessionStorage.get() || '{}');
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const getWishlistPath = () => `${getBaseUrl()}/api/wishes`;

  const fetchWishlist = async (page: number) => {
    try {
      const response = await fetchInstance.get<WishlistResponseData>(
        `${getWishlistPath()}?page=${page}&size=10&sort=createdDate,desc`,
        {
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log('Response data:', data);
        setWishlist(data.content);
        setTotalPages(data.totalPages);
      } else if (response.status === 401) {
        alert('토큰이 유효하지 않습니다. 다시 로그인해주세요.');
      } else {
        alert('위시 리스트를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('위시 리스트 조회 에러:', error);
      alert('위시 리스트 조회 에러가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchWishlist(page);
  }, [page, authInfo.token]);

  const handleDelete = async (wishId: number) => {
    try {
      const response = await fetch(`/api/wishes/${wishId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });

      if (response.status === 204) {
        setWishlist((prev) => prev.filter((item) => item.wishId !== wishId));
        alert('관심 목록에서 삭제되었습니다.');
      } else if (response.status === 404) {
        alert('관심 상품을 찾을 수 없습니다.');
      } else if (response.status === 401) {
        alert('토큰이 유효하지 않습니다. 다시 로그인해주세요.');
      } else {
        alert('관심 목록 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('관심 목록 삭제 에러:', error);
      alert('관심 목록 삭제 에러가 발생했습니다.');
    }
  };

  const handleLogout = () => {
    authSessionStorage.set(undefined);
    localStorage.removeItem('authToken');

    const redirectURL = `${window.location.origin}${RouterPath.home}`;
    window.location.replace(redirectURL);
  };

  return (
    <Wrapper>
      <Text fontSize="2xl" fontWeight="bold">
        {authInfo?.email}님 안녕하세요!
      </Text>
      <Box height="64px" />
      <VStack spacing={4} align="stretch">
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <Box key={item.wishId} p={4} borderWidth="1px" borderRadius="lg">
              <HStack spacing={4}>
                <Image boxSize="50px" src={item.productImageUrl} alt={item.productName} />
                <VStack align="start">
                  <Text fontSize="lg" fontWeight="bold">{item.productName}</Text>
                  <Text>{item.productPrice}원</Text>
                </VStack>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDelete(item.wishId)}
                >
                  삭제
                </Button>
              </HStack>
            </Box>
          ))
        ) : (
          <Text>위시리스트에 상품이 없습니다.</Text>
        )}
      </VStack>
      <HStack spacing={4} mt={4}>
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          isDisabled={page === 0 || totalPages === 0}
        >
          이전
        </Button>
        <Text>{totalPages === 0 ? 1 : page + 1} / {totalPages === 0 ? 1 : totalPages}</Text>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          isDisabled={page === totalPages - 1 || totalPages === 0}
        >
          다음
        </Button>
      </HStack>
      <Box height="64px" />
      <Button colorScheme="gray" size="sm" onClick={handleLogout}>
        로그아웃
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 80px 0 120px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 36px;
`;