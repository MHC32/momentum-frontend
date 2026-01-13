/**
 * WeeklyGoalCard - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS (observé dans Image 5):
 * - Header: Icône + Titre + Counter (21/83)
 * - Grid 7 jours avec 3 états visuels:
 *   1. Complété (Lun, Mar): background vert, valeur verte
 *   2. Aujourd'hui (Mer): border bleu épais, background bleu transparent
 *   3. Futur (Jeu-Dim): background gris foncé, valeur "-", opacity réduite
 * - PAS de progress bar classique
 * - PAS de status badge
 * - PAS de catégorie
 */

import DailyBreakdownGrid from './DailyBreakdownGrid'
import MenuButton from './MenuButton'

function WeeklyGoalCard({ goal, onMenuClick }) {
  // Icône Professional (pour commits GitHub)
  const professionalIcon = 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'

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
          {/* Icône SVG */}
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
              d={professionalIcon} 
            />
          </svg>
          
          {/* Titre */}
          <h3 
            className="text-lg font-semibold"
            style={{ color: '#E8F1F5' }}
          >
            {goal.title}
          </h3>
        </div>

        {/* Counter à droite */}
        <div className="flex items-center gap-3">
          <div 
            className="text-xl font-bold"
            style={{ color: '#7BBDE8' }}
          >
            {goal.currentWeekValue}/{goal.weekTarget}
          </div>
          <MenuButton onClick={onMenuClick} />
        </div>
      </div>

      {/* Grid 7 jours */}
      <DailyBreakdownGrid days={goal.dailyData} />
    </div>
  )
}

export default WeeklyGoalCard