// frontend/src/components/ProjectCard.jsx
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteProject } from '../redux/slices/projectSlice'
import ProjectModal from './ProjectModal'

function ProjectCard({ project, onClick }) {
  const dispatch = useDispatch()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (window.confirm('Supprimer ce projet et toutes ses tâches ?')) {
      await dispatch(deleteProject(project._id))
    }
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    setShowEditModal(true)
    setShowMenu(false)
  }

  const handleMenuToggle = (e) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  // Calculer commits count
  const commitsCount = project.commits?.length || project.commitCount || 0

  // Type tag styling
  const typeTag = project.type === 'dev' ? 'Dev' : 'Perso'

  return (
    <>
      <div
        onClick={onClick}
        className="
          relative
          bg-momentum-dark/40 
          border border-momentum-light-1/10 
          rounded-xl p-4
          cursor-pointer 
          transition-all duration-200
          hover:border-momentum-light-2/30
          hover:bg-momentum-dark/50
          group
        "
      >
        {/* Menu trois points (caché par défaut, visible au hover) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={handleMenuToggle}
            className="
              text-gray-400 hover:text-white 
              p-1.5 rounded-lg
              hover:bg-momentum-dark/70
              transition-colors
            "
            aria-label="Menu"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <circle cx="8" cy="2" r="1.5"/>
              <circle cx="8" cy="8" r="1.5"/>
              <circle cx="8" cy="14" r="1.5"/>
            </svg>
          </button>
          
          {showMenu && (
            <div className="
              absolute right-0 top-full mt-1
              w-40 
              bg-momentum-dark/95 backdrop-blur-md
              border border-momentum-light-1/20
              rounded-lg py-1 
              shadow-xl shadow-black/50
              z-50
            ">
              <button
                onClick={handleEdit}
                className="
                  w-full px-3 py-2 text-left text-sm
                  hover:bg-momentum-light-2/10 
                  transition-colors
                  flex items-center gap-2
                "
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </button>
              <button
                onClick={handleDelete}
                className="
                  w-full px-3 py-2 text-left text-sm
                  text-red-400 hover:bg-red-500/10 
                  transition-colors
                  flex items-center gap-2
                "
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          )}
        </div>

        {/* Header - Icon + Name (pas de % ici selon l'image) */}
        <div className="flex items-center gap-3 mb-2">
          {/* Icon */}
          <div
            className="
              w-10 h-10 
              rounded-xl 
              flex items-center justify-center 
              font-bold text-lg
              flex-shrink-0
            "
            style={{ 
              background: project.color || 'linear-gradient(135deg, #7BBDE8, #4E8EA2)',
              color: '#0F1419'
            }}
          >
            {project.icon || project.name.charAt(0)}
          </div>
          
          {/* Name */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base truncate">
              {project.name}
            </div>
          </div>
        </div>

        {/* Tasks & Commits count */}
        <div className="text-sm text-gray-400 mb-3 ml-[52px]">
          {project.taskCount || 0} tâches • {commitsCount} commits
        </div>

        {/* Progress Bar */}
        <div className="
          h-1.5 
          bg-momentum-dark/40 
          rounded-full 
          overflow-hidden
          mb-3
        ">
          <div
            className="
              h-full 
              bg-gradient-to-r from-momentum-light-2 to-momentum-accent 
              rounded-full 
              transition-all duration-500
            "
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>

        {/* Footer - Progress text + Tag */}
        <div className="flex justify-between items-center">
          {/* Progress percentage text */}
          <div className="text-sm text-gray-400">
            {project.progress || 0}% complété
          </div>
          
          {/* Type Tag */}
          <div className={`
            px-3 py-1 
            rounded-md 
            text-xs font-semibold
            ${project.type === 'dev' 
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
              : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }
          `}>
            {typeTag}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <ProjectModal
          project={project}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  )
}

export default ProjectCard