import { CalendarDays, Flame } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/date.js'
import PlaceholderImage from './PlaceholderImage.jsx'

export default function DishCard({ dish }) {
  return (
    <Link
      to={`/dish/${dish.id}`}
      className="glass-panel group grid grid-cols-[7rem_1fr] gap-3 rounded-[1.6rem] p-3 transition active:scale-[0.99]"
    >
      <div className="h-28 overflow-hidden rounded-[1.25rem] bg-blush">
        {dish.image ? (
          <img
            className="h-full w-full object-cover"
            src={dish.image}
            alt={dish.name}
          />
        ) : (
          <PlaceholderImage />
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-between py-1">
        <div>
          <div className="mb-2 inline-flex rounded-full bg-blush px-3 py-1 text-xs font-black text-berry">
            {dish.category}
          </div>
          <h3 className="line-clamp-2 text-lg font-bold leading-tight text-cocoa">
            {dish.name}
          </h3>
        </div>
        <div className="grid gap-1 text-xs text-cocoa/60">
          <span className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-berry" />
            做过 {dish.cookCount} 次
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-orange-400" />
            最近 {formatDate(dish.lastCookedAt)}
          </span>
        </div>
      </div>
    </Link>
  )
}
