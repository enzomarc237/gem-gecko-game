import { useState } from 'react'
import { X, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task } from '../App'

interface TaskFormProps {
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export default function TaskForm({ onAdd, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('personal')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = 'Task title is required'
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }

    if (description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    if (dueDate && new Date(dueDate) < new Date()) {
      newErrors.dueDate = 'Due date must be in the future'
    }

    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onAdd({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      category,
      completed: false,
    })

    // Reset form
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setCategory('personal')
    setErrors({})
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl"></div>
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Create New Task
          </h2>
          <button
            onClick={onCancel}
            className={cn(
              'p-1.5 rounded-lg text-slate-600 dark:text-slate-400',
              'hover:bg-slate-100 dark:hover:bg-slate-800',
              'transition-colors duration-200'
            )}
            aria-label="Close form"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
              }}
              placeholder="What do you need to do?"
              maxLength={100}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border',
                'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white',
                'placeholder-slate-500 dark:placeholder-slate-400',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'transition-all duration-200',
                errors.title ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
              )}
              aria-invalid={!!errors.title}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {title.length}/100
              </p>
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: '' }))
              }}
              placeholder="Add more details about your task..."
              maxLength={500}
              rows={3}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border',
                'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white',
                'placeholder-slate-500 dark:placeholder-slate-400',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'transition-all duration-200 resize-none',
                errors.description
                  ? 'border-red-500'
                  : 'border-slate-200 dark:border-slate-700'
              )}
              aria-invalid={!!errors.description}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {description.length}/500
              </p>
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Priority and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as 'low' | 'medium' | 'high')
                }
                className={cn(
                  'w-full px-4 py-2.5 rounded-lg border',
                  'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'transition-all duration-200',
                  'border-slate-200 dark:border-slate-700'
                )}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={cn(
                  'w-full px-4 py-2.5 rounded-lg border',
                  'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  'transition-all duration-200',
                  'border-slate-200 dark:border-slate-700'
                )}
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="shopping">Shopping</option>
                <option value="health">Health</option>
                <option value="finance">Finance</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value)
                if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: '' }))
              }}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border',
                'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'transition-all duration-200',
                errors.dueDate
                  ? 'border-red-500'
                  : 'border-slate-200 dark:border-slate-700'
              )}
              aria-invalid={!!errors.dueDate}
            />
            {errors.dueDate && (
              <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-lg font-semibold',
                'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white',
                'hover:bg-slate-200 dark:hover:bg-slate-700',
                'transition-all duration-200 active:scale-95'
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={cn(
                'flex-1 px-4 py-2.5 rounded-lg font-semibold',
                'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                'text-white shadow-lg hover:shadow-xl',
                'transition-all duration-200 active:scale-95'
              )}
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
