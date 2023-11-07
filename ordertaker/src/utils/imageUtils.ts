// utils/imageUtils.ts

import { supabase } from '~/api/supabase';

// 파일 이름에 한글이 포함되어 있는지 확인
export const checkFileForKorean = (fileName: string): boolean => {
  const CheckRegExpKorean: RegExp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  return CheckRegExpKorean.test(fileName);
};

// 이미지를 Supabase Storage에 업로드하고 URL 반환
export const uploadImageToStorage = async (imageFile: File): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from('images')
    .upload('public/' + imageFile.name, imageFile, {
      upsert: true,
      cacheControl: '0'
    });

  if (error) {
    console.error(error);
    return null;
  }

  return "https://rnosdhxurhrwulmmbctu.supabase.co/storage/v1/object/public/images/" + data.path;
};