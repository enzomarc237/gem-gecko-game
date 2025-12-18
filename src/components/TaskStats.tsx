import { CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskStatsProps {
  completed: number
  total: number
}

export default function TaskStats({ completed, total }: TaskStatsProps) {
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)
  const active = total - completed

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {/* Total Tasks */}
      <div className={cn(
        'rounded-lg p-3 sm:p-4 border',
        'bg-gradient-to-br from-blue-50 to-blue-100/50',
        'dark:from-blue-900/20 dark:to-blue-900/10',
        'border-blue-200 dark:border-blue-800'
      )}>
        <div className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
          Total Tasks
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">
          {total}
        </div>
      </div>

      {/* Active Tasks */}
      <div className={cn(
        'rounded-lg p-3 sm:p-4 border',
        'bg-gradient-to-br from-amber-50 to-amber-100/50',
        'dark:from-amber-900/20 dark:to-amber-900/10',
        'border-amber-200 dark:border-amber-800'
      )}>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Active
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-amber-100">
          {active}
        </div>
      </div>

      {/* Completed Tasks */}
      <div className={cn(
        'rounded-lg p-3 sm:p-4 border',
        'bg-gradient-to-br from-green-50 to-green-100/50',
        'dark:from-green-900/20 dark:to-green-900/10',
        'border-green-200 dark:border-green-800'
      )}>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-green-700 dark:text-green-300 mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Done
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-100">
          {completed}
        </div>
      </div>
    </div>
  )
}
