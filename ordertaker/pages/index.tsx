import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react';
import Image from 'next/image'
import orange from "../public/orange.jpeg";

type Image = {
  id: number;
  created_at: string;
  name: string;
  href: string;
  userName: string;
  imageSrc: string;
};

/**
 * 배열 안에 존재할 수 있는 falsy한 값들을 제거하여 배열을 믿을 수 있는 상태로 만들기 위해 사용
 * 참고: https://velog.io/@yongbum/filter-boolean
*/
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Main( { images }: { images: Image[]} ) {
  const [isLoading, setLoading] = useState(true);
  const [item, setItem] = useState(
    []
  );

  return (

    <div className="flex flex-col items-center justify-start py-36 min-h-screen">
      <Head>
        <title>🍊</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-6xl font-bold">
         {/* 🍊{" "} */}
        <a className="text-blue-600" href="https://nextjs.org">
          {/* test */}
        </a>
      </h1>
      <Image
          alt=""
          src={orange}
          width={500}
          objectFit="cover"
          className={cn(
            'duration-700 ease-in-out group-hover:opacity-75',
            isLoading
              ? 'scale-110 blur-2xl grayscale'
              : 'scale-100 blur-0 grayscale-0'
          )}
          onLoadingComplete={() => setLoading(false)}
      />
    </div>
  )
}
