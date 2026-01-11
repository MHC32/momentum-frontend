function LevelTabs({ currentLevel, onLevelChange }) {
  // 🔍 LOG 1: Vérifier que le composant se rend
  console.log('🎯 [LevelTabs] RENDER');
  console.log('   currentLevel:', currentLevel);
  console.log('   onLevelChange:', typeof onLevelChange);

  const levels = [
    { 
      value: 'annual', 
      label: 'Annuel', 
      description: 'Vue annuelle',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    { 
      value: 'quarterly', 
      label: 'Trimestriel', 
      description: '4 trimestres',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    { 
      value: 'monthly', 
      label: 'Mensuel', 
      description: '12 mois',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    { 
      value: 'weekly', 
      label: 'Hebdo', 
      description: '~52 semaines',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    { 
      value: 'daily', 
      label: 'Quotidien', 
      description: '365 jours',
      icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
    }
  ];

  // 🔍 LOG 2: Vérifier les levels
  console.log('   levels array length:', levels.length);

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex gap-2 pb-2 min-w-max">
        {levels.map((level) => {
          // 🔍 LOG 3: Vérifier chaque level rendu
          const isActive = currentLevel === level.value;
          if (isActive) {
            console.log('   📍 Active level:', level.value);
          }
          
          return (
            <button
              key={level.value}
              onClick={() => {
                // 🔍 LOG 4: Vérifier les clicks
                console.log('🖱️ [LevelTabs] CLICK on:', level.value);
                console.log('   Previous level:', currentLevel);
                onLevelChange(level.value);
              }}
              className={`
                group relative flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all
                ${currentLevel === level.value
                  ? 'bg-gradient-to-br from-momentum-light-2/20 to-momentum-accent/20 border-2 border-momentum-light-2/50 shadow-lg'
                  : 'bg-momentum-dark/40 border border-momentum-light-1/10 hover:bg-momentum-accent/10 hover:border-momentum-light-1/20'
                }
              `}
            >
              {/* Icon SVG */}
              <svg 
                className={`
                  w-6 h-6 transition-transform
                  ${currentLevel === level.value ? 'scale-110 text-momentum-light-2' : 'text-gray-400 group-hover:scale-105 group-hover:text-gray-300'}
                `}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={level.icon} />
              </svg>
              
              {/* Label */}
              <span className={`
                text-sm font-semibold
                ${currentLevel === level.value 
                  ? 'text-momentum-light-2' 
                  : 'text-gray-400 group-hover:text-gray-300'
                }
              `}>
                {level.label}
              </span>
              
              {/* Description */}
              <span className="text-xs text-gray-500">
                {level.description}
              </span>
              
              {/* Active Indicator */}
              {currentLevel === level.value && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-momentum-light-2 to-momentum-accent rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LevelTabs;