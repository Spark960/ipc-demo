'use client'

import { useEffect, useState } from 'react'
import { createClient, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import MotionWrapper from '@/components/MotionWrapper'
import FileUploader from '@/components/FileUploader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SubmissionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Logic to check if they already submitted Phase 2
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
      await checkSubmissionStatus(user.id) // Check DB on load
      setLoading(false)
    }
    init()
  }, [router])

  if (loading || !user) return null

  const teamNameDisplay = user.email?.split('@')[0] || "Team"

  return (
    <div className="max-w-4xl mx-auto">
      <MotionWrapper>
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white">Submission Timeline</h1>
          <p className="text-neutral-400 mt-2">Manage your deliverables for all IPC stages.</p>
        </header>
      </MotionWrapper>

      <div className="space-y-8">
        
        {/* STAGE 1: Case Study (Dynamic Status) */}
        <MotionWrapper delay={0.1}>
          <Card className={`border-2 backdrop-blur-md ${hasSubmitted ? 'bg-green-950/20 border-green-900/50' : 'bg-neutral-900/60 border-blue-900/50'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  {hasSubmitted ? (
                    <Badge className="bg-green-600 mb-2 hover:bg-green-700">Phase 2: Completed</Badge>
                  ) : (
                    <Badge className="bg-blue-600 mb-2 hover:bg-blue-700">Phase 2: Active</Badge>
                  )}
                  
                  <CardTitle className="text-xl text-white">Case Study Submission</CardTitle>
                  <CardDescription className="text-neutral-400">
                    Submit your preliminary analysis document.
                  </CardDescription>
                </div>
                <div className="text-right">
                  {hasSubmitted ? (
                     <p className="text-sm font-bold text-green-400">Received</p>
                  ) : (
                     <p className="text-sm font-bold text-red-400">Deadline: Dec 23, 2025</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {hasSubmitted ? (
                // SUCCESS STATE
                <div className="bg-green-900/10 p-6 rounded-lg border border-green-900/30 flex items-center gap-4">
                   <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                   </div>
                   <div>
                      <h4 className="text-white font-medium">Submission Recorded</h4>
                      <p className="text-neutral-400 text-sm">You have successfully uploaded your case study. Best of luck for the results!</p>
                   </div>
                </div>
              ) : (
                // UPLOAD STATE
                <div className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                   <FileUploader 
                      teamName={teamNameDisplay} 
                      onUploadComplete={() => checkSubmissionStatus(user.id)}
                   />
                </div>
              )}
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* STAGE 2: GD Round (LOCKED) */}
        <MotionWrapper delay={0.2}>
          <Card className="bg-neutral-900/40 backdrop-blur-md border-neutral-800/80 opacity-75">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="text-neutral-500 border-neutral-700 mb-2">Phase 3: Locked</Badge>
                  <CardTitle className="text-xl text-neutral-400">Group Discussion (GD)</CardTitle>
                  <CardDescription className="text-neutral-600">
                    Qualifying teams will participate in an offline/online GD round.
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-500">Jan 10, 2026</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
               <div className="h-24 flex items-center justify-center bg-neutral-950/50 rounded border border-dashed border-neutral-800 text-neutral-600 text-sm">
                  🔒 Locked until qualification results are declared.
               </div>
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* STAGE 3: Final Policy (LOCKED) */}
        <MotionWrapper delay={0.3}>
          <Card className="bg-neutral-900/40 backdrop-blur-md border-neutral-800/80 opacity-75">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="text-neutral-500 border-neutral-700 mb-2">Phase 4: Locked</Badge>
                  <CardTitle className="text-xl text-neutral-400">Final Policy Document</CardTitle>
                  <CardDescription className="text-neutral-600">
                    Final &quot;Bharat Yuva Innovation Policy Recommendation 2026&quot;.
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-500">Jan 21, 2026</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
               <div className="h-24 flex items-center justify-center bg-neutral-950/50 rounded border border-dashed border-neutral-800 text-neutral-600 text-sm">
                  🔒 Requires clearance of Phase 3.
               </div>
            </CardContent>
          </Card>
        </MotionWrapper>

      </div>
    </div>
  )
}