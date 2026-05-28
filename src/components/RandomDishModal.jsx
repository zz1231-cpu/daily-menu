import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import PlaceholderImage from './PlaceholderImage.jsx'

export default function RandomDishModal({ dish, onClose }) {
  if (!dish) return null

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-cocoa/30 px-4 pb-6 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-[448px] rounded-[2rem] p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-berry">今天可以给她做</p>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-blush text-berry"
            aria-label="关闭推荐"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <Link to={`/dish/${dish.id}`} onClick={onClose}>
          <div className="mb-4 h-56 overflow-hidden rounded-[1.5rem] bg-blush">
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
          <h2 className="text-2xl font-black text-cocoa">{dish.name}</h2>
          <p className="mt-2 text-sm leading-6 text-cocoa/65">
            {dish.category} · 做过 {dish.cookCount} 次。点开看看步骤，今晚就安排。
          </p>
        </Link>
      </div>
    </div>
  )
}
