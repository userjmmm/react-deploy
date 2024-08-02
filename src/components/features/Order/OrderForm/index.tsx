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

type Props = {
  orderHistory: OrderHistory;
};

export const OrderForm = ({ orderHistory }: Props) => {
  const { optionId, quantity, message } = orderHistory;

  const methods = useForm<OrderFormData>({
    defaultValues: {
      optionId,
      productQuantity: quantity,
      senderId: 0,
      receiverId: 0,
      hasCashReceipt: false,
      messageCardTextMessage: message,
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

    const requestBody = {
      optionId: values.optionId,
      quantity: values.productQuantity,
      message: values.messageCardTextMessage,
    };

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

      if (response.ok) {
        console.log('Request Body:', requestBody);
        alert('주문이 완료되었습니다.');
      }
      else if (response.status === 403) {
        alert('주문 권한이 없습니다. 로그인 상태를 확인해주세요.');
      }
      else {
        alert('주문에 실패했습니다.');
      }
    } catch (error) {
      console.error('주문 에러:', error);
      alert('주문 에러가 발생했습니다.');
    }
  };

  // Submit 버튼을 누르면 form이 제출되는 것을 방지하기 위한 함수
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

  if (values.messageCardTextMessage.length < 1) {
    return {
      errorMessage: '메시지를 입력해주세요.',
      isValid: false,
    };
  }

  if (values.messageCardTextMessage.length > 100) {
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
