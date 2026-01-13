/**
 * DailyBreakdownGrid - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS (observé dans Image 5):
 * - Grid 7 colonnes (Lun-Dim)
 * - 3 états visuels différents:
 *   1. Complété: background vert transparent, valeur verte
 *   2. Aujourd'hui: border bleu épais 2px, background bleu très transparent
 *   3. Futur: background gris foncé, valeur "-", opacity réduite
 * - Gap: 8px entre les jours
 * - Padding: 12px par jour
 * - Border-radius: 12px
 * - Label: 11px, gris
 * - Valeur complétée: 20px, vert, 700
 * - Valeur aujourd'hui: 20px, normal
 * - Valeur futur: gris, opacity 0.5
 */

function DailyBreakdownGrid({ days }) {
  return (
    <div 
      className="grid gap-2"
      style={{
        gridTemplateColumns: 'repeat(7, 1fr)'
      }}
    >
      {days.map((day, index) => {
        // Déterminer le style selon l'état
        let cardStyle = {}
        let labelStyle = {}
        let valueStyle = {}

        if (day.isCompleted) {
          // État 1: Complété (Lun, Mar)
          cardStyle = {
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }
          labelStyle = {
            color: '#10B981'
          }
          valueStyle = {
            color: '#10B981',
            fontWeight: 700,
            fontSize: '20px'
          }
        } else if (day.isToday) {
          // État 2: Aujourd'hui (Mer)
          cardStyle = {
            background: 'rgba(123, 189, 232, 0.08)',
            border: '2px solid #7BBDE8'
          }
          labelStyle = {
            color: '#7BBDE8',
            fontWeight: 600
          }
          valueStyle = {
            color: '#E8F1F5',
            fontWeight: 600,
            fontSize: '20px'
          }
        } else {
          // État 3: Futur (Jeu-Dim)
          cardStyle = {
            background: 'rgba(15, 20, 25, 0.5)',
            border: '1px solid rgba(110, 162, 179, 0.1)',
            opacity: 0.6
          }
          labelStyle = {
            color: '#8BA3B8'
          }
          valueStyle = {
            color: '#8BA3B8',
            fontSize: '20px'
          }
        }

        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-3 rounded-xl transition-all"
            style={cardStyle}
          >
            {/* Label jour */}
            <div 
              className="text-xs mb-2"
              style={labelStyle}
            >
              {day.day}
            </div>
            
            {/* Valeur */}
            <div 
              className="font-bold"
              style={valueStyle}
            >
              {day.value !== null ? day.value : '-'}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DailyBreakdownGrid