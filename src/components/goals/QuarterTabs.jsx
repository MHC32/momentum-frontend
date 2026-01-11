/* eslint-disable no-unused-vars */
/**
 * COMMIT: feat(goals): Add QuarterTabs component for quarterly navigation
 * 
 * Ajoute le composant QuarterTabs avec 4 onglets Q1-Q4 pour la vue trimestrielle
 */

function QuarterTabs({ currentQuarter, onQuarterChange, year }) {
  const quarters = [
    { value: 1, label: 'Q1', period: 'Jan-Mar', color: 'from-cyan-500 to-blue-500' },
    { value: 2, label: 'Q2', period: 'Avr-Juin', color: 'from-green-500 to-emerald-500' },
    { value: 3, label: 'Q3', period: 'Juil-Sep', color: 'from-orange-500 to-amber-500' },
    { value: 4, label: 'Q4', period: 'Oct-Déc', color: 'from-purple-500 to-pink-500' }
  ]

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex gap-3 pb-2 min-w-max">
        {quarters.map((quarter) => {
          const isActive = currentQuarter === quarter.value
          
          return (
            <button
              key={quarter.value}
              onClick={() => onQuarterChange(quarter.value)}
              className={`
                group relative flex items-center gap-3 px-6 py-4 rounded-xl transition-all min-w-[140px]
                ${isActive
                  ? `bg-gradient-to-br ${quarter.color}/20 border-2 border-${quarter.color.split('-')[1]}-500/50 shadow-lg`
                  : 'bg-momentum-dark/40 border border-momentum-light-1/10 hover:bg-momentum-accent/10 hover:border-momentum-light-1/20'
                }
              `}
            >
              {/* Icon */}
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center transition-all
                ${isActive 
                  ? `bg-gradient-to-br ${quarter.color}` 
                  : 'bg-momentum-dark/60 group-hover:bg-momentum-dark/80'
                }
              `}>
                <svg 
                  className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex flex-col items-start">
                <span className={`
                  text-lg font-bold
                  ${isActive 
                    ? 'text-momentum-light-2' 
                    : 'text-gray-400 group-hover:text-gray-300'
                  }
                `}>
                  {quarter.label}
                </span>
                <span className="text-xs text-gray-500">
                  {quarter.period}
                </span>
              </div>

              {/* Active Indicator */}
              {isActive && (
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r ${quarter.color} rounded-full`} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuarterTabs


