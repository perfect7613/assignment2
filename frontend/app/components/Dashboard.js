"use client"

import { useState, useEffect } from "react"
import { Search, Settings, Bell, ChevronDown, Star, FileText, Upload, Menu, X } from "lucide-react"
import Image from "next/image"
import ImportCandidates from "./ImportCandidates"

import { 
  fetchCandidates, 
  fetchCandidate, 
  advanceCandidateStage, 
  rejectCandidate, 
  generateCandidatePDF
} from "../services/api"


export default function Dashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [activeTab, setActiveTab] = useState("All")
  const [candidates, setCandidates] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Load candidates
  useEffect(() => {
    const loadCandidates = async () => {
      setIsLoading(true)
      setError(null)
      try {
        let stage = null
        if (activeTab === "Accepted") stage = "Accepted"
        if (activeTab === "Rejected") stage = "Rejected"
        
        const data = await fetchCandidates({
          stage: stage,
          search: searchQuery,
        })
        setCandidates(data)
      } catch (err) {
        setError("Failed to load candidates. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCandidates()
  }, [activeTab, searchQuery])

  const handleCandidateClick = async (candidate) => {
    try {
      const fullCandidate = await fetchCandidate(candidate.id)
      setSelectedCandidate(fullCandidate)
      setMobileMenuOpen(false) // Close mobile menu when opening candidate details
    } catch (err) {
      console.error("Failed to fetch candidate details:", err)
      setError("Failed to load candidate details. Please try again.")
    }
  }

  const handleCloseDetails = () => {
    setSelectedCandidate(null)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleAdvanceStage = async () => {
    if (!selectedCandidate) return
    
    const stageProgression = {
      "Screening": "Design Challenge",
      "Design Challenge": "Interview",
      "Interview": "Round 2 Interview",
      "Round 2 Interview": "HR Round",
      "HR Round": "Hired"
    }
    
    const nextStage = stageProgression[selectedCandidate.stage] || "Hired"
    
    try {
      const updatedCandidate = await advanceCandidateStage(selectedCandidate.id, nextStage)
      setSelectedCandidate(updatedCandidate)
      
      // Update the candidate in the list
      setCandidates(candidates.map(c => 
        c.id === updatedCandidate.id ? updatedCandidate : c
      ))
    } catch (err) {
      console.error("Failed to advance candidate:", err)
      setError("Failed to update candidate status. Please try again.")
    }
  }

  const handleRejectCandidate = async () => {
    if (!selectedCandidate) return
    
    try {
      const updatedCandidate = await rejectCandidate(selectedCandidate.id)
      setSelectedCandidate(updatedCandidate)
      
      setCandidates(candidates.map(c => 
        c.id === updatedCandidate.id ? updatedCandidate : c
      ))
    } catch (err) {
      console.error("Failed to reject candidate:", err)
      setError("Failed to reject candidate. Please try again.")
    }
  }

  const handleGeneratePDF = () => {
    if (!selectedCandidate) return
    generateCandidatePDF(selectedCandidate.id)
  }

  const handleImportSuccess = (newCandidates) => {
    setCandidates([...candidates, ...newCandidates])
    setShowImportModal(false)
  }
  
  const handleImportCancel = () => {
    setShowImportModal(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className={`flex flex-col md:flex-row min-h-screen bg-[#151515] text-white overflow-hidden`}>
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-r from-[#6E38E0] to-[#FF5F36] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-[#151515] rounded-full"></div>
          </div>
          <span className="font-semibold">RSKD Talent</span>
        </div>
        <button onClick={toggleMobileMenu} className="text-gray-400">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`${
          mobileMenuOpen ? 'block fixed inset-0 z-40 bg-[#151515]' : 'hidden'
        } md:block md:static md:w-[180px] md:border-r md:border-gray-800 md:flex-col ${selectedCandidate ? 'md:blur-sm' : ''}`}
      >
        <div className="hidden md:flex p-6 items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-r from-[#6E38E0] to-[#FF5F36] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-[#151515] rounded-full"></div>
          </div>
          <span className="font-semibold">RSKD Talent</span>
        </div>

        <div className="mt-8 px-6">
          <div className="text-xs text-gray-400 mb-4">RECRUITMENT</div>
          <div className="bg-gradient-to-r from-[#6E38E0] to-[#FF5F36] rounded-full p-[1px]">
            <div className="flex items-center gap-2 py-2 px-4 rounded-full">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  fill="white"
                />
                <path
                  d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z"
                  fill="white"
                />
              </svg>
              <span className="font-medium">Candidates</span>
            </div>
          </div>
        </div>
        
        {/* Mobile menu close button */}
        <div className="md:hidden mt-8 px-6">
          <button 
            onClick={toggleMobileMenu}
            className="w-full bg-[#222222] py-2 px-4 rounded-md"
          >
            Close Menu
          </button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${selectedCandidate ? 'blur-sm' : ''}`}>
        {/* Header - Desktop */}
        <div className="hidden md:flex justify-between items-center p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for jobs, candidates and more..."
              className="bg-[#222222] rounded-full pl-10 pr-4 py-2 text-sm w-[350px] focus:outline-none"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center gap-4">
            <Settings className="w-5 h-5 text-gray-400" />
            <Bell className="w-5 h-5 text-gray-400" />
            <div className="w-8 h-8 rounded-full bg-[#FF5F36] flex items-center justify-center text-white">R</div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#222222] rounded-full pl-10 pr-4 py-2 text-sm w-full focus:outline-none"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Current Openings */}
        <div className="px-4 md:px-6 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold">Current Openings</h2>
            <div className="flex items-center gap-2 text-sm bg-[#222222] rounded-full px-4 py-1">
              <span className="hidden sm:inline">Sort By:</span> Latest
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <JobCard
              title="Sr. UX Designer"
              icon="🎨"
              color="from-[#6E38E0] to-[#FF5F36]"
              postedDays={2}
              location="Bengaluru"
              experience={3}
              applications={45}
              lastWeek={14}
            />
            <JobCard
              title="Growth Manager"
              icon="📈"
              color="from-[#FF5F36] to-[#FF8F36]"
              postedDays={5}
              location="Remote"
              experience={2}
              applications={38}
              lastWeek={0}
            />
            <JobCard
              title="Financial Analyst"
              icon="💰"
              color="from-[#FFD928] to-[#FFA928]"
              postedDays={0}
              location="Mumbai"
              experience={5}
              applications={25}
              lastWeek={25}
            />
            <JobCard
              title="Software Engineer"
              icon="💻"
              color="from-[#00B85E] to-[#00D88A]"
              postedDays={1}
              location="New York"
              experience={4}
              applications={105}
              lastWeek={0}
            />
          </div>
        </div>

        {/* Candidates */}
        <div className="px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
            <h2 className="text-lg md:text-xl font-semibold">Candidates</h2>
            <div className="flex flex-wrap items-center gap-3">
              {/* Import Button */}
              <button 
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 text-sm bg-[#222222] rounded-full px-4 py-1"
              >
                <Upload className="w-4 h-4" />
                <span>Import Candidates</span>
              </button>
              
              <div className="flex items-center gap-2 text-sm bg-[#222222] rounded-full px-4 py-1">
                <span>March 2023</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 md:gap-6 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <TabButton active={activeTab === "All"} onClick={() => setActiveTab("All")}>
              All
            </TabButton>
            <TabButton active={activeTab === "Accepted"} onClick={() => setActiveTab("Accepted")}>
              Accepted
            </TabButton>
            <TabButton active={activeTab === "Rejected"} onClick={() => setActiveTab("Rejected")}>
              Rejected
            </TabButton>
          </div>

          {isLoading ? (
            <div className="text-center py-10">Loading candidates...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-10">No candidates found</div>
          ) : (
            <div className="bg-[#1A1A1A] rounded-lg overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b border-gray-800">
                    <th className="px-4 py-3">CANDIDATE NAME</th>
                    <th className="px-4 py-3">
                      RATING
                      <ChevronDown className="w-3 h-3 inline ml-1" />
                    </th>
                    <th className="px-4 py-3">
                      STAGES
                      <ChevronDown className="w-3 h-3 inline ml-1" />
                    </th>
                    <th className="px-4 py-3">APPLIED ROLE</th>
                    <th className="px-4 py-3">
                      APPLICATION DATE
                      <ChevronDown className="w-3 h-3 inline ml-1" />
                    </th>
                    <th className="px-4 py-3">ATTACHMENTS</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="border-b border-gray-800 hover:bg-[#222222] cursor-pointer"
                      onClick={() => handleCandidateClick(candidate)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                            <Image
                              src={candidate.avatar || "/placeholder.svg"}
                              alt={candidate.name}
                              width={32}
                              height={32}
                            />
                          </div>
                          <span>{candidate.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-[#FFD928] text-[#FFD928]" />
                          <span>{typeof candidate.rating === 'number' ? candidate.rating.toFixed(1) : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{candidate.stage}</td>
                      <td className="px-4 py-3">{candidate.role}</td>
                      <td className="px-4 py-3">
                        {new Date(candidate.date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>
                            {candidate.files} {candidate.files === 1 ? "file" : "files"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedCandidate && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-40"
            onClick={handleCloseDetails}
          ></div>
          
          <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[90%] md:w-[400px] bg-[#1A1A1A] shadow-lg z-50 sm:rounded-l-lg overflow-hidden">
            <div className="h-full p-4 md:p-6 overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Candidate Details</h2>
                <button onClick={handleCloseDetails} className="text-gray-400 hover:text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#222222]">
                  ✕
                </button>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-[#6E38E0] bg-[#222222]">
                  <Image
                    src={selectedCandidate.avatar || "/placeholder.svg"}
                    alt={selectedCandidate.name}
                    width={64}
                    height={64}
                  />
                </div>
                <h3 className="text-lg font-semibold">{selectedCandidate.name}</h3>
                <p className="text-sm text-gray-400">{selectedCandidate.role}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#222222] p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">EMAIL</p>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M17 21H7C4 21 2 19.5 2 16V8C2 4.5 4 3 7 3H17C20 3 22 4.5 22 8V16C22 19.5 20 21 17 21Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.7698 7.7688L13.2228 12.0551C12.5025 12.6116 11.4973 12.6116 10.777 12.0551L5.22998 7.7688"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-sm truncate">{selectedCandidate.email || "N/A"}</span>
                  </div>
                </div>
                <div className="bg-[#222222] p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">PHONE NUMBER</p>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.31 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                      />
                    </svg>
                    <span className="text-sm">+1 5423-6548</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Application Details</h3>

                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-gray-700"></div>

                  {["Screening", "Design Challenge", "Interview", "Round 2 Interview", "HR Round", "Hired"].map((stage, index) => {
                    const currentStageIndex = ["Screening", "Design Challenge", "Interview", "Round 2 Interview", "HR Round", "Hired"].indexOf(selectedCandidate.stage);
                    const isCompleted = index <= currentStageIndex;
                    const isInProgress = index === currentStageIndex;
                    
                    return (
                      <div key={stage} className="relative z-10 flex items-start gap-3 mb-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted ? "bg-[#00B85E]" : isInProgress ? "bg-[#FFD928]" : "bg-[#222222]"
                        }`}>
                          {isCompleted && index < currentStageIndex ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M9.31006 14.7L5.85006 11.24L4.44006 12.65L9.31006 17.52L19.5701 7.26L18.1601 5.85L9.31006 14.7Z"
                                fill="white"
                              />
                            </svg>
                          ) : isInProgress ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                fill="white"
                              />
                            </svg>
                          ) : (
                            <span className="text-white">{index + 1}</span>
                          )}
                        </div>
                        <div className={index === currentStageIndex ? "flex justify-between w-full" : ""}>
                          <div>
                            <h4 className="font-medium">{stage}</h4>
                            {index < currentStageIndex && (
                              <p className="text-xs text-gray-400">Completed</p>
                            )}
                          </div>
                          {index === currentStageIndex && (
                            <div className="bg-[#222222] text-xs px-2 py-1 rounded-md text-[#FFD928]">Under Review</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Experience</h3>

                <div className="bg-[#222222] p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                          fill="#FF5A5F"
                        />
                        <path
                          d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z"
                          fill="#FF5A5F"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Previous Company</h4>
                      <p className="text-xs text-gray-400">Oct '20 - Present</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    {selectedCandidate.rejected 
                      ? "This candidate has been rejected."
                      : "Candidate is currently under consideration for the " + selectedCandidate.role + " position."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button 
                  onClick={handleAdvanceStage}
                  disabled={selectedCandidate.rejected || selectedCandidate.stage === "Hired"}
                  className={`flex-1 ${
                    selectedCandidate.rejected || selectedCandidate.stage === "Hired"
                      ? "bg-gray-600"
                      : "bg-gradient-to-r from-[#6E38E0] to-[#FF5F36]"
                  } text-white py-2 px-4 rounded-md flex items-center justify-center gap-2`}
                >
                  <span>Move to Next Step</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14.4301 5.93005L20.5001 12.0001L14.4301 18.0701"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.5 12H20.33"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button 
                  onClick={handleRejectCandidate}
                  disabled={selectedCandidate.rejected}
                  className={`bg-[#FF5F36] text-white py-2 px-4 rounded-md ${
                    selectedCandidate.rejected ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Reject
                </button>
                <button 
                  onClick={handleGeneratePDF}
                  className="bg-[#FF9800] text-white py-2 px-4 rounded-md"
                >
                  PDF
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Import Modal */}
      {showImportModal && (
        <ImportCandidates 
          onImportSuccess={handleImportSuccess}
          onCancel={handleImportCancel}
        />
      )}
    </div>
  )
}

// Components
function JobCard({ title, icon, color, postedDays, location, experience, applications, lastWeek }) {
  return (
    <div className="bg-[#1A1A1A] rounded-lg overflow-hidden border border-gray-800">
      <div className={`bg-gradient-to-r ${color} h-1`}></div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-md bg-[#222222] flex items-center justify-center text-lg">{icon}</div>
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-xs text-gray-400">Posted {postedDays} days ago</p>
            </div>
          </div>
          <button className="w-7 h-7 rounded-full bg-[#222222] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z"
                fill="white"
              />
              <path
                d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z"
                fill="white"
              />
              <path
                d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        <div className="flex gap-6 mb-4">
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z"
                stroke="#898989"
                strokeWidth="1.5"
              />
              <path
                d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z"
                stroke="#898989"
                strokeWidth="1.5"
              />
            </svg>
            <span className="text-xs text-gray-400">{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
                stroke="#898989"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51001"
                stroke="#898989"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs text-gray-400">{experience} years exp.</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-2xl font-semibold">{applications}</h3>
            <p className="text-xs text-gray-400">applications</p>
          </div>
          <div className={`text-xs ${lastWeek > 0 ? "text-[#00B85E]" : "text-gray-400"}`}>
            {lastWeek > 0 ? `${lastWeek} in last week` : "No applications this week"}
          </div>
        </div>
      </div>
    </div>
  )
}

function TabButton({ children, active, onClick }) {
  return (
    <button className={`relative pb-2 ${active ? "text-white" : "text-gray400"}`} onClick={onClick}>
      {children}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#6E38E0] to-[#FF5F36] rounded-full"></div>
      )}
    </button>
  )
}