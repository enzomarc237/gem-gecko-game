import TaskCard from './TaskCard'
import type { Task } from '../App'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <TaskCard
            task={task}
            onToggle={() => onToggle(task.id)}
            onDelete={() => onDelete(task.id)}
          />
        </div>
      ))}
    </div>
  )
}
