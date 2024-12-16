import { MeetingForm } from '../components/MeetingForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl text-black font-bold mb-6 text-center">
          Send Meeting Invitation
        </h1>
        <MeetingForm />
      </div>
    </main>
  )
}
