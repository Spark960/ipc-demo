'use client'

import MotionWrapper from '@/components/MotionWrapper'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'

export default function GuidelinesPage() {
  const schedule = [
    { phase: "Registrations", details: "Portal Opening & Team Signup", date: "Dec 9 - Dec 17", highlight: false },
    // HIGHLIGHT REMOVED
    { phase: "Case Study", details: "Submission of Policy Case Study", date: "Dec 25, 2025", highlight: false },
    // UPDATED DATE & HIGHLIGHT ADDED
    { phase: "Evaluation", details: "Group Discussion (GD) Round", date: "Jan 11, 2026", highlight: true },
    { phase: "Final Doc", details: "Policy Recommendation Document", date: "Jan 21, 2026", highlight: false },
    { phase: "Grand Finale", details: "Presentation at MES 2026 (MIT Manipal)", date: "Feb 11-12, 2026", highlight: false },
  ]

  return (
    <div className="max-w-4xl mx-auto text-neutral-300">
      <MotionWrapper>
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white">Guidelines & Rules</h1>
          <p className="text-neutral-400 mt-2">Official handbook for the Innovation Policy Consortium.</p>
        </header>
      </MotionWrapper>

      <div className="grid gap-6">
        
        {/* General Info */}
        <MotionWrapper delay={0.1}>
          <Card className="bg-neutral-900/60 backdrop-blur-md border-neutral-800/80">
            <CardHeader>
              <CardTitle className="text-white">Objective</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">
                The IPC aims to bring together E-Cells and student policy teams to address challenges within India&apos;s startup ecosystem. 
                Participating teams will identify real-world problems and develop research-backed policy solutions to present to the government 
                at the <span className="text-blue-400">Manipal Entrepreneurship Summit (MES) 2026</span>.
              </p>
            </CardContent>
          </Card>
        </MotionWrapper>

        {/* Timeline Section */}
        <MotionWrapper delay={0.2}>
          <Card className="bg-neutral-900/60 backdrop-blur-md border-neutral-800/80">
            <CardHeader>
              <CardTitle className="text-white">Official Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              
              {/* DESKTOP VIEW */}
              <div className="hidden md:block relative overflow-x-auto">
                <table className="w-full text-sm text-left text-neutral-400">
                  <thead className="text-xs uppercase bg-neutral-950/50 text-neutral-200">
                    <tr>
                      <th scope="col" className="px-6 py-3 rounded-tl-lg">Phase</th>
                      <th scope="col" className="px-6 py-3">Details</th>
                      <th scope="col" className="px-6 py-3 rounded-tr-lg">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((item, index) => (
                      <tr key={index} className={`border-b border-neutral-800 hover:bg-neutral-800/50 ${item.highlight ? 'bg-blue-900/20 border-blue-900/30' : ''}`}>
                        <td className={`px-6 py-4 font-medium ${item.highlight ? 'text-blue-200' : 'text-white'}`}>
                          {item.phase}
                        </td>
                        <td className={`px-6 py-4 ${item.highlight ? 'text-blue-200' : ''}`}>
                          {item.details}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap ${item.highlight ? 'text-blue-200 font-bold' : ''}`}>
                          {item.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE VIEW */}
              <div className="md:hidden space-y-4">
                {schedule.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${
                      item.highlight 
                        ? 'bg-blue-900/10 border-blue-900/30' 
                        : 'bg-neutral-950/50 border-neutral-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`font-bold ${item.highlight ? 'text-blue-400' : 'text-white'}`}>
                        {item.phase}
                      </span>
                      <span className={`text-xs font-mono px-2 py-1 rounded ${item.highlight ? 'bg-blue-900/40 text-blue-200' : 'bg-neutral-900 text-neutral-500'}`}>
                        {item.date}
                      </span>
                    </div>
                    <p className={`text-sm ${item.highlight ? 'text-blue-200/80' : 'text-neutral-400'}`}>
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>
        </MotionWrapper>

        {/* Deliverables */}
        <MotionWrapper delay={0.3}>
          <Card className="bg-neutral-900/60 backdrop-blur-md border-neutral-800/80">
            <CardHeader>
               <CardTitle className="text-white">Submission Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-white">Format:</strong> All documents must be submitted in <code className="bg-neutral-800 px-1 py-0.5 rounded">.pdf</code> format.
                </li>
                <li>
                  <strong className="text-white">Naming Convention:</strong> Please name your files as <code className="text-blue-400">OrganisationName_CaseStudy.pdf</code>.
                </li>
                <li>
                  <strong className="text-white">Plagiarism:</strong> Content must be original. Research-backed citations are mandatory.
                </li>
              </ul>

              <div className="bg-neutral-950/50 p-4 m-4 rounded-lg border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
                 <div className="text-sm text-neutral-400">
                    <p className="text-white font-medium mb-1">Expected Format</p>
                    <p>Download the official sample PDF structure.</p>
                 </div>
                 <a href="/IPC_Format.pdf" download className="w-full md:w-auto">
                    <Button variant="outline" className="w-full gap-2 border-neutral-700 hover:bg-neutral-800 hover:text-white">
                        <Download className="h-4 w-4" /> Download Template
                    </Button>
                 </a>
              </div>
            </CardContent>
          </Card>
        </MotionWrapper>

      </div>
    </div>
  )
}