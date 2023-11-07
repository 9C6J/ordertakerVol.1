import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react';
import Image from 'next/image'
import orange from "../public/orange.jpeg";
import { cn } from "~/utils/utils";

export default function Main() {
  const [isLoading, setLoading] = useState(true);

  return (

    <div 
    className="group flex flex-col items-center justify-start py-36 min-h-screen">
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
  )
}
