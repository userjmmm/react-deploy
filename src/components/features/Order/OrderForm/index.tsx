import styled from '@emotion/styled';
import { FormProvider, useForm } from 'react-hook-form';
import { Spacing } from '@/components/common/layouts/Spacing';
import { SplitLayout } from '@/components/common/layouts/SplitLayout';
import type { OrderFormData, OrderHistory } from '@/types';
import { HEADER_HEIGHT } from '../../Layout/Header';
import { GoodsInfo } from './GoodsInfo';
import { OrderFormMessageCard } from './MessageCard';
import { OrderFormOrderInfo } from './OrderInfo';
import { getBaseUrl } from '@/api/instance';
import { useAuth } from '@/provider/Auth';
import { orderHistorySessionStorage } from '@/utils/storage';
import { useGetMemberPoints } from '@/api/hooks/useGetMemberPoints';

type Props = {
  orderHistory: OrderHistory[];
};

export const OrderForm = ({ orderHistory }: Props) => {
  const methods = useForm<OrderFormData>({
    defaultValues: {
      optionId: orderHistory[0]?.optionId ?? 0,
      productQuantity: orderHistory[0]?.quantity ?? 0,
      senderId: 0,
      receiverId: 0,
      hasCashReceipt: false,
      message: orderHistory[0]?.message ?? '',
    },
  });

  const { handleSubmit } = methods;
  const authInfo = useAuth();
  const { data: memberPoints, isLoading: isPointsLoading } = useGetMemberPoints();

  const handleForm = async (values: OrderFormData) => {
    const { errorMessage, isValid } = validateOrderForm(values);

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    const orders = orderHistorySessionStorage.get() as OrderHistory[];

    const results = [];
    for (const order of orders) {
      const requestBody = {
        optionId: order.optionId,
        quantity: order.quantity,
        message: values.message,
      };

      console.log('서버로 전송하는 요청 데이터:', JSON.stringify(requestBody, null, 2));

      try {
        const response = await fetch(`${getBaseUrl()}/api/orders`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authInfo?.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          credentials: 'include',
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`옵션 ID ${order.optionId} 주문 실패:`, response.status, errorBody);
          results.push({ success: false, optionId: order.optionId, error: errorBody });
        } else {
          const data = await response.json();
          console.log(`옵션 ID ${order.optionId} 주문 성공:`, data);
          results.push({ success: true, optionId: order.optionId, data });
        }
      } catch (error) {
        console.error(`옵션 ID ${order.optionId} 주문 에러:`, error);
        results.push({ success: false, optionId: order.optionId, error: error});
      }
    }

    const successfulOrders = results.filter(result => result.success);
    const failedOrders = results.filter(result => !result.success);

    if (successfulOrders.length > 0) {
      console.log('성공한 주문:', successfulOrders);
      alert(`${successfulOrders.length}개의 주문이 완료되었습니다.`);
    }

    if (failedOrders.length > 0) {
      console.error('실패한 주문:', failedOrders);
      alert(`${failedOrders.length}개의 주문 중 오류가 발생했습니다.`);
    }
  };

  const preventEnterKeySubmission = (e: React.KeyboardEvent<HTMLFormElement>) => {
    const target = e.target as HTMLFormElement;
    if (e.key === 'Enter' && !['TEXTAREA'].includes(target.tagName)) {
      e.preventDefault();
    }
  };

  return (
    <FormProvider {...methods}>
      <form action="" onSubmit={handleSubmit(handleForm)} onKeyDown={preventEnterKeySubmission}>
        <SplitLayout sidebar={
          <OrderFormOrderInfo 
            orderHistory={orderHistory}
            memberPoints={memberPoints}
            isPointsLoading={isPointsLoading}
          />
        }>
          <Wrapper>
            <OrderFormMessageCard />
            <Spacing height={8} backgroundColor="#ededed" />
            <GoodsInfo orderHistory={orderHistory} />
          </Wrapper>
        </SplitLayout>
      </form>
    </FormProvider>
  );
};

const validateOrderForm = (values: OrderFormData): { errorMessage?: string; isValid: boolean } => {
  console.log('유효성 검사 값:', values);

  if (values.hasCashReceipt) {
    if (!values.cashReceiptNumber) {
      return {
        errorMessage: '현금영수증 번호를 입력해주세요.',
        isValid: false,
      };
    }

    if (!/^\d+$/.test(values.cashReceiptNumber)) {
      return {
        errorMessage: '현금영수증 번호는 숫자로만 입력해주세요.',
        isValid: false,
      };
    }
  }

  if (values.message.length < 1) {
    return {
      errorMessage: '메시지를 입력해주세요.',
      isValid: false,
    };
  }

  if (values.message.length > 100) {
    return {
      errorMessage: '메시지는 100자 이내로 입력해주세요.',
      isValid: false,
    };
  }

  return {
    isValid: true,
  };
};

const Wrapper = styled.div`
  border-left: 1px solid #e5e5e5;
  height: calc(100vh - ${HEADER_HEIGHT});
`;