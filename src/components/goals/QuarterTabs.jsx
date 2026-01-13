/**
 * QuarterTabs - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS:
 * - 4 boutons Q1-Q4
 * - Active : gradient background selon quarter + border + shadow
 * - Inactive : dark background + border muted
 * - Icon + Label + Période
 * - Couleur unique par quarter
 * - Active indicator (barre en bas)
 */

function QuarterTabs({ currentQuarter, onQuarterChange, year }) {
  const quarters = [
    { 
      value: 1, 
      label: 'Q1', 
      period: 'Jan-Mar',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    { 
      value: 2, 
      label: 'Q2', 
      period: 'Avr-Juin',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    { 
      value: 3, 
      label: 'Q3', 
      period: 'Juil-Sep',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    { 
      value: 4, 
      label: 'Q4', 
      period: 'Oct-Déc',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    }
  ]

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
      {quarters.map((quarter) => {
        const isActive = currentQuarter === quarter.value
        
        return (
          <button
            key={quarter.value}
            onClick={() => onQuarterChange(quarter.value)}
            className={`
              group relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all whitespace-nowrap
              ${isActive
                ? 'bg-gradient-to-r from-[#7BBDE8] to-[#4E8EA2] text-[#001D39] shadow-lg'
                : 'bg-[rgba(0,29,57,0.4)] border border-[rgba(110,162,179,0.1)] text-[#8BA3B8] hover:bg-[rgba(78,142,162,0.1)] hover:border-[rgba(110,162,179,0.2)]'
              }
            `}
          >
            {/* Icon */}
            <svg 
              className={`w-5 h-5 ${isActive ? 'text-[#001D39]' : 'text-[#8BA3B8]'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={quarter.icon} />
            </svg>
            
            {/* Content */}
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold">
                {quarter.label}
              </span>
              <span className={`text-xs ${isActive ? 'text-[#001D39]/70' : 'text-[#8BA3B8]'}`}>
                {quarter.period}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default QuarterTabs