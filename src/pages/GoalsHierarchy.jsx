/**
 * COMMIT: feat(goals): Create GoalsHierarchy V2 with complete hierarchical navigation
 * 
 * Refonte complète de GoalsHierarchy avec :
 * - LevelTabs (Annual/Quarterly/Monthly/Weekly/Daily)
 * - Navigation conditionnelle selon le niveau
 * - Appels aux nouveaux thunks Redux V2
 * - FocusOfTheDay pour vue daily
 */

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  getAnnualGoals,
  getQuarterlyGoals,
  getMonthlyGoals,
  getWeeklyGoals,
  getDailyGoals,
  setHierarchyLevel,
  setHierarchyQuarter,
  setHierarchyMonth,
  setHierarchyWeek,
  setHierarchyDate,
  setHierarchyCategory,
  clearMessages
} from '../redux/slices/goalSlice'
import { useSocket } from '../hooks/useSocket'
import Sidebar from '../components/Sidebar'
import LevelTabs from '../components/goals/LevelTabs'
import QuarterTabs from '../components/goals/QuarterTabs'
import MonthSelector from '../components/goals/MonthSelector'
import WeekSelector from '../components/goals/WeekSelector'
import DateNavigator from '../components/goals/DateNavigator'
import FocusOfTheDay from '../components/goals/FocusOfTheDay'
import WeeklyDailyBreakdown from '../components/goals/WeeklyDailyBreakdown'
import GoalCard from '../components/goals/GoalCard'
import GoalModal from '../components/GoalModal'

function GoalsHierarchy() {
  const dispatch = useDispatch()
  const { isConnected } = useSocket()
  const [showModal, setShowModal] = useState(false)
  
  const { 
    annualGoals,
    quarterlyGoals,
    monthlyGoals,
    weeklyGoals,
    dailyGoals,
    focusGoals,
    hierarchyFilters,
    viewMetadata,
    isLoading,
    error,
    successMessage
  } = useSelector((state) => state.goals)

  const currentLevel = hierarchyFilters.level

  // Charger les objectifs selon le niveau actif
  useEffect(() => {
    const filters = {
      year: hierarchyFilters.year,
      category: hierarchyFilters.category
    }

    switch (currentLevel) {
      case 'annual':
        dispatch(getAnnualGoals(filters))
        break
      case 'quarterly':
        dispatch(getQuarterlyGoals({ 
          quarter: hierarchyFilters.quarter || 1, 
          filters 
        }))
        break
      case 'monthly':
        dispatch(getMonthlyGoals({ 
          month: hierarchyFilters.month || 1, 
          filters 
        }))
        break
      case 'weekly':
        dispatch(getWeeklyGoals({ 
          week: hierarchyFilters.week || 1, 
          filters 
        }))
        break
      case 'daily':
        dispatch(getDailyGoals({ 
          ...filters,
          date: hierarchyFilters.date || new Date().toISOString().split('T')[0]
        }))
        break
      default:
        break
    }
  }, [
    dispatch, 
    currentLevel, 
    hierarchyFilters.year,
    hierarchyFilters.category,
    hierarchyFilters.quarter,
    hierarchyFilters.month,
    hierarchyFilters.week,
    hierarchyFilters.date
  ])

  // Clear messages après 3 secondes
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessages())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, error, dispatch])

  // Obtenir les goals du niveau actif
  const getCurrentGoals = () => {
    switch (currentLevel) {
      case 'annual': return annualGoals
      case 'quarterly': return quarterlyGoals
      case 'monthly': return monthlyGoals
      case 'weekly': return weeklyGoals
      case 'daily': return dailyGoals
      default: return []
    }
  }

  const currentGoals = Array.isArray(getCurrentGoals()) ? getCurrentGoals() : []

  // Catégories avec icônes SVG
  const categories = [
    { 
      value: null, 
      label: 'Tous', 
      color: 'from-blue-500 to-purple-500',
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
    },
    { 
      value: 'financial', 
      label: 'Financier', 
      color: 'from-green-500 to-emerald-500',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    { 
      value: 'professional', 
      label: 'Professionnel', 
      color: 'from-blue-500 to-cyan-500',
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    },
    { 
      value: 'learning', 
      label: 'Apprentissage', 
      color: 'from-purple-500 to-pink-500',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    },
    { 
      value: 'personal', 
      label: 'Personnel', 
      color: 'from-orange-500 to-red-500',
      icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
    },
    { 
      value: 'health', 
      label: 'Santé', 
      color: 'from-red-500 to-pink-500',
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
    }
  ]

  // Grouper par catégorie
  const goalsByCategory = currentGoals.reduce((acc, goal) => {
    const cat = goal.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(goal)
    return acc
  }, {})

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Mes Objectifs {hierarchyFilters.year}
            </h1>
            <p className="text-gray-400">
              Transforme tes rêves en actions concrètes
            </p>
            
            {/* Socket.IO status (dev only) */}
            {import.meta.env.DEV && (
              <div className="text-xs mt-2">
                {isConnected ? (
                  <span className="text-green-400">🟢 Socket connecté</span>
                ) : (
                  <span className="text-red-400">🔴 Socket déconnecté</span>
                )}
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="btn-primary"
          >
            + Nouvel objectif
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400">
            {successMessage}
          </div>
        )}

        {/* Level Tabs */}
        <LevelTabs 
          currentLevel={currentLevel}
          onLevelChange={(level) => dispatch(setHierarchyLevel(level))}
        />

        {/* Conditional Navigation */}
        {currentLevel === 'quarterly' && (
          <QuarterTabs
            currentQuarter={hierarchyFilters.quarter || 1}
            onQuarterChange={(q) => dispatch(setHierarchyQuarter(q))}
            year={hierarchyFilters.year}
          />
        )}

        {currentLevel === 'monthly' && (
          <MonthSelector
            currentMonth={hierarchyFilters.month || 1}
            onMonthChange={(m) => dispatch(setHierarchyMonth(m))}
            year={hierarchyFilters.year}
          />
        )}

        {currentLevel === 'weekly' && (
          <WeekSelector
            currentWeek={hierarchyFilters.week || 1}
            onWeekChange={(w) => dispatch(setHierarchyWeek(w))}
            year={hierarchyFilters.year}
          />
        )}

        {currentLevel === 'daily' && (
          <DateNavigator
            currentDate={hierarchyFilters.date || new Date().toISOString().split('T')[0]}
            onDateChange={(d) => dispatch(setHierarchyDate(d))}
          />
        )}

        {/* Focus du jour (vue daily uniquement) */}
        {currentLevel === 'daily' && (
          <FocusOfTheDay
            focusGoals={focusGoals}
            tasks={viewMetadata.daily?.tasks || []}
            focusMetadata={{
              completed: viewMetadata.daily?.focusCompleted || 0,
              total: viewMetadata.daily?.focusTotal || 0,
              progress: viewMetadata.daily?.focusProgress || 0
            }}
          />
        )}

        {/* Category Filters */}
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value || 'all'}
              onClick={() => dispatch(setHierarchyCategory(cat.value))}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all font-medium
                ${hierarchyFilters.category === cat.value
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : 'bg-momentum-dark/30 text-gray-300 hover:bg-momentum-dark/50 border border-momentum-light-1/20'
                }
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={cat.icon} />
              </svg>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-momentum-light-2"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && currentGoals.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-momentum-dark/40 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Aucun objectif pour ce niveau
            </h3>
            <p className="text-gray-500 mb-4">
              Créez votre premier objectif avec décomposition automatique
            </p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Créer un objectif
            </button>
          </div>
        )}

        {/* Goals Grid */}
        {!isLoading && currentGoals.length > 0 && (
          <div className="space-y-8">
            {Object.entries(goalsByCategory).map(([category, goals]) => {
              const categoryInfo = categories.find(c => c.value === category) || categories[0]
              
              return (
                <div key={category} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={categoryInfo.icon} />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold">
                      {categoryInfo.label}
                    </h2>
                    <span className="text-sm text-gray-500">
                      ({goals.length} objectif{goals.length > 1 ? 's' : ''})
                    </span>
                  </div>

                  {/* Goals Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map((goal) => (
                      <div key={goal._id}>
                        <GoalCard goal={goal} level={currentLevel} />
                        
                        {/* Weekly Daily Breakdown (vue weekly + objectif numérique) */}
                        {currentLevel === 'weekly' && goal.type === 'numeric' && (
                          <WeeklyDailyBreakdown 
                            goal={goal}
                            weekStart={viewMetadata.weekly?.weekStart}
                            weekEnd={viewMetadata.weekly?.weekEnd}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Goal Modal */}
      {showModal && (
        <GoalModal 
          onClose={() => setShowModal(false)}
          defaultView="hierarchy"
        />
      )}
    </div>
  )
}

export default GoalsHierarchy