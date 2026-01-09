function GoalCard({ goal }) {
  // Déterminer la couleur du status
  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track':
        return 'from-green-500 to-emerald-500';
      case 'at-risk':
        return 'from-yellow-500 to-orange-500';
      case 'behind':
        return 'from-red-500 to-pink-500';
      case 'completed':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Déterminer l'icône du status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'on-track':
        return '✅';
      case 'at-risk':
        return '⚠️';
      case 'behind':
        return '🔴';
      case 'completed':
        return '🎉';
      default:
        return '⏳';
    }
  };

  // Déterminer le label du status
  const getStatusLabel = (status) => {
    switch (status) {
      case 'on-track':
        return 'Sur la bonne voie';
      case 'at-risk':
        return 'À risque';
      case 'behind':
        return 'En retard';
      case 'completed':
        return 'Terminé';
      default:
        return 'En attente';
    }
  };

  // Formater les grands nombres
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className="bg-momentum-dark/40 backdrop-blur-sm border border-momentum-light-1/10 rounded-xl p-6 hover:border-momentum-light-1/20 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{goal.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-200 group-hover:text-momentum-light-2 transition-colors">
              {goal.title}
            </h3>
            {goal.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                {goal.description}
              </p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className={`
          flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
          bg-gradient-to-r ${getStatusColor(goal.status)} text-white
        `}>
          <span>{getStatusIcon(goal.status)}</span>
          <span>{getStatusLabel(goal.status)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progression</span>
          <span className="text-sm font-semibold text-momentum-light-2">
            {goal.progress_percent.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 bg-momentum-dark/60 rounded-full overflow-hidden">
          <div
            className={`
              h-full rounded-full transition-all duration-500
              bg-gradient-to-r ${getStatusColor(goal.status)}
            `}
            style={{ width: `${Math.min(goal.progress_percent, 100)}%` }}
          />
        </div>
      </div>

      {/* Values */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-momentum-light-2">
            {formatNumber(goal.current_value)}
          </span>
          <span className="text-gray-500">/</span>
          <span className="text-xl text-gray-400">
            {formatNumber(goal.target_value)}
          </span>
          <span className="text-sm text-gray-500 ml-1">
            {goal.unit}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-momentum-light-1/10">
        {/* Badges */}
        <div className="flex gap-2">
          {/* Commits Integration Badge */}
          {goal.commits_integration?.enabled && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>Auto-sync</span>
            </div>
          )}

          {/* Priority Badge */}
          {goal.priority === 'high' && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
              <span>⚡</span>
              <span>Priorité haute</span>
            </div>
          )}
        </div>

        {/* Deadline */}
        {goal.deadline && (
          <div className="text-xs text-gray-500">
            {new Date(goal.deadline).toLocaleDateString('fr-FR')}
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalCard;