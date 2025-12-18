import { useState, useEffect } from 'react'
import { CheckCircle2, Plus, Trash2, Filter, Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import FilterBar from './components/FilterBar'
import TaskStats from './components/TaskStats'

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  category: string
  createdAt: string
}

export type FilterType = 'all' | 'active' | 'completed'
export type SortType = 'date' | 'priority' | 'alphabetical'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : []
  })

  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('date')
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Add new task
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [newTask, ...prev])
    setShowForm(false)
  }

  // Toggle task completion
  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  // Delete task
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Apply status filter
    if (filter === 'active' && task.completed) return false
    if (filter === 'completed' && !task.completed) return false

    // Apply search filter
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }

    if (sort === 'alphabetical') {
      return a.title.localeCompare(b.title)
    }

    // date sort (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const completedCount = tasks.filter((t) => t.completed).length
  const activeCount = tasks.length - completedCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  TaskFlow
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Stay organized and productive
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3',
                'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                'text-white font-semibold rounded-lg shadow-lg hover:shadow-xl',
                'transition-all duration-200 active:scale-95',
                'h-10 sm:h-auto'
              )}
              aria-label="Add new task"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>

          <TaskStats completed={completedCount} total={tasks.length} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Task Form Modal */}
        {showForm && (
          <div className="mb-6 animate-fade-in">
            <TaskForm
              onAdd={addTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700',
                'bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
                'placeholder-slate-500 dark:placeholder-slate-400',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'transition-all duration-200'
              )}
              aria-label="Search tasks"
            />
          </div>

          <FilterBar
            filter={filter}
            sort={sort}
            onFilterChange={setFilter}
            onSortChange={setSort}
          />
        </div>

        {/* Tasks List */}
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-slate-400 dark:text-slate-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {filter === 'completed'
                ? 'No completed tasks yet'
                : filter === 'active'
                  ? 'No active tasks'
                  : 'No tasks yet'}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first task to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowForm(true)}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3',
                  'bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg',
                  'transition-all duration-200 active:scale-95'
                )}
              >
                <Plus className="w-5 h-5" />
                Create Task
              </button>
            )}
          </div>
        ) : (
          <TaskList
            tasks={sortedTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 sm:py-8 mt-12 sm:mt-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} • {completedCount} completed
            • {activeCount} active
          </p>
        </div>
      </footer>
    </div>
  )
}
