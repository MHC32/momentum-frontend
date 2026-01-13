/**
 * MonthSelector - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS:
 * - 12 boutons Jan-Déc
 * - Active : gradient background + border + shadow
 * - Inactive : dark background + border muted
 * - Icon calendrier SVG
 * - Label mois (court)
 * - Active indicator (barre en bas)
 * - Scroll horizontal sur mobile
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
                  ? 'bg-gradient-to-br from-[rgba(123,189,232,0.2)] to-[rgba(78,142,162,0.2)] border-2 border-[rgba(123,189,232,0.5)] shadow-lg'
                  : 'bg-[rgba(0,29,57,0.4)] border border-[rgba(110,162,179,0.1)] hover:bg-[rgba(78,142,162,0.1)] hover:border-[rgba(110,162,179,0.2)]'
                }
              `}
            >
              {/* Icon Calendar */}
              <svg 
                className={`
                  w-5 h-5 mx-auto mb-1 transition-transform
                  ${isActive ? 'scale-110 text-[#7BBDE8]' : 'text-[#8BA3B8] group-hover:scale-105 group-hover:text-gray-300'}
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
                  ? 'text-[#7BBDE8]' 
                  : 'text-[#8BA3B8] group-hover:text-gray-300'
                }
              `}>
                {month.label}
              </span>
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-[#7BBDE8] to-[#4E8EA2] rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MonthSelector