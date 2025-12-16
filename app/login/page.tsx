'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MotionWrapper from '@/components/MotionWrapper'
import StarBackground from '@/components/StarBackground' // We bring the stars inside specifically for this view

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    // FIX: z-[999] ensures it sits above everything. w-screen/h-screen forces full viewport.
    <div className="fixed inset-0 z-[999] w-screen h-screen flex items-center justify-center bg-neutral-950">
      
      {/* Background just for this overlay */}
      <div className="absolute inset-0 z-0">
        <StarBackground />
      </div>

      <MotionWrapper className="relative z-10 w-full max-w-md px-4">
        <Card className="bg-neutral-900/40 backdrop-blur-xl border-neutral-800/80 text-white shadow-2xl">
          <CardHeader className="text-center pb-2">
            <h1 className="text-3xl font-bold text-blue-500 tracking-tighter mb-2">IPC PORTAL</h1>
            <CardTitle className="text-xl">Team Login</CardTitle>
            <CardDescription className="text-neutral-400">
              Enter your credentials to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</label>
                <Input 
                  type="email" 
                  placeholder="team@college.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-neutral-950/50 border-neutral-800 focus:border-blue-500/50 text-white placeholder:text-neutral-600 transition-all duration-300 focus:ring-1 focus:ring-blue-500/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-neutral-950/50 border-neutral-800 focus:border-blue-500/50 text-white placeholder:text-neutral-600 transition-all duration-300 focus:ring-1 focus:ring-blue-500/50"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-6 transition-all duration-300 shadow-[0_0_20px_-5px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)]"
                disabled={loading}
              >
                {loading ? (
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                        <span>Authenticating...</span>
                    </div>
                ) : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  )
}