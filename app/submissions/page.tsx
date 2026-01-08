'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import MotionWrapper from '@/components/MotionWrapper'
// Removed FileUploader import as it's no longer needed here
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button" // Added for download button
import { CheckCircle2, AlertCircle, FileText, Download } from 'lucide-react' // Added icons

const supabase = createClient()

export default function SubmissionsPage() {
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

  if (loading || !user) return null

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
          <Card className={`border-2 backdrop-blur-md ${hasSubmitted ? 'bg-green-950/20 border-green-900/50' : 'bg-neutral-900/60 border-neutral-800'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge className={`mb-2 ${hasSubmitted ? 'bg-green-600' : 'bg-neutral-600'}`}>
                    {hasSubmitted ? "Phase 2: Completed" : "Phase 2: Closed"}
                  </Badge>
                  
                  <CardTitle className="text-xl text-white">Case Study Submission</CardTitle>
                  <CardDescription className="text-neutral-400">
                    Preliminary analysis document.
                  </CardDescription>
                </div>
                <div className="text-right">
                  {hasSubmitted ? (
                     <p className="text-sm font-bold text-green-400">Received</p>
                  ) : (
                     <p className="text-sm font-bold text-red-400">Closed</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {hasSubmitted ? (
                // SUCCESS STATE
                <div className="bg-green-900/10 p-6 rounded-lg border border-green-900/30 flex items-center gap-4">
                   <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                   </div>
                   <div>
                      <h4 className="text-white font-medium">Submission Recorded</h4>
                      <p className="text-neutral-400 text-sm">You have successfully uploaded your case study.</p>
                   </div>
                </div>
              ) : (
                // CLOSED STATE
                <div className="bg-neutral-950 p-6 rounded-lg border border-neutral-800 flex items-center gap-4">
                    <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                        <h4 className="text-white font-medium">Submissions Closed</h4>
                        <p className="text-neutral-400 text-sm">The deadline for this phase has passed.</p>
                    </div>
                </div>
              )}
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* STAGE 2: GD Round (ACTIVE) */}
        <MotionWrapper delay={0.2}>
          <Card className="bg-neutral-900/60 backdrop-blur-md border-2 border-blue-900/50">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="bg-blue-600 mb-2 hover:bg-blue-700">Phase 3: Active</Badge>
                  <CardTitle className="text-xl text-white">Group Discussion (GD)</CardTitle>
                  <CardDescription className="text-neutral-400">
                    Download the material below. No submission required for this round.
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-400">Jan 11, 2026</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
               <div className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
                      <a href="/GD_GUIDELINES_IPC2026.pdf" download>
                        <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                      </a>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-800">
                      <p className="text-sm text-neutral-500 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Note: This is an offline/live round.
                      </p>
                  </div>
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