/**
 * DateNavigator - Design EXACT du wireframe (AVEC ICÔNES SVG)
 * 
 * WIREFRAME SPECS (observé dans Images 4 et 6):
 * - 3 éléments: Flèche gauche + Texte + Flèche droite
 * - Format Monthly: "Janvier 2026"
 * - Format Daily: "Samedi 3 Janvier 2026"
 * - Boutons: background dark + border
 * - Texte: centré, grand, blanc
 */

function DateNavigator({ currentDate, onDateChange, displayFormat = 'month' }) {
  // Parser la date
  const date = new Date(currentDate)
  
  // Formater selon le type
  const getDisplayText = () => {
    if (displayFormat === 'month') {
      const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ]
      return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
    } else {
      // Daily format
      const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
      const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ]
      return `${dayNames[date.getDay()]} ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
    }
  }

  // Gérer la navigation
  const handlePrevious = () => {
    const newDate = new Date(date)
    if (displayFormat === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    onDateChange(newDate.toISOString().split('T')[0])
  }

  const handleNext = () => {
    const newDate = new Date(date)
    if (displayFormat === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    onDateChange(newDate.toISOString().split('T')[0])
  }

  return (
    <div className="mb-6 flex items-center justify-center gap-4">
      {/* Bouton Précédent */}
      <button
        onClick={handlePrevious}
        className="p-3 rounded-xl transition-all"
        style={{
          background: 'rgba(0, 29, 57, 0.3)',
          border: '1px solid rgba(110, 162, 179, 0.15)',
          color: '#8BA3B8'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 29, 57, 0.5)'
          e.currentTarget.style.color = '#7BBDE8'
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

      {/* Texte central */}
      <div 
        className="flex-1 max-w-md text-center px-4 py-3 rounded-xl"
        style={{
          background: 'rgba(0, 29, 57, 0.3)',
          border: '1px solid rgba(110, 162, 179, 0.15)'
        }}
      >
        <h3 
          className="text-2xl font-bold"
          style={{ color: '#E8F1F5' }}
        >
          {getDisplayText()}
        </h3>
      </div>

      {/* Bouton Suivant */}
      <button
        onClick={handleNext}
        className="p-3 rounded-xl transition-all"
        style={{
          background: 'rgba(0, 29, 57, 0.3)',
          border: '1px solid rgba(110, 162, 179, 0.15)',
          color: '#8BA3B8'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 29, 57, 0.5)'
          e.currentTarget.style.color = '#7BBDE8'
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

export default DateNavigator