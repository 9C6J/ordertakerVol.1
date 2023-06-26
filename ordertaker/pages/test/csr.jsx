import {useEffect, useState} from "react";
import { supabase } from '../api/supabase';


export default function Csr(){

    const [image, setImages] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            const { data: images } = await supabase.from('images').select('*');
            // const res = await fetch("https://63046ed0761a3bce77e78.e9c.mockapi.io/api/users");
            // const users = await res.json();
            setImages(images);
        };

        fetchData();
    }, []);

// 1.데이터변경이 있고 화면 새로고침시 화면깜빡임과 동시에 최신데이터를 가지고옴.
// 초기 로딩 느림
// SEO X
    return(
        <div>
             <h1>Client Side Rendering</h1>
             <ul>
                {image?.map(image=>(<li key={image.id}>{image.imageSrc}</li>))}
             </ul>   
        </div>

    )


}