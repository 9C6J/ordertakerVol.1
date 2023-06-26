import {useEffect, useState} from "react";
import { supabase } from '../api/supabase';

export async function getServerSideProps(){

    const { data: image } = await supabase.from('images').select('*');

    return {
        props : {
            image
        }
    }
}
// 2. 서버로부터 완전하게 만들어진 html파일을 받아와 페이지 전체를 렌더링 하는 방식
// 서버에 부담을줌
function Ssr({image}){


    return(
        <div>
             <h1>Server Side Rendering</h1>
             <ul>
                {image?.map(image=>(<li key={image.id}>{image.imageSrc}</li>))}
             </ul>   
        </div>
    )

}

export default Ssr