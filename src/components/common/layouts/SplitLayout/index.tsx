import styled from '@emotion/styled';
import { ReactNode } from 'react';

type SplitLayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export const SplitLayout = ({ sidebar, children }: SplitLayoutProps) => {
  return (
    <Container>
      <MainContent>{children}</MainContent>
      <Sidebar>{sidebar}</Sidebar>
    </Container>
  );
};

const Container = styled.div`
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 2;
  padding: 20px;

  @media (max-width: 768px) {
    order: 1;
    padding: 10px;
  }
`;

const Sidebar = styled.div`
  flex: 1;
  padding: 20px;

  @media (max-width: 768px) {
    order: 2;
    padding: 10px;
  }
`;