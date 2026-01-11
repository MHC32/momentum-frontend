/**
 * COMMIT: feat(goals): Create GoalCard V2 with hierarchical portions display
 * 
 * Crée le composant GoalCard adapté pour afficher :
 * - Vue annuelle : objectif annuel complet
 * - Vue trimestrielle : portion Q + indication "Q1 - 25% de annuel"
 * - Vue mensuelle/hebdo/daily : portions correspondantes
 */

function GoalCard({ goal, level }) {
  // Icônes de catégorie (SVG)
  const getCategoryIcon = (category) => {
    const icons = {
      financial: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      professional: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      learning: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      personal: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
      health: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
    }
    return icons[category] || icons.personal
  }

  // Couleur selon status
  const getStatusColor = (status) => {
    const colors = {
      'on-track': 'from-green-500 to-emerald-500',
      'at-risk': 'from-yellow-500 to-orange-500',
      'behind': 'from-red-500 to-pink-500',
      'completed': 'from-blue-500 to-cyan-500'
    }
    return colors[status] || 'from-gray-500 to-gray-600'
  }

  // Label du status
  const getStatusLabel = (status) => {
    const labels = {
      'on-track': 'On Track',
      'at-risk': 'At Risk',
      'behind': 'Behind',
      'completed': 'Completed'
    }
    return labels[status] || 'Not Started'
  }

  // Formater les nombres
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toLocaleString()
  }

  // Afficher le contexte hiérarchique (ex: "Q1 - 25% de 700k annuel")
  const getHierarchyContext = () => {
    if (!goal.parent_annual_id || level === 'annual') return null
    
    const contexts = {
      quarterly: `Q${goal.quarter} - 25% de ${formatNumber(goal.parent_annual_target)} ${goal.unit} annuel`,
      monthly: `${getMonthName(goal.month)} - ${(100/12).toFixed(0)}% de ${formatNumber(goal.parent_annual_target)} ${goal.unit} annuel`,
      weekly: `Semaine ${goal.week} - ~${(100/52).toFixed(1)}% de ${formatNumber(goal.parent_annual_target)} ${goal.unit} annuel`,
      daily: `Jour ${goal.day_of_year} - ~${(100/365).toFixed(1)}% de ${formatNumber(goal.parent_annual_target)} ${goal.unit} annuel`
    }
    
    return contexts[level]
  }

  const getMonthName = (month) => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    return months[month - 1] || 'N/A'
  }

  const hierarchyContext = getHierarchyContext()

  return (
    <div className="bg-momentum-dark/40 backdrop-blur-sm border border-momentum-light-1/10 rounded-xl p-6 hover:border-momentum-light-1/20 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Category Icon SVG */}
          <div className="w-10 h-10 bg-gradient-to-br from-momentum-light-2/20 to-momentum-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-momentum-light-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={getCategoryIcon(goal.category)} />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-200 group-hover:text-momentum-light-2 transition-colors truncate">
              {goal.title}
            </h3>
            {hierarchyContext && (
              <p className="text-xs text-gray-500 mt-1">
                {hierarchyContext}
              </p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className={`
          flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2
          bg-gradient-to-r ${getStatusColor(goal.status)} text-white
        `}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {goal.status === 'on-track' && (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            )}
            {goal.status === 'at-risk' && (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            )}
            {goal.status === 'behind' && (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            )}
            {goal.status === 'completed' && (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
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
          {goal.unit && (
            <span className="text-sm text-gray-500 ml-1">
              {goal.unit}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-momentum-light-1/10">
        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          {/* Auto-sync Badge */}
          {goal.commits_integration?.enabled && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Connecté avec Commits Tracker</span>
            </div>
          )}

          {/* High Priority Badge */}
          {goal.priority === 'high' && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Priorité haute</span>
            </div>
          )}
        </div>

        {/* Deadline */}
        {goal.deadline && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {goal.days_remaining !== undefined && goal.days_remaining > 0
                ? `${goal.days_remaining} jours restants`
                : new Date(goal.deadline).toLocaleDateString('fr-FR')
              }
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default GoalCard