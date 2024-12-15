'use client'

import { useState } from 'react'
import { TeamDropdown } from './TeamDropdown'

export function MeetingForm() {
  const [name, setName] = useState('')
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')
  const [meetingLink, setMeetingLink] = useState('')
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({
    type: null,
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          time,
          description,
          meetingLink,
          teamId: selectedTeamId
        })
      })

      const responseData = await response.json()

      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Invitation sent successfully!' 
        })
        // Reset form
        setName('')
        setTime('')
        setDescription('')
        setMeetingLink('')
        setSelectedTeamId('')
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: responseData.message || 'Unknown error occurred' 
        })
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Failed to send invitation' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Schedule Meeting
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Meeting Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter meeting name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Meeting Time
            </label>
            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border  text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              required
            />
          </div>

          <div>
            <label className="block  text-black text-gray-700 text-sm font-semibold mb-2">
              Team
            </label>
            <TeamDropdown onTeamSelect={setSelectedTeamId} className=' text-black' />
          </div>

          <div>
            <label className="block text-gray-700  text-black text-sm font-semibold mb-2">
              Meeting Link
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full px-3 py-2 border  text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter meeting link"
              required
            />
          </div>

          <div>
            <label className="block  text-black text-gray-700 text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full  text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 min-h-[100px]"
              placeholder="Enter meeting description"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Invitation'}
          </button>
        </form>

        {submitStatus.type && (
          <div 
            className={`mt-4 p-4 rounded-md text-center ${
              submitStatus.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
            }`}
          >
            {submitStatus.message}
          </div>
        )}
      </div>
    </div>
  )
}