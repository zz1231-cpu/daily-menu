import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import { CategoriesProvider } from './hooks/useCategories.jsx'
import { DishesProvider } from './hooks/useDishes.jsx'
import DishDetailPage from './pages/DishDetailPage.jsx'
import DishFormPage from './pages/DishFormPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import RandomPage from './pages/RandomPage.jsx'

export default function App() {
  return (
    <CategoriesProvider>
      <DishesProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<DishFormPage />} />
            <Route path="/dish/:id" element={<DishDetailPage />} />
            <Route path="/dish/:id/edit" element={<DishFormPage />} />
            <Route path="/random" element={<RandomPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </DishesProvider>
    </CategoriesProvider>
  )
}
