'use client'
import { MeetingForm } from '../components/MeetingForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center relative">
      <button 
        onClick={() => window.location.href = '/edit_members'} 
        className='absolute top-4 left-4 bg-blue-500 text-white rounded-lg px-4 py-2'>
        edit
      </button>

      <div className="w-full max-w-md">
        <h1 className="text-2xl text-black font-bold mb-6 text-center">
        </h1>
        <MeetingForm />
      </div>
    </main>
  )
}
