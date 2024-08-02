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

  const handleForm = async (values: OrderFormData) => {
    const { errorMessage, isValid } = validateOrderForm(values);

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    const orders = orderHistorySessionStorage.get() as OrderHistory[];

    const requests = orders.map(order => {
      const requestBody = {
        optionId: order.optionId,
        quantity: order.quantity,
        message: values.message,
      };

      console.log('서버로 전송하는 요청 데이터:', JSON.stringify(requestBody, null, 2));

      return fetch(`${getBaseUrl()}/api/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authInfo?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      })
      .then(async response => {
        const status = response.status;
        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`옵션 ID ${order.optionId} 주문 실패:`, status, errorBody);
          return { success: false, optionId: order.optionId, status, error: errorBody };
        }
        const data = await response.json();
        console.log(`옵션 ID ${order.optionId} 주문 성공:`, data);
        return { success: true, optionId: order.optionId, status, data };
      })
      .catch(error => {
        console.error(`옵션 ID ${order.optionId} 주문 에러:`, error);
        return { success: false, optionId: order.optionId, status: 500, error: error.message };
      });
    });

    try {
      const results = await Promise.all(requests);
      const successfulOrders = results.filter(result => result.success);
      const failedOrders = results.filter(result => !result.success);

      if (successfulOrders.length > 0) {
        console.log('성공한 주문:', successfulOrders);
        alert(`${successfulOrders.length}개의 주문이 완료되었습니다.`);
      }

      if (failedOrders.length > 0) {
        console.error('실패한 주문:', failedOrders);
        const insufficientPoints = failedOrders.some(order => order.status === 400);
        if (insufficientPoints) {
          alert('포인트가 부족합니다.');
        } else {
          alert(`${failedOrders.length}개의 주문 중 오류가 발생했습니다.`);
        }
      }
    } catch (error) {
      console.error('주문 처리 중 예외 발생:', error);
      alert('주문 처리 중 예기치 않은 오류가 발생했습니다.');
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
        <SplitLayout sidebar={<OrderFormOrderInfo orderHistory={orderHistory} />}>
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