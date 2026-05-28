import { ArrowLeft, CalendarDays, Pencil, Trash2, Utensils } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import Toast from '../components/Toast.jsx'
import { useDishes } from '../hooks/useDishes.jsx'
import { formatFullDate } from '../utils/date.js'

export default function DishDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dishes, deleteDish, markCooked } = useDishes()
  const [toast, setToast] = useState('')
  const dish = useMemo(() => dishes.find((item) => item.id === id), [dishes, id])

  if (!dish) return <Navigate to="/" replace />

  function handleCooked() {
    markCooked(dish.id)
    setToast('已记录，今天就吃这个。')
    window.setTimeout(() => setToast(''), 1800)
  }

  function handleDelete() {
    if (!window.confirm('确定要删除这道菜吗？')) return
    deleteDish(dish.id)
    navigate('/')
  }

  return (
    <article className="space-y-5">
      <Toast message={toast} />
      <header className="-mx-4 -mt-5">
        <div className="relative h-80 bg-blush">
          {dish.image ? (
            <img
              className="h-full w-full object-cover"
              src={dish.image}
              alt={dish.name}
            />
          ) : (
            <PlaceholderImage />
          )}
          <Link
            to="/"
            className="absolute left-4 top-5 grid h-11 w-11 place-items-center rounded-full bg-cream/92 text-berry shadow-candy"
            aria-label="返回菜单"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <section className="glass-panel rounded-[2rem] p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-blush px-3 py-1 text-xs font-black text-berry">
              {dish.category}
            </p>
            <h1 className="text-3xl font-black leading-tight text-cocoa">
              {dish.name}
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Stat icon={Utensils} label="做过次数" value={`${dish.cookCount} 次`} />
          <Stat
            icon={CalendarDays}
            label="最近一次"
            value={formatFullDate(dish.lastCookedAt)}
          />
        </div>
      </section>

      <InfoSection title="食材">
        <div className="flex flex-wrap gap-2">
          {dish.ingredients.length ? (
            dish.ingredients.map((ingredient) => (
              <span
                key={ingredient}
                className="rounded-full bg-blush px-3 py-2 text-sm font-bold text-cocoa"
              >
                {ingredient}
              </span>
            ))
          ) : (
            <p className="text-sm text-cocoa/60">还没有写食材。</p>
          )}
        </div>
      </InfoSection>

      <InfoSection title="做法步骤">
        {dish.steps.length ? (
          <ol className="space-y-3">
            {dish.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush text-sm font-black text-berry">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-6 text-cocoa/75">{step}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-cocoa/60">还没有写步骤。</p>
        )}
      </InfoSection>

      <InfoSection title="小备注">
        <p className="whitespace-pre-wrap text-sm leading-6 text-cocoa/75">
          {dish.note || '暂无备注。'}
        </p>
      </InfoSection>

      <div className="grid gap-3">
        <button
          type="button"
          onClick={handleCooked}
          className="primary-glass-button flex min-h-14 items-center justify-center gap-2 rounded-[1.35rem] px-5 text-base font-black"
        >
          <Utensils className="h-5 w-5" />
          今天就吃这个
        </button>
        <Link
          to={`/dish/${dish.id}/edit`}
          className="glass-panel flex min-h-[52px] items-center justify-center gap-2 rounded-[1.35rem] px-5 text-base font-black text-cocoa"
        >
          <Pencil className="h-5 w-5 text-orange-400" />
          编辑菜品
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="glass-panel flex min-h-[52px] items-center justify-center gap-2 rounded-[1.35rem] px-5 text-base font-black text-red-500"
        >
          <Trash2 className="h-5 w-5" />
          删除菜品
        </button>
      </div>
    </article>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[1.25rem] bg-cream p-3">
      <Icon className="mb-2 h-5 w-5 text-berry" />
      <p className="text-xs font-semibold text-cocoa/50">{label}</p>
      <p className="mt-1 text-sm font-black text-cocoa">{value}</p>
    </div>
  )
}

function InfoSection({ title, children }) {
  return (
    <section className="glass-panel rounded-[2rem] p-5">
      <h2 className="mb-4 text-lg font-black text-cocoa">{title}</h2>
      {children}
    </section>
  )
}
