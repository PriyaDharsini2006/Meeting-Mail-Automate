'use client'

import { useState, useEffect } from 'react'
import { Loader2, Search, Filter } from 'lucide-react'

export default function EditMembersPage() {
  const [teamMembers, setTeamMembers] = useState([])
  const [teams, setTeams] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  // New state for filtering and searching
  const [filterTeam, setFilterTeam] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch team members and teams
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/team-members')
        const data = await response.json()
        
        setTeamMembers(data.teamMembers)
        setTeams(data.teams)
      } catch (err) {
        setError('Failed to fetch team members and teams')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handle member selection
  const handleMemberSelect = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  // Submit team updates
  const handleSubmit = async () => {
    if (selectedMembers.length === 0 || !selectedTeam) {
      setError('Please select members and a team')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/team-members/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          memberIds: selectedMembers,
          teamId: selectedTeam
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(`Updated ${result.updatedCount} team member(s)`)
        setSelectedMembers([])
        
        // Refresh the data
        const refreshResponse = await fetch('/api/team-members')
        const refreshData = await refreshResponse.json()
        setTeamMembers(refreshData.teamMembers)
      } else {
        setError(result.message || 'Failed to update team members')
      }
    } catch (err) {
      setError('An error occurred while updating team members')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter and search logic
  const filteredMembers = teamMembers.filter(member => {
    const matchesTeamFilter = !filterTeam || member.team.id === filterTeam
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTeamFilter && matchesSearch
  })

  // Loading component
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-lg text-gray-600">Loading team members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Team Members</h1>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Team Update Section - Moved to the top */}
      <div className="mb-6 flex items-center space-x-4">
        <select 
          value={selectedTeam} 
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="p-2 border rounded flex-grow"
        >
          <option value="">Select a team</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <button 
          onClick={handleSubmit} 
          disabled={selectedMembers.length === 0 || !selectedTeam}
          className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Update Team ({selectedMembers.length} selected)
        </button>
      </div>

      {/* Filtering and Search Section */}
      <div className="mb-4 flex space-x-4">
        <div className="flex-grow relative">
          <input 
            type="text" 
            placeholder="Search members by name" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-8 border rounded"
          />
          <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
        </div>
        
        <select 
          value={filterTeam} 
          onChange={(e) => setFilterTeam(e.target.value)}
          className="p-2 border rounded flex-shrink-0"
        >
          <option value="">All Teams</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {/* Team Members Grid */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Team Members</h2>
        {filteredMembers.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No team members found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map(member => (
              <div 
                key={member.id} 
                className={`
                  p-3 border rounded cursor-pointer 
                  ${selectedMembers.includes(member.id) 
                    ? 'bg-blue-100 border-blue-500' 
                    : 'hover:bg-gray-100'
                  }
                `}
                onClick={() => handleMemberSelect(member.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-sm text-gray-500">
                      Current Team: {member.team.name}
                    </p>
                  </div>
                  {selectedMembers.includes(member.id) && (
                    <span className="text-blue-600">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}