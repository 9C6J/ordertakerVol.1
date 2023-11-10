import React, {  useRef, useState, useEffect, ReactHTML} from "react";

import { supabase } from '../../src/api/supabase';
import Image from 'next/image'
import { useFormFields } from "~/utils/utils";
import { Product } from '~/types/product';
import Router from "next/router";
import { checkFileForKorean, uploadImageToStorage } from '~/utils/imageUtils'; // 추가된 부분


// const MAX_COUNT = 1;

// 상품 초기화
const PRODUCT_FORM_VALUES: Product = {
  title: "",
  price: 0,
  imageSrc: null,
  size: null,
  content: "",
  order_qunatity_limit: 10,
};

export default function CreateProduct(){
  const [values, handleChange, resetFormFields] = useFormFields<Product>(PRODUCT_FORM_VALUES);
  const [uploadedFiles, setUploadedFiles] = useState<File | null>(null);
  const [imgFile, setImgFile] = useState<string | null>('');
  const firstFocusInput = useRef<HTMLInputElement | null>(null);
  // const [fileLimit, setFileLimit] = useState(false);
  
  const handleUploadFiles = (file: File[]) => {
    const reader = new FileReader();

    if (file?.length) {
      reader.readAsDataURL(file[0]);
    }

    setUploadedFiles(file[0]);

    reader.onloadend = () => {
      setImgFile(reader.result as string);
    };
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 0) {
      const file = files[0];

      if (checkFileForKorean(file?.name || '')) {
        alert(`상품이미지 파일 이름에 한글이 포함되어 있습니다. \n변경 후 다시 시도해주세요.`);
        return;
      }

      handleUploadFiles(files);
      handleChange(e);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const insertValue = { ...values };

    if (!uploadedFiles?.name) {
      confirm(`이미지 없이 등록할까요? 상품관리메뉴에서 등록 가능합니다.`);
    } else {
      const imageUrl = await uploadImageToStorage(uploadedFiles);

      if (imageUrl) {
        insertValue.imageSrc = imageUrl;

        // 상품 등록
        const { error } = await supabase.from('product').insert(insertValue);

        if (error) {
          console.log(error)
        } else {
          Router.push("/product");
        }
      }
    }
  };

  useEffect(() => {
    firstFocusInput?.current?.focus();
  }, []);

  // 상품등록
  const handleSumbit = async (event : any) => {
    event.preventDefault();
    const InsertValue = {...values};

    if(!uploadedFiles?.name){
      confirm(`이미지 없이 등록할까요? 상품관리메뉴에서 등록 가능합니다.`);      
    }else{    

      // 파일서버 이미지 업로드
      const {data,error} = await supabase.storage
      .from('images')
      .upload('public/'+ uploadedFiles?.name, uploadedFiles as File, {
        upsert : true,
        cacheControl : '0'
      });

      if(error){
        console.error(error);
        return;
      }
      InsertValue.imageSrc = "https://rnosdhxurhrwulmmbctu.supabase.co/storage/v1/object/public/images/"+data.path;
    }
      // 상품등록
      const {error} = await supabase.from('product').insert(InsertValue);

      if(error){
        console.log(error)
      }else{
        Router.push("/product");
      }

  };

  return (
    <div>
      <form
          onSubmit={handleSumbit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
            
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            > 
              상품명
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              name="title"
              type="string"
              placeholder=""
              required
              ref={firstFocusInput}
              value={values.title}
              onChange={handleChange}
            />
          </div>
            
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            > 
              상품가격
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              name="price"
              type="number"
              placeholder=""
              required
              value={values.price}
              onChange={handleChange}
            />
          </div>
            
          <div className="mb-6 ">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            > 
              상품이미지
            </label>
            
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" 
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  // className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                       
                    {imgFile ? 
                      <div className="">
                        <Image
                        alt=""
                        src={imgFile?.toString()}
                        priority={false}
                        width={150}
                        height={150}
                        />
                      </div>
                      // imgFile.map(file => (
                      // <div className="" key={file}>
                      //   <Image
                      //   alt=""
                      //   src={file}
                      //   priority={true}
                      //   width={100}
                      //   height={100}
                      //   />
                      // </div>
                    : <div>
                        <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
                          </path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    }
                       
                    </div>
                    <input id="dropzone-file" type="file" 
                    className="hidden" 
                      name="imageSrc"
                      // value={values.imageSrc}
                      onChange={(e)=> { handleUpload(e); }}
                      // disabled={fileLimit}
                      // multiple
                    />
                </label>
            </div> 
            
          </div>
          
            
          {/* <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            > 
              상품사이즈
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="size"
              name="size"
              type="size"
              placeholder=""
              required
            />
          </div> */}
            
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            > 
              상품설명
            </label>
            <textarea
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              cols={40}
              rows={8}
              id="content"
              name="content"
              placeholder=""
              value={values.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            > 
              구매시 최대수량
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="order_qunatity_limit"
              name="order_qunatity_limit"
              type="number"
              placeholder=""
              required
              defaultValue={values.order_qunatity_limit}
              onChange={handleChange}
              min="0"
            />
          </div>
          

          <div className="flex gap-2">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              상품등록
            </button>
          </div>

        </form>
    </div>
  )

}
