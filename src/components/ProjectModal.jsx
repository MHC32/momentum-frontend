import { useState, } from 'react'
import { useDispatch } from 'react-redux'
import { createProject, updateProject, getProjects } from '../redux/slices/projectSlice'

function ProjectModal({ project, onClose }) {
  const dispatch = useDispatch()
  const isEdit = !!project

  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    type: project?.type || 'dev',
    priority: project?.priority || 'normal',
    status: project?.status || 'active',
    color: project?.color || '#7BBDE8',
    icon: project?.icon || ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const colors = [
    '#7BBDE8', '#6EA2B3', '#4E8EA2', '#49769F',
    '#F59E0B', '#10B981', '#EF4444', '#A78BFA'
  ]

  const onChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEdit) {
        await dispatch(updateProject({ id: project._id, data: formData }))
      } else {
        await dispatch(createProject(formData))
      }
      await dispatch(getProjects())
      onClose()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {isEdit ? 'Modifier le projet' : 'Nouveau projet'}
        </h2>

        <form onSubmit={onSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nom *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              className="input-field"
              placeholder="Mon super projet"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              className="input-field"
              rows="3"
              placeholder="Description du projet..."
            />
          </div>

          {/* Icon */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Icône (emoji ou lettre)
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={onChange}
              className="input-field"
              placeholder="💻"
              maxLength="2"
            />
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Couleur</label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.color === color
                      ? 'ring-2 ring-white scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={onChange}
              className="input-field"
            >
              <option value="dev">Dev</option>
              <option value="personal">Personnel</option>
            </select>
          </div>

          {/* Priority */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Priorité</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={onChange}
              className="input-field"
            >
              <option value="low">Basse</option>
              <option value="normal">Normale</option>
              <option value="high">Haute</option>
              <option value="critical">Critique</option>
            </select>
          </div>

          {/* Status (only for edit) */}
          {isEdit && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Statut</label>
              <select
                name="status"
                value={formData.status}
                onChange={onChange}
                className="input-field"
              >
                <option value="active">Actif</option>
                <option value="on-hold">En pause</option>
                <option value="completed">Complété</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectModal