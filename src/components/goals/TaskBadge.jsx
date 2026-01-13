/**
 * TaskBadge - Design EXACT du wireframe
 * 
 * WIREFRAME SPECS (observé dans Image 4):
 * - Format: Badge cliquable pour tâches liées
 * - Examples: "Momentum module Goals", "FinApp module Comptes", "+3 autres"
 * - Background: rgba(78, 142, 162, 0.15)
 * - Border: rgba(110, 162, 179, 0.25)
 * - Color: #7BBDE8
 * - Padding: 6px 12px
 * - Border-radius: 8px
 * - Font-size: 12px
 * - Hover effect
 */

function TaskBadge({ task, onClick }) {
  return (
    <button
      onClick={() => onClick && onClick(task.id)}
      className="px-3 py-1.5 rounded-lg transition-all whitespace-nowrap text-xs font-medium"
      style={{
        background: 'rgba(78, 142, 162, 0.15)',
        border: '1px solid rgba(110, 162, 179, 0.25)',
        color: '#7BBDE8'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(78, 142, 162, 0.25)'
        e.currentTarget.style.borderColor = 'rgba(123, 189, 232, 0.4)'
        e.currentTarget.style.color = '#E8F1F5'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(78, 142, 162, 0.15)'
        e.currentTarget.style.borderColor = 'rgba(110, 162, 179, 0.25)'
        e.currentTarget.style.color = '#7BBDE8'
      }}
    >
      {task.name}
    </button>
  )
}

export default TaskBadge