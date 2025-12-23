'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { UploadCloud, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

const supabase = createClient()

export default function FileUploader({ teamName, onUploadComplete }: { teamName: string, onUploadComplete?: () => void }) {
  const [uploading, setUploading] = useState(false)
  
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return
      setUploading(true)

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${teamName}-casestudy.${fileExt}` 

      // 1. Get current User ID
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not found")

      // 2. Upload File to Storage
      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // 3. Record in Database
      const { error: dbError } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          team_name: teamName,
          file_url: fileName,
          stage: 'case-study'
        })

      if (dbError) throw dbError

      // 4. Notify Parent Component
      if (onUploadComplete) onUploadComplete()

    } catch (error) {
      alert(`Error: ${(error as Error).message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-neutral-800 rounded-lg bg-neutral-950/50 hover:bg-neutral-900/50 transition">
      
      {uploading ? (
        <div className="text-center">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-neutral-400">Uploading your masterpiece...</p>
        </div>
      ) : (
        <>
          <UploadCloud className="h-12 w-12 text-neutral-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-1">Upload Case Study</h3>
          <p className="text-sm text-neutral-500 mb-6">PDF format only. Max 10MB.</p>
          
          <div className="relative">
            <Button variant="outline" className="cursor-pointer border-blue-600 text-blue-400 hover:bg-blue-900/20">
              Choose File
            </Button>
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </>
      )}
    </div>
  )
}