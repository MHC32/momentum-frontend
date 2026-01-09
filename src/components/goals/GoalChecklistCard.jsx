function GoalChecklistCard({ goal, onStepToggle, onProgressUpdate, onMarkComplete }) {
  // Icône de catégorie
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'financial':
        return '💰';
      case 'professional':
        return '💼';
      case 'learning':
        return '📚';
      case 'personal':
        return '🎮';
      case 'health':
        return '🧺';
      default:
        return '🎯';
    }
  };

  // Couleur de la barre de progression selon le statut
  const getProgressColor = () => {
    if (goal.completed || goal.progress_percent >= 100) {
      return 'from-green-500 to-emerald-500';
    }
    if (goal.progress_percent >= 50) {
      return 'from-blue-500 to-cyan-500';
    }
    return 'from-orange-500 to-yellow-500';
  };

  // Rendu selon le type d'objectif
  const renderContent = () => {
    // Type 'steps' : Checklist avec étapes
    if (goal.type === 'steps') {
      return (
        <div className="space-y-3">
          {goal.steps?.map((step) => (
            <label
              key={step.id}
              className="flex items-start gap-3 p-3 bg-momentum-dark/40 border border-momentum-light-1/10 rounded-lg hover:border-momentum-light-1/20 transition-all cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={step.completed}
                onChange={() => onStepToggle(goal._id, step.id)}
                className="mt-1 w-5 h-5 rounded border-momentum-light-1/30 bg-momentum-dark/60 checked:bg-momentum-light-2 checked:border-momentum-light-2 focus:ring-2 focus:ring-momentum-light-2/50 cursor-pointer"
              />
              <div className="flex-1">
                <p className={`
                  font-medium transition-all
                  ${step.completed 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-300 group-hover:text-momentum-light-2'
                  }
                `}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
              {step.completed && (
                <span className="text-green-400">✓</span>
              )}
            </label>
          ))}
        </div>
      );
    }

    // Type 'numeric' : Progress bar avec boutons +/-
    if (goal.type === 'numeric') {
      return (
        <div className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progression</span>
              <span className="text-sm font-semibold text-momentum-light-2">
                {goal.progress_percent.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-momentum-dark/60 rounded-full overflow-hidden">
              <div
                className={`
                  h-full rounded-full transition-all duration-500
                  bg-gradient-to-r ${getProgressColor()}
                `}
                style={{ width: `${Math.min(goal.progress_percent, 100)}%` }}
              />
            </div>
          </div>

          {/* Values */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-momentum-light-2">
                {goal.current_value.toLocaleString()}
              </span>
              <span className="text-gray-500">/</span>
              <span className="text-xl text-gray-400">
                {goal.target_value.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                {goal.unit}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => onProgressUpdate(goal._id, -10)}
                className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                disabled={goal.current_value <= 0}
              >
                -10
              </button>
              <button
                onClick={() => onProgressUpdate(goal._id, 10)}
                className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/20 transition-all"
                disabled={goal.progress_percent >= 100}
              >
                +10
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Type 'simple' : Un seul bouton "Marquer comme terminé"
    if (goal.type === 'simple') {
      return (
        <div className="flex items-center justify-center py-6">
          <button
            onClick={() => onMarkComplete(goal._id)}
            disabled={goal.completed}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2
              ${goal.completed
                ? 'bg-green-500/10 border border-green-500/30 text-green-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-momentum-light-2 to-momentum-accent text-momentum-dark hover:shadow-lg'
              }
            `}
          >
            {goal.completed ? (
              <>
                <span>✓</span>
                <span>Terminé</span>
              </>
            ) : (
              <>
                <span>✓</span>
                <span>Marquer comme terminé</span>
              </>
            )}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`
      bg-momentum-dark/40 backdrop-blur-sm border rounded-xl p-6 transition-all
      ${goal.completed || goal.progress_percent >= 100
        ? 'border-green-500/30 bg-green-500/5'
        : 'border-momentum-light-1/10 hover:border-momentum-light-1/20'
      }
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{goal.icon || getCategoryIcon(goal.category)}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-200">
              {goal.title}
            </h3>
            {goal.description && (
              <p className="text-sm text-gray-500 mt-1">
                {goal.description}
              </p>
            )}
          </div>
        </div>

        {/* Completion Badge */}
        {(goal.completed || goal.progress_percent >= 100) && (
          <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-xs font-medium text-green-400">
            <span>✓</span>
            <span>Terminé</span>
          </div>
        )}
      </div>

      {/* Content selon le type */}
      {renderContent()}

      {/* Footer Info */}
      {goal.type === 'steps' && (
        <div className="mt-4 pt-4 border-t border-momentum-light-1/10 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            {goal.completed_steps || 0} / {goal.total_steps || 0} étapes complétées
          </span>
          <span className="font-semibold text-momentum-light-2">
            {goal.progress_percent.toFixed(0)}%
          </span>
        </div>
      )}

      {/* Completed At */}
      {goal.completed_at && (
        <div className="mt-4 pt-4 border-t border-momentum-light-1/10 text-xs text-gray-500">
          Terminé le {new Date(goal.completed_at).toLocaleDateString('fr-FR')}
        </div>
      )}
    </div>
  );
}

export default GoalChecklistCard;