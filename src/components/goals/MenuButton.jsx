/**
 * MenuButton - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS (observé dans les images):
 * - Icône: ⋯ (trois points verticaux)
 * - Taille: 24x24px
 * - Background: transparent
 * - Hover: background dark
 * - Color: gris muted
 * - Hover color: gris plus clair
 */

function MenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-1 rounded-lg transition-all"
      style={{
        background: 'transparent',
        color: '#8BA3B8'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(0, 29, 57, 0.5)'
        e.currentTarget.style.color = '#E8F1F5'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = '#8BA3B8'
      }}
    >
      <svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" 
        />
      </svg>
    </button>
  )
}

export default MenuButton