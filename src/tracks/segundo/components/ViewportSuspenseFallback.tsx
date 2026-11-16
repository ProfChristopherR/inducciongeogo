import React from 'react'
import { Loader2 } from 'lucide-react'

interface Props {
  label: string
}

export const ViewportSuspenseFallback: React.FC<Props> = ({ label }) => (
  <div className="apple-glass-dark rounded-3xl min-h-[480px] flex flex-col items-center justify-center gap-3 p-8 text-slate-200">
    <Loader2 className="size-8 animate-spin text-sky-400" />
    <p className="text-sm font-semibold tracking-tight">{label}</p>
  </div>
)
