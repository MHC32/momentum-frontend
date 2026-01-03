import { useState } from 'react'
import TaskCard from './TaskCard'

function KanbanColumn({ column, tasks, onDragStart, onDrop }) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    onDrop(column.id)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${column.color}`} />
            <h3 className="font-semibold text-lg">{column.title}</h3>
          </div>
          <span className="text-sm text-gray-400 bg-momentum-dark/40 px-3 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 glass-card p-4 rounded-2xl transition-all ${
          isDragOver ? 'border-2 border-momentum-light-2 bg-momentum-light-2/5' : ''
        }`}
        style={{ minHeight: '400px' }}
      >
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm">Aucune tâche</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDragStart={onDragStart}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default KanbanColumn