/* eslint-disable no-unused-vars */
/**
 * GoalCard - Design EXACT du wireframe
 * 
 * Supporte 2 contextes :
 * 1. Goals Hiérarchiques (Annual/Q/M/W/D)
 * 2. Goals Personnels (dans PersonalGoals)
 * 
 * WIREFRAME SPECS:
 * - Emoji + Titre + Catégorie/Contexte
 * - Progress bar + Status badge (hiérarchiques) OU Progress numérique (personnels)
 * - Grid 2 colonnes (Par mois + Deadline) pour Annual
 * - Jours restants pour Annual
 * - Pas de bouton menu "⋯" (sera ajouté plus tard si besoin)
 */

function GoalCard({ goal, level, context = 'hierarchical' }) {
  // ==========================================
  // HELPERS
  // ==========================================
  
  const getCategoryLabel = (category) => {
    const labels = {
      financial: 'Financier',
      professional: 'Professionnel',
      learning: 'Apprentissage',
      personal: 'Personnel',
      health: 'Santé'
    }
    return labels[category] || 'Autre'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'on-track': 'On Track',
      'at-risk': 'At Risk',
      'behind': 'Behind',
      'completed': 'Completed'
    }
    return labels[status] || 'Not Started'
  }

  const getStatusColor = (status) => {
    const colors = {
      'on-track': 'from-green-500 to-emerald-500',
      'at-risk': 'from-yellow-500 to-orange-500',
      'behind': 'from-red-500 to-pink-500',
      'completed': 'from-blue-500 to-cyan-500'
    }
    return colors[status] || 'from-gray-500 to-gray-600'
  }

  const formatNumber = (num) => {
    if (num == null || num === undefined) return '0'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toLocaleString()
  }

  // ==========================================
  // CALCULS SPÉCIFIQUES
  // ==========================================

  // Calcul Par mois (Annual uniquement)
  const getMonthlyAmount = () => {
    if (level !== 'annual' || !goal.deadline || !goal.target_value) return null
    const now = new Date()
    const deadline = new Date(goal.deadline)
    const monthsRemaining = Math.max(1, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24 * 30)))
    const remaining = goal.target_value - (goal.current_value || 0)
    return Math.ceil(remaining / monthsRemaining)
  }

  // Calcul Par jour (Annual uniquement)
  const getDailyAmount = () => {
    if (level !== 'annual' || !goal.deadline || !goal.target_value) return null
    const now = new Date()
    const deadline = new Date(goal.deadline)
    const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))
    if (daysRemaining <= 0) return 0
    const remaining = goal.target_value - (goal.current_value || 0)
    return Math.ceil(remaining / daysRemaining)
  }

  // Jours restants (Annual uniquement)
  const getDaysRemaining = () => {
    if (level !== 'annual' || !goal.deadline) return null
    const now = new Date()
    const deadline = new Date(goal.deadline)
    const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))
    return daysRemaining > 0 ? daysRemaining : 0
  }

  // Contexte hiérarchique (Quarterly, Monthly, Weekly, Daily)
  const getHierarchyContext = () => {
    if (!goal.parent_annual_target || level === 'annual') return null

    const getMonthName = (month) => {
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
      return months[month - 1] || 'N/A'
    }

    const contexts = {
      quarterly: `Q${goal.quarter} - 25% de ${formatNumber(goal.parent_annual_target)} ${goal.unit || ''} annuel`,
      monthly: `${getMonthName(goal.month)} - ${(100/12).toFixed(0)}% de ${formatNumber(goal.parent_annual_target)} ${goal.unit || ''} annuel`,
      weekly: `Semaine ${goal.week} - ~${(100/52).toFixed(1)}% de ${formatNumber(goal.parent_annual_target)} ${goal.unit || ''} annuel`,
      daily: `Jour ${goal.day_of_year} - ~${(100/365).toFixed(1)}% de ${formatNumber(goal.parent_annual_target)} ${goal.unit || ''} annuel`
    }

    return contexts[level]
  }

  const monthlyAmount = getMonthlyAmount()
  const dailyAmount = getDailyAmount()
  const daysRemaining = getDaysRemaining()
  const hierarchyContext = getHierarchyContext()

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="bg-[rgba(0,29,57,0.3)] backdrop-blur-sm border border-[rgba(110,162,179,0.15)] rounded-2xl p-6 mb-4 hover:border-[rgba(123,189,232,0.3)] transition-all">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex-1">
          {/* Emoji + Titre */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{goal.icon || '🎯'}</span>
            <h3 className="text-lg font-semibold text-gray-200">
              {goal.title}
            </h3>
          </div>

          {/* Catégorie OU Contexte hiérarchique */}
          {level === 'annual' ? (
            <div className="text-[13px] text-[#8BA3B8] mt-1">
              {getCategoryLabel(goal.category)}
            </div>
          ) : hierarchyContext ? (
            <div className="text-[13px] text-[#8BA3B8] mt-1">
              {hierarchyContext}
            </div>
          ) : (
            <div className="text-[13px] text-[#8BA3B8] mt-1">
              {getCategoryLabel(goal.category)}
            </div>
          )}
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="my-4">
        {/* Barre */}
        <div className="h-3 bg-[rgba(78,142,162,0.2)] rounded-md overflow-hidden mb-2">
          <div
            className={`h-full rounded-md transition-all duration-500 bg-gradient-to-r ${getStatusColor(goal.status)}`}
            style={{ width: `${Math.min(goal.progress_percent || 0, 100)}%` }}
          />
        </div>

        {/* Valeurs + Status Badge */}
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-gray-300">
            {formatNumber(goal.current_value)} {goal.unit} / {formatNumber(goal.target_value)} {goal.unit}
          </span>
          <span className={`
            px-3 py-1 rounded-xl text-[11px] font-semibold
            ${goal.status === 'on-track' ? 'bg-[rgba(16,185,129,0.15)] text-[#10B981] border border-[rgba(16,185,129,0.3)]' : ''}
            ${goal.status === 'at-risk' ? 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)]' : ''}
            ${goal.status === 'behind' ? 'bg-[rgba(239,68,68,0.15)] text-[#EF4444] border border-[rgba(239,68,68,0.3)]' : ''}
            ${goal.status === 'completed' ? 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6] border border-[rgba(59,130,246,0.3)]' : ''}
          `}>
            {getStatusLabel(goal.status)}
          </span>
        </div>
      </div>

      {/* GRID 2 COLONNES (Annual uniquement) */}
      {level === 'annual' && (monthlyAmount !== null || dailyAmount !== null) && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* Par mois OU Par jour */}
          {monthlyAmount !== null && (
            <div>
              <div className="text-[11px] text-[#8BA3B8] mb-1">Par mois</div>
              <div className="text-lg font-semibold text-[#7BBDE8]">
                {formatNumber(monthlyAmount)} {goal.unit}
              </div>
            </div>
          )}

          {dailyAmount !== null && !monthlyAmount && (
            <div>
              <div className="text-[11px] text-[#8BA3B8] mb-1">Par jour</div>
              <div className="text-lg font-semibold text-[#7BBDE8]">
                ~{dailyAmount} {goal.unit}
              </div>
            </div>
          )}

          {/* Deadline */}
          {goal.deadline && (
            <div>
              <div className="text-[11px] text-[#8BA3B8] mb-1">Deadline</div>
              <div className="text-[14px] font-semibold text-gray-200">
                {new Date(goal.deadline).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DEADLINE INLINE (Quarterly, Monthly uniquement) */}
      {(level === 'quarterly' || level === 'monthly') && goal.deadline && (
        <div className="mt-3 text-xs text-[#8BA3B8]">
          📅 Deadline: {new Date(goal.deadline).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      )}

      {/* JOURS RESTANTS (Annual uniquement) */}
      {level === 'annual' && daysRemaining !== null && (
        <div className="mt-3 text-xs text-[#8BA3B8] flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
        </div>
      )}

      {/* BADGE COMMITS TRACKER (si connecté) */}
      {goal.commits_integration?.enabled && (
        <div className="mt-3 px-3 py-2 bg-[rgba(123,189,232,0.1)] rounded-lg text-xs text-[#8BA3B8]">
          💡 Connecté avec Commits Tracker
        </div>
      )}
    </div>
  )
}

export default GoalCard