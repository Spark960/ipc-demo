'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'


export default function Sidebar() {
  const pathname = usePathname()
  
  // Helper to check if link is active
  const isActive = (path: string) => pathname === path

  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-950/80 backdrop-blur-xl hidden md:flex flex-col p-6 fixed h-full">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-blue-500 tracking-tighter">IPC PORTAL</h1>
        <p className="text-xs text-neutral-500">E-Cell MIT Manipal</p>
      </div>
      
      <nav className="space-y-2 flex-1">
        
        {/* DASHBOARD LINK */}
        <Link 
          href="/" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/') 
              ? 'bg-neutral-900 text-white font-medium pointer-events-none' // ADDED pointer-events-none
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
          aria-disabled={isActive('/')} // Good for accessibility
        >
          <span>📊</span> Dashboard
        </Link>
        
        {/* SUBMISSIONS LINK */}
        <Link 
          href="/submissions" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/submissions') 
              ? 'bg-neutral-900 text-white font-medium pointer-events-none' // ADDED pointer-events-none
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
          aria-disabled={isActive('/submissions')}
        >
          <span>📂</span> Submissions
        </Link>
        
        {/* GUIDELINES LINK */}
        <Link 
          href="/guidelines" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/guidelines') 
              ? 'bg-neutral-900 text-white font-medium pointer-events-none' // ADDED pointer-events-none
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
          aria-disabled={isActive('/guidelines')}
        >
          <span>📄</span> Guidelines
        </Link>
      </nav>

      <div className="pt-6 border-t border-neutral-800">
        <LogoutButton className="flex items-center gap-3 text-red-400 hover:text-red-300 transition text-sm font-medium w-full text-left">
           <span>🚪</span> Log Out
        </LogoutButton>
      </div>
    </aside>
  )
}