import { useState } from 'react'

function TaskCard({ task, onDragStart, draggable = true, showProject = true }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e) => {
    if (!draggable) return
    
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('taskId', task._id)
    e.dataTransfer.setData('fromStatus', task.status)
    setIsDragging(true)
    
    if (onDragStart) {
      onDragStart(task)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const priorityColors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    normal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    low: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  const priorityLabels = {
    critical: 'URGENT',
    high: 'HAUTE',
    normal: 'NORMALE',
    low: 'BASSE'
  }

  const typeColors = {
    dev: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    personal: 'bg-green-500/20 text-green-400 border-green-500/30',
    goal: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    habit: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
  }

  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-momentum-bg/60 border border-momentum-light-1/10 rounded-xl p-4 transition-all hover:border-momentum-light-2/30 ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      } ${isDragging ? 'opacity-50 scale-95' : ''}`}
    >
      {/* Task ID and Title */}
      <div className="mb-3">
        <div className="font-semibold text-base mb-1">
          {task.taskId && (
            <span className="text-momentum-light-2 mr-2">[{task.taskId}]</span>
          )}
          {task.title}
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-400 line-clamp-2 mt-1">
            {task.description}
          </p>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Priority Tag */}
        <span
          className={`px-2 py-1 rounded-md text-xs font-semibold border ${
            priorityColors[task.priority] || priorityColors.normal
          }`}
        >
          {priorityLabels[task.priority] || 'NORMALE'}
        </span>

        {/* Type Tag */}
        {task.type && (
          <span
            className={`px-2 py-1 rounded-md text-xs font-semibold border ${
              typeColors[task.type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
            }`}
          >
            {task.type}
          </span>
        )}
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
        {/* Project - COMPLETE NULL CHECK */}
        {showProject && task.project && typeof task.project === 'object' && task.project.name && (
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: task.project.color || '#7BBDE8' }}
            />
            <span>{task.project.name}</span>
          </div>
        )}

        {/* Deadline */}
        {task.deadline && (
          <span>
            📅 {new Date(task.deadline).toLocaleDateString('fr-FR')}
          </span>
        )}

        {/* Git Commits */}
        {task.gitCommits && task.gitCommits.length > 0 && (
          <span>💾 {task.gitCommits.length} commit{task.gitCommits.length > 1 ? 's' : ''}</span>
        )}

        {/* Estimated Time */}
        {task.estimatedTime && (
          <span>⏱️ {task.estimatedTime}h</span>
        )}
      </div>

      {/* Progress Bar */}
      {task.progress > 0 && task.progress < 100 && (
        <div className="mt-3">
          <div className="h-1.5 bg-momentum-dark/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-momentum-light-2 to-momentum-accent transition-all"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskCard