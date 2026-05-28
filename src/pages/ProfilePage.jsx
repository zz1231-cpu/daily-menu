import {
  BarChart3,
  Download,
  Heart,
  Trophy,
  Upload,
  Utensils,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCategories } from '../hooks/useCategories.jsx'
import { useDishes } from '../hooks/useDishes.jsx'
import { formatFullDate } from '../utils/date.js'

export default function ProfilePage() {
  const { dishes, replaceDishes } = useDishes()
  const { categories, replaceCategories } = useCategories()
  const [backupMessage, setBackupMessage] = useState('')
  const importInputRef = useRef(null)

  const stats = useMemo(() => {
    const mostCooked = [...dishes].sort((a, b) => b.cookCount - a.cookCount)[0]
    const recent = [...dishes]
      .filter((dish) => dish.lastCookedAt)
      .sort((a, b) => new Date(b.lastCookedAt) - new Date(a.lastCookedAt))[0]
    const categoryCounts = categories.map((category) => ({
      category,
      count: dishes.filter((dish) => dish.category === category).length,
    })).filter((item) => item.count > 0)

    return { mostCooked, recent, categoryCounts }
  }, [categories, dishes])

  function showBackupMessage(message) {
    setBackupMessage(message)
    window.setTimeout(() => setBackupMessage(''), 2200)
  }

  function handleExport() {
    const backup = {
      app: 'couple-private-menu',
      version: 1,
      exportedAt: new Date().toISOString(),
      categories,
      dishes,
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const date = new Date().toISOString().slice(0, 10)
    const link = document.createElement('a')
    link.href = url
    link.download = `每日菜单备份-${date}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    showBackupMessage('备份已导出，可以保存到手机文件里。')
  }

  async function handleImport(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const text = await file.text()
      const backup = JSON.parse(text)
      if (!Array.isArray(backup.dishes) || !Array.isArray(backup.categories)) {
        throw new Error('Invalid backup')
      }

      if (!window.confirm('导入备份会覆盖当前手机里的菜品和分类，确定继续吗？')) {
        return
      }

      replaceCategories(backup.categories)
      replaceDishes(backup.dishes)
      showBackupMessage('导入成功，菜谱已经恢复。')
    } catch {
      showBackupMessage('导入失败，请选择正确的备份文件。')
    }
  }

  return (
    <div className="space-y-5">
      <header className="candy-panel rounded-[2rem] p-5 shadow-candy">
        <div className="relative z-10">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-sm font-black text-berry">
              <Heart className="h-4 w-4 fill-berry" />
              我们的小厨房
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-cocoa">
              认真吃饭，也是认真生活。
            </h1>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Metric
          icon={Utensils}
          label="已记录菜品"
          value={`${dishes.length} 道`}
        />
        <Metric
          icon={Trophy}
          label="做得最多"
          value={stats.mostCooked?.cookCount ? stats.mostCooked.name : '还没有'}
        />
      </div>

      <section className="glass-panel rounded-[2rem] p-5">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-cocoa">
          <BarChart3 className="h-5 w-5 text-berry" />
          分类统计
        </h2>
        {stats.categoryCounts.length ? (
          <div className="space-y-3">
            {stats.categoryCounts.map(({ category, count }) => (
              <div key={category}>
                <div className="mb-1 flex items-center justify-between text-sm font-bold">
                  <span>{category}</span>
                  <span>{count} 道</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-cream">
                  <div
                    className="h-full rounded-full bg-berry"
                    style={{ width: `${(count / dishes.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-cocoa/60">分类统计会在添加菜品后出现。</p>
        )}
      </section>

      <section className="glass-panel rounded-[2rem] p-5">
        <h2 className="mb-2 text-lg font-black text-cocoa">数据备份</h2>
        <p className="mb-4 text-sm leading-6 text-cocoa/60">
          导出后可以保存到手机文件、iCloud 或聊天收藏里，需要恢复时再导入。
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="primary-glass-button flex min-h-12 items-center justify-center gap-2 rounded-[1.25rem] px-4 text-sm font-black"
          >
            <Download className="h-4 w-4 text-berry" />
            导出备份
          </button>
          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className="primary-glass-button flex min-h-12 items-center justify-center gap-2 rounded-[1.25rem] px-4 text-sm font-black"
          >
            <Upload className="h-4 w-4 text-berry" />
            导入备份
          </button>
        </div>
        <input
          ref={importInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImport}
          className="hidden"
        />
        {backupMessage && (
          <p className="mt-3 text-sm font-bold text-berry">{backupMessage}</p>
        )}
      </section>

      <section className="glass-panel rounded-[2rem] p-5">
        <h2 className="mb-4 text-lg font-black text-cocoa">最近做过的菜</h2>
        {stats.recent ? (
          <Link to={`/dish/${stats.recent.id}`} className="block">
            <p className="text-xl font-black text-cocoa">{stats.recent.name}</p>
            <p className="mt-1 text-sm text-cocoa/60">
              {formatFullDate(stats.recent.lastCookedAt)}
            </p>
          </Link>
        ) : (
          <p className="text-sm leading-6 text-cocoa/60">
            还没有记录做过哪道菜。下次在详情页点“今天就吃这个”。
          </p>
        )}
      </section>
    </div>
  )
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="glass-panel rounded-[1.6rem] p-4">
      <Icon className="mb-3 h-6 w-6 text-berry" />
      <p className="text-xs font-bold text-cocoa/50">{label}</p>
      <p className="mt-1 line-clamp-2 min-h-12 text-xl font-black leading-tight text-cocoa">
        {value}
      </p>
    </div>
  )
}
