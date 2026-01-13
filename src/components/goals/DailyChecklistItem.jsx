/**
 * DailyChecklistItem - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS (observé dans Images 6-7):
 * - 4 états distincts:
 *   1. Complété: ☑ + background vert + texte vert "Complété"
 *   2. En cours (link): ☐ + link bleu "📋 Voir dans Kanban"
 *   3. En cours (progress): ☐ + texte gris "1/3 complétés"
 *   4. Non commencé: ☐ + texte gris "Non commencé"
 * - Padding: 16px
 * - Border-radius: 12px
 * - Background varie selon l'état
 */

function DailyChecklistItem({ item, onToggle, onLinkClick }) {
  // Déterminer le style selon l'état
  let containerStyle = {}
  let checkboxColor = ''
  let statusContent = null

  if (item.isCompleted) {
    // État 1: Complété
    containerStyle = {
      background: 'rgba(16, 185, 129, 0.15)',
      border: '1px solid rgba(16, 185, 129, 0.2)'
    }
    checkboxColor = '#10B981'
    statusContent = (
      <span style={{ color: '#10B981', fontWeight: 600 }}>
        Complété
      </span>
    )
  } else if (item.kanbanLink) {
    // État 2: En cours avec link
    containerStyle = {
      background: 'rgba(0, 29, 57, 0.3)',
      border: '1px solid rgba(110, 162, 179, 0.15)'
    }
    checkboxColor = '#8BA3B8'
    statusContent = (
      <button
        onClick={() => onLinkClick && onLinkClick(item.id)}
        className="flex items-center gap-1 text-sm transition-all"
        style={{ color: '#7BBDE8' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#E8F1F5'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#7BBDE8'
        }}
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          />
        </svg>
        <span>Voir dans Kanban</span>
      </button>
    )
  } else if (item.progress) {
    // État 3: En cours avec progress
    containerStyle = {
      background: 'rgba(0, 29, 57, 0.3)',
      border: '1px solid rgba(110, 162, 179, 0.15)'
    }
    checkboxColor = '#8BA3B8'
    statusContent = (
      <span className="text-sm" style={{ color: '#8BA3B8' }}>
        {item.progress.current}/{item.progress.total} complétés
      </span>
    )
  } else {
    // État 4: Non commencé
    containerStyle = {
      background: 'rgba(0, 29, 57, 0.3)',
      border: '1px solid rgba(110, 162, 179, 0.15)'
    }
    checkboxColor = '#8BA3B8'
    statusContent = (
      <span className="text-sm" style={{ color: '#8BA3B8' }}>
        Non commencé
      </span>
    )
  }

  return (
    <div
      className="p-4 rounded-xl transition-all"
      style={containerStyle}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle && onToggle(item.id)}
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: '20px',
            height: '20px',
            marginTop: '2px'
          }}
        >
          {item.isCompleted ? (
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: checkboxColor }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="3" 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          ) : (
            <div 
              className="rounded"
              style={{
                width: '18px',
                height: '18px',
                border: `2px solid ${checkboxColor}`
              }}
            />
          )}
        </button>

        {/* Content */}
        <div className="flex-1">
          {/* Titre */}
          <div 
            className="font-semibold mb-1"
            style={{ 
              color: item.isCompleted ? '#10B981' : '#E8F1F5'
            }}
          >
            {item.title}
          </div>
          
          {/* Status */}
          {statusContent}
        </div>
      </div>
    </div>
  )
}

export default DailyChecklistItem