import { Filter, SortAsc } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FilterType, SortType } from '../App'

interface FilterBarProps {
  filter: FilterType
  sort: SortType
  onFilterChange: (filter: FilterType) => void
  onSortChange: (sort: SortType) => void
}

export default function FilterBar({
  filter,
  sort,
  onFilterChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      {/* Filter Buttons */}
      <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
              'active:scale-95',
              filter === f
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </span>
          </button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <SortAsc className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortType)}
          className={cn(
            'px-4 py-2 rounded-lg border text-sm font-medium',
            'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
            'text-slate-900 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'transition-all duration-200 cursor-pointer'
          )}
          aria-label="Sort tasks"
        >
          <option value="date">Newest First</option>
          <option value="priority">Priority</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
    </div>
  )
}
