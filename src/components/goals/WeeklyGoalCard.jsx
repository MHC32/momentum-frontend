/**
 * WeeklyGoalCard - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS (observé dans Image 5):
 * - Titre: "83 commits GitHub" (total de la semaine)
 * - Counter: "21/83" (actuel/total)
 * - Grid 7 jours avec valeurs réelles
 * - Icône adaptée au type
 */

import DailyBreakdownGrid from './DailyBreakdownGrid'
import MenuButton from './MenuButton'

function WeeklyGoalCard({ goal, onMenuClick }) {
  // Sélectionner l'icône selon le type d'objectif
  const getIconPath = (unit) => {
    const icons = {
      'commits': 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', // Professional
      '€': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // Financial
      'EUR': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // Financial
      'default': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' // Chart
    };
    return icons[unit] || icons.default;
  };

  const iconPath = getIconPath(goal.unit);

  // 🆕 Formater le titre de manière plus intelligente
  const formatTitle = () => {
    // Si le titre est déjà bon, le garder
    if (goal.title && goal.title.includes(goal.unit)) {
      return goal.title;
    }
    
    // Sinon, créer un titre basé sur les données
    const { weekTarget, unit } = goal;
    
    if (unit === 'commits') {
      return `${weekTarget} commits GitHub`;
    } else if (unit === '€') {
      return `${weekTarget.toLocaleString()} €`;
    } else {
      return `${weekTarget} ${unit}`;
    }
  };

  // 🆕 Formater les nombres
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const displayTitle = formatTitle();
  const displayCurrent = formatNumber(goal.currentWeekValue || 0);
  const displayTarget = formatNumber(goal.weekTarget || 0);

  return (
    <div 
      className="p-6 rounded-2xl transition-all"
      style={{
        background: 'rgba(0, 29, 57, 0.3)',
        border: '1px solid rgba(110, 162, 179, 0.15)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '1px solid rgba(123, 189, 232, 0.3)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '1px solid rgba(110, 162, 179, 0.15)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Header avec Counter */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 flex-1">
          {/* Icône SVG adaptée au type */}
          <svg 
            className="w-6 h-6 flex-shrink-0"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: '#7BBDE8' }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d={iconPath} 
            />
          </svg>
          
          {/* Titre (ex: "83 commits GitHub") */}
          <h3 
            className="text-lg font-semibold"
            style={{ color: '#E8F1F5' }}
          >
            {displayTitle}
          </h3>
        </div>

        {/* Counter à droite (ex: "21/83") */}
        <div className="flex items-center gap-3">
          <div 
            className="text-xl font-bold"
            style={{ color: '#7BBDE8' }}
          >
            {displayCurrent}/{displayTarget}
          </div>
          <MenuButton onClick={() => onMenuClick && onMenuClick(goal._id || goal.id)} />
        </div>
      </div>

      {/* Grid 7 jours */}
      <DailyBreakdownGrid days={goal.dailyData || []} />
    </div>
  )
}
export default WeeklyGoalCard