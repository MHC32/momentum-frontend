/**
 * StatusBadge - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS (observé dans les images):
 * - Padding: 4px 12px
 * - Border-radius: 12px
 * - Font-size: 11px
 * - Font-weight: 600
 * - 4 statuts: on-track (vert), at-risk (orange), behind (rouge), completed (bleu)
 */

function StatusBadge({ status }) {
  const getStatusConfig = (status) => {
    const configs = {
      'on-track': {
        label: 'On Track',
        bg: 'rgba(16, 185, 129, 0.15)',
        color: '#10B981',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      },
      'at-risk': {
        label: 'At Risk',
        bg: 'rgba(245, 158, 11, 0.15)',
        color: '#F59E0B',
        border: '1px solid rgba(245, 158, 11, 0.3)'
      },
      'behind': {
        label: 'Behind',
        bg: 'rgba(239, 68, 68, 0.15)',
        color: '#EF4444',
        border: '1px solid rgba(239, 68, 68, 0.3)'
      },
      'completed': {
        label: 'Completed',
        bg: 'rgba(59, 130, 246, 0.15)',
        color: '#3B82F6',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }
    }

    return configs[status] || configs['on-track']
  }

  const config = getStatusConfig(status)

  return (
    <span
      className="inline-block px-3 py-1 font-semibold whitespace-nowrap"
      style={{
        fontSize: '11px',
        fontWeight: 600,
        background: config.bg,
        color: config.color,
        border: config.border,
        borderRadius: '12px'
      }}
    >
      {config.label}
    </span>
  )
}

export default StatusBadge