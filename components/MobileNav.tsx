'use client'

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'
import { useState } from "react"

export default function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  
  const isActive = (path: string) => pathname === path

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Remove padding here so layout.tsx controls spacing */}
      <SheetTrigger className="text-white hover:text-blue-400 transition">
        <Menu className="h-8 w-8" />
      </SheetTrigger>

      {/* FIX: Made background solid neutral-950 to fix transparency issue */}
      <SheetContent side="left" className="bg-neutral-950 border-r border-neutral-800 text-white w-72 p-6">
        <div className="mb-8 mt-6">
            <h1 className="text-2xl font-bold text-blue-500 tracking-tighter">IPC PORTAL</h1>
            <p className="text-xs text-neutral-500">E-Cell MIT Manipal</p>
        </div>

        <nav className="space-y-2 flex-1">
            <Link 
              href="/" 
              onClick={() => setOpen(false)} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive('/') 
                  ? 'bg-neutral-900 text-white font-medium' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <span>📊</span> Dashboard
            </Link>
            
            <Link 
              href="/submissions" 
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive('/submissions') 
                  ? 'bg-neutral-900 text-white font-medium' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <span>📂</span> Submissions
            </Link>
            
            <Link 
              href="/guidelines" 
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive('/guidelines') 
                  ? 'bg-neutral-900 text-white font-medium' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <span>📄</span> Guidelines
            </Link>
        </nav>

        <div className="pt-6 border-t border-neutral-800 mt-auto absolute bottom-8 w-[calc(100%-3rem)]">
            <LogoutButton className="flex items-center gap-3 text-red-400 hover:text-red-300 transition text-sm font-medium w-full text-left">
               <span>🚪</span> Log Out
            </LogoutButton>
        </div>
      </SheetContent>
    </Sheet>
  )
}