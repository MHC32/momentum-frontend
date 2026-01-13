/**
 * WeekSelector - Design EXACT du wireframe (AVEC ICÔNES SVG)
 * 
 * WIREFRAME SPECS (observé dans Image 5):
 * - 3 éléments: Flèche gauche + Info semaine + Flèche droite
 * - Format: "Semaine 1/52 - 30 Déc 2024 au 5 Jan 2025"
 * - Boutons: background dark + border
 * - Texte: centré, grand, blanc
 * - Icône: Calendar dans le texte
 */

function WeekSelector({ currentWeek, onWeekChange, year = 2026 }) {
  const totalWeeks = 52

  // Calculer les dates de la semaine
  const getWeekDates = (week, year) => {
    const firstDayOfYear = new Date(year, 0, 1)
    const daysOffset = (week - 1) * 7
    
    const weekStart = new Date(firstDayOfYear)
    weekStart.setDate(firstDayOfYear.getDate() + daysOffset)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    return { start: weekStart, end: weekEnd }
  }

  const { start, end } = getWeekDates(currentWeek, year)

  // Formater les dates
  const formatDate = (date) => {
    const day = date.getDate()
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
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
      {/* Bouton Précédent */}
      <button
        onClick={handlePrevious}
        disabled={currentWeek === 1}
        className="p-3 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: 'rgba(0, 29, 57, 0.3)',
          border: '1px solid rgba(110, 162, 179, 0.15)',
          color: '#8BA3B8'
        }}
        onMouseEnter={(e) => {
          if (currentWeek > 1) {
            e.currentTarget.style.background = 'rgba(0, 29, 57, 0.5)'
            e.currentTarget.style.color = '#7BBDE8'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 29, 57, 0.3)'
          e.currentTarget.style.color = '#8BA3B8'
        }}
      >
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
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      </button>

      {/* Info Semaine */}
      <div 
        className="flex-1 max-w-2xl px-6 py-4 rounded-xl"
        style={{
          background: 'rgba(0, 29, 57, 0.3)',
          border: '1px solid rgba(110, 162, 179, 0.15)'
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: '#7BBDE8' }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <h3 
            className="text-2xl font-bold"
            style={{ color: '#7BBDE8' }}
          >
            Semaine {currentWeek}/{totalWeeks}
          </h3>
        </div>
        <p 
          className="text-sm text-center"
          style={{ color: '#8BA3B8' }}
        >
          {formatDate(start)} au {formatDate(end)}
        </p>
      </div>

      {/* Bouton Suivant */}
      <button
        onClick={handleNext}
        disabled={currentWeek === totalWeeks}
        className="p-3 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: 'rgba(0, 29, 57, 0.3)',
          border: '1px solid rgba(110, 162, 179, 0.15)',
          color: '#8BA3B8'
        }}
        onMouseEnter={(e) => {
          if (currentWeek < totalWeeks) {
            e.currentTarget.style.background = 'rgba(0, 29, 57, 0.5)'
            e.currentTarget.style.color = '#7BBDE8'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 29, 57, 0.3)'
          e.currentTarget.style.color = '#8BA3B8'
        }}
      >
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
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </button>
    </div>
  )
}

export default WeekSelector