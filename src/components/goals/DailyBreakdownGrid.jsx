function DailyBreakdownGrid({ days }) {
  // S'assurer d'avoir exactement 7 jours
  const displayDays = [...Array(7)].map((_, index) => {
    if (days && days[index]) {
      return {
        ...days[index],
        day: days[index].day || ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index]
      };
    }
    return {
      day: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index],
      value: null,
      isCompleted: false,
      isToday: false
    };
  });

  return (
    <div 
      className="grid gap-2"
      style={{
        gridTemplateColumns: 'repeat(7, 1fr)'
      }}
    >
      {displayDays.map((day, index) => {
        // Déterminer le style selon l'état
        let cardStyle = {}
        let labelStyle = {}
        let valueStyle = {}

        // Jour futur sans valeur? (valeur = null)
        const isFuture = day.value === null;
        
        if (day.isCompleted && !isFuture) {
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
        } else if (day.isToday && !isFuture) {
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
        } else if (isFuture) {
          // État 3: Futur (Jeu-Dim) - sans valeur
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
        } else {
          // État 4: Passé non complété
          cardStyle = {
            background: 'rgba(0, 29, 57, 0.3)',
            border: '1px solid rgba(110, 162, 179, 0.15)'
          }
          labelStyle = {
            color: '#8BA3B8'
          }
          valueStyle = {
            color: '#E8F1F5',
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