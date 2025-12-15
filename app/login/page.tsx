'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MotionWrapper from '@/components/MotionWrapper'

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
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
      <MotionWrapper>
        <Card className="w-full max-w-md bg-neutral-900/60 backdrop-blur-xl border-neutral-800 text-white shadow-2xl">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold text-blue-500 mb-2">IPC PORTAL</h1>
            <CardTitle>Team Login</CardTitle>
            <CardDescription className="text-neutral-400">
              Enter your registered email and password to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Email</label>
                <Input 
                  type="email" 
                  placeholder="team@college.edu" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-neutral-950 border-neutral-800 focus:border-blue-500 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-neutral-950 border-neutral-800 focus:border-blue-500 text-white"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded bg-red-900/30 border border-red-900 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  )
}