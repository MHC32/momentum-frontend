import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProjects } from '../redux/slices/projectSlice'
import { getTasks, updateTask } from '../redux/slices/taskSlice'
import Sidebar from '../components/Sidebar'
import TaskCard from '../components/TaskCard'
import CreateTaskModal from '../components/CreateTaskModal'

function Kanban() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { projects } = useSelector((state) => state.projects)
  const { tasks } = useSelector((state) => state.tasks)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [draggedTask, setDraggedTask] = useState(null)

  useEffect(() => {
    dispatch(getProjects())
    dispatch(getTasks())
  }, [dispatch])

  // Get current project
  const project = projects.find(p => p._id === projectId)

  // Filter tasks for this project
  const projectTasks = tasks.filter(task => {
    if (task.project && typeof task.project === 'object') {
      return task.project._id === projectId
    }
    return task.project === projectId
  })

  // Group tasks by status
  const todoTasks = projectTasks.filter(t => t.status === 'todo')
  const inProgressTasks = projectTasks.filter(t => t.status === 'in-progress')
  const doneTasks = projectTasks.filter(t => t.status === 'done')

  // Kanban columns configuration
  const columns = [
    {
      id: 'todo',
      title: '📋 À faire',
      tasks: todoTasks,
      color: 'bg-gray-500'
    },
    {
      id: 'in-progress',
      title: '🚀 En cours',
      tasks: inProgressTasks,
      color: 'bg-blue-500'
    },
    {
      id: 'done',
      title: '✅ Terminé',
      tasks: doneTasks,
      color: 'bg-green-500'
    }
  ]

  // Drag & Drop handlers
  const handleDragStart = (task) => {
    setDraggedTask(task)
  }

  const handleDrop = async (newStatus) => {
    if (!draggedTask || draggedTask.status === newStatus) return

    try {
      await dispatch(updateTask({
        id: draggedTask._id,
        taskData: { status: newStatus }
      })).unwrap()
      
      setDraggedTask(null)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  if (!project) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📁</div>
            <h2 className="text-2xl font-bold mb-2">Projet non trouvé</h2>
            <button onClick={() => navigate('/projects')} className="btn-primary mt-4">
              Retour aux projets
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/projects')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Retour
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                  style={{ backgroundColor: project.color || '#7BBDE8' }}
                >
                  {project.icon || project.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{project.name}</h1>
                  <p className="text-gray-400">{project.description || 'Kanban Board'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary"
          >
            + Nouvelle tâche
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-momentum-light-2 mb-1">
              {projectTasks.length}
            </div>
            <div className="text-sm text-gray-400">Total tâches</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-gray-400 mb-1">
              {todoTasks.length}
            </div>
            <div className="text-sm text-gray-400">À faire</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {inProgressTasks.length}
            </div>
            <div className="text-sm text-gray-400">En cours</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {doneTasks.length}
            </div>
            <div className="text-sm text-gray-400">Terminées</div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </main>

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          defaultProject={projectId}
        />
      )}
    </div>
  )
}

// Kanban Column Component
function KanbanColumn({ column, onDragStart, onDrop }) {
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
            {column.tasks.length}
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
          {column.tasks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm">Aucune tâche</p>
            </div>
          ) : (
            column.tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDragStart={onDragStart}
                draggable={true}
                showProject={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Kanban