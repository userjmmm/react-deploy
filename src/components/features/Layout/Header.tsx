import styled from '@emotion/styled';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, ChangeEvent } from 'react';

import { Container } from '@/components/common/layouts/Container';
import { useAuth } from '@/provider/Auth';
import { getDynamicPath, RouterPath } from '@/routes/path';
import { updateBaseUrl, queryClient } from '@/api/instance';

export const Header = () => {
  const navigate = useNavigate();
  const authInfo = useAuth();
  const [selectedApi, setSelectedApi] = useState('default');

  useEffect(() => {
    const storedBaseUrl = localStorage.getItem('baseURL');
    if (storedBaseUrl) {
      setSelectedApi(storedBaseUrl);
      updateBaseUrl(storedBaseUrl);
    }
  }, []);

  const handleLogin = () => {
    navigate(getDynamicPath.login());
  };

  const handleApiChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newApi = event.target.value;
    setSelectedApi(newApi);
    localStorage.setItem('baseURL', newApi);
    updateBaseUrl(newApi);
    queryClient.invalidateQueries();
  };

  return (
    <Wrapper>
      <Container flexDirection="row" alignItems="center" justifyContent="space-between">
        <Link to={RouterPath.home}>
          <Logo
            src="https://gift-s.kakaocdn.net/dn/gift/images/m640/pc_gift_logo.png"
            alt="카카오 선물하기 로고"
          />
        </Link>
        <RightWrapper>
        <select value={selectedApi} onChange={handleApiChange}>
            <option value="http://localhost:8080">백엔드 API 선택</option>
            <option value="http://giftshop-kakao.shop:8080">이지호</option>
            <option value="http://43.201.254.198:8080">정성훈</option>
            <option value="http://18.191.135.250:8080">윤재용</option>
            <option value="http://riding-bud.shop:8080">주보경</option>
          </select>
          {authInfo ? (
            <LinkButton onClick={() => navigate(RouterPath.myAccount)}>내 계정</LinkButton>
          ) : (
            <LinkButton onClick={handleLogin}>로그인</LinkButton>
          )}
        </RightWrapper>
      </Container>
    </Wrapper>
  );
};

export const HEADER_HEIGHT = '54px';

export const Wrapper = styled.header`
  position: fixed;
  z-index: 9999;
  width: 100%;
  max-width: 100vw;
  height: ${HEADER_HEIGHT};
  background-color: #fff;
  padding: 0 16px;
`;

const Logo = styled.img`
  height: ${HEADER_HEIGHT};
`;
const RightWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LinkButton = styled.p`
  align-items: center;
  font-size: 14px;
  color: #000;
  text-decoration: none;
  cursor: pointer;
  margin-left: 20px;
`;
