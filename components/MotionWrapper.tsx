'use client'

import { motion } from 'framer-motion'

export default function MotionWrapper({
  children,
  delay = 0,
  className = ""
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start: Invisible and slightly down
      animate={{ opacity: 1, y: 0 }}  // End: Visible and at normal position
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }} // Smooth easing
      className={className}
    >
      {children}
    </motion.div>
  )
}