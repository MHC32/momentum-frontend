import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createTask } from '../redux/slices/taskSlice'
import { getProjects } from '../redux/slices/projectSlice'

function CreateTaskModal({ isOpen, onClose, defaultProject = null }) {
  const dispatch = useDispatch()
  const { projects } = useSelector((state) => state.projects)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    taskId: '',
    project: defaultProject || '',
    type: 'dev',
    priority: 'normal',
    status: 'todo',
    deadline: ''
  })

  useEffect(() => {
    dispatch(getProjects())
  }, [dispatch])

  useEffect(() => {
    if (defaultProject) {
      setFormData(prev => ({ ...prev, project: defaultProject }))
    }
  }, [defaultProject])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Le titre est requis')
      return
    }

    if (!formData.project) {
      alert('Veuillez sélectionner un projet')
      return
    }

    setIsLoading(true)

    try {
      const taskData = {
        ...formData,
        deadline: formData.deadline || null
      }

      if (!taskData.taskId) {
        delete taskData.taskId
      }

      await dispatch(createTask(taskData)).unwrap()
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        taskId: '',
        project: defaultProject || '',
        type: 'dev',
        priority: 'normal',
        status: 'todo',
        deadline: ''
      })

      onClose()
    } catch (error) {
      console.error('Failed to create task:', error)
      alert('Erreur lors de la création de la tâche')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-momentum-dark/95 to-momentum-bg/95 backdrop-blur-xl border border-momentum-light-1/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-momentum-dark/90 backdrop-blur-xl border-b border-momentum-light-1/10 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-momentum-light-2 to-momentum-light-3 bg-clip-text text-transparent">
            ✨ Nouvelle tâche
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-momentum-light-1/10 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title - Required */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-momentum-light-2">
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Intégration API paiement mobile"
              className="w-full bg-momentum-bg/50 border border-momentum-light-1/20 rounded-xl px-4 py-3 focus:outline-none focus:border-momentum-light-2 transition-colors text-white placeholder-gray-500"
              required
            />
          </div>

          {/* Two Columns: Task ID + Project */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Task ID - Optional */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                ID Tâche <span className="text-xs text-gray-500">(optionnel)</span>
              </label>
              <input
                type="text"
                name="taskId"
                value={formData.taskId}
                onChange={handleChange}
                placeholder="Ex: VAL-023"
                className="w-full bg-momentum-bg/50 border border-momentum-light-1/20 rounded-xl px-4 py-3 focus:outline-none focus:border-momentum-light-2 transition-colors text-white placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">Laissez vide pour génération auto</p>
            </div>

            {/* Project - Required */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-momentum-light-2">
                Projet <span className="text-red-400">*</span>
              </label>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="w-full bg-momentum-bg/50 border border-momentum-light-1/20 rounded-xl px-4 py-3 focus:outline-none focus:border-momentum-light-2 transition-colors text-white"
                required
              >
                <option value="">Sélectionner un projet</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.icon || '📁'} {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décris la tâche en détails..."
              rows="3"
              className="w-full bg-momentum-bg/50 border border-momentum-light-1/20 rounded-xl px-4 py-3 focus:outline-none focus:border-momentum-light-2 transition-colors text-white placeholder-gray-500 resize-none"
            />
          </div>

          {/* Three Columns: Type + Priority + Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-momentum-bg/50 border border-momentum-light-1/20 rounded-xl px-4 py-3 focus:outline-none focus:border-momentum-light-2 transition-colors text-white"
              >
                <option value="dev">💻 Dev</option>
                <option value="personal">👤 Personnel</option>
                <option value="goal">🎯 Objectif</option>
                <option value="habit">🔁 Habitude</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Priorité</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-momentum-bg/50 border border-momentum-light-1/20 rounded-xl px-4 py-3 focus:outline-none focus:border-momentum-light-2 transition-colors text-white"
              >
                <option value="low">🟢 Basse</option>
                <option value="normal">🔵 Normale</option>
                <option value="high">🟠 Haute</option>
                <option value="critical">🔴 Critique</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Statut</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-momentum-bg/50 border border-momentum-light-1/20 rounded-xl px-4 py-3 focus:outline-none focus:border-momentum-light-2 transition-colors text-white"
              >
                <option value="todo">📋 À faire</option>
                <option value="in-progress">🚀 En cours</option>
                <option value="done">✅ Terminé</option>
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full bg-momentum-bg/50 border border-momentum-light-1/20 rounded-xl px-4 py-3 focus:outline-none focus:border-momentum-light-2 transition-colors text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-momentum-light-1/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-momentum-dark/50 border border-momentum-light-1/20 rounded-xl font-semibold hover:bg-momentum-dark/70 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title || !formData.project}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-momentum-light-2 to-momentum-accent rounded-xl font-semibold text-momentum-dark hover:shadow-lg hover:shadow-momentum-light-2/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Création...
                </span>
              ) : (
                '✨ Créer la tâche'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTaskModal