/* eslint-disable no-unused-vars */
// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getDashboard } from '../redux/slices/dashboardSlice'
import { updateTaskStatus } from '../redux/slices/taskSlice'
import { useSocket } from '../hooks/useSocket'
import Sidebar from '../components/Sidebar'
import CreateTaskModal from '../components/CreateTaskModal'

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  
  // 🆕 NOUVEAU : Utiliser dashboardSlice au lieu de projects/tasks
  const { 
    dashboardData, 
    focusTasks, 
    stats, 
    projects, 
    recentActivity, 
    isLoading 
  } = useSelector((state) => state.dashboard)

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)

  // Socket.IO
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      // 🆕 NOUVEAU : Appeler le endpoint dashboard unique
      dispatch(getDashboard())
    }
  }, [user, navigate, dispatch])

  // Toggle task completion
  const handleTaskToggle = async (task) => {
    try {
      const newStatus = task.status === 'done' ? 'todo' : 'done'
      
      await dispatch(updateTaskStatus({
        id: task._id,
        status: newStatus
      })).unwrap()
      
      // Refresh dashboard après update
      dispatch(getDashboard())
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  // 🆕 NOUVEAU : Stats viennent du backend
  const activeProjects = stats?.projectsActive?.current || 0
  const completedTasks = stats?.tasksCompleted?.current || 0
  const totalCommits = stats?.commitsWeek?.current || 0
  const productivity = stats?.productivity?.current || 0

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Salut, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-400">Voici ton focus du jour</p>
            
            {/* Socket.IO status indicator (dev only) */}
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
            className="btn-primary"
            onClick={() => setIsCreateTaskModalOpen(true)}
          >
            + Nouvelle tâche
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-momentum-light-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-gray-400">Chargement du dashboard...</span>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {!isLoading && dashboardData && (
          <>
            {/* Focus Hero */}
            <div className="relative bg-gradient-to-br from-momentum-primary/40 to-momentum-accent/20 border border-momentum-light-2/30 rounded-2xl p-8 mb-8 overflow-hidden">
              <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-momentum-light-2/10 rounded-full blur-3xl" />
              
              <div className="relative">
                <h2 className="text-3xl font-bold mb-2">🎯 {dashboardData.focus.title}</h2>
                <p className="text-gray-400 mb-6">
                  {dashboardData.focus.description}
                </p>
                
                <div className="space-y-3">
                  {focusTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">✨</div>
                      <p>Aucune tâche prioritaire. Crée-en une pour commencer!</p>
                    </div>
                  ) : (
                    focusTasks.map((task) => (
                      <div
                        key={task._id}
                        className="flex items-start gap-4 bg-momentum-bg/40 backdrop-blur-sm border border-momentum-light-1/10 rounded-xl p-4 hover:border-momentum-light-2/30 transition-all"
                      >
                        {/* Checkbox */}
                        <div 
                          onClick={() => handleTaskToggle(task)}
                          className={`w-5 h-5 min-w-5 border-2 rounded-md mt-0.5 cursor-pointer transition-all ${
                            task.status === 'done'
                              ? 'bg-momentum-accent border-momentum-accent'
                              : 'border-momentum-accent hover:border-momentum-light-2'
                          } flex items-center justify-center`}
                        >
                          {task.status === 'done' && (
                            <svg className="w-3 h-3 text-momentum-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Title avec taskId */}
                          <div className={`font-semibold mb-2 ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                            {task.taskId && <span className="text-momentum-light-2">[{task.taskId}] </span>}
                            {task.title}
                          </div>
                          
                          {/* Tags inline */}
                          <div className="flex gap-3 text-sm flex-wrap">
                            <span className={`px-3 py-1 rounded-md text-xs font-semibold ${
                              task.priority === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              task.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                              'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}>
                              {task.priority === 'critical' ? 'URGENT' : task.priority === 'high' ? 'HAUTE' : 'NORMALE'}
                            </span>
                            
                            {task.type && (
                              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                {task.type === 'habit' ? '🔥 Habitude' : task.type}
                              </span>
                            )}
                            
                            {task.deadline && (
                              <span className="text-gray-400">
                                📅 {new Date(task.deadline).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                            
                            {task.commitsCount > 0 && (
                              <span className="text-gray-400">
                                💻 {task.commitsCount} commits
                              </span>
                            )}

                            {task.estimatedTime && (
                              <span className="text-gray-400">
                                ⏱ {task.estimatedTime}min
                              </span>
                            )}

                            {task.streak && (
                              <span className="text-gray-400">
                                🔥 Streak: {task.streak.current} jours
                              </span>
                            )}

                            {task.daysWithoutCompletion && (
                              <span className="text-orange-400">
                                ⚠️ Pas fait depuis {task.daysWithoutCompletion} jours
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Commits Week */}
              <div className="glass-card p-6 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-momentum-light-2 to-momentum-light-3 bg-clip-text text-transparent mb-2">
                  {totalCommits}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Commits semaine</div>
                {stats?.commitsWeek && (
                  <div className={`text-xs font-semibold ${
                    stats.commitsWeek.trend === 'up' ? 'text-green-400' : 
                    stats.commitsWeek.trend === 'down' ? 'text-red-400' : 
                    'text-gray-400'
                  }`}>
                    {stats.commitsWeek.trend === 'up' && '↑ '}
                    {stats.commitsWeek.trend === 'down' && '↓ '}
                    {stats.commitsWeek.change}
                  </div>
                )}
              </div>

              {/* Tasks Completed */}
              <div className="glass-card p-6 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-momentum-light-2 to-momentum-light-3 bg-clip-text text-transparent mb-2">
                  {completedTasks}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Tâches complétées</div>
                {stats?.tasksCompleted && (
                  <div className={`text-xs font-semibold ${
                    stats.tasksCompleted.trend === 'up' ? 'text-green-400' : 
                    stats.tasksCompleted.trend === 'down' ? 'text-red-400' : 
                    'text-gray-400'
                  }`}>
                    {stats.tasksCompleted.trend === 'up' && '↑ '}
                    {stats.tasksCompleted.trend === 'down' && '↓ '}
                    {stats.tasksCompleted.change}
                  </div>
                )}
              </div>

              {/* Projects Active */}
              <div className="glass-card p-6 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-momentum-light-2 to-momentum-light-3 bg-clip-text text-transparent mb-2">
                  {activeProjects}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Projets actifs</div>
                {stats?.projectsActive && (
                  <div className="text-xs font-semibold text-gray-400">
                    → {stats.projectsActive.change}
                  </div>
                )}
              </div>

              {/* Productivity */}
              <div className="glass-card p-6 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-momentum-light-2 to-momentum-light-3 bg-clip-text text-transparent mb-2">
                  {productivity}%
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Productivité</div>
                {stats?.productivity && (
                  <div className={`text-xs font-semibold ${
                    stats.productivity.trend === 'up' ? 'text-green-400' : 
                    stats.productivity.trend === 'down' ? 'text-red-400' : 
                    'text-gray-400'
                  }`}>
                    {stats.productivity.trend === 'up' && '↑ '}
                    {stats.productivity.trend === 'down' && '↓ '}
                    {stats.productivity.change}
                  </div>
                )}
              </div>
            </div>

            {/* Projects Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Projects */}
              <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                    </svg>
                    Projets actifs
                  </h3>
                  <Link to="/projects" className="text-sm text-momentum-light-2 hover:text-momentum-light-3">
                    Voir tout →
                  </Link>
                </div>

                <div className="space-y-3">
                  {projects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📁</div>
                      <p className="mb-4">Aucun projet</p>
                      <Link to="/projects" className="btn-primary text-sm">
                        Créer un projet
                      </Link>
                    </div>
                  ) : (
                    projects.map((project) => (
                      <Link
                        key={project._id}
                        to={`/projects/${project._id}/kanban`}
                        className="block p-4 bg-momentum-bg/40 border border-momentum-light-1/10 rounded-xl hover:border-momentum-light-2/30 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                            style={{ backgroundColor: project.color || '#7BBDE8' }}
                          >
                            {project.icon || project.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{project.name}</div>
                            <div className="text-sm text-gray-400">
                              {project.taskCount || 0} tâches • {project.commitCount || 0} commits
                            </div>
                          </div>
                          <div className="font-semibold text-momentum-light-2">
                            {project.progress || 0}%
                          </div>
                        </div>
                        <div className="h-2 bg-momentum-dark/40 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-momentum-light-2 to-momentum-accent rounded-full transition-all"
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Activité récente
                  </h3>
                </div>

                <div className="space-y-4 relative pl-6">
                  {/* Timeline line */}
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-momentum-accent to-transparent" />

                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Aucune activité récente</p>
                    </div>
                  ) : (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-6 top-1 w-3 h-3 bg-momentum-light-2 rounded-full border-2 border-momentum-bg" />
                        <div className="bg-momentum-dark/30 border border-momentum-light-1/10 rounded-xl p-3">
                          <div className="text-xs text-gray-500 mb-1">
                            {activity.timestampRelative}
                          </div>
                          <div className="font-semibold text-sm mb-1 flex items-center gap-2">
                            <span>{activity.icon}</span>
                            <span>{activity.title}</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {activity.description}
                          </div>
                          {activity.project && (
                            <div className="text-xs text-gray-500 mt-1">
                              📁 {activity.project.name}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
      />
    </div>
  )
}

export default Dashboard