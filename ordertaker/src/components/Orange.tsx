// src/components/common/Orange.tsx

import { useState } from 'react';
import Image from 'next/image';
import orange from '../../public/orange.jpeg';
import { cn } from '~/utils/utils';

const Orange = () => {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="group flex flex-col items-center justify-start py-36 min-h-screen">
      <Image
        alt=""
        width={500}
        src={orange}
        objectFit="contain"
        className={cn(
          'duration-700 ease-in-out group-hover:opacity-100',
          isLoading
            ? 'scale-110 blur-2xl grayscale'
            : 'scale-100 blur-0 grayscale-0'
        )}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
};

export default Orange;