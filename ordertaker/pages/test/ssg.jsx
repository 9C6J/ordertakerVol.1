import {useEffect, useState} from "react";
import { supabase } from '../api/supabase';

export async function getStaticProps(){

    const { data: image } = await supabase.from('images').select('*');

    return {
        props : {
            image
        }

    }
}

// 빌드를 진행할 때 pages 폴더에서 작성한 각 페이지들에 대해 각각의 문서를 생성해서 static한 파일로 생성합니다.
//만약 해당 페이지에 대한 요청이 발생하게 되면, 이 페이지들을 재생성하는 것이 아니라 이미 생성이 된 페이지를 반환하는 형태로 동작합니다. 따라서 React의 CSR보다 응답속도가 빠르다는 장점이 있고 Next.js에서도 SSG형태로 사용하는 것을 지향하고 있습니다.
// 마케팅 페이지, 블로그 게시물, 제품의 목록과 같이 정적 생성된 정보를 각 요청에 동일한 정보로 반환하는 경우에 위 SSG를 사용합니다.
function Ssg({image}){

    return(
        <div>
             <h1>Static Stie Generation</h1>
             <ul>
                {image.map(image=>(<li key={image.id}>{image.imageSrc}</li>))}
             </ul>   
        </div>
    )

}

export default Ssg