import { ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import DishForm from '../components/DishForm.jsx'
import Toast from '../components/Toast.jsx'
import { useDishes } from '../hooks/useDishes.jsx'

export default function DishFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dishes, addDish, updateDish } = useDishes()
  const [toast, setToast] = useState('')
  const isEditing = Boolean(id)

  const dish = useMemo(
    () => dishes.find((item) => item.id === id),
    [dishes, id],
  )

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 1800)
    return () => window.clearTimeout(timer)
  }, [toast])

  if (isEditing && !dish) return <Navigate to="/" replace />

  function handleSubmit(form) {
    if (isEditing) {
      updateDish(id, form)
      setToast('修改已保存，今晚也要好好吃饭。')
      window.setTimeout(() => navigate(`/dish/${id}`), 650)
      return
    }

    addDish(form)
    setToast('保存成功，下次不知道吃什么就来看看吧。')
    window.setTimeout(() => navigate('/'), 650)
  }

  return (
    <div className="space-y-5">
      <Toast message={toast} />
      <header className="flex items-center gap-3">
        <Link
          to={isEditing ? `/dish/${id}` : '/'}
          className="glass-control grid h-11 w-11 shrink-0 place-items-center rounded-full text-berry"
          aria-label="返回"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-sm font-semibold text-berry">
            {isEditing ? '编辑菜品' : '添加菜品'}
          </p>
          <h1 className="text-2xl font-black text-cocoa">
            {isEditing ? '把味道调得更贴心' : '记录一道新的喜欢'}
          </h1>
        </div>
      </header>

      <DishForm
        initialDish={dish}
        submitLabel={isEditing ? '保存修改' : '保存菜品'}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
