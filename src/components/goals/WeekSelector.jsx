/**
 * COMMIT: feat(goals): Add WeekSelector component for weekly navigation
 * 
 * Ajoute le composant WeekSelector avec flèches de navigation et affichage de la période
 */

function WeekSelector({ currentWeek, onWeekChange, year }) {
  // Calculer les dates de la semaine
  const getWeekDates = (week, year) => {
    const firstDayOfYear = new Date(year, 0, 1)
    const daysOffset = (week - 1) * 7
    const weekStart = new Date(firstDayOfYear)
    weekStart.setDate(firstDayOfYear.getDate() + daysOffset)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    return {
      start: weekStart,
      end: weekEnd
    }
  }

  const weekDates = getWeekDates(currentWeek, year)
  const totalWeeks = 52

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    })
  }

  const handlePrevious = () => {
    if (currentWeek > 1) {
      onWeekChange(currentWeek - 1)
    }
  }

  const handleNext = () => {
    if (currentWeek < totalWeeks) {
      onWeekChange(currentWeek + 1)
    }
  }

  return (
    <div className="mb-6 flex items-center justify-center gap-4">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentWeek === 1}
        className="p-3 rounded-xl bg-momentum-dark/40 border border-momentum-light-1/10 hover:bg-momentum-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
      >
        <svg 
          className="w-5 h-5 text-gray-400 group-hover:text-momentum-light-2 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Week Info */}
      <div className="flex-1 max-w-md glass-card p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg className="w-5 h-5 text-momentum-light-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-2xl font-bold text-momentum-light-2">
            Semaine {currentWeek}/{totalWeeks}
          </h3>
        </div>
        <p className="text-sm text-gray-400">
          {formatDate(weekDates.start)} au {formatDate(weekDates.end)}
        </p>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentWeek === totalWeeks}
        className="p-3 rounded-xl bg-momentum-dark/40 border border-momentum-light-1/10 hover:bg-momentum-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
      >
        <svg 
          className="w-5 h-5 text-gray-400 group-hover:text-momentum-light-2 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default WeekSelector