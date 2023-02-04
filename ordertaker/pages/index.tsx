import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react';
import Image from 'next/image'
// import cat from "../public/cat.png";
import orange from "../public/orange.jpeg";

import { supabase } from './api/supabase';

type Image = {
  id: number;
  created_at: string;
  name: string;
  href: string;
  userName: string;
  imageSrc: string;
};

// next.js는 프리렌더링(pre-rendering) 기능을 제공합니다.
// 말 그대로 사전에 미리 html을 렌더링 한다는 것인데요 즉 html을
// 미리 생성하고 최소한의js를 연결시킨 후 클라이언트에서 요청이 들어오면 해당 html을 로드하면서 나머지js를 불러와 화면에 렌더링 시켜주는 것이죠.

// Server-side rendering: SSR 
// export async function getServerSideProps() {
//   const { data } = await supabase.from( 'images' ).select( '*' );

//   console.log("getServersideProps");
//   console.log(data);

//   if(!data){
//     return {
//         props: {
//           images: [],
//         },
//       }
//   }

//   return {
//     props: {
//       images: data,
//     },
//   };
// }

// Static site rendering: SSG
// export async function getStaticProps() {

//   const { data } = await supabase.from('images').select('*').order('id');

//   return {
//     props: {
//       images: data,
//     },
//   }
// }


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

  // async function getTasks() {
  //   const { data } = await supabase.from('images').select('*');

  //   setItem( data );
  // }

  // Run the getTasks function when the component is mounted
  // useEffect(() => {
  //   getTasks();
  // }, []);

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
