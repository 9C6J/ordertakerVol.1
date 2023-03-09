import React, {  useRef, useState, useEffect, ReactHTML} from "react";

import { supabase } from '../api/supabase';
import Image from 'next/image'
import internal from "stream";
import { InputType } from "zlib";
import { useFormFields } from "../../lib/utils";
import Router from "next/router";

const MAX_COUNT = 1;

// 상품
type Product = {
  // id : String;// 상품번호 
  title : string;// 상품제목 
  price : number;// 상품가격 
  imageSrc : string;// 상품이미지 
  size : string;// 상품사이즈 
  content : string;// 상품설명 

};

// 상품 초기화
const PRODUCT_FORM_VALUES: Product = {
  title : "",
  price : 0,
  imageSrc : "",
  size : "",
  content : "",
};


export default function CreateProduct(){

  const [values, handleChange, resetFormFields] = useFormFields<Product>(PRODUCT_FORM_VALUES);

  const [uploadedFiles, setUploadedFiles] = useState<File|any|null>('');
  const [imgFile, setImgFile] = useState<ArrayBuffer|String|null>('');
  const [fileLimit, setFileLimit] = useState(false);

  const firstFocusInput  = useRef<HTMLInputElement|any>(null);

  const handleUploadFiles = (file:File[]) => {
    // const uploaded = [...uploadedFiles];
    const reader = new FileReader();
    // const images = [...imgFile];

    let limitExceeded = false;
    // files.some((file) =>{
    //   if(uploaded.findIndex((f)=> f.name === file.name) === -1 ){
    //     // uploaded.push(file);
    //     uploaded[0] = file;

    //     reader.readAsDataURL(file);

    //     // if(uploaded.length === MAX_COUNT ) setFileLimit(true);
    //     // if(uploaded.length > MAX_COUNT){
    //     //   alert(`업로드 가능한 최대 파일 갯수는 ${MAX_COUNT}개 입니다.`);
    //     //   setFileLimit(false);
    //     //   limitExceeded = true;
    //     //   return true;
    //     // }
    //   }
    // });

    if(file?.length){
      reader.readAsDataURL(file[0]);
    }

    // if(!limitExceeded){
      setUploadedFiles(file[0])
      reader.onloadend = () => {
        // images.push(reader.result);
        setImgFile(reader.result)
        // console.log("e",images)
      }
    // };
  }

  const handleUpload = async(e:any) => {
    let files:any;
    
    if (e.target.files) {
      files = Array.prototype.slice.call(e.target.files);
      handleUploadFiles(files);
      handleChange(e);
    }

  }
  
  useEffect(()=>{
    firstFocusInput.current.focus();
  },[]);


  // 상품등록
  const handleSumbit = async (event : any) => {
    event.preventDefault();

    const InsertValue = {...values};

    // 파일서버 이미지 업로드
    try {
      const {data,error} = await supabase.storage
      .from('images')
      .upload('public/'+ uploadedFiles?.name, uploadedFiles as File, {
        upsert : true,
        cacheControl : '0'
      });

      // 파일서버 업로드 성공
      if(data){
        try {
          const sPath :string = "https://rnosdhxurhrwulmmbctu.supabase.co/storage/v1/object/public/images/"+data.path;
  
          // 파일서버 url 추가
          InsertValue.imageSrc = sPath;
          
          // 상품등록
          await supabase.from('product').insert(InsertValue);
          console.log('product insert 완료');
          
        } catch (err) {
          console.error(err);
        }
        Router.push("/product/productList");

  
      }else if(error){
        console.log(error);
        return;
      }
      // location.reload();
      // resetFormFields();

    } catch (error) {
      console.error(error);
      return;
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
              type="title"
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
              type="price"
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