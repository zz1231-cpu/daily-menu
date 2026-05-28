import { CheckCircle2 } from 'lucide-react'

export default function Toast({ message }) {
  if (!message) return null

  return (
    <div className="fixed left-1/2 top-5 z-40 flex min-h-12 w-[calc(100%-2rem)] max-w-[448px] -translate-x-1/2 items-center gap-2 rounded-[1.25rem] bg-berry px-4 py-3 text-sm font-black text-cream shadow-candy">
      <CheckCircle2 className="h-5 w-5 text-honey" />
      {message}
    </div>
  )
}
