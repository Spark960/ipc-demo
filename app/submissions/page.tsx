'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import MotionWrapper from '@/components/MotionWrapper'
import FileUploader from '@/components/FileUploader' // Re-imported!
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle } from 'lucide-react'

const supabase = createClient()

export default function SubmissionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Track multiple stages
  const [hasCaseStudy, setHasCaseStudy] = useState(false)
  const [hasFinalDoc, setHasFinalDoc] = useState(false)

  const checkSubmissionStatus = async (userId: string) => {
    // Fetch ALL submissions for this user
    const { data } = await supabase
      .from('submissions')
      .select('stage')
      .eq('user_id', userId)

    if (data) {
      // Check which stages exist
      if (data.some(s => s.stage === 'case-study')) setHasCaseStudy(true)
      if (data.some(s => s.stage === 'final-doc')) setHasFinalDoc(true)
    }
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

  if (loading || !user) return null

  // Helper for team name
  const teamNameDisplay = user.user_metadata?.organization_name || user.email?.split('@')[0] || "Team"

  return (
    <div className="max-w-4xl mx-auto">
      <MotionWrapper>
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white">Submission Timeline</h1>
          <p className="text-neutral-400 mt-2">Manage your deliverables for all IPC stages.</p>
        </header>
      </MotionWrapper>

      <div className="space-y-8">
        
        {/* STAGE 1: Case Study (CLOSED) */}
        <MotionWrapper delay={0.1}>
          <Card className="border-2 bg-neutral-900/40 border-neutral-800 opacity-80">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                   <Badge className="bg-neutral-600 mb-2">Phase 2: Closed</Badge>
                   <CardTitle className="text-xl text-neutral-400">Case Study</CardTitle>
                </div>
                <div className="text-right">
                   <p className="text-sm font-bold text-neutral-500">Dec 25</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-3 text-neutral-500 text-sm">
                 <CheckCircle2 className="h-4 w-4" /> Phase completed.
               </div>
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* STAGE 2: GD Round (CLOSED) */}
        <MotionWrapper delay={0.2}>
          <Card className="bg-neutral-900/40 border-2 border-neutral-800 opacity-80">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="bg-neutral-600 mb-2">Phase 3: Completed</Badge>
                  <CardTitle className="text-xl text-neutral-400">Group Discussion</CardTitle>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-neutral-500">Jan 11</p>
                </div>
              </div>
            </CardHeader>
             <CardContent>
               <div className="flex items-center gap-3 text-neutral-500 text-sm">
                 <CheckCircle2 className="h-4 w-4" /> Phase completed.
               </div>
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* STAGE 3: Final Policy (ACTIVE NOW) */}
        <MotionWrapper delay={0.3}>
          <Card className={`border-2 backdrop-blur-md ${hasFinalDoc ? 'bg-green-950/20 border-green-900/50' : 'bg-neutral-900/60 border-blue-600'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  {hasFinalDoc ? (
                    <Badge className="bg-green-600 mb-2">Phase 4: Submitted</Badge>
                  ) : (
                    <Badge className="bg-blue-600 mb-2 animate-pulse">Phase 4: Urgent</Badge>
                  )}
                  <CardTitle className="text-xl text-white">Final Policy Document</CardTitle>
                  <CardDescription className="text-neutral-400">
                    Upload your final recommendation document (PDF).
                  </CardDescription>
                </div>
                <div className="text-right">
                  {hasFinalDoc ? (
                    <p className="text-sm font-bold text-green-400">Received</p>
                  ) : (
                    <p className="text-sm font-bold text-red-500">Due: 21st Jan, 2026</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
               {hasFinalDoc ? (
                 <div className="bg-green-900/10 p-6 rounded-lg border border-green-900/30 flex items-center gap-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <div>
                       <h4 className="text-white font-medium">Document Received</h4>
                       <p className="text-neutral-400 text-sm">See you at the Grand Finale on Feb 11!</p>
                    </div>
                 </div>
               ) : (
                 <div className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                    {/* HERE IS THE NEW UPLOADER CONFIG */}
                    <FileUploader 
                      teamName={teamNameDisplay}
                      bucketName="final-documents" // Target new bucket
                      stage="final-doc"            // Target new stage name
                      fileSuffix="final"           // File name: Team-final.pdf
                      onUploadComplete={() => checkSubmissionStatus(user.id)}
                    />
                 </div>
               )}
            </CardContent>
          </Card>
        </MotionWrapper>

      </div>
    </div>
  )
}