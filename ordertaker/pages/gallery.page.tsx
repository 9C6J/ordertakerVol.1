import React, { useState, useEffect} from "react";

import { supabase } from './api/supabase';
import Image from 'next/image'
import orange from "../public/orange.jpeg";
import cat from "../public/cat.png";
import { useRouter} from "next/router";

import { cn } from "~/utils/utils";

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


export const getStaticProps = async () => {
  const { data: images } = await supabase.from('images').select('*');

  return {
    props: {
      images
    }
  };
}

function BlurImage({ image }: { image: Image }) {
  const [isLoading, setLoading] = useState(true)

  return (
    <a href={image.imageSrc} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
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
};

const addTestImage = async () => {
  try {
    await supabase.from('images').insert([{
      name: 'undefined-study',
      href: 'https://github.com/undefined-study',
      userName: 'ahnanne',
      imageSrc: 'https://avatars.githubusercontent.com/u/105836469?s=200&v=4',
    }]);
  
    console.log('완료!');
  } catch (err) {
    console.error(err);
  }
};

type Image = {
  id: number;
  created_at: string;
  name: string;
  href: string;
  userName: string; 
  imageSrc: string;
};

// const Gallery = (props : Image|Image[]) => {
function Gallery({images} : { images : Image[]}){

  return (
    <div className="container px-5 py-10 mx-auto w-2/3">
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {images?.map((image) => (
            <BlurImage key={image.id} image={image} />
        ))}
      </div>
      <FileUpload/>

        <button className="bg-blue-100" onClick={addTestImage}>
          테스트 이미지를 추가
        </button>
    </div>
  );
};

const addImage = async () => {
  try {
    await supabase.from('images').insert([{
      name: 'test',
      href: 'https://avatars.githubusercontent.com/u/105836469?s=200&v=4',
      imageSrc: 'https://avatars.githubusercontent.com/u/105836469?s=200&v=4',
      userName: 'test'
    }]);
  
    // https://rnosdhxurhrwulmmbctu.supabase.co/storage/v1/object/sign/images/cat.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvY2F0LnBuZyIsImlhdCI6MTY3NDMwMDk5MiwiZXhwIjoxNjc0OTA1NzkyfQ.vjG_Jcw61aWF8FBsU_Q2LNvTbY_Ra2Zkf8sLlEufsqw&t=2023-01-21T11%3A36%3A32.227Z
    console.log('완료!');
  } catch (err) {
    console.error(err);
  }
};

function FileUpload(){

  const handleUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {
    let file;

    if (e.target.files) {
      file = e.target.files[0];
    }
    
    const {data,error} = await supabase.storage
    .from('images')
    .upload('public/'+ file?.name, file as File, {
      upsert : true,
      cacheControl : '0'
    });

    if(data){
      console.log(data);
      
      try {
        const sPath :string = "https://rnosdhxurhrwulmmbctu.supabase.co/storage/v1/object/public/images/"+data.path;

        await supabase.from('images').insert([{
          name: 'test',
          href: sPath,
          imageSrc: sPath,
          userName: 'test'
        }]);
        // location.reload();
        
        console.log('완료!');
      } catch (err) {
        console.error(err);
      }

    }else if(error){
      console.log(error);
    }
  }

  // https://www.youtube.com/watch?v=yLdOpLk7bsI&t=1s
  // https://nextdev1111.medium.com/how-to-use-supabase-storage-upload-file-easily-and-quickly-a7622e35cfe5
    return(
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        

        <input
          type="file"
          accept="image/*"
          id="file_input"
          className="
          block w-auto text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-poitner dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
          "
          onChange={(e)=> { handleUpload(e); }}
        />
      </div>

    )

}
export default Gallery;