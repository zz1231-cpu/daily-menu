import { Dice5, Heart, ListPlus, Menu } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: '菜单', icon: Menu },
  { to: '/add', label: '添加', icon: ListPlus },
  { to: '/random', label: '随机', icon: Dice5 },
  { to: '/profile', label: '我的', icon: Heart },
]

export default function BottomTabBar() {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t border-cream/45 bg-cream/35 px-4 pt-2 shadow-[0_-12px_35px_rgba(35,33,36,0.08)] backdrop-blur-2xl">
      <div className="grid grid-cols-4 gap-2">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex min-h-14 flex-col items-center justify-center rounded-2xl text-xs font-medium transition',
                isActive
                  ? 'bg-cream/55 text-berry shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_26px_rgba(239,111,154,0.15)]'
                  : 'text-cocoa/55 active:bg-peach/25',
              ].join(' ')
            }
          >
            <Icon className="mb-1 h-5 w-5" strokeWidth={2.2} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
