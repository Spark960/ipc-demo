import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; 
import MobileNav from "@/components/MobileNav"; // Import the new component
import StarBackground from '@/components/StarBackground';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPC Portal | E-Cell MIT Manipal",
  description: "Innovation Policy Consortium Submission Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-neutral-950 text-white`}>
        
        {/* BACKGROUND LAYER */}
        <StarBackground />

        <div className="flex min-h-screen relative z-10 flex-col md:flex-row"> 
          
          {/* DESKTOP SIDEBAR (Hidden on mobile) */}
          <Sidebar />

          {/* MOBILE NAVBAR (Hidden on desktop) */}
          <div className="md:hidden border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-50 flex items-center p-4 gap-4">
             {/* 1. The Menu Trigger */}
             <MobileNav />
             
             {/* 2. The Logo (Now visible on mobile top bar) */}
             <div>
                <h1 className="text-xl font-bold text-blue-500 tracking-tighter leading-none">IPC PORTAL</h1>
                <p className="text-[10px] text-neutral-500 leading-none">E-Cell MIT Manipal</p>
             </div>
          </div>
          
          {/* MAIN CONTENT */}
          <main className="flex-1 md:ml-64 p-4 md:p-8">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}