'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import FileUploader from '../components/FileUploader'
import MotionWrapper from '../components/MotionWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock } from 'lucide-react'

const supabase = createClient()

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasSubmitted, setHasSubmitted] = useState(false) // New State

  // Function to check submission status (Moved outside so we can call it after upload)
  const checkSubmissionStatus = async (userId: string) => {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .eq('stage', 'case-study')
      .single() // Returns data if found, null if not

    if (data) setHasSubmitted(true)
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      await checkSubmissionStatus(user.id) // Check DB immediately
      setLoading(false)
    }
    init()
  }, [router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-800 border-t-blue-500"></div>
      </div>
    )
  }
  console.log('User Info:', user);
  console.log('fg', user.user_metadata);

  const teamNameDisplay = user.user_metadata?.organization_name || user.email?.split('@')[0] || "Team"
  

  return (
    <div className="max-w-5xl mx-auto">
      <MotionWrapper>
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome, <span className="text-blue-500 capitalize">{teamNameDisplay}</span>
            </h1>
            <p className="text-neutral-400 mt-2">Track your team&apos;s progress for IPC 2026.</p>
          </div>
          <div className="text-right">
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-800 px-4 py-1">
                  Phase 2: Case Study
              </Badge>
          </div>
        </header>
      </MotionWrapper>

      {/* Stats Grid */}
      <MotionWrapper delay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* DEADLINE CARD */}
        <Card className="bg-neutral-900/60 backdrop-blur-md border-neutral-800/80 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Next Deadline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Dec 23, 2025</div>
            <p className="text-xs text-neutral-500 mt-1">Case Study Submission</p>
          </CardContent>
        </Card>
        
        {/* STATUS CARD (Dynamic Color) */}
        <Card className={`border-neutral-800 ${hasSubmitted ? 'bg-green-950/20 border-green-900/50' : 'bg-neutral-900'} hover:-translate-y-1`}>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-neutral-400">Status</CardTitle>
          </CardHeader>
          <CardContent>
            {hasSubmitted ? (
                <div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-green-400">
                        <CheckCircle2 className="h-6 w-6" /> Submitted
                    </div>
                    <p className="text-xs text-green-500/70 mt-1">Ready for review</p>
                </div>
            ) : (
                <div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-yellow-500">
                        <Clock className="h-6 w-6" /> Pending
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Action required</p>
                </div>
            )}
          </CardContent>
        </Card>

        {/* NEXT PHASE CARD */}
        <Card className="bg-neutral-900/60 backdrop-blur-md border-neutral-800/80 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Next Phase Info</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-white">Evaluation</div>
             <p className="text-xs text-neutral-500 mt-1">Ends Jan 10</p>
          </CardContent>
        </Card>
      </MotionWrapper>

      {/* Upload Section - Hides if submitted */}
      <MotionWrapper delay={0.4}>
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">Active Tasks</h2>
          
          {hasSubmitted ? (
            // VIEW IF SUBMITTED
            <Card className="bg-neutral-900 border-green-900/30 text-white">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Submission Received</h3>
                    <p className="text-neutral-400 max-w-md">
                        Your Case Study has been securely recorded. Results will be announced on January 10th. Good luck!
                    </p>
                </CardContent>
            </Card>
          ) : (
            // VIEW IF PENDING
            <Card className="bg-neutral-900/60 backdrop-blur-md border-neutral-800/80 text-white">
                <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Case Study Submission</CardTitle>
                        <CardDescription className="text-neutral-400 mt-1">
                        Upload your solution for the preliminary round. PDF only.
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-red-500 text-red-500 bg-red-500/10">Due in 8 Days</Badge>
                </div>
                </CardHeader>
                <CardContent>
                {/* Pass the refresh function so the UI updates instantly after upload */}
                <FileUploader 
                    teamName={teamNameDisplay} 
                    onUploadComplete={() => checkSubmissionStatus(user.id)} 
                />
                </CardContent>
            </Card>
          )}
        </section>
      </MotionWrapper>

    </div>
  )
}