import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("req.query.secret===",req.query.secret);

  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: '유효하지 않은 토큰' })
  }

  try {
    // 페이지 재생성
    await res.revalidate('/gallery');
    return res.json({ revalidated: true });
  } catch (err) {
    // 만약 에러가 있다면, Next.js는 기존에 성공적으로 생성되어있던 페이지를 보여줄 것이다.
    return res.status(500).send('유효성 재검증 에러')
  }
}