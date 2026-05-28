import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useCategories } from '../hooks/useCategories.jsx'
import { useDishes } from '../hooks/useDishes.jsx'

export default function CategoryScroller({ value, onChange }) {
  const { categories } = useCategories()
  const [isManaging, setIsManaging] = useState(false)
  const filterCategories = ['全部', ...categories]

  return (
    <>
      <div className="-mx-4 overflow-x-auto px-4 pb-1">
        <div className="flex gap-2">
          {filterCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onChange(category)}
              className={[
                'category-pill glass-control min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold',
                value === category
                  ? 'is-selected text-cocoa'
                  : 'text-cocoa/70',
              ].join(' ')}
            >
              {category}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsManaging(true)}
            className="category-pill glass-control flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-black text-berry"
          >
            <Plus className="h-4 w-4" />
            分类
          </button>
        </div>
      </div>

      <CategoryManager
        open={isManaging}
        selectedCategory={value}
        onSelect={onChange}
        onClose={() => setIsManaging(false)}
      />
    </>
  )
}

function CategoryManager({ open, selectedCategory, onSelect, onClose }) {
  const { categories, addCategory, updateCategory, removeCategory } =
    useCategories()
  const { renameDishCategory, moveDishCategory } = useDishes()
  const [newCategory, setNewCategory] = useState('')
  const [editingName, setEditingName] = useState('')
  const [editingValue, setEditingValue] = useState('')

  if (!open) return null

  function handleAdd(event) {
    event.preventDefault()
    const added = addCategory(newCategory)
    if (!added) return
    setNewCategory('')
    onSelect(added)
  }

  function startEdit(category) {
    setEditingName(category)
    setEditingValue(category)
  }

  function cancelEdit() {
    setEditingName('')
    setEditingValue('')
  }

  function saveEdit(category) {
    const nextCategory = updateCategory(category, editingValue)
    if (!nextCategory || nextCategory === category) {
      cancelEdit()
      return
    }

    renameDishCategory(category, nextCategory)
    if (selectedCategory === category) onSelect(nextCategory)
    cancelEdit()
  }

  function handleRemove(category) {
    if (!window.confirm(`确定要删除“${category}”这个分类吗？`)) return
    const fallback = removeCategory(category)
    moveDishCategory(category, fallback)
    if (selectedCategory === category) onSelect('全部')
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-cocoa/30 px-4 pb-6 backdrop-blur-sm">
      <div className="glass-panel max-h-[82vh] w-full max-w-[448px] overflow-hidden rounded-[2rem]">
        <div className="flex items-center justify-between border-b border-cream px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-berry">分类管理</p>
            <h2 className="text-xl font-black text-cocoa">整理你们的菜单类型</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-blush text-berry"
            aria-label="关闭分类管理"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(82vh-5rem)] space-y-4 overflow-y-auto p-5">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              placeholder="添加新分类，比如夜宵"
              className="glass-control min-h-12 min-w-0 flex-1 rounded-[1.25rem] px-4 text-base font-semibold outline-none focus:border-berry"
            />
            <button
              type="submit"
              className="flex min-h-12 shrink-0 items-center gap-1.5 rounded-[1.25rem] bg-berry px-4 text-sm font-black text-cream shadow-candy"
            >
              <Plus className="h-4 w-4" />
              添加
            </button>
          </form>

          <div className="space-y-2">
            {categories.map((category) => {
              const isEditing = editingName === category

              return (
                <div
                  key={category}
                  className="glass-control flex min-h-14 items-center gap-2 rounded-[1.25rem] p-2"
                >
                  {isEditing ? (
                    <input
                      value={editingValue}
                      onChange={(event) => setEditingValue(event.target.value)}
                      className="min-h-10 min-w-0 flex-1 rounded-xl border border-cream/50 bg-cream/45 px-3 text-base font-bold outline-none backdrop-blur focus:border-berry"
                      autoFocus
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelect(category)}
                      className={[
                        'min-h-10 min-w-0 flex-1 rounded-xl px-3 text-left text-base font-bold',
                        selectedCategory === category
                          ? 'bg-blush text-berry'
                          : 'text-cocoa',
                      ].join(' ')}
                    >
                      {category}
                    </button>
                  )}

                  {isEditing ? (
                    <>
                      <IconButton
                        label="保存分类名称"
                        onClick={() => saveEdit(category)}
                        icon={Check}
                      />
                      <IconButton
                        label="取消编辑"
                        onClick={cancelEdit}
                        icon={X}
                      />
                    </>
                  ) : (
                    <>
                      <IconButton
                        label={`编辑 ${category}`}
                        onClick={() => startEdit(category)}
                        icon={Pencil}
                      />
                      <IconButton
                        label={`删除 ${category}`}
                        onClick={() => handleRemove(category)}
                        icon={Trash2}
                        disabled={categories.length <= 1}
                        danger
                      />
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function IconButton({
  label,
  onClick,
  icon: Icon,
  disabled = false,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream/45 backdrop-blur disabled:opacity-35',
        danger ? 'text-red-500' : 'text-cocoa/70',
      ].join(' ')}
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}
