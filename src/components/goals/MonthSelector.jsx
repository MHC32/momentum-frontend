/* eslint-disable no-unused-vars */
/**
 * COMMIT: feat(goals): Add MonthSelector component for monthly navigation
 * 
 * Ajoute le composant MonthSelector avec 12 boutons Jan-Déc pour la vue mensuelle
 */

function MonthSelector({ currentMonth, onMonthChange, year }) {
  const months = [
    { value: 1, label: 'Jan', fullName: 'Janvier' },
    { value: 2, label: 'Fév', fullName: 'Février' },
    { value: 3, label: 'Mar', fullName: 'Mars' },
    { value: 4, label: 'Avr', fullName: 'Avril' },
    { value: 5, label: 'Mai', fullName: 'Mai' },
    { value: 6, label: 'Juin', fullName: 'Juin' },
    { value: 7, label: 'Juil', fullName: 'Juillet' },
    { value: 8, label: 'Aoû', fullName: 'Août' },
    { value: 9, label: 'Sep', fullName: 'Septembre' },
    { value: 10, label: 'Oct', fullName: 'Octobre' },
    { value: 11, label: 'Nov', fullName: 'Novembre' },
    { value: 12, label: 'Déc', fullName: 'Décembre' }
  ]

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex gap-2 pb-2 min-w-max">
        {months.map((month) => {
          const isActive = currentMonth === month.value
          
          return (
            <button
              key={month.value}
              onClick={() => onMonthChange(month.value)}
              title={month.fullName}
              className={`
                group relative px-4 py-3 rounded-xl transition-all min-w-[70px]
                ${isActive
                  ? 'bg-gradient-to-br from-momentum-light-2/20 to-momentum-accent/20 border-2 border-momentum-light-2/50 shadow-lg'
                  : 'bg-momentum-dark/40 border border-momentum-light-1/10 hover:bg-momentum-accent/10 hover:border-momentum-light-1/20'
                }
              `}
            >
              {/* Icon Calendar */}
              <svg 
                className={`
                  w-5 h-5 mx-auto mb-1 transition-transform
                  ${isActive ? 'scale-110 text-momentum-light-2' : 'text-gray-400 group-hover:scale-105 group-hover:text-gray-300'}
                `}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              
              {/* Label */}
              <span className={`
                block text-sm font-semibold
                ${isActive 
                  ? 'text-momentum-light-2' 
                  : 'text-gray-400 group-hover:text-gray-300'
                }
              `}>
                {month.label}
              </span>
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-momentum-light-2 to-momentum-accent rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MonthSelector