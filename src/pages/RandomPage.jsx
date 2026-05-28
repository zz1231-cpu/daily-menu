import { Dice5, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import { useDishes } from '../hooks/useDishes.jsx'

export default function RandomPage() {
  const { dishes } = useDishes()
  const [dish, setDish] = useState(null)

  function pickRandom() {
    if (!dishes.length) return
    setDish(dishes[Math.floor(Math.random() * dishes.length)])
  }

  return (
    <div className="space-y-5">
      <header className="candy-panel rounded-[2rem] p-5 shadow-candy">
        <div className="relative z-10">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-sm font-black text-berry">
              <Sparkles className="h-4 w-4" />
              随机推荐
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-cocoa">
              不纠结，交给今天的胃口。
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={pickRandom}
          className="primary-glass-button relative z-10 mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-[1.35rem] px-5 text-base font-black"
        >
          <Dice5 className="h-5 w-5 text-berry" />
          抽一道菜
        </button>
      </header>

      {dish ? (
        <Link
          to={`/dish/${dish.id}`}
          className="glass-panel block overflow-hidden rounded-[2rem]"
        >
          <div className="h-72 bg-blush">
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
          <div className="p-5">
            <p className="text-sm font-semibold text-berry">今天可以给她做</p>
            <h2 className="mt-1 text-3xl font-black text-cocoa">{dish.name}</h2>
            <p className="mt-2 text-sm leading-6 text-cocoa/65">
              {dish.category} · 做过 {dish.cookCount} 次。点开就能看详细做法。
            </p>
          </div>
        </Link>
      ) : (
        <div className="glass-panel rounded-[2rem] p-8 text-center">
          <p className="text-base font-bold text-cocoa">
            {dishes.length
              ? '点一下按钮，看看今天吃什么。'
              : '还没有菜品可以推荐，先去添加一道吧。'}
          </p>
          {!dishes.length && (
            <Link
              to="/add"
              className="primary-glass-button mt-5 inline-flex min-h-12 items-center rounded-[1.25rem] px-5 text-sm font-black"
            >
              添加菜品
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
