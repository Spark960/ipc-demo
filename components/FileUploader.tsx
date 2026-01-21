'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { UploadCloud, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

const supabase = createClient()

interface FileUploaderProps {
  teamName: string
  onUploadComplete?: () => void
  bucketName?: string // e.g., 'submissions' or 'final-documents'
  stage?: string      // e.g., 'case-study' or 'final-doc'
  fileSuffix?: string // e.g., 'casestudy' or 'final'
}

export default function FileUploader({ 
  teamName, 
  onUploadComplete,
  bucketName = 'submissions', // Default to old bucket
  stage = 'case-study',       // Default to old stage
  fileSuffix = 'casestudy'    // Default to old naming
}: FileUploaderProps) {
  
  const [uploading, setUploading] = useState(false)
  
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return

      const file = event.target.files[0]
      
      // 1. Check File Size (10MB Limit)
      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large! Max 10MB.")
        return
      }

      setUploading(true)

      const fileExt = file.name.split('.').pop()
      // Create dynamic filename: "TeamName-final.pdf"
      const fileName = `${teamName}-${fileSuffix}.${fileExt}` 

      // 2. Get current User ID
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not found")

      // 3. Upload File to Storage (Dynamic Bucket)
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // 4. Record in Database (Dynamic Stage)
      const { error: dbError } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          team_name: teamName,
          file_url: fileName,
          stage: stage // Saves as 'final-doc' now
        })

      if (dbError) throw dbError

      // 5. Notify Parent Component
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
            <p className="text-neutral-400">Uploading your document...</p>
        </div>
      ) : (
        <>
          <UploadCloud className="h-12 w-12 text-neutral-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-1">Upload PDF</h3>
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