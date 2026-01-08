'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
// Removed FileUploader import
import MotionWrapper from '../components/MotionWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button" // Added for download button
import { CheckCircle2, FileText, Download, AlertCircle } from 'lucide-react' // Added icons

const supabase = createClient()

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const checkSubmissionStatus = async (userId: string) => {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .eq('stage', 'case-study')
      .single()

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
      await checkSubmissionStatus(user.id)
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
                  Phase 3: Pre-GD
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
            <div className="text-2xl font-bold text-white">Jan 11, 2026</div>
            <p className="text-xs text-neutral-500 mt-1">GD Round</p>
          </CardContent>
        </Card>
        
        {/* STATUS CARD (Refers to previous round status) */}
        <Card className={`border-neutral-800 ${hasSubmitted ? 'bg-green-950/20 border-green-900/50' : 'bg-neutral-900'} hover:-translate-y-1`}>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-neutral-400">Case Study Status</CardTitle>
          </CardHeader>
          <CardContent>
            {hasSubmitted ? (
                <div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-green-400">
                        <CheckCircle2 className="h-6 w-6" /> In Review
                    </div>
                    <p className="text-xs text-green-500/70 mt-1">Phase 2 Completed</p>
                </div>
            ) : (
                <div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-red-500">
                        <AlertCircle className="h-6 w-6" /> Closed
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Submission missed</p>
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
             <div className="text-2xl font-bold text-white">Final Doc</div>
             <p className="text-xs text-neutral-500 mt-1">Due Jan 21</p>
          </CardContent>
        </Card>
      </MotionWrapper>

      {/* Active Tasks - NOW SHOWS PHASE 3 DOWNLOAD */}
      <MotionWrapper delay={0.4}>
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">Active Tasks</h2>
          
          <Card className="bg-neutral-900/60 backdrop-blur-md border-blue-900/50 text-white">
              <CardHeader>
              <div className="flex justify-between items-center">
                  <div>
                      <CardTitle>GD Round Preparation</CardTitle>
                      <CardDescription className="text-neutral-400 mt-1">
                      Download the material for the upcoming Group Discussion round.
                      </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-blue-500 text-blue-400 bg-blue-500/10">Active Phase</Badge>
              </div>
              </CardHeader>
              <CardContent>
                <div className="bg-neutral-950 p-6 rounded-lg border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                          <div className="p-3 bg-blue-900/20 rounded-lg">
                              <FileText className="h-6 w-6 text-blue-400" />
                          </div>
                          <div>
                              <h4 className="text-white font-medium">GD Topic / Material</h4>
                              <p className="text-sm text-neutral-400">Preparation document for Round 3</p>
                          </div>
                      </div>
                      
                      {/* MAKE SURE TO PUT 'GD_Material.pdf' IN YOUR PUBLIC FOLDER */}
                      <a href="/GD_GUIDELINES_IPC2026.pdf" download className="w-full md:w-auto">
                        <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                            <Download className="h-4 w-4" /> Download PDF
                        </Button>
                      </a>
                  </div>
              </CardContent>
          </Card>
        </section>
      </MotionWrapper>

    </div>
  )
}