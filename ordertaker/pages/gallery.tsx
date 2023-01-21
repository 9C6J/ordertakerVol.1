import React, { useState, useEffect} from "react";

import { supabase } from './api/supabase';
import Image from 'next/image'
import orange from "../public/orange.jpeg";
import cat from "../public/cat.png";
// const showTestData = async () => {
//   const { data, status, statusText } = await supabase.from('images').select('*');
//   console.log("showTestData ====");
//   console.log(data);
//   console.log(status);
//   console.log(statusText);
  
//   return{
//     props: {
//       images: data,
//     },
//   }
// };

type ImageProps = {
  data: string;
  status: string;
  statusText : string;
};

const IMAGE_VALUES: ImageProps = {
  data: "",
  status: "",
  statusText : "",
};


export const getServerSideProps = async () => {
  // const { data , status, statusText } = await supabase.from('images').select('*');
  const { data , status, statusText } = await supabase.from('images').select('*');
  console.log("getServerSideProps ====");
  // console.log(req);

  // console.log(data);
  // console.log(status);
  // console.log(statusText);

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
  }else{
    return { 
      props: {
        images: data,
      }, 
    }

  }

}
// Static site rendering: SSG
// export async function getStaticProps() {

//   const { data } = await supabase.from('images').select('*').order('id');

//   return {
//     props: {
//       images: data,
//     },
//   }
// }

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
          priority={true}
          width={500}
          height={500}
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

// const addTestImage = async () => {
//   try {
//     await supabase.from('images').insert([{
//       name: 'test',
//       href: 'https://avatars.githubusercontent.com/u/105836469?s=200&v=4',
//       imageSrc: 'https://avatars.githubusercontent.com/u/105836469?s=200&v=4',
//       userName: 'test'
//     }]);
  
//     console.log('완료!');
//   } catch (err) {
//     console.error(err);
//   }
// };


/**
 * 배열 안에 존재할 수 있는 falsy한 값들을 제거하여 배열을 믿을 수 있는 상태로 만들기 위해 사용
 * 참고: https://velog.io/@yongbum/filter-boolean
*/
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type Image = {
  id: number;
  created_at: string;
  name: string;
  href: string;
  userName: string;
  imageSrc: string;
};

const Gallery = (data:any) => {

  // const [aImages, setImages] = useState<Image | null>(data);
  //   console.log(props)
  // }, []);

  // let image :Image[] = [{
  //   id: 123,
  //   created_at: "test",
  //   name: "test",
  //   href: "test",
  //   userName: "test",
  //   imageSrc: "test"
  // }]
    //   <div className="bg-slate-100 max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      
  //   <button className="bg-blue-100" onClick={showTestData}>
  //     DB 테스트
  //   </button><br/>

  //   <button className="bg-blue-100" onClick={addTestImage}>
  //     테스트 이미지를 추가
  //   </button>
  
  // </div>

  return (
    <div className="container px-5 py-10 mx-auto w-2/3">
      {/* <BlurImage image={image}/> */}
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {data.images && data.images.map((image : Image) => (
            <BlurImage key={image.id} image={image} />
        ))}
      </div>
      <FileUpload/>
    </div>
  );
};

function FileUpload(){
  // https://www.youtube.com/watch?v=yLdOpLk7bsI&t=1s
  
    return(
      <div>
        <input
          type="file"
          accept="image/*"
          id="file_input"
          className="
          block w-auto
          text-sm
          text-gray-900
          bg-gray-50 
          rounded-lg border
          border-gray-300
          cursor-poitner
          dark:text-gray-400
          focus:outline-none
          dark:bg-gray-700
          dark:border-gray-600
          dark:placeholder-gray-400
          "
        
        />
      </div>

    )

}
  
export default Gallery;