import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createGoal, updateGoal } from '../redux/slices/goalSlice'

function GoalModal({ goal, onClose, defaultView = 'hierarchy' }) {
  const dispatch = useDispatch()
  const isEdit = !!goal

  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    type: goal?.type || 'numeric',
    category: goal?.category || 'personal',
    level: goal?.level || 'annual',
    priority: goal?.priority || 'normal',
    
    // Display options
    display_in_hierarchy: goal?.display_in_hierarchy ?? (defaultView === 'hierarchy'),
    display_in_checklist: goal?.display_in_checklist ?? (defaultView === 'checklist'),
    
    // Auto decompose
    auto_decompose: goal?.auto_decompose ?? true,
    
    // Numeric type fields
    target_value: goal?.target_value || 100,
    current_value: goal?.current_value || 0,
    unit: goal?.unit || '',
    
    // Steps type fields
    steps: goal?.steps || [{ label: '', completed: false }],
    
    // Dates
    deadline: goal?.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
    year: goal?.year || 2026,
    
    // Integration
    integration_type: goal?.integration_type || 'none'
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Categories avec icônes
  const categories = [
    { value: 'financial', label: 'Financier', icon: '💰', color: 'from-green-500 to-emerald-500' },
    { value: 'professional', label: 'Professionnel', icon: '💼', color: 'from-blue-500 to-cyan-500' },
    { value: 'learning', label: 'Apprentissage', icon: '📚', color: 'from-purple-500 to-pink-500' },
    { value: 'personal', label: 'Personnel', icon: '🎯', color: 'from-orange-500 to-red-500' },
    { value: 'health', label: 'Santé', icon: '❤️', color: 'from-red-500 to-pink-500' }
  ]

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleTypeChange = (newType) => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      // Reset type-specific fields
      steps: newType === 'steps' ? [{ label: '', completed: false }] : [],
      target_value: newType === 'numeric' ? 100 : 0,
      current_value: 0
    }))
  }

  // Steps management
  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { label: '', completed: false }]
    }))
  }

  const removeStep = (index) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }))
  }

  const updateStep = (index, label) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, label } : step
      )
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error('Le titre est requis')
      }

      if (formData.type === 'steps' && formData.steps.filter(s => s.label.trim()).length === 0) {
        throw new Error('Au moins une étape est requise')
      }

      // Prepare data
      const goalData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        category: formData.category,
        level: formData.level,
        priority: formData.priority,
        display_in_hierarchy: formData.display_in_hierarchy,
        display_in_checklist: formData.display_in_checklist,
        auto_decompose: formData.auto_decompose,
        year: parseInt(formData.year),
        integration_type: formData.integration_type
      }

      // Add type-specific fields
      if (formData.type === 'numeric') {
        goalData.target_value = parseFloat(formData.target_value)
        goalData.current_value = parseFloat(formData.current_value)
        goalData.unit = formData.unit.trim()
      } else if (formData.type === 'steps') {
        goalData.steps = formData.steps
          .filter(s => s.label.trim())
          .map(s => ({ label: s.label.trim(), completed: false }))
      }

      if (formData.deadline) {
        goalData.deadline = new Date(formData.deadline)
      }

      // Submit
      if (isEdit) {
        await dispatch(updateGoal({ goalId: goal._id, goalData })).unwrap()
      } else {
        await dispatch(createGoal(goalData)).unwrap()
      }

      onClose()
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {isEdit ? 'Modifier l\'objectif' : 'Nouvel Objectif'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Titre *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              className="input-field"
              placeholder="Mon objectif 2026"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              className="input-field"
              rows="2"
              placeholder="Description de l'objectif..."
            />
          </div>

          {/* Type d'objectif */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Type d'objectif *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('numeric')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.type === 'numeric'
                    ? 'border-momentum-light-2 bg-momentum-light-2/10'
                    : 'border-momentum-light-1/20 hover:border-momentum-light-1/40'
                }`}
              >
                <div className="text-2xl mb-1">📊</div>
                <div className="text-sm font-medium">Numérique</div>
                <div className="text-xs text-gray-500">Avec valeur cible</div>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('steps')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.type === 'steps'
                    ? 'border-momentum-light-2 bg-momentum-light-2/10'
                    : 'border-momentum-light-1/20 hover:border-momentum-light-1/40'
                }`}
              >
                <div className="text-2xl mb-1">✅</div>
                <div className="text-sm font-medium">Étapes</div>
                <div className="text-xs text-gray-500">Checklist</div>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('simple')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.type === 'simple'
                    ? 'border-momentum-light-2 bg-momentum-light-2/10'
                    : 'border-momentum-light-1/20 hover:border-momentum-light-1/40'
                }`}
              >
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-sm font-medium">Simple</div>
                <div className="text-xs text-gray-500">On/Off</div>
              </button>
            </div>
          </div>

          {/* Numeric Type Fields */}
          {formData.type === 'numeric' && (
            <div className="mb-4 p-4 bg-momentum-dark/20 rounded-xl">
              <h3 className="text-sm font-semibold mb-3">Configuration numérique</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Valeur cible *</label>
                  <input
                    type="number"
                    name="target_value"
                    value={formData.target_value}
                    onChange={onChange}
                    className="input-field"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Valeur actuelle</label>
                  <input
                    type="number"
                    name="current_value"
                    value={formData.current_value}
                    onChange={onChange}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm mb-1">Unité (optionnel)</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={onChange}
                  className="input-field"
                  placeholder="€, kg, commits, etc."
                />
              </div>
            </div>
          )}

          {/* Steps Type Fields */}
          {formData.type === 'steps' && (
            <div className="mb-4 p-4 bg-momentum-dark/20 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Étapes</h3>
                <button
                  type="button"
                  onClick={addStep}
                  className="text-sm text-momentum-light-2 hover:text-momentum-light-3 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter
                </button>
              </div>
              <div className="space-y-2">
                {formData.steps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={step.label}
                      onChange={(e) => updateStep(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder={`Étape ${index + 1}`}
                    />
                    {formData.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="px-3 text-red-400 hover:text-red-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Catégorie *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    formData.category === cat.value
                      ? 'border-momentum-light-2 bg-momentum-light-2/10'
                      : 'border-momentum-light-1/20 hover:border-momentum-light-1/40'
                  }`}
                >
                  <div className="text-xl mb-1">{cat.icon}</div>
                  <div className="text-sm font-medium">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Niveau hiérarchique *
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={onChange}
              className="input-field"
            >
              <option value="annual">📅 Annuel</option>
              <option value="quarterly">📊 Trimestriel</option>
              <option value="monthly">🗓️ Mensuel</option>
              <option value="weekly">📆 Hebdomadaire</option>
              <option value="daily">☀️ Quotidien</option>
            </select>
          </div>

          {/* Priority & Deadline */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
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
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={onChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Display Options */}
          <div className="mb-4 p-4 bg-momentum-dark/20 rounded-xl">
            <h3 className="text-sm font-semibold mb-3">Affichage</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="display_in_hierarchy"
                  checked={formData.display_in_hierarchy}
                  onChange={onChange}
                  className="w-4 h-4 rounded border-momentum-light-1/30 bg-momentum-dark/40 text-momentum-light-2 focus:ring-momentum-light-2 focus:ring-offset-0"
                />
                <span className="text-sm">Afficher dans la vue hiérarchique</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="display_in_checklist"
                  checked={formData.display_in_checklist}
                  onChange={onChange}
                  className="w-4 h-4 rounded border-momentum-light-1/30 bg-momentum-dark/40 text-momentum-light-2 focus:ring-momentum-light-2 focus:ring-offset-0"
                />
                <span className="text-sm">Afficher dans la vue checklist</span>
              </label>
              {formData.level === 'annual' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="auto_decompose"
                    checked={formData.auto_decompose}
                    onChange={onChange}
                    className="w-4 h-4 rounded border-momentum-light-1/30 bg-momentum-dark/40 text-momentum-light-2 focus:ring-momentum-light-2 focus:ring-offset-0"
                  />
                  <span className="text-sm">Décomposer automatiquement</span>
                </label>
              )}
            </div>
          </div>

          {/* Integration Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Intégration (optionnel)
            </label>
            <select
              name="integration_type"
              value={formData.integration_type}
              onChange={onChange}
              className="input-field"
            >
              <option value="none">Aucune</option>
              <option value="commits">Commits GitHub</option>
              <option value="books">Livres lus (projets)</option>
            </select>
          </div>

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
              className="btn-primary flex-1"
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

export default GoalModal