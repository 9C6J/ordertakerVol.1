import {useEffect, useState} from "react";
import { supabase } from '../api/supabase';

export async function getStaticProps(){

    const { data: image } = await supabase.from('images').select('*');

    return {
        props : {
            image
        },
        revalidate: 60, //초를의미
    }
}
function Ssg({image}){

    return(
        <div>
             <h1>Incremental Static Regeneration</h1>
             <ul>
                {image?.map(image=>(<li key={image.id}>{image.imageSrc}</li>))}
             </ul>   
        </div>
    )

}

export default Ssg