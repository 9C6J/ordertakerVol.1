/**
 * v0 by Vercel.
 * @see https://v0.dev/t/M0rut6wvakp
 */
import Link from "next/link"
import { Button } from "~/components/ui/button"
import { CardHeader, CardContent, Card } from "~/components/ui/card"
import { Avatar } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { SVGProps } from "react"
import { cn } from "~/utils/utils"

export default function Component() {
  return (
    <>
      <main className="flex-1">
        <section
          className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center bg-gray-200"
          style={{
            backgroundImage: "url(/placeholder.svg?height=500&width=1000)",
          }}
        >
          <div className="container px-4 md:px-6 text-black">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">Welcome to our Marketing Agency</h1>
            <p className="mt-2 text-lg sm:text-xl md:text-2xl">We help your business grow and succeed.</p>
            {/* <Button className="mt-4">상품 보러가기</Button> */}
          </div>
        </section>
        {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">현주네 제주도 감귤</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">1박스 10kg 기준! 35,000 =&lt; 25,000 지인 할인</p>
                  <Button className="mt-2">장바구니 담기</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Service 1</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Description for service 1.</p>
                  <Button className="mt-2">Shortcut Link</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Service 1</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Description for service 1.</p>
                  <Button className="mt-2">Shortcut Link</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section> */}
        {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">주문하기</h2>
            <form className="mt-8 grid grid-cols-1 gap-6">
              <input
                className="border-2 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Full Name"
                type="text"
              />
              <input
                className="border-2 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Email Address"
                type="email"
              />
              <textarea
                className="border-2 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Your Message"
                rows={5}
              />
              <Button>주문</Button>
            </form>
          </div>
        </section> */}
      </main>
    </>
  )
}

function MountainIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}


function PlaneIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  )
}
