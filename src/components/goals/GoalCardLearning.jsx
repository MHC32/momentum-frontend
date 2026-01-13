/**
 * GoalCardLearning - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS (observé dans Images 1-2):
 * - Header: Icône + Titre + Catégorie + Menu
 * - Progress bar avec badge status
 * - Section "Livre actuel" avec titre et % complété
 * - PAS de grid 2 colonnes
 * - PAS de jours restants
 */

import ProgressBar from './ProgressBar'
import MenuButton from './MenuButton'

function GoalCardLearning({ goal, onMenuClick }) {
  // Icône Learning
  const learningIcon = 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'

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
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {/* Icône Book/Learning */}
            <svg 
              className="w-6 h-6"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: '#7BBDE8' }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d={learningIcon} 
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
          
          {/* Catégorie */}
          <div 
            className="text-sm"
            style={{ 
              color: '#8BA3B8',
              marginTop: '4px'
            }}
          >
            Apprentissage
          </div>
        </div>

        {/* Menu button */}
        <MenuButton onClick={onMenuClick} />
      </div>

      {/* Progress Bar */}
      <ProgressBar 
        current={goal.currentValue}
        target={goal.targetValue}
        unit={goal.unit}
        progress={goal.progress}
        status={goal.status}
      />

      {/* Section Livre actuel */}
      {goal.currentBook && (
        <div style={{ marginTop: '16px' }}>
          <div 
            className="text-xs mb-1"
            style={{ color: '#8BA3B8' }}
          >
            Livre actuel
          </div>
          <div 
            className="text-sm font-semibold"
            style={{ color: '#E8F1F5' }}
          >
            {goal.currentBook.title} ({goal.currentBook.progress}% complété)
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalCardLearning