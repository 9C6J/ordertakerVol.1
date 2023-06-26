/** @type {import('next').NextConfig} */
module.exports = {
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'example.com',
  //       port: '',
  //       pathname: '/account123/**',
  //     },
  //   ],
  // },


  reactStrictMode: true,
  images: {
    domains: [
    'ordertaker-vol-1.vercel.app',
    'bit.ly',
    'pbs.twimg.com',
    '*',
    'www.google.com',
    'avatars.githubusercontent.com',
    'rnosdhxurhrwulmmbctu.supabase.co',
    ]
  },
}