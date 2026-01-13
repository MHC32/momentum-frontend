/* eslint-disable no-unused-vars */
/**
 * QuarterSelector - Design EXACT du wireframe (AVEC ICÔNES SVG)
 * 
 * WIREFRAME SPECS (observé dans Image 3):
 * - 4 boutons: Q1-Q4 avec période
 * - Actif: gradient bleu clair
 * - Inactif: background dark + border
 * - Layout: flex gap-2 (8px)
 * - Format: "Q1 (Jan-Mar)"
 * - Icône: Chart bars
 */

function QuarterSelector({ currentQuarter, onQuarterChange, year }) {
  const quarters = [
    { value: 1, label: 'Q1', period: 'Jan-Mar' },
    { value: 2, label: 'Q2', period: 'Avr-Juin' },
    { value: 3, label: 'Q3', period: 'Juil-Sep' },
    { value: 4, label: 'Q4', period: 'Oct-Déc' }
  ]

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
      {quarters.map((quarter) => {
        const isActive = currentQuarter === quarter.value
        
        return (
          <button
            key={quarter.value}
            onClick={() => onQuarterChange(quarter.value)}
            className="flex items-center gap-3 px-6 py-3 rounded-xl transition-all whitespace-nowrap"
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
            {/* Icône Chart Bars */}
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
            
            {/* Content */}
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold">
                {quarter.label}
              </span>
              <span 
                className="text-xs"
                style={{ 
                  color: isActive ? 'rgba(0, 29, 57, 0.7)' : '#8BA3B8' 
                }}
              >
                {quarter.period}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default QuarterSelector