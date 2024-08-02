import { Divider } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useGetProductDetail } from '@/api/hooks/useGetProductDetail';
import { useGetProductOptions } from '@/api/hooks/useGetProductOptions';
import { Button } from '@/components/common/Button';
import { Spacing } from '@/components/common/layouts/Spacing';
import type { OrderHistory } from '@/types';
import { HeadingText } from '../Common/HeadingText';
import { LabelText } from '../Common/LabelText';
import { CashReceiptFields } from '../Fields/CashReceiptFields';
import { LoadingView } from '@/components/common/View/LoadingView';

type Props = {
  orderHistory: OrderHistory[];
};

export const OrderFormOrderInfo = ({ orderHistory }: Props) => {
  const productId = orderHistory[0].productId;
  const { data: detail, isLoading: isDetailLoading } = useGetProductDetail({ productId: productId.toString() });
  const { data: options, isLoading: isOptionsLoading } = useGetProductOptions({ productId: productId.toString() });

  if (isDetailLoading || isOptionsLoading) {
    return <LoadingView />;
  }

  if (!detail || !options) {
    return <div>상품 정보를 불러오는 중 오류가 발생했습니다.</div>;
  }

  const totalPrice = orderHistory.reduce((total, order) => {
    const selectedOption = options.find(option => option.id === order.optionId);
    return total + (selectedOption ? detail.price * order.quantity : 0);
  }, 0);

  return (
    <Wrapper>
      <Title>
        <HeadingText>결제 정보</HeadingText>
      </Title>
      <Divider color="#ededed" />
      <CashReceiptFields />
      <Divider color="#ededed" />
      <ItemWrapper>
        <LabelText>상품명</LabelText>
        <HeadingText>{detail.name}</HeadingText>
      </ItemWrapper>
      {orderHistory.map((order, index) => {
        const selectedOption = options.find(option => option.id === order.optionId);
        return (
          <ItemWrapper key={index}>
            <LabelText>선택한 옵션</LabelText>
            <HeadingText>{selectedOption ? `${selectedOption.name} X ${order.quantity}개` : '옵션 없음'}</HeadingText>
          </ItemWrapper>
        );
      })}
      <ItemWrapper>
        <LabelText>메시지</LabelText>
        <HeadingText>{orderHistory[0].message}</HeadingText>
      </ItemWrapper>
      <ItemWrapper>
        <LabelText>최종 결제금액</LabelText>
        <HeadingText>{totalPrice}원</HeadingText>
      </ItemWrapper>
      <Divider color="#ededed" />
      <Spacing height={32} />
      <Button type="submit">{totalPrice}원 결제하기</Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border-left: 1px solid #ededed;
  border-right: 1px solid #ededed;
  padding: 16px;
`;

const Title = styled.h6`
  padding: 24px 0 20px;
`;

const ItemWrapper = styled.div`
  padding: 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;