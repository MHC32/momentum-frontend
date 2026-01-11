/**
 * COMMIT: feat(goals): Add WeeklyDailyBreakdown component for week view
 * 
 * Ajoute le composant qui affiche le breakdown quotidien des objectifs numériques
 * dans la vue hebdomadaire (Lun-Dim)
 */

function WeeklyDailyBreakdown({ goal, weekStart, weekEnd }) {
  // Jours de la semaine
  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  
  // Calculer la target quotidienne
  const dailyTarget = goal.target_value / 7
  
  // Générer les données pour chaque jour (simulation - devra venir du backend en réel)
  const dailyData = daysOfWeek.map((day, index) => {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + index)
    
    // Simulation de données (devra venir du backend)
    const achieved = Math.floor(Math.random() * dailyTarget * 1.5)
    const isToday = date.toDateString() === new Date().toDateString()
    const isPast = date < new Date()
    
    return {
      day,
      date,
      achieved,
      target: dailyTarget,
      percentage: Math.min((achieved / dailyTarget) * 100, 100),
      isToday,
      isPast
    }
  })

  return (
    <div className="mt-4 p-4 bg-momentum-dark/20 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-momentum-light-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h4 className="text-sm font-semibold text-gray-300">
          Breakdown quotidien
        </h4>
        <span className="text-xs text-gray-500 ml-auto">
          Target: {dailyTarget.toFixed(0)} {goal.unit}/jour
        </span>
      </div>

      {/* Daily Breakdown Grid */}
      <div className="grid grid-cols-7 gap-2">
        {dailyData.map((data, index) => {
          const isCompleted = data.achieved >= data.target
          const isBehind = data.isPast && !isCompleted
          
          return (
            <div
              key={index}
              className={`
                relative p-3 rounded-lg transition-all
                ${data.isToday
                  ? 'bg-momentum-light-2/20 border-2 border-momentum-light-2/50 shadow-lg'
                  : 'bg-momentum-dark/40 border border-momentum-light-1/10'
                }
                ${!data.isPast && !data.isToday ? 'opacity-50' : ''}
              `}
            >
              {/* Day Label */}
              <div className={`
                text-xs font-semibold mb-2 text-center
                ${data.isToday ? 'text-momentum-light-2' : 'text-gray-400'}
              `}>
                {data.day}
              </div>

              {/* Value */}
              <div className="text-center">
                <div className={`
                  text-lg font-bold mb-1
                  ${isCompleted 
                    ? 'text-green-400' 
                    : isBehind 
                    ? 'text-red-400' 
                    : data.isToday 
                    ? 'text-momentum-light-2' 
                    : 'text-gray-400'
                  }
                `}>
                  {data.isPast || data.isToday ? data.achieved : '-'}
                </div>
                
                {/* Progress Bar */}
                {(data.isPast || data.isToday) && (
                  <div className="w-full h-1.5 bg-momentum-dark/60 rounded-full overflow-hidden">
                    <div
                      className={`
                        h-full rounded-full transition-all
                        ${isCompleted
                          ? 'bg-green-500'
                          : isBehind
                          ? 'bg-red-500'
                          : 'bg-momentum-light-2'
                        }
                      `}
                      style={{ width: `${Math.min(data.percentage, 100)}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Status Icon */}
              {data.isPast && (
                <div className="absolute -top-1 -right-1">
                  {isCompleted ? (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>
              )}

              {/* Today Indicator */}
              {data.isToday && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-momentum-light-2 to-momentum-accent rounded-full" />
              )}
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-momentum-light-1/10 flex items-center justify-between text-xs">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">Complété</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-400">En retard</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-momentum-light-2 rounded-full"></div>
            <span className="text-gray-400">Aujourd'hui</span>
          </div>
        </div>
        <span className="text-gray-500">
          {dailyData.filter(d => d.achieved >= d.target && d.isPast).length}/7 jours réussis
        </span>
      </div>
    </div>
  )
}

export default WeeklyDailyBreakdown