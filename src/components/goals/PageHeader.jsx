/**
 * PageHeader - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS (observé dans les images):
 * - Titre: "Mes Objectifs 2026" (grand, 40px, font-weight 700)
 * - Sous-titre: "Transforme tes rêves en actions concrètes" (gris muted)
 * - Bouton: "+ Nouvel objectif" (top-right, gradient bleu)
 * - Layout: flex justify-between
 */

function PageHeader({ title, subtitle, buttonText, onButtonClick }) {
  return (
    <div className="flex justify-between items-start mb-8">
      {/* Left: Titre + Sous-titre */}
      <div>
        <h1 
          className="text-4xl font-bold mb-2"
          style={{ color: '#E8F1F5' }}
        >
          {title}
        </h1>
        <p 
          className="text-base"
          style={{ color: '#8BA3B8' }}
        >
          {subtitle}
        </p>
      </div>

      {/* Right: Bouton */}
      <button
        onClick={onButtonClick}
        className="px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg flex items-center gap-2"
        style={{
          background: 'linear-gradient(135deg, #7BBDE8, #4E8EA2)',
          color: '#001D39'
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
            d="M12 4v16m8-8H4" 
          />
        </svg>
        <span>{buttonText}</span>
      </button>
    </div>
  )
}

export default PageHeader