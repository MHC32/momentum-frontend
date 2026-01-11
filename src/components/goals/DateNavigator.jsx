/**
 * COMMIT: feat(goals): Add DateNavigator component for daily navigation
 * 
 * Ajoute le composant DateNavigator avec flèches et affichage de la date formatée
 */

function DateNavigator({ currentDate, onDateChange }) {
  const date = new Date(currentDate)

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handlePrevious = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() - 1)
    onDateChange(newDate.toISOString().split('T')[0])
  }

  const handleNext = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() + 1)
    onDateChange(newDate.toISOString().split('T')[0])
  }

  const handleToday = () => {
    const today = new Date()
    onDateChange(today.toISOString().split('T')[0])
  }

  const isToday = () => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="mb-6 flex items-center justify-center gap-4">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        className="p-3 rounded-xl bg-momentum-dark/40 border border-momentum-light-1/10 hover:bg-momentum-accent/10 transition-all group"
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

      {/* Date Info */}
      <div className="flex-1 max-w-2xl glass-card p-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <svg className="w-6 h-6 text-momentum-light-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="text-2xl font-bold text-momentum-light-2 capitalize">
            {formatDate(date)}
          </h3>
        </div>
        
        {/* Today Button */}
        {!isToday() && (
          <button
            onClick={handleToday}
            className="text-xs text-momentum-accent hover:text-momentum-light-2 transition-colors flex items-center gap-1 mx-auto"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Aujourd'hui
          </button>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="p-3 rounded-xl bg-momentum-dark/40 border border-momentum-light-1/10 hover:bg-momentum-accent/10 transition-all group"
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

export default DateNavigator