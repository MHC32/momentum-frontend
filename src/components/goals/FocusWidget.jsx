/**
 * FocusWidget - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS (observé dans Image 6):
 * - Card avec gradient background
 * - Icône 🎯 (cible)
 * - Titre: "Focus du jour"
 * - Description du focus
 * - Stats row: "2/4 objectifs complétés" + "50%" (grand)
 * - Padding: 24px
 * - Border-radius: 16px
 * - Pas de menu button
 */

function FocusWidget({ focus }) {
  return (
    <div 
      className="p-6 rounded-2xl mb-6"
      style={{
        background: 'linear-gradient(135deg, rgba(78, 142, 162, 0.2), rgba(123, 189, 232, 0.15))',
        border: '1px solid rgba(123, 189, 232, 0.3)'
      }}
    >
      {/* Header avec icône */}
      <div className="flex items-center gap-3 mb-3">
        {/* Icône Target/Focus */}
        <svg 
          className="w-7 h-7"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{ color: '#7BBDE8' }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        
        {/* Titre */}
        <h3 
          className="text-xl font-bold"
          style={{ color: '#7BBDE8' }}
        >
          Focus du jour
        </h3>
      </div>

      {/* Description */}
      <p 
        className="text-base mb-4"
        style={{ 
          color: '#E8F1F5',
          lineHeight: '1.6'
        }}
      >
        {focus.description}
      </p>

      {/* Stats row */}
      <div className="flex items-center justify-between">
        {/* Texte stats */}
        <div 
          className="text-sm"
          style={{ color: '#8BA3B8' }}
        >
          {focus.completedCount}/{focus.totalCount} objectifs complétés
        </div>

        {/* Pourcentage grand */}
        <div 
          className="text-3xl font-bold"
          style={{ color: '#7BBDE8' }}
        >
          {focus.percentage}%
        </div>
      </div>
    </div>
  )
}

export default FocusWidget