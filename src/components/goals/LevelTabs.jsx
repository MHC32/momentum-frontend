/**
 * LevelTabs - Design EXACT du wireframe (AVEC ICÔNES SVG)
 * 
 * CORRECTION: Utilisation d'icônes SVG au lieu d'emojis
 * 
 * WIREFRAME SPECS:
 * - 5 tabs: Annual, Quarterly, Monthly, Weekly, Daily
 * - Tab actif: background bleu clair (gradient)
 * - Tab inactif: background dark + border muted
 * - Layout: flex gap-2 (8px)
 * - Icônes SVG: Calendar, Chart, Calendar, Calendar, Sun
 */

function LevelTabs({ currentLevel, onLevelChange }) {
  const levels = [
    { 
      value: 'annual', 
      label: 'Annuel',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    { 
      value: 'quarterly', 
      label: 'Trimestriel',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    { 
      value: 'monthly', 
      label: 'Mensuel',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    { 
      value: 'weekly', 
      label: 'Hebdo',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    { 
      value: 'daily', 
      label: 'Quotidien',
      icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
    }
  ]

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex gap-2 pb-2 min-w-max">
        {levels.map((level) => {
          const isActive = currentLevel === level.value
          
          return (
            <button
              key={level.value}
              onClick={() => onLevelChange(level.value)}
              className="px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2"
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, #7BBDE8, #4E8EA2)',
                      color: '#001D39',
                      border: 'none'
                    }
                  : {
                      background: 'rgba(0, 29, 57, 0.3)',
                      color: '#8BA3B8',
                      border: '1px solid rgba(110, 162, 179, 0.15)'
                    }
              }
            >
              {/* Icône SVG */}
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d={level.icon} 
                />
              </svg>
              <span className="text-sm">{level.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default LevelTabs