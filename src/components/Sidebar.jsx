/**
 * COMMIT: feat(sidebar): Make year dynamic in Goals menu items
 * 
 * Met à jour le Sidebar pour afficher "Objectifs YYYY" avec l'année dynamique
 */

import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  // Année dynamique
  const currentYear = new Date().getFullYear()

  const navItems = [
    {
      section: 'Principal',
      items: [
        { 
          name: 'Dashboard', 
          path: '/dashboard', 
          icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
        },
        { 
          name: 'Projets', 
          path: '/projects', 
          icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' 
        },
        { 
          name: `Objectifs ${currentYear}`, // 🎯 Année dynamique
          path: '/goals-2026', 
          icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' 
        },
        { 
          name: 'Objectifs Perso', 
          path: '/goals-perso', 
          icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' 
        }
      ]
    },
    
  ]

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-5 left-5 z-50 w-10 h-10 bg-momentum-dark/40 backdrop-blur-md border border-momentum-light-1/20 rounded-xl flex flex-col items-center justify-center gap-1"
      >
        <span className={`w-5 h-0.5 bg-momentum-light-2 transition-all ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`w-5 h-0.5 bg-momentum-light-2 transition-all ${mobileOpen ? 'opacity-0' : ''}`}></span>
        <span className={`w-5 h-0.5 bg-momentum-light-2 transition-all ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative top-0 left-0 h-screen w-64 
        bg-momentum-dark/40 backdrop-blur-xl border-r border-momentum-light-1/10
        p-6 flex flex-col gap-8 z-40 overflow-y-auto
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 px-3">
          <div className="w-10 h-10 bg-gradient-to-br from-momentum-light-2 to-momentum-accent rounded-xl flex items-center justify-center">
            <span className="text-xl font-bold text-momentum-dark">M</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-momentum-light-2 to-momentum-light-3 bg-clip-text text-transparent">
            Momentum
          </span>
        </Link>

        {/* Navigation Sections */}
        {navItems.map((section, idx) => (
          <nav key={idx} className="flex flex-col gap-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-3 mb-2">
              {section.section}
            </div>
            {section.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive(item.path)
                    ? 'bg-gradient-to-r from-momentum-light-2/15 to-momentum-accent/15 text-momentum-light-2 border border-momentum-light-2/30'
                    : 'text-gray-400 hover:bg-momentum-accent/10 hover:text-momentum-light-2'
                  }
                `}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        ))}

        {/* User Profile */}
        <div className="mt-auto">
          <div className="flex items-center gap-3 p-3 bg-momentum-accent/10 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-momentum-light-2 to-momentum-accent rounded-full flex items-center justify-center font-bold text-momentum-dark">
              {user?.name?.charAt(0) || 'M'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{user?.name}</div>
              <div className="text-xs text-gray-400">Développeur</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-3 px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar