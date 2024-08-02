import styled from '@emotion/styled';
import { useGetProductDetail } from '@/api/hooks/useGetProductDetail';
import { useGetProductOptions } from '@/api/hooks/useGetProductOptions';
import { Image } from '@/components/common/Image';
import { Spacing } from '@/components/common/layouts/Spacing';
import type { OrderHistory } from '@/types';

import { LabelText } from '../Common/LabelText';

type Props = {
  orderHistory: OrderHistory[];
};

export const GoodsInfo = ({ orderHistory }: Props) => {
  const productId = orderHistory[0].productId;
  const { data: detail, isLoading: isDetailLoading } = useGetProductDetail({ productId: productId.toString() });
  const { data: options, isLoading: isOptionsLoading } = useGetProductOptions({ productId: productId.toString() });

  if (isDetailLoading || isOptionsLoading) {
    return <div>정보를 불러오는 중입니다...</div>;
  }

  return (
    <Wrapper>
      <LabelText>선물내역</LabelText>
      <Spacing />
      <GoodsWrapper>
        <GoodsInfoWrapper>
          <GoodsInfoImage>
            <Image src={detail.imageUrl} width={86} ratio="square" />
          </GoodsInfoImage>
          <GoodsInfoTextWrapper>
            <GoodsInfoTextTitle>{detail.name}</GoodsInfoTextTitle>
            {orderHistory.map((order, index) => {
              const selectedOption = options.find(option => option.id === order.optionId);
              return (
                <GoodsInfoTextOption key={index}>
                  {selectedOption ? `${selectedOption.name} X ${order.quantity}개` : '옵션 없음'}
                </GoodsInfoTextOption>
              );
            })}
            <GoodsInfoTextMessage>{orderHistory[0].message}</GoodsInfoTextMessage>
          </GoodsInfoTextWrapper>
        </GoodsInfoWrapper>
      </GoodsWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  width: 100%;
  padding: 16px;
`;

const GoodsWrapper = styled.div`
  width: 100%;
  padding: 20px 16px 16px;
  border-radius: 8px;
  border: 1px solid #ededed;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.02);
`;

const GoodsInfoWrapper = styled.div`
  display: flex;
`;

const GoodsInfoImage = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
`;

const GoodsInfoTextWrapper = styled.div`
  padding-left: 8px;
`;

const GoodsInfoTextTitle = styled.p`
  font-size: 14px;
  line-height: 18px;
  font-weight: 400;
  margin-top: 3px;
  color: #222;
  overflow: hidden;
  font-weight: 400;
`;

const GoodsInfoTextMessage = styled.p`
  font-size: 12px;
  line-height: 16px;
  color: #666;
  margin-top: 4px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const GoodsInfoTextOption = styled.p`
  font-size: 12px;
  line-height: 16px;
  color: #666;
  margin-top: 4px;
  white-space: pre-wrap;
  word-break: break-word;
`;