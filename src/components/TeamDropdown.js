'use client'

import { useState, useEffect } from 'react'
import { Team } from '@prisma/client'



export function TeamDropdown({ onTeamSelect }) {
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('')

  useEffect(() => {
    async function fetchTeams() {
      const response = await fetch('/api/teams')
      const data = await response.json()
      setTeams(data)
    }
    fetchTeams()
  }, [])

  const handleTeamChange = (e) => {
    const teamId = e.target.value
    setSelectedTeam(teamId)
    onTeamSelect(teamId)
  }

  return (
    <select 
      value={selectedTeam} 
      onChange={handleTeamChange} 
      className="w-full p-2 text-black border rounded"
    >
      <option value="">Select a Team</option>
      {teams.map(team => (
        <option key={team.id} className='text-black' value={team.id}>
          {team.name}
        </option>
      ))}
    </select>
  )
}
