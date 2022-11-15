/**
 * https://www.paigeniedringhaus.com/blog/how-to-unit-test-next-js-api-routes-with-typescript
 */
 import { NextApiRequest, NextApiResponse } from "next";

 export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   // 유효한 요청인지부터 확인
   if (req.query.secret !== process.env.REVALIDATE_SECRET) {
     return res.status(401).json({ message: '유효하지 않은 토큰' });
   }
 
   try {
     // 페이지 재생성
     await res.unstable_revalidate('/');
     return res.json({ revalidated: true });
   } catch (err) {
     // 만약 에러가 있다면, Next.js는 기존에 성공적으로 생성되어있던 페이지를 보여줄 것이다.
     return res.status(500).send('유효성 재검증 에러');
   }
 }