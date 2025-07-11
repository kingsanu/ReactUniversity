import React from 'react'
import Link from 'next/link'

export default function page() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50'>
      <div className='text-center mb-12'>
        <h1 className='text-8xl font-bold text-gray-900 mb-4'>TimsCare</h1>
        <p className='text-xl text-gray-600'>Your career development platform</p>
      </div>
      
      <div className='flex gap-6'>
        <Link 
          href="/dashboard" 
          className='bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg'
        >
          Dashboard
        </Link>
        
        <Link 
          href="/login" 
          className='bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg border border-gray-200'
        >
          Sign In
        </Link>
        
        <Link 
          href="/signup" 
          className='bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg'
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}
