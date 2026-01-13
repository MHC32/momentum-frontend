/**
 * GoalCardWithTracker - Wrapper de GoalCardAnnual avec badge Commits Tracker
 * 
 * WIREFRAME SPECS (observé dans Image 2):
 * - Identique à GoalCardAnnual
 * - Badge en bas: "💡 Connecté avec Commits Tracker"
 * - Background badge: rgba(123, 189, 232, 0.1)
 * - Color badge: #7BBDE8
 * 
 * NOTE: C'est simplement GoalCardAnnual avec hasTracker=true
 */

import GoalCardAnnual from './GoalCardAnnual'

function GoalCardWithTracker({ goal, onMenuClick }) {
  // Forcer hasTracker à true
  const goalWithTracker = {
    ...goal,
    hasTracker: true
  }

  return (
    <GoalCardAnnual 
      goal={goalWithTracker}
      onMenuClick={onMenuClick}
    />
  )
}

export default GoalCardWithTracker