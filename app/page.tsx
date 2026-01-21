'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
// Re-imported FileUploader for the active task card
import FileUploader from '../components/FileUploader' 
import MotionWrapper from '../components/MotionWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Calendar } from 'lucide-react'

const supabase = createClient()

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasFinalDoc, setHasFinalDoc] = useState(false)

  const checkSubmissionStatus = async (userId: string) => {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .eq('stage', 'final-doc') // Checking for PHASE 4 now
      .single()

    if (data) setHasFinalDoc(true)
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
              <Badge className="bg-red-600/20 text-red-400 border-red-800 px-4 py-1 animate-pulse">
                  Phase 4: Final Submission
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
            <div className="text-2xl font-bold text-white">Feb 11, 2026</div>
            <p className="text-xs text-neutral-500 mt-1">Grand Finale (Offline)</p>
          </CardContent>
        </Card>
        
        {/* STATUS CARD (Current Phase) */}
        <Card className={`border-neutral-800 ${hasFinalDoc ? 'bg-green-950/20 border-green-900/50' : 'bg-neutral-900'} hover:-translate-y-1`}>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-neutral-400">Final Submission</CardTitle>
          </CardHeader>
          <CardContent>
            {hasFinalDoc ? (
                <div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-green-400">
                        <CheckCircle2 className="h-6 w-6" /> Received
                    </div>
                    <p className="text-xs text-green-500/70 mt-1">Ready for evaluation</p>
                </div>
            ) : (
                <div>
                    <div className="flex items-center gap-2 text-xl font-bold text-red-500">
                        <AlertCircle className="h-6 w-6" /> Due 21st Jan, 2026
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Upload Pending</p>
                </div>
            )}
          </CardContent>
        </Card>

        {/* NEXT PHASE CARD */}
        <Card className="bg-neutral-900/60 backdrop-blur-md border-neutral-800/80 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-400">Event Info</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-2 text-2xl font-bold text-white">
                <Calendar className="h-6 w-6" /> MES 2026
             </div>
             <p className="text-xs text-neutral-500 mt-1">Manipal University</p>
          </CardContent>
        </Card>
      </MotionWrapper>

      {/* Active Tasks - PHASE 4 UPLOAD */}
      <MotionWrapper delay={0.4}>
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">Active Tasks</h2>
          
          {hasFinalDoc ? (
            <Card className="bg-neutral-900 border-green-900/30 text-white">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">You are all set!</h3>
                    <p className="text-neutral-400 max-w-md">
                        Your final policy document has been recorded. Best of luck for the Grand Finale selections!
                    </p>
                </CardContent>
            </Card>
          ) : (
            <Card className="glass-card text-white border-blue-600/50">
                <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Final Policy Submission</CardTitle>
                        <CardDescription className="text-neutral-400 mt-1">
                        Upload your final consolidated policy document (Phase 4).
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-red-500 text-red-500 bg-red-500/10">Due 21st Jan, 2026</Badge>
                </div>
                </CardHeader>
                <CardContent>
                    <FileUploader 
                        teamName={teamNameDisplay}
                        bucketName="final-documents" // NEW BUCKET
                        stage="final-doc"            // NEW STAGE
                        fileSuffix="final"           // NEW SUFFIX
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