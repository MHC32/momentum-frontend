/**
 * GoalCardChecklist - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS (observé dans Images 1-2):
 * - Header: Icône + Titre + Catégorie + Menu
 * - PAS de progress bar classique
 * - PAS de status badge
 * - Liste de steps avec checkboxes
 * - Step complété: ✓ + background vert transparent
 * - Step non complété: ○ + background dark
 * - Sub-text pour steps non complétés (ex: "0/3 clients")
 */

import MenuButton from './MenuButton'

function GoalCardChecklist({ goal, onStepToggle, onMenuClick }) {
  // Icône Professional (pour carrière freelance)
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
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {/* Icône Professional */}
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
          
          {/* Catégorie */}
          <div 
            className="text-sm"
            style={{ 
              color: '#8BA3B8',
              marginTop: '4px'
            }}
          >
            Professionnel
          </div>
        </div>

        {/* Menu button */}
        <MenuButton onClick={onMenuClick} />
      </div>

      {/* Liste des steps */}
      <div className="space-y-2" style={{ marginTop: '16px' }}>
        {goal.steps.map((step) => (
          <div
            key={step.id}
            className="p-3 rounded-xl transition-all cursor-pointer"
            style={{
              background: step.completed 
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(15, 20, 25, 0.4)',
              border: step.completed
                ? '1px solid rgba(16, 185, 129, 0.2)'
                : '1px solid transparent'
            }}
            onClick={() => onStepToggle(step.id)}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox/Icon */}
              <div 
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: '20px',
                  height: '20px',
                  marginTop: '2px'
                }}
              >
                {step.completed ? (
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ color: '#10B981' }}
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="3" 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                ) : (
                  <div 
                    className="rounded-full"
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid #8BA3B8'
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div 
                  className="font-semibold"
                  style={{ 
                    color: step.completed ? '#10B981' : '#E8F1F5'
                  }}
                >
                  {step.title}
                </div>
                
                {/* Sub-text (pour steps non complétés) */}
                {!step.completed && step.subtitle && (
                  <div 
                    className="text-xs"
                    style={{ 
                      color: '#8BA3B8',
                      marginTop: '4px'
                    }}
                  >
                    {step.subtitle}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GoalCardChecklist