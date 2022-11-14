import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react';
import Image from 'next/image'
import cat from "../public/cat.png";
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SERVICE_KEY as string
);

const IMAGE_TABLE = 'images';

type Image = {
  id: number;
  created_at: string;
  name: string;
  href: string;
  userName: string;
  imageSrc: string;
};

export async function getStaticProps() {
  console.log("1");
  const { data } = await supabaseAdmin.from( IMAGE_TABLE ).select( '*' );
  
  return {
    props: {
      images: data,
    },
  };
}

const addTestImage = async () => {
  try {
    await supabaseAdmin.from(IMAGE_TABLE).insert([{
      name: 'nmame',
      href: 'href',
      imageSrc: 'imageSrc',
      userName: 'userName'
    }]);
  
    console.log('완료!');
  } catch (err) {
    console.error(err);
  }
};


/**
 * 배열 안에 존재할 수 있는 falsy한 값들을 제거하여 배열을 믿을 수 있는 상태로 만들기 위해 사용
 * 참고: https://velog.io/@yongbum/filter-boolean
*/
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function BlurImage({ image }: { image: Image }) {
  const [ isLoading, setLoading ] = useState( true );

  return (
    <a href="1" className="group">
      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
        <Image
          alt=""
          src={cat}
          layout="fill"
          objectFit="cover"
          className={cn(
            'group-hover:opacity-75 duration-700 ease-in-out',
            isLoading
              ? 'grayscale blur-2xl scale-110'
              : 'grayscale-0 blur-0 scale-100'
          )}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">test</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">test</p>
    </a>
  )
}

export default function Gallery( { images }: { images: Image[]} ) {
  return (

    <div className="bg-slate-100 max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
    <button className="bg-blue-100" onClick={addTestImage}>
      테스트 이미지를 추가
    </button>
    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      <BlurImage />
      {/* {
       images.map( image  => <BlurImage key={image.id} image={image} /> )
      } */}
    </div>
  </div>
  )
}

// max-w-2xl : max-width: 42rem;
// sm: lg: breakpoint
// x 좌우 , y 위아래
// padding ex) px, py / pt(top), pr(right), pb(bottom), pl(left) 

