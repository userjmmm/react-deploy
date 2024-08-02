import styled from '@emotion/styled';
import KAKAO_LOGO from '@/assets/kakao_logo.svg';
import { Button } from '@/components/common/Button';
import { breakpoints } from '@/styles/variants';
import { getBaseUrl } from '@/api/instance';

export const LoginPage = () => {
  const handleKakaoLogin = () => {
    const baseUrl = getBaseUrl();
    window.location.href = `${baseUrl}/oauth/kakao`;
  };

  return (
    <Wrapper>
      <Logo src={KAKAO_LOGO} alt="카카고 CI" />
      <FormWrapper>
        <Button
          onClick={handleKakaoLogin}
          style={{ backgroundColor: '#F7E600', color: '#3C1E1E' }}
        >
          카카오로 로그인
        </Button>
      </FormWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Logo = styled.img`
  width: 88px;
  color: #333;
`;

const FormWrapper = styled.article`
  width: 100%;
  max-width: 580px;
  padding: 16px;

  @media screen and (min-width: ${breakpoints.sm}) {
    border: 1px solid rgba(0, 0, 0, 0.12);
    padding: 60px 52px;
  }
`;