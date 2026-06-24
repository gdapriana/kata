import Trending from '@/app/(root)/_components/trending'
import React from 'react'

export default function LatestStories() {
  return (
    <main className='p-6'>
        <div className="container my-4 flex flex-col justify-start md:flex-row items-stretch md:justify-center md:items-start">
            <div className="md:w-2/3">Hello</div>
            <div className="md:w-1/3">
                <Trending />
            </div>
        </div>
    </main>
  )
}
