import { Activity } from 'lucide-react'

interface NavbarProps {
  isConnected: boolean
}

export default function Navbar({ isConnected }: NavbarProps) {
  return (
    <nav className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-accent" />
          <h1 className="text-xl font-bold">Basic Trading Software</h1>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </nav>
  )
}
