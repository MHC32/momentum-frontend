/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
/**
 * GoalsHierarchy - PAGE PRINCIPALE DES OBJECTIFS
 * 
 * 🆕 VERSION AVEC AGRÉGATION HEBDOMADAIRE:
 * - 1 carte par type d'objectif (commits, épargne, etc.)
 * - Données agrégées pour la semaine
 * - Compatible avec le wireframe "83 commits GitHub"
 */

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAnnualGoals,
  getQuarterlyGoals,
  getMonthlyGoals,
  getWeeklyGoals,
  getDailyGoals,
  updateProgress,
  completeStep,
  refreshWeeklyGoals // 🆕 Importé
} from '../redux/slices/goalSlice'

// Layout
import Sidebar from '../components/Sidebar'

// Components
import PageHeader from '../components/goals/PageHeader'
import LevelTabs from '../components/goals/LevelTabs'
import QuarterSelector from '../components/goals/QuarterSelector'
import DateNavigator from '../components/goals/DateNavigator'
import WeekSelector from '../components/goals/WeekSelector'
import GoalsGrid from '../components/goals/GoalsGrid'
import GoalCardAnnual from '../components/goals/GoalCardAnnual'
import GoalCardLearning from '../components/goals/GoalCardLearning'
import GoalCardChecklist from '../components/goals/GoalCardChecklist'
import GoalCardWithTracker from '../components/goals/GoalCardWithTracker'
import GoalCardQuarterly from '../components/goals/GoalCardQuarterly'
import GoalCardMonthly from '../components/goals/GoalCardMonthly'
import WeeklyGoalCard from '../components/goals/WeeklyGoalCard'
import FocusWidget from '../components/goals/FocusWidget'
import DailyChecklistItem from '../components/goals/DailyChecklistItem'

// Modal
import GoalModal from '../components/GoalModal'

function GoalsHierarchy() {
  const dispatch = useDispatch()
  
  // ==================== REDUX STATE ====================
  const {
    annualGoals,
    quarterlyGoals,
    monthlyGoals,
    weeklyGoals, // 🆕 Contient les objectifs AGRÉGÉS par type
    dailyGoals,
    focusGoals,
    viewMetadata,
    isLoading,
    isError,
    error
  } = useSelector((state) => state.goals)

  // ==================== LOCAL STATE ====================
  const [level, setLevel] = useState('annual')
  const [quarter, setQuarter] = useState(1)
  const [month, setMonth] = useState(1)
  const [week, setWeek] = useState(1)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [year] = useState(new Date().getFullYear())

  // 🆕 MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)

  // ==================== EFFECTS - FETCH DATA ====================
  
  useEffect(() => {
    console.log('🔄 Level changed to:', level)
    fetchGoalsForCurrentLevel()
  }, [level, quarter, month, week, date])

  const fetchGoalsForCurrentLevel = () => {
    const filters = { year, category: null }

    switch (level) {
      case 'annual':
        console.log('📡 Fetching annual goals...')
        dispatch(getAnnualGoals(filters))
        break

      case 'quarterly':
        console.log('📡 Fetching quarterly goals for Q' + quarter)
        dispatch(getQuarterlyGoals({ quarter, filters }))
        break

      case 'monthly':
        console.log('📡 Fetching monthly goals for month ' + month)
        dispatch(getMonthlyGoals({ month, filters }))
        break

      case 'weekly':
        console.log('📡 Fetching weekly goals for week ' + week)
        dispatch(refreshWeeklyGoals()) // 🆕 Réinitialiser avant de charger
        dispatch(getWeeklyGoals({ week, filters }))
        break

      case 'daily':
        console.log('📡 Fetching daily goals for date ' + date)
        dispatch(getDailyGoals({ ...filters, date }))
        break

      default:
        console.warn('Unknown level:', level)
    }
  }

  // ==================== DEBUG LOGS ====================
  useEffect(() => {
    // Log pour debugger les données weekly AGRÉGÉES
    if (level === 'weekly' && weeklyGoals.length > 0) {
      console.log('🔍 DEBUG Aggregated Weekly Goals:')
      weeklyGoals.forEach((goal, index) => {
        console.log(`Goal ${index + 1}: ${goal.title}`)
        console.log(`  Progress: ${goal.currentWeekValue || goal.current_value}/${goal.weekTarget || goal.target_value}`)
        if (goal.dailyData && goal.dailyData.length > 0) {
          console.log(`  Daily Data: ${goal.dailyData.map(d => `${d.day}:${d.value !== null ? d.value : '-'}`).join(', ')}`)
        }
      })
    }
  }, [weeklyGoals, level])

  // ==================== HANDLERS ====================

  const handleCreateGoal = () => {
    console.log('🆕 Opening create goal modal')
    setEditingGoal(null)
    setIsModalOpen(true)
  }

  const handleEditGoal = (goal) => {
    console.log('✏️ Opening edit goal modal for:', goal._id)
    setEditingGoal(goal)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingGoal(null)
    // Refresh current view
    fetchGoalsForCurrentLevel()
  }

  const handleMenuClick = (goalId) => {
    console.log('📋 Menu clicked for goal:', goalId)
    
    // Chercher dans tous les tableaux d'objectifs
    const allGoals = [
      ...annualGoals,
      ...quarterlyGoals,
      ...monthlyGoals,
      ...weeklyGoals,
      ...dailyGoals
    ]
    
    const goal = allGoals.find(g => g._id === goalId)
    
    if (goal) {
      handleEditGoal(goal)
    } else {
      console.warn('Goal not found for menu click:', goalId)
    }
  }

  const handleStepToggle = (goalId, stepId) => {
    console.log('✅ Toggle step:', stepId, 'in goal:', goalId)
    dispatch(completeStep({ goalId, stepId }))
  }

  const handleTaskClick = (taskId) => {
    console.log('📌 Task clicked:', taskId)
    // TODO: Ouvrir vue task ou Kanban
  }

  const handleDailyToggle = (goalId) => {
    console.log('✅ Toggle daily goal:', goalId)
    
    // Trouver le goal dans dailyGoals ou focusGoals
    const goal = [...dailyGoals, ...focusGoals].find(g => g._id === goalId)
    
    if (!goal) return

    // Si numeric, incrémenter la target value
    if (goal.type === 'numeric') {
      dispatch(updateProgress({
        goalId,
        progressData: { increment: goal.target_value }
      }))
    } 
    // Si simple, toggle completed
    else {
      // Toggle via update
      dispatch(updateProgress({
        goalId,
        progressData: { completed: !goal.completed }
      }))
    }
  }

  const handleKanbanClick = (goalId) => {
    console.log('📊 Open Kanban for goal:', goalId)
    // TODO: Naviguer vers Kanban avec filtre sur goal
  }

  const handleLevelChange = (newLevel) => {
    console.log('🔄 Changing level to:', newLevel)
    setLevel(newLevel)
  }

  const handleQuarterChange = (newQuarter) => {
    console.log('🔄 Changing quarter to:', newQuarter)
    setQuarter(newQuarter)
  }

  const handleDateChange = (newDate) => {
    console.log('🔄 Changing date to:', newDate)
    setDate(newDate)
    
    // Extraire le mois pour la vue monthly
    const dateObj = new Date(newDate)
    setMonth(dateObj.getMonth() + 1)
  }

  const handleWeekChange = (newWeek) => {
    console.log('🔄 Changing week to:', newWeek)
    setWeek(newWeek)
  }

  // ==================== UTILITY FUNCTIONS ====================

  const calculateDaysRemaining = (deadline) => {
    if (!deadline) return null
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diff = deadlineDate - today
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  // Fonction pour éviter les doublons entre dailyGoals et focusGoals
  const getUniqueDailyGoals = () => {
    const allGoals = [...dailyGoals, ...focusGoals]
    
    // Utiliser un Map pour éliminer les doublons par _id
    const uniqueGoalsMap = new Map()
    
    allGoals.forEach(goal => {
      if (!uniqueGoalsMap.has(goal._id)) {
        uniqueGoalsMap.set(goal._id, goal)
      }
    })
    
    return Array.from(uniqueGoalsMap.values())
  }

  // Fonction pour nettoyer les données dailyData (éviter les doublons)
  const cleanDailyData = (dailyData) => {
    if (!dailyData || !Array.isArray(dailyData)) return []
    
    // Si plus de 7 jours, prendre seulement les 7 premiers
    if (dailyData.length > 7) {
      console.warn(`⚠️ Nettoyage dailyData: ${dailyData.length} -> 7 jours`)
      return dailyData.slice(0, 7)
    }
    
    return dailyData
  }

  // ==================== RENDER HELPERS ====================

  const renderGoalCard = (goal) => {
    // Type Learning (avec current book)
    if (goal.category === 'learning' && goal.currentBook) {
      return (
        <GoalCardLearning 
          key={goal._id}
          goal={{
            id: goal._id,
            title: goal.title,
            category: goal.category,
            currentValue: goal.current_value,
            targetValue: goal.target_value,
            unit: goal.unit,
            progress: goal.progress_percent,
            status: goal.status,
            currentBook: goal.currentBook
          }}
          onMenuClick={() => handleMenuClick(goal._id)}
        />
      )
    }

    // Type Checklist (steps)
    if (goal.type === 'steps') {
      return (
        <GoalCardChecklist 
          key={goal._id}
          goal={{
            id: goal._id,
            title: goal.title,
            category: goal.category,
            steps: goal.steps || []
          }}
          onStepToggle={(stepId) => handleStepToggle(goal._id, stepId)}
          onMenuClick={() => handleMenuClick(goal._id)}
        />
      )
    }

    // Type Numeric avec tracker (commits, etc.)
    if (goal.commits_integration?.enabled || goal.integration_type === 'commits') {
      return (
        <GoalCardWithTracker 
          key={goal._id}
          goal={{
            id: goal._id,
            title: goal.title,
            category: goal.category,
            currentValue: goal.current_value,
            targetValue: goal.target_value,
            unit: goal.unit,
            progress: goal.progress_percent,
            status: goal.status,
            deadline: goal.deadline,
            daysRemaining: calculateDaysRemaining(goal.deadline),
            perMonth: null,
            perDay: Math.round(goal.target_value / 365),
            showGrid: true
          }}
          onMenuClick={() => handleMenuClick(goal._id)}
        />
      )
    }

    // Type Numeric standard (Annual)
    return (
      <GoalCardAnnual 
        key={goal._id}
        goal={{
          id: goal._id,
          title: goal.title,
          category: goal.category,
          currentValue: goal.current_value,
          targetValue: goal.target_value,
          unit: goal.unit,
          progress: goal.progress_percent,
          status: goal.status,
          deadline: goal.deadline,
          daysRemaining: calculateDaysRemaining(goal.deadline),
          perMonth: Math.round(goal.target_value / 12),
          perDay: null,
          showGrid: true
        }}
        onMenuClick={() => handleMenuClick(goal._id)}
      />
    )
  }

  // ==================== RENDER ====================

  if (isError) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center" style={{ background: '#001D39' }}>
          <div 
            className="p-6 rounded-2xl max-w-md text-center"
            style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.3)' 
            }}
          >
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#EF4444' }}>
              Erreur de chargement
            </h3>
            <p className="mb-4" style={{ color: '#8BA3B8' }}>
              {error || 'Impossible de charger les objectifs'}
            </p>
            <button
              onClick={fetchGoalsForCurrentLevel}
              className="px-6 py-2 rounded-xl font-medium transition-all"
              style={{
                background: 'rgba(123, 189, 232, 0.2)',
                color: '#7BBDE8',
                border: '1px solid rgba(123, 189, 232, 0.3)'
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <Sidebar />
      
      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto" style={{ background: '#001D39' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <PageHeader 
            title="Mes Objectifs 2026"
            subtitle="Transforme tes rêves en actions concrètes"
            buttonText="Nouvel objectif"
            onButtonClick={handleCreateGoal}
          />

          {/* Navigation principale */}
          <LevelTabs 
            currentLevel={level}
            onLevelChange={handleLevelChange}
          />

          {/* Sub-navigation conditionnelle */}
          {level === 'quarterly' && (
            <QuarterSelector 
              currentQuarter={quarter}
              onQuarterChange={handleQuarterChange}
              year={year}
            />
          )}

          {level === 'monthly' && (
            <DateNavigator 
              currentDate={date}
              onDateChange={handleDateChange}
              displayFormat="month"
            />
          )}

          {level === 'weekly' && (
            <WeekSelector 
              currentWeek={week}
              onWeekChange={handleWeekChange}
              year={year}
            />
          )}

          {level === 'daily' && (
            <DateNavigator 
              currentDate={date}
              onDateChange={handleDateChange}
              displayFormat="day"
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#7BBDE8' }}></div>
            </div>
          )}

          {/* Contenu conditionnel selon le level */}
          {!isLoading && (
            <>
              {/* VUE ANNUAL */}
              {level === 'annual' && (
                <GoalsGrid columns={2}>
                  {annualGoals.length === 0 ? (
                    <div className="col-span-2 text-center py-20" style={{ color: '#8BA3B8' }}>
                      <div className="text-6xl mb-4">🎯</div>
                      <p className="text-xl mb-2">Aucun objectif annuel</p>
                      <p>Crée ton premier objectif pour commencer !</p>
                    </div>
                  ) : (
                    annualGoals.map((goal) => renderGoalCard(goal))
                  )}
                </GoalsGrid>
              )}

              {/* VUE QUARTERLY */}
              {level === 'quarterly' && (
                <GoalsGrid columns={2}>
                  {quarterlyGoals.length === 0 ? (
                    <div className="col-span-2 text-center py-20" style={{ color: '#8BA3B8' }}>
                      <div className="text-6xl mb-4">📅</div>
                      <p className="text-xl mb-2">Aucun objectif pour Q{quarter}</p>
                      <p>Les objectifs apparaîtront ici après décomposition automatique</p>
                    </div>
                  ) : (
                    quarterlyGoals.map((goal) => (
                      <GoalCardQuarterly 
                        key={goal._id}
                        goal={{
                          id: goal._id,
                          title: goal.title,
                          category: goal.category,
                          hierarchyContext: goal.hierarchyContext || goal._doc?.hierarchyContext || '',
                          currentValue: goal.current_value,
                          targetValue: goal.target_value,
                          unit: goal.unit,
                          progress: goal.progress_percent,
                          status: goal.status,
                          deadline: goal.deadline
                        }}
                        onMenuClick={() => handleMenuClick(goal._id)}
                      />
                    ))
                  )}
                </GoalsGrid>
              )}

              {/* VUE MONTHLY */}
              {level === 'monthly' && (
                <GoalsGrid columns={2}>
                  {monthlyGoals.length === 0 ? (
                    <div className="col-span-2 text-center py-20" style={{ color: '#8BA3B8' }}>
                      <div className="text-6xl mb-4">📆</div>
                      <p className="text-xl mb-2">Aucun objectif pour ce mois</p>
                      <p>Les objectifs apparaîtront ici après décomposition automatique</p>
                    </div>
                  ) : (
                    monthlyGoals.map((goal) => (
                      <GoalCardMonthly 
                        key={goal._id}
                        goal={{
                          id: goal._id,
                          title: goal.title,
                          category: goal.category,
                          hierarchyContext: goal.hierarchyContext || goal._doc?.hierarchyContext || '',
                          currentValue: goal.current_value,
                          targetValue: goal.target_value,
                          unit: goal.unit,
                          progress: goal.progress_percent,
                          status: goal.status,
                          linkedTasks: goal.linkedTasksPopulated || goal._doc?.linkedTasksPopulated || []
                        }}
                        onMenuClick={() => handleMenuClick(goal._id)}
                        onTaskClick={handleTaskClick}
                      />
                    ))
                  )}
                </GoalsGrid>
              )}

              {/* 🆕 VUE WEEKLY - AGRÉGÉE PAR TYPE */}
              {level === 'weekly' && (
                <div className="space-y-6">
                  {weeklyGoals.length === 0 ? (
                    <div className="text-center py-20" style={{ color: '#8BA3B8' }}>
                      <div className="text-6xl mb-4">📊</div>
                      <p className="text-xl mb-2">Aucun objectif pour cette semaine</p>
                      <p>Les objectifs apparaîtront ici après décomposition automatique</p>
                    </div>
                  ) : (
                    // Afficher 1 carte par type d'objectif agrégé
                    weeklyGoals.map((goalType, index) => (
                      <WeeklyGoalCard 
                        key={goalType.id || goalType._id || `weekly-goal-${index}`}
                        goal={{
                          id: goalType.id || goalType._id,
                          _id: goalType._id || goalType.id, // 🆕 Pour compatibilité
                          title: goalType.title || `${goalType.weekTarget || goalType.target_value || 0} ${goalType.unit || ''}`,
                          currentWeekValue: goalType.currentWeekValue || goalType.current_value || 0,
                          weekTarget: goalType.weekTarget || goalType.target_value || 0,
                          unit: goalType.unit || 'default',
                          dailyData: cleanDailyData(goalType.dailyData || [])
                        }}
                        onMenuClick={handleMenuClick}
                      />
                    ))
                  )}
                  
                  {/* Objectifs personnels cette semaine */}
                  {viewMetadata?.weekly?.personalGoals && viewMetadata.weekly.personalGoals.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4" style={{ color: '#7BBDE8' }}>
                        Objectifs personnels cette semaine
                      </h3>
                      <div className="space-y-3">
                        {viewMetadata.weekly.personalGoals.map((goal) => (
                          <div 
                            key={goal._id}
                            className="p-4 rounded-xl transition-all"
                            style={{
                              background: 'rgba(0, 29, 57, 0.3)',
                              border: '1px solid rgba(110, 162, 179, 0.15)'
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div 
                                  className="font-semibold"
                                  style={{ color: '#E8F1F5' }}
                                >
                                  {goal.title}
                                </div>
                                {goal.deadline && (
                                  <div 
                                    className="text-xs mt-1"
                                    style={{ color: '#8BA3B8' }}
                                  >
                                    Échéance: {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                                  </div>
                                )}
                              </div>
                              <div 
                                className="text-sm font-semibold"
                                style={{ 
                                  color: goal.completed ? '#10B981' : '#7BBDE8'
                                }}
                              >
                                {goal.completed ? '✓ Terminé' : 'En cours'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VUE DAILY */}
              {level === 'daily' && (
                <>
                  {/* Focus Widget */}
                  {(focusGoals.length > 0 || viewMetadata.daily) && (
                    <FocusWidget 
                      focus={{
                        description: viewMetadata.daily?.focusDescription || 
                                    `Termine tes ${focusGoals.length} objectifs prioritaires du jour`,
                        completedCount: viewMetadata.daily?.focusCompleted || 0,
                        totalCount: viewMetadata.daily?.focusTotal || focusGoals.length,
                        percentage: viewMetadata.daily?.focusProgress || 0
                      }} 
                    />
                  )}

                  {/* Daily Checklist - Éviter les doublons */}
                  <div className="space-y-3">
                    {getUniqueDailyGoals().length === 0 ? (
                      <div className="text-center py-20" style={{ color: '#8BA3B8' }}>
                        <div className="text-6xl mb-4">✅</div>
                        <p className="text-xl mb-2">Aucun objectif pour aujourd'hui</p>
                        <p>Profite de ta journée libre ! 🎉</p>
                      </div>
                    ) : (
                      getUniqueDailyGoals().map((goal) => (
                        <DailyChecklistItem 
                          key={goal._id}
                          item={{
                            id: goal._id,
                            title: goal.title,
                            isCompleted: goal.completed,
                            kanbanLink: goal.linked_tasks?.length > 0,
                            progress: goal.type === 'steps' ? {
                              current: goal.completed_steps || 0,
                              total: goal.total_steps || 0
                            } : null
                          }}
                          onToggle={handleDailyToggle}
                          onLinkClick={handleKanbanClick}
                        />
                      ))
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* GOAL MODAL */}
      {isModalOpen && (
        <GoalModal
          goal={editingGoal}
          onClose={handleCloseModal}
          defaultView="hierarchy"
        />
      )}
    </div>
  )
}

export default GoalsHierarchy