import { CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '../App'

interface TaskCardProps {
  task: Task
  onToggle: () => void
  onDelete: () => void
}

const priorityConfig = {
  low: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  medium: {
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  },
  high: {
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  },
}

const categoryColors: Record<string, string> = {
  personal: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  work: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  shopping: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  health: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  finance: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
}

export default function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const isOverdue =
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate) < new Date()

  return (
    <div
      className={cn(
        'group relative rounded-lg border transition-all duration-300',
        'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600',
        task.completed
          ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800'
          : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
      )}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Checkbox */}
          <button
            onClick={onToggle}
            className={cn(
              'flex-shrink-0 mt-1 transition-all duration-300',
              'hover:scale-110 active:scale-95'
            )}
            aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500 drop-shadow-sm" />
            ) : (
              <Circle className="w-6 h-6 text-slate-400 dark:text-slate-600 hover:text-blue-500 transition-colors" />
            )}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'text-base sm:text-lg font-semibold transition-all duration-300',
                task.completed
                  ? 'line-through text-slate-500 dark:text-slate-400'
                  : 'text-slate-900 dark:text-white'
              )}
            >
              {task.title}
            </h3>

            {task.description && (
              <p
                className={cn(
                  'text-sm mt-2 line-clamp-2 transition-colors duration-300',
                  task.completed
                    ? 'text-slate-400 dark:text-slate-500'
                    : 'text-slate-600 dark:text-slate-400'
                )}
              >
                {task.description}
              </p>
            )}

            {/* Tags and Meta Info */}
            <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-4">
              <span
                className={cn(
                  'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                  priorityConfig[task.priority].color
                )}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>

              <span
                className={cn(
                  'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                  categoryColors[task.category]
                )}
              >
                {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
              </span>

              {task.dueDate && (
                <div
                  className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                    isOverdue
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  )}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(task.dueDate)}
                  {isOverdue && <span className="ml-1">Overdue</span>}
                </div>
              )}
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className={cn(
              'flex-shrink-0 p-2 rounded-lg transition-all duration-200',
              'text-slate-400 dark:text-slate-600 hover:text-red-500',
              'hover:bg-red-50 dark:hover:bg-red-900/20',
              'opacity-0 group-hover:opacity-100 sm:opacity-100',
              'active:scale-95'
            )}
            aria-label="Delete task"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
