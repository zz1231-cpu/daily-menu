import BottomTabBar from './BottomTabBar.jsx'

export default function AppShell({ children }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-white/10 text-cocoa shadow-candy ring-1 ring-white/30 backdrop-blur-sm">
      <main className="flex-1 px-4 pb-28 pt-5">{children}</main>
      <BottomTabBar />
    </div>
  )
}
