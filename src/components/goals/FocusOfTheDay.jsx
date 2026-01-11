/**
 * COMMIT: feat(goals): Add FocusOfTheDay component for daily focus section
 * 
 * Ajoute le composant FocusOfTheDay qui affiche tous les objectifs/tâches
 * avec deadline aujourd'hui avec une progress bar
 */

import { useDispatch } from 'react-redux'
import { completeStep, updateProgress } from '../../redux/slices/goalSlice'

function FocusOfTheDay({ focusGoals, tasks, focusMetadata }) {
  const dispatch = useDispatch()

  // Progress du focus
  const { completed = 0, total = 0, progress = 0 } = focusMetadata || {}

  // Handler pour toggle une étape
  // eslint-disable-next-line no-unused-vars
  const handleStepToggle = (goalId, stepId) => {
    dispatch(completeStep({ goalId, stepId }))
  }

  // Handler pour toggle un goal simple
  const handleToggleGoal = (goal) => {
    if (goal.type === 'simple') {
      dispatch(updateProgress({
        goalId: goal._id,
        progressData: { value: goal.completed ? 0 : 1 }
      }))
    } else if (goal.type === 'numeric') {
      // Pour les numériques, on peut cocher si atteint
      if (goal.current_value >= goal.target_value) {
        dispatch(updateProgress({
          goalId: goal._id,
          progressData: { value: goal.target_value }
        }))
      }
    }
  }

  const safeGoals = Array.isArray(focusGoals) ? focusGoals : []
  const safeTasks = Array.isArray(tasks) ? tasks : []
  
  const allItems = [
    ...safeGoals.map(g => ({ ...g, itemType: 'goal' })),
    ...safeTasks.map(t => ({ ...t, itemType: 'task' }))
  ]

  // Icône selon type et status
  const getItemIcon = (item) => {
    if (item.completed || item.progress_percent >= 100) {
      return (
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )
    }

    if (item.itemType === 'goal' && item.type === 'numeric') {
      return (
        <div className="w-6 h-6 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
      )
    }

    return (
      <div className="w-6 h-6 rounded-full border-2 border-gray-500"></div>
    )
  }

  if (total === 0) {
    return (
      <div className="glass-card p-8 text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-momentum-dark/40 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-400 mb-2">
          Aucun objectif pour aujourd'hui
        </h3>
        <p className="text-sm text-gray-500">
          Tous les objectifs avec deadline aujourd'hui apparaîtront ici
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 mb-6 border-l-4 border-momentum-accent">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-momentum-accent to-momentum-light-2 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-momentum-light-2">
            Focus du jour
          </h2>
          <p className="text-sm text-gray-400">
            Finaliser specs module Goals Momentum
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            {completed}/{total} objectifs complétés
          </span>
          <span className="text-2xl font-bold text-momentum-light-2">
            {progress}%
          </span>
        </div>
        <div className="h-3 bg-momentum-dark/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-momentum-accent to-momentum-light-2"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {allItems.map((item) => {
          const isCompleted = item.completed || item.progress_percent >= 100
          const isGoal = item.itemType === 'goal'
          
          return (
            <div
              key={item._id}
              className={`
                flex items-start gap-3 p-4 rounded-xl transition-all
                ${isCompleted
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-momentum-dark/40 border border-momentum-light-1/10 hover:border-momentum-light-1/20'
                }
              `}
            >
              {/* Checkbox/Icon */}
              <button
                onClick={() => handleToggleGoal(item)}
                className="mt-0.5 flex-shrink-0"
              >
                {getItemIcon(item)}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className={`
                  font-medium mb-1
                  ${isCompleted 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-200'
                  }
                `}>
                  {item.title}
                </h4>

                {/* Numeric progress */}
                {isGoal && item.type === 'numeric' && (
                  <div className="flex items-baseline gap-2 text-sm">
                    <span className={isCompleted ? 'text-green-400' : 'text-momentum-light-2'}>
                      {item.current_value.toLocaleString()}
                    </span>
                    <span className="text-gray-500">/</span>
                    <span className="text-gray-400">
                      {item.target_value.toLocaleString()} {item.unit}
                    </span>
                  </div>
                )}

                {/* Task link */}
                {!isGoal && item.linked_project && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span>Voir dans Kanban</span>
                  </div>
                )}
              </div>

              {/* Completion indicator */}
              {isCompleted && (
                <div className="flex items-center gap-1 text-xs text-green-400 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Complété</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FocusOfTheDay