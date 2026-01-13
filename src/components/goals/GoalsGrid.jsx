/**
 * GoalsGrid - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS (observé dans les images):
 * - Grid 2 colonnes: Annual, Quarterly, Monthly
 * - Grid 1 colonne: Weekly, Daily
 * - Gap: 16px entre les cards
 * - Responsive
 */

function GoalsGrid({ columns = 2, children, className = '' }) {
  return (
    <div 
      className={`grid gap-4 ${className}`}
      style={{
        gridTemplateColumns: columns === 2 ? 'repeat(2, 1fr)' : '1fr'
      }}
    >
      {children}
    </div>
  )
}

export default GoalsGrid