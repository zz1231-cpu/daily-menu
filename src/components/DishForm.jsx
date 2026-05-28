import { Camera, Minus, Plus, Save } from 'lucide-react'
import { useState } from 'react'
import { EMPTY_DISH } from '../constants.js'
import { useCategories } from '../hooks/useCategories.jsx'
import { fileToDataUrl } from '../utils/image.js'
import PlaceholderImage from './PlaceholderImage.jsx'

function ensureRows(values) {
  return values?.length ? values : ['']
}

export default function DishForm({ initialDish, submitLabel, onSubmit }) {
  const { categories, addCategory } = useCategories()
  const [form, setForm] = useState(() => ({
    ...EMPTY_DISH,
    ...initialDish,
    ingredients: ensureRows(initialDish?.ingredients),
    steps: ensureRows(initialDish?.steps),
  }))
  const [newCategory, setNewCategory] = useState('')
  const categoryOptions = categories.includes(form.category)
    ? categories
    : [form.category, ...categories].filter(Boolean)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function updateList(field, index, value) {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }))
  }

  function addListItem(field) {
    setForm((current) => ({ ...current, [field]: [...current[field], ''] }))
  }

  function removeListItem(field, index) {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    updateField('image', dataUrl)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim()) return
    onSubmit(form)
  }

  function handleAddCategory() {
    const added = addCategory(newCategory)
    if (!added) return
    updateField('category', added)
    setNewCategory('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-cocoa">菜品照片</span>
        <div className="glass-panel relative h-56 overflow-hidden rounded-[1.7rem]">
          {form.image ? (
            <img
              className="h-full w-full object-cover"
              src={form.image}
              alt="菜品预览"
            />
          ) : (
            <PlaceholderImage />
          )}
          <div className="absolute inset-x-4 bottom-4 flex justify-end">
            <span className="inline-flex min-h-12 items-center gap-2 rounded-full bg-cream/95 px-4 text-sm font-black text-berry shadow-candy">
              <Camera className="h-5 w-5 text-berry" />
              上传照片
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="上传菜品照片"
          />
        </div>
      </label>

      <div>
        <label className="mb-2 block text-sm font-bold text-cocoa" htmlFor="name">
          菜品名称
        </label>
        <input
          id="name"
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          placeholder="比如：番茄炒蛋"
          className="glass-control min-h-[52px] w-full rounded-[1.25rem] px-4 py-3 text-base font-semibold outline-none transition focus:border-berry"
          required
        />
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-bold text-cocoa"
          htmlFor="category"
        >
          分类
        </label>
        <select
          id="category"
          value={form.category}
          onChange={(event) => updateField('category', event.target.value)}
          className="glass-control min-h-[52px] w-full rounded-[1.25rem] px-4 py-3 text-base font-semibold outline-none transition focus:border-berry"
        >
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="mt-3 flex gap-2">
          <input
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            placeholder="添加新分类"
            className="glass-control min-h-12 min-w-0 flex-1 rounded-[1.25rem] px-4 text-base outline-none transition focus:border-berry"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="flex min-h-12 shrink-0 items-center gap-1.5 rounded-[1.25rem] bg-blush px-4 text-sm font-black text-berry"
          >
            <Plus className="h-4 w-4" />
            添加
          </button>
        </div>
      </div>

      <ListEditor
        title="食材清单"
        field="ingredients"
        rows={form.ingredients}
        placeholder="鸡蛋 2 个"
        onAdd={addListItem}
        onRemove={removeListItem}
        onChange={updateList}
      />

      <ListEditor
        title="详细做法"
        field="steps"
        rows={form.steps}
        placeholder="准备食材"
        multiline
        onAdd={addListItem}
        onRemove={removeListItem}
        onChange={updateList}
      />

      <div>
        <label className="mb-2 block text-sm font-bold text-cocoa" htmlFor="note">
          小备注
        </label>
        <textarea
          id="note"
          value={form.note}
          onChange={(event) => updateField('note', event.target.value)}
          placeholder="她喜欢少放辣，下次可以多放一点土豆"
          rows={4}
          className="glass-control w-full resize-none rounded-[1.25rem] px-4 py-3 text-base outline-none transition focus:border-berry"
        />
      </div>

      <button
        type="submit"
        className="primary-glass-button flex min-h-14 w-full items-center justify-center gap-2 rounded-[1.35rem] px-5 text-base font-black transition active:scale-[0.99]"
      >
        <Save className="h-5 w-5" />
        {submitLabel}
      </button>
    </form>
  )
}

function ListEditor({
  title,
  field,
  rows,
  placeholder,
  multiline = false,
  onAdd,
  onRemove,
  onChange,
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-cocoa">{title}</h2>
        <button
          type="button"
          onClick={() => onAdd(field)}
          className="inline-flex min-h-10 items-center gap-1 rounded-full bg-blush px-3 text-sm font-black text-berry"
        >
          <Plus className="h-4 w-4" />
          添加
        </button>
      </div>
      <div className="space-y-3">
        {rows.map((row, index) => {
          const sharedProps = {
            value: row,
            onChange: (event) => onChange(field, index, event.target.value),
            placeholder: index === 0 ? placeholder : `${title} ${index + 1}`,
            className:
              'glass-control w-full rounded-[1.25rem] px-4 py-3 text-base outline-none transition focus:border-berry',
          }

          return (
            <div key={index} className="flex gap-2">
              <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-[1.1rem] bg-blush text-sm font-black text-berry">
                {index + 1}
              </div>
              {multiline ? (
                <textarea
                  {...sharedProps}
                  rows={2}
                  className={`${sharedProps.className} resize-none`}
                />
              ) : (
                <input {...sharedProps} />
              )}
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(field, index)}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-[1.1rem] bg-cream/45 text-cocoa/55 backdrop-blur"
                  aria-label={`删除第 ${index + 1} 项`}
                >
                  <Minus className="h-5 w-5" />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
