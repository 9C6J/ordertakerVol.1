import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react';
import Image from 'next/image'
import cat from "../public/cat.png";

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

export const getServerSideProps = async () => {
  const { data, status, statusText } = await supabase.from('images').select('*');
  console.log("getServerSideProps ====");
  // console.log(req);

  console.log(data);
  console.log(status);
  console.log(statusText);


  if (!data) {
      return { 
        props: {
          images: [
            {
              id: 1,
              created_at: "test",
              name: "차",
              href: "https://avatars.githubusercontent.com/u/105836469?s=200&v=4",
              userName: "차",
              imageSrc: "https://avatars.githubusercontent.com/u/105836469?s=200&v=4"
            }
          ]
        }, 
        // redirect: { 
        //   destination: '/login',
        //   permanent: false 
        // } 
      }
  }

  return{
    props: {
      images: data,
    },
  }
}

/**
 * 배열 안에 존재할 수 있는 falsy한 값들을 제거하여 배열을 믿을 수 있는 상태로 만들기 위해 사용
 * 참고: https://velog.io/@yongbum/filter-boolean
*/
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}


const addTestImage = async () => {
  try {
    await supabase.from('images').insert([{
      name: 'test',
      href: 'https://avatars.githubusercontent.com/u/105836469?s=200&v=4',
      imageSrc: 'https://avatars.githubusercontent.com/u/105836469?s=200&v=4',
      userName: 'test'
    }]);
  
    console.log('완료!');
  } catch (err) {
    console.error(err);
  }
};

const showTestData = async () => {
  const { data, status, statusText } = await supabase.from('images').select('*');
  console.log("showTestData ====");
  console.log(data);
  console.log(status);
  console.log(statusText);
  
  return{
    props: {
      images: data,
    },
  }
};



function BlurImage({ image }: { image: Image }) {
  const [isLoading, setLoading] = useState(true)

  return (
    <a href={image.imageSrc} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        
        {/* <img
          alt=""
          src={image.imageSrc}
        /> */}
        
        <Image
          alt=""
          src={image.imageSrc}
          layout="fill"
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
      <h3 className="mt-4 text-sm text-gray-700">{image.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{image.name}</p>
    </a>
  )
}

export default function Gallery( { images }: { images: Image[]} ) {

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
        <title>Supabase Auth Tutorial</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-6xl font-bold">
        Welcome to{" "}
        <a className="text-blue-600" href="https://nextjs.org">
          Next.js! with Supabase1
        </a>
      </h1>
    </div>
  //   <div className="bg-slate-100 max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      
  //   <button className="bg-blue-100" onClick={showTestData}>
  //     DB 테스트
  //   </button><br/>

  //   <button className="bg-blue-100" onClick={addTestImage}>
  //     테스트 이미지를 추가
  //   </button>
  //   <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
  //     {/* <BlurImage /> */}
  //     {images && images.map((image) => (
  //         <BlurImage key={image.id} image={image} />
  //       ))}

        
  //     {item && item.map((image) => (
  //         <BlurImage key={image.id} image={image} />
  //       ))}


  //   </div>
  // </div>
  )
}

// max-w-2xl : max-width: 42rem;
// sm: lg: breakpoint
// x 좌우 , y 위아래
// padding ex) px, py / pt(top), pr(right), pb(bottom), pl(left) 

