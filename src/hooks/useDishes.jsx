import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'couple-private-menu-dishes'
const DishesContext = createContext(null)

function readDishes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function normalizeList(values) {
  return Array.isArray(values)
    ? values.map((value) => String(value).trim()).filter(Boolean)
    : []
}

function normalizeDish(dish) {
  const now = new Date().toISOString()

  return {
    id: String(dish.id || crypto.randomUUID()),
    name: String(dish.name || '').trim(),
    image: String(dish.image || ''),
    category: String(dish.category || '家常菜').trim() || '家常菜',
    ingredients: normalizeList(dish.ingredients),
    steps: normalizeList(dish.steps),
    note: String(dish.note || '').trim(),
    cookCount: Number.isFinite(Number(dish.cookCount))
      ? Number(dish.cookCount)
      : 0,
    lastCookedAt: String(dish.lastCookedAt || ''),
    createdAt: String(dish.createdAt || now),
    updatedAt: String(dish.updatedAt || now),
  }
}

export function DishesProvider({ children }) {
  const [dishes, setDishes] = useState(() => readDishes())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes))
  }, [dishes])

  const api = useMemo(() => {
    function addDish(input) {
      const now = new Date().toISOString()
      const dish = {
        id: crypto.randomUUID(),
        name: input.name.trim(),
        image: input.image,
        category: input.category,
        ingredients: normalizeList(input.ingredients),
        steps: normalizeList(input.steps),
        note: input.note.trim(),
        cookCount: 0,
        lastCookedAt: '',
        createdAt: now,
        updatedAt: now,
      }

      setDishes((current) => [dish, ...current])
      return dish
    }

    function updateDish(id, input) {
      const now = new Date().toISOString()
      let nextDish = null

      setDishes((current) =>
        current.map((dish) => {
          if (dish.id !== id) return dish

          nextDish = {
            ...dish,
            name: input.name.trim(),
            image: input.image,
            category: input.category,
            ingredients: normalizeList(input.ingredients),
            steps: normalizeList(input.steps),
            note: input.note.trim(),
            updatedAt: now,
          }
          return nextDish
        }),
      )

      return nextDish
    }

    function deleteDish(id) {
      setDishes((current) => current.filter((dish) => dish.id !== id))
    }

    function markCooked(id) {
      const now = new Date().toISOString()

      setDishes((current) =>
        current.map((dish) =>
          dish.id === id
            ? {
                ...dish,
                cookCount: dish.cookCount + 1,
                lastCookedAt: now,
                updatedAt: now,
              }
            : dish,
        ),
      )
    }

    function renameDishCategory(oldName, nextName) {
      const now = new Date().toISOString()

      setDishes((current) =>
        current.map((dish) =>
          dish.category === oldName
            ? { ...dish, category: nextName, updatedAt: now }
            : dish,
        ),
      )
    }

    function moveDishCategory(oldName, fallbackName) {
      if (!fallbackName) return
      renameDishCategory(oldName, fallbackName)
    }

    function replaceDishes(nextDishes) {
      if (!Array.isArray(nextDishes)) return false
      setDishes(nextDishes.map(normalizeDish).filter((dish) => dish.name))
      return true
    }

    return {
      dishes,
      addDish,
      updateDish,
      deleteDish,
      markCooked,
      renameDishCategory,
      moveDishCategory,
      replaceDishes,
    }
  }, [dishes])

  return <DishesContext.Provider value={api}>{children}</DishesContext.Provider>
}

export function useDishes() {
  const context = useContext(DishesContext)
  if (!context) {
    throw new Error('useDishes must be used inside DishesProvider')
  }
  return context
}
