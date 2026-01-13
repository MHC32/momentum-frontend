/**
 * GoalsHierarchy - PAGE PRINCIPALE DES OBJECTIFS
 * 
 * WIREFRAME SPECS:
 * - Assemble tous les 21 composants créés
 * - Gère le routing entre 5 vues: Annual, Quarterly, Monthly, Weekly, Daily
 * - Gère l'état global: level, quarter, date, week
 * - Affichage conditionnel selon le level actif
 */

import { useState } from 'react'
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


function GoalsHierarchy() {
  // État global
  const [level, setLevel] = useState('annual')
  const [quarter, setQuarter] = useState(1)
  const [date, setDate] = useState('2026-01-03')
  const [week, setWeek] = useState(1)

  // Mock data - ANNUAL
  const annualGoals = [
    {
      id: '1',
      title: 'Économiser 700 000 HTG',
      category: 'financial',
      currentValue: 105000,
      targetValue: 700000,
      unit: 'HTG',
      progress: 15,
      status: 'on-track',
      deadline: '2026-12-31',
      daysRemaining: 362,
      perMonth: 58333,
      perDay: null,
      showGrid: true,
      hasTracker: false
    },
    {
      id: '2',
      title: '4000 commits GitHub',
      category: 'professional',
      currentValue: 1247,
      targetValue: 4000,
      unit: 'commits',
      progress: 31.2,
      status: 'on-track',
      deadline: '2026-12-31',
      daysRemaining: 362,
      perMonth: null,
      perDay: 11,
      showGrid: true
    },
    {
      id: '3',
      title: 'Lire 12 livres',
      category: 'learning',
      currentValue: 1,
      targetValue: 12,
      unit: 'livres',
      progress: 8.3,
      status: 'at-risk',
      currentBook: {
        title: 'Atomic Habits',
        progress: 41
      }
    },
    {
      id: '4',
      title: 'Lancer carrière freelance',
      category: 'professional',
      steps: [
        { id: '1', title: 'Portfolio en ligne', completed: true },
        { id: '2', title: 'Obtenir 3 clients', completed: false, subtitle: '0/3 clients' },
        { id: '3', title: 'Profil Upwork optimisé', completed: false }
      ]
    }
  ]

  // Mock data - QUARTERLY
  const quarterlyGoals = [
    {
      id: '1',
      title: 'Économiser 175 000 HTG',
      category: 'financial',
      hierarchyContext: 'Q1 - 25% de 700k annuel',
      currentValue: 32000,
      targetValue: 175000,
      unit: 'HTG',
      progress: 18,
      status: 'on-track',
      deadline: '2026-03-31'
    },
    {
      id: '2',
      title: '1000 commits GitHub',
      category: 'professional',
      hierarchyContext: 'Q1 - 25% de 4000 annuel',
      currentValue: 245,
      targetValue: 1000,
      unit: 'commits',
      progress: 24.5,
      status: 'on-track',
      deadline: '2026-03-31'
    }
  ]

  // Mock data - MONTHLY
  const monthlyGoals = [
    {
      id: '1',
      title: '333 commits GitHub',
      category: 'professional',
      hierarchyContext: '4000 commits annuels',
      currentValue: 83,
      targetValue: 333,
      unit: 'commits',
      progress: 25,
      status: 'on-track',
      linkedTasks: [
        { id: '1', name: 'Momentum module Goals' },
        { id: '2', name: 'FinApp module Comptes' },
        { id: '3', name: '+3 autres' }
      ]
    },
    {
      id: '2',
      title: 'Économiser 58 333 HTG',
      category: 'financial',
      hierarchyContext: '700 000 HTG annuels',
      currentValue: 15000,
      targetValue: 58333,
      unit: 'HTG',
      progress: 26,
      status: 'on-track',
      linkedTasks: [
        { id: '4', name: 'Budget mensuel' },
        { id: '5', name: 'Suivi dépenses' }
      ]
    }
  ]

  // Mock data - WEEKLY
  const weeklyGoals = [
    {
      id: '1',
      title: '83 commits GitHub',
      currentWeekValue: 21,
      weekTarget: 83,
      dailyData: [
        { day: 'Lun', value: 14, isCompleted: true, isToday: false },
        { day: 'Mar', value: 7, isCompleted: true, isToday: false },
        { day: 'Mer', value: 0, isCompleted: false, isToday: true },
        { day: 'Jeu', value: null, isCompleted: false, isToday: false },
        { day: 'Ven', value: null, isCompleted: false, isToday: false },
        { day: 'Sam', value: null, isCompleted: false, isToday: false },
        { day: 'Dim', value: null, isCompleted: false, isToday: false }
      ]
    }
  ]

  // Mock data - DAILY
  const dailyFocus = {
    description: 'Avancer sur le module Goals de Momentum et compléter la configuration de FinApp',
    completedCount: 2,
    totalCount: 4,
    percentage: 50
  }

  const dailyGoals = [
    {
      id: '1',
      title: '333 commits GitHub',
      isCompleted: true
    },
    {
      id: '2',
      title: 'Terminer module Goals',
      isCompleted: false,
      kanbanLink: true
    },
    {
      id: '3',
      title: 'Lire Atomic Habits',
      isCompleted: false,
      progress: { current: 1, total: 3 }
    },
    {
      id: '4',
      title: 'Économiser 2000 HTG',
      isCompleted: false
    }
  ]

  // Handlers
  const handleCreateGoal = () => {
    console.log('Create new goal')
  }

  const handleMenuClick = (goalId) => {
    console.log('Menu clicked for goal:', goalId)
  }

  const handleStepToggle = (goalId, stepId) => {
    console.log('Toggle step:', stepId, 'in goal:', goalId)
  }

  const handleTaskClick = (taskId) => {
    console.log('Task clicked:', taskId)
  }

  const handleDailyToggle = (goalId) => {
    console.log('Toggle daily goal:', goalId)
  }

  const handleKanbanClick = (goalId) => {
    console.log('Open Kanban for goal:', goalId)
  }

  return (
    <div className="min-h-screen p-8" style={{ background: '#001D39' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader 
          title="Mes Objectifs 2026"
          subtitle="Transforme tes rêves en actions concrètes"
          buttonText="+ Nouvel objectif"
          onButtonClick={handleCreateGoal}
        />

        {/* Navigation principale */}
        <LevelTabs 
          currentLevel={level}
          onLevelChange={setLevel}
        />

        {/* Sub-navigation conditionnelle */}
        {level === 'quarterly' && (
          <QuarterSelector 
            currentQuarter={quarter}
            onQuarterChange={setQuarter}
            year={2026}
          />
        )}

        {level === 'monthly' && (
          <DateNavigator 
            currentDate={date}
            onDateChange={setDate}
            displayFormat="month"
          />
        )}

        {level === 'weekly' && (
          <WeekSelector 
            currentWeek={week}
            onWeekChange={setWeek}
            year={2026}
          />
        )}

        {level === 'daily' && (
          <DateNavigator 
            currentDate={date}
            onDateChange={setDate}
            displayFormat="day"
          />
        )}

        {/* Contenu conditionnel selon le level */}
        {level === 'annual' && (
          <GoalsGrid columns={2}>
            {/* Financial Goal */}
            <GoalCardAnnual 
              goal={annualGoals[0]}
              onMenuClick={() => handleMenuClick(annualGoals[0].id)}
            />

            {/* Commits Goal with Tracker */}
            <GoalCardWithTracker 
              goal={annualGoals[1]}
              onMenuClick={() => handleMenuClick(annualGoals[1].id)}
            />

            {/* Learning Goal */}
            <GoalCardLearning 
              goal={annualGoals[2]}
              onMenuClick={() => handleMenuClick(annualGoals[2].id)}
            />

            {/* Checklist Goal */}
            <GoalCardChecklist 
              goal={annualGoals[3]}
              onStepToggle={(stepId) => handleStepToggle(annualGoals[3].id, stepId)}
              onMenuClick={() => handleMenuClick(annualGoals[3].id)}
            />
          </GoalsGrid>
        )}

        {level === 'quarterly' && (
          <GoalsGrid columns={2}>
            {quarterlyGoals.map((goal) => (
              <GoalCardQuarterly 
                key={goal.id}
                goal={goal}
                onMenuClick={() => handleMenuClick(goal.id)}
              />
            ))}
          </GoalsGrid>
        )}

        {level === 'monthly' && (
          <GoalsGrid columns={2}>
            {monthlyGoals.map((goal) => (
              <GoalCardMonthly 
                key={goal.id}
                goal={goal}
                onMenuClick={() => handleMenuClick(goal.id)}
                onTaskClick={handleTaskClick}
              />
            ))}
          </GoalsGrid>
        )}

        {level === 'weekly' && (
          <div className="space-y-4">
            {weeklyGoals.map((goal) => (
              <WeeklyGoalCard 
                key={goal.id}
                goal={goal}
                onMenuClick={() => handleMenuClick(goal.id)}
              />
            ))}
          </div>
        )}

        {level === 'daily' && (
          <>
            {/* Focus Widget */}
            <FocusWidget focus={dailyFocus} />

            {/* Daily Checklist */}
            <div className="space-y-3">
              {dailyGoals.map((goal) => (
                <DailyChecklistItem 
                  key={goal.id}
                  item={goal}
                  onToggle={handleDailyToggle}
                  onLinkClick={handleKanbanClick}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GoalsHierarchy