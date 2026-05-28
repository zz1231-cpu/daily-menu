import { Dice5, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CategoryScroller from '../components/CategoryScroller.jsx'
import DishCard from '../components/DishCard.jsx'
import RandomDishModal from '../components/RandomDishModal.jsx'
import { useDishes } from '../hooks/useDishes.jsx'

export default function HomePage() {
  const { dishes } = useDishes()
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('全部')
  const [randomDish, setRandomDish] = useState(null)

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchedName = dish.name.toLowerCase().includes(keyword.toLowerCase())
      const matchedCategory = category === '全部' || dish.category === category
      return matchedName && matchedCategory
    })
  }, [category, dishes, keyword])

  function pickRandom() {
    if (!dishes.length) return
    const dish = dishes[Math.floor(Math.random() * dishes.length)]
    setRandomDish(dish)
  }

  return (
    <div className="space-y-5">
      <header className="candy-panel rounded-[2rem] p-5 shadow-candy">
        <div className="relative z-10">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-berry">每日菜单</p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-cocoa">
              今天想给宝宝做点什么？
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={pickRandom}
          className="primary-glass-button relative z-10 mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[1.35rem] px-5 text-base font-black"
        >
          <Dice5 className="h-5 w-5 text-berry" />
          今天吃什么？
        </button>
      </header>

      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cocoa/45" />
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索以前做过的菜"
          className="glass-control min-h-[52px] w-full rounded-[1.4rem] py-3 pl-12 pr-4 text-base font-semibold outline-none transition focus:border-berry"
        />
      </label>

      <CategoryScroller value={category} onChange={setCategory} />

      {filteredDishes.length ? (
        <div className="space-y-3">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      ) : (
        <EmptyState hasDishes={dishes.length > 0} />
      )}

      <RandomDishModal dish={randomDish} onClose={() => setRandomDish(null)} />
    </div>
  )
}

function EmptyState({ hasDishes }) {
  return (
    <div className="glass-panel rounded-[2rem] p-8 text-center">
      <p className="text-base font-bold text-cocoa">
        {hasDishes
          ? '没有找到这道菜，换个关键词试试吧。'
          : '还没有记录菜品，先添加一道你们爱吃的吧。'}
      </p>
      {!hasDishes && (
        <Link
          to="/add"
          className="primary-glass-button mt-5 inline-flex min-h-12 items-center rounded-[1.25rem] px-5 text-sm font-black"
        >
          添加第一道菜
        </Link>
      )}
    </div>
  )
}
