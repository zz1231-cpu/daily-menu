import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_CATEGORIES } from '../constants.js'

const STORAGE_KEY = 'couple-private-menu-categories'
const CategoriesContext = createContext(null)

function normalizeCategory(value) {
  return String(value).trim()
}

function uniqueCategories(values) {
  return values
    .map(normalizeCategory)
    .filter(Boolean)
    .filter((category, index, list) => list.indexOf(category) === index)
}

function readCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return uniqueCategories(parsed?.length ? parsed : DEFAULT_CATEGORIES)
  } catch {
    return DEFAULT_CATEGORIES
  }
}

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState(() => readCategories())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
  }, [categories])

  const api = useMemo(() => {
    function addCategory(value) {
      const category = normalizeCategory(value)
      if (!category || categories.includes(category)) return ''

      setCategories((current) => [...current, category])
      return category
    }

    function updateCategory(oldName, nextName) {
      const nextCategory = normalizeCategory(nextName)
      if (!nextCategory) return ''
      if (
        nextCategory !== oldName &&
        categories.some((category) => category === nextCategory)
      ) {
        return ''
      }

      setCategories((current) => {
        return current.map((category) =>
          category === oldName ? nextCategory : category,
        )
      })

      return nextCategory
    }

    function removeCategory(name) {
      if (categories.length <= 1) return ''
      const fallback = categories.find((category) => category !== name) || ''

      setCategories((current) =>
        current.length <= 1
          ? current
          : current.filter((category) => category !== name),
      )

      return fallback
    }

    function replaceCategories(nextCategories) {
      const normalized = uniqueCategories(
        nextCategories?.length ? nextCategories : DEFAULT_CATEGORIES,
      )
      setCategories(normalized.length ? normalized : DEFAULT_CATEGORIES)
      return true
    }

    return {
      categories,
      addCategory,
      updateCategory,
      removeCategory,
      replaceCategories,
    }
  }, [categories])

  return (
    <CategoriesContext.Provider value={api}>
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error('useCategories must be used inside CategoriesProvider')
  }
  return context
}
