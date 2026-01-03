// frontend/src/pages/Projects.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProjects } from '../redux/slices/projectSlice'
import { getTasks, updateTaskStatus } from '../redux/slices/taskSlice'
import { useSocket } from '../hooks/useSocket' // 🆕 NOUVEAU
import ProjectCard from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'
import TaskCard from '../components/TaskCard'
import Sidebar from '../components/Sidebar'

function Projects() {
  const dispatch = useDispatch()
  const { projects, isLoading } = useSelector((state) => state.projects)
  const { tasks } = useSelector((state) => state.tasks)
  
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  const [draggedTask, setDraggedTask] = useState(null)

  // 🆕 NOUVEAU : Initialiser Socket.IO
  const { isConnected } = useSocket()

  useEffect(() => {
    dispatch(getProjects())
    dispatch(getTasks())
  }, [dispatch])

  useEffect(() => {
    // Sélectionner le premier projet par défaut
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0])
    }
  }, [projects, selectedProject])

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true
    if (filter === 'active') return project.status === 'active'
    if (filter === 'dev') return project.type === 'dev'
    if (filter === 'personal') return project.type === 'personal'
    return true
  })

  // Filtrer les tâches du projet sélectionné
  const projectTasks = selectedProject ? tasks.filter(task => {
    if (task.project && typeof task.project === 'object') {
      return task.project._id === selectedProject._id
    }
    return task.project === selectedProject._id
  }) : []

  // Grouper par statut
  const todoTasks = projectTasks.filter(t => t.status === 'todo')
  const inProgressTasks = projectTasks.filter(t => t.status === 'in-progress')
  const doneTasks = projectTasks.filter(t => t.status === 'done')

  // Drag & Drop handlers
  const handleDragStart = (task) => {
    setDraggedTask(task)
  }

  const handleDrop = async (newStatus) => {
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null)
      return
    }

    try {
      await dispatch(updateTaskStatus({
        id: draggedTask._id,
        status: newStatus
      })).unwrap()
      
      // Pas besoin de refetch - Socket.IO mettra à jour automatiquement
      setDraggedTask(null)
    } catch (error) {
      console.error('Failed to update task:', error)
      setDraggedTask(null)
    }
  }

  const handleProjectClick = (project) => {
    setSelectedProject(project)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Projets</h1>
            <p className="text-gray-400">{projects.length} projets au total</p>
            
            {/* 🆕 Socket.IO status indicator (dev only) */}
            {import.meta.env.DEV && (
              <div className="text-xs mt-2">
                {isConnected ? (
                  <span className="text-green-400">🟢 Socket connecté</span>
                ) : (
                  <span className="text-red-400">🔴 Socket déconnecté</span>
                )}
              </div>
            )}
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + Nouveau projet
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {[
            { value: 'all', label: 'Tous' },
            { value: 'active', label: 'Actifs' },
            { value: 'dev', label: 'Dev' },
            { value: 'personal', label: 'Personnel' }
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                filter === f.value
                  ? 'bg-momentum-light-2 text-momentum-dark'
                  : 'bg-momentum-dark/30 text-gray-300 hover:bg-momentum-dark/50 border border-momentum-light-1/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-momentum-light-2"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold mb-2">Aucun projet</h3>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Créer un projet
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => handleProjectClick(project)}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            {/* Kanban Section */}
            {selectedProject && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">
                  {selectedProject.icon || '📁'} {selectedProject.name} - Board Kanban
                </h2>

                {/* Kanban Board */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <KanbanColumn
                    title="📋 À faire"
                    count={todoTasks.length}
                    tasks={todoTasks}
                    status="todo"
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                  />
                  <KanbanColumn
                    title="🚀 En cours"
                    count={inProgressTasks.length}
                    tasks={inProgressTasks}
                    status="in-progress"
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                  />
                  <KanbanColumn
                    title="✅ Terminé"
                    count={doneTasks.length}
                    tasks={doneTasks}
                    status="done"
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {showModal && <ProjectModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

// Kanban Column Component
function KanbanColumn({ title, count, tasks, status, onDragStart, onDrop }) {
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
    onDrop(status)
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{title}</h3>
          <span className="text-sm text-gray-400 bg-momentum-dark/40 px-3 py-1 rounded-full">
            {count}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 glass-card p-4 rounded-2xl transition-all min-h-[400px] ${
          isDragOver ? 'border-2 border-momentum-light-2 bg-momentum-light-2/5' : ''
        }`}
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

export default Projects