/**
 * ProgressBar - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS (observé dans les images):
 * - Barre: height 12px, border-radius 6px
 * - Container: background rgba(78, 142, 162, 0.2)
 * - Fill: gradient success to light-2
 * - Texte dessous: "X / Y unit" + Badge
 * - Font-size: 13px
 * - Margin: 16px 0
 */

import StatusBadge from './StatusBadge'

function ProgressBar({ current, target, unit, progress, status }) {
  // Formater les nombres
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toLocaleString()
  }

  return (
    <div style={{ margin: '16px 0' }}>
      {/* Barre de progression */}
      <div 
        className="rounded-md overflow-hidden"
        style={{
          height: '12px',
          background: 'rgba(78, 142, 162, 0.2)',
          borderRadius: '6px'
        }}
      >
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${Math.min(progress, 100)}%`,
            background: 'linear-gradient(90deg, #10B981, #7BBDE8)',
            borderRadius: '6px'
          }}
        />
      </div>

      {/* Texte + Badge */}
      <div className="flex items-center justify-between mt-2">
        <span 
          className="text-sm"
          style={{ color: '#E8F1F5' }}
        >
          {formatNumber(current)} {unit} / {formatNumber(target)} {unit}
        </span>
        <StatusBadge status={status} />
      </div>
    </div>
  )
}

export default ProgressBar