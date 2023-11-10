// src/layouts/MainLayout.tsx

import { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      {/* 공통 레이아웃 요소들을 추가할 수 있습니다. */}
      {children}
    </div>
  );
};

export default MainLayout;