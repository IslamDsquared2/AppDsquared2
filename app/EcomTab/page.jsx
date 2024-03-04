import React from 'react'
import Header from '@/components/Header'

const page = () => {
  return (
    <div className='w-full h-full overflow-hidden'>
      <Header />
    <div className='w-screen h-screen flex justify-center items-center'>
      <img src="https://media2.giphy.com/media/j736NvdQFYhX9FOtx6/giphy.gif?cid=6c09b9529iuhw1ecdjcnw0ys4imft5055kjanzhcjnl78bh6&ep=v1_stickers_related&rid=giphy.gif&ct=s" alt="work in progress" />
    </div>
    </div>
  )
}

export default page