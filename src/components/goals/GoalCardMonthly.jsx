/* eslint-disable no-unused-vars */
/**
 * GoalCardMonthly - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS (observé dans Images 4 et 8):
 * - Header: Icône + Titre + Menu
 * - Contexte avec flèche: "↑ 4000 commits annuels"
 * - Progress bar avec badge status
 * - Section "Tâches liées" avec badges cliquables
 * - PAS de grid 2 colonnes
 * - PAS de deadline
 * - PAS de jours restants
 */

import ProgressBar from './ProgressBar'
import MenuButton from './MenuButton'
import TaskBadge from './TaskBadge'

function GoalCardMonthly({ goal, onMenuClick, onTaskClick }) {
  // Icônes de catégorie
  const getCategoryIcon = (category) => {
    const icons = {
      financial: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      professional: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      learning: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      personal: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
      health: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
    }
    return icons[goal.category] || icons.professional
  }

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
            {/* Icône SVG */}
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
                d={getCategoryIcon(goal.category)} 
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
          
          {/* Contexte avec flèche ↑ */}
          <div 
            className="text-sm flex items-center gap-1"
            style={{ 
              color: '#8BA3B8',
              marginTop: '4px'
            }}
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 10l7-7m0 0l7 7m-7-7v18" 
              />
            </svg>
            <span>{goal.hierarchyContext}</span>
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

      {/* Tâches liées */}
      {goal.linkedTasks && goal.linkedTasks.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div 
            className="text-xs mb-2"
            style={{ color: '#8BA3B8' }}
          >
            Tâches liées:
          </div>
          <div className="flex flex-wrap gap-2">
            {goal.linkedTasks.map((task) => (
              <TaskBadge 
                key={task.id}
                task={task}
                onClick={onTaskClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalCardMonthly