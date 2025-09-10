import { Scale, Bot, Film, GraduationCap, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useNavigation } from '@/context/NavigationContext';
import { useAppFunctions } from '@/hooks/useAppFunctions';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { AIDocumentAnalyzer } from './AIDocumentAnalyzer';

interface FooterMenuProps {
  isVisible?: boolean;
}

export const FooterMenu = ({ isVisible = true }: FooterMenuProps) => {
  const [activeItem, setActiveItem] = useState('home');
  const [aiDocumentOpen, setAiDocumentOpen] = useState(false);
  const { setCurrentFunction } = useNavigation();
  const { functions } = useAppFunctions();
  const { isDesktop } = useDeviceDetection();

  const findFunction = (searchTerm: string) => {
    return functions.find(func => 
      func.funcao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const menuItems = [
    {
      id: 'home',
      title: 'Cursos',
      icon: GraduationCap,
      function: 'Cursos Preparatórios',
      color: 'primary'
    },
    {
      id: 'vademecum',
      title: 'Vade Mecum',
      icon: Scale,
      function: 'Vade Mecum Digital',
      color: 'info'
    },
    {
      id: 'biblioteca',
      title: 'Biblioteca',
      icon: BookOpen,
      function: 'Biblioteca Clássicos',
      color: 'library'
    },
    {
      id: 'assistenteia',
      title: 'Professora IA',
      icon: Bot,
      function: 'Assistente IA Jurídica',
      color: 'special-ai',
      special: true
    },
    {
      id: 'juriflix',
      title: 'Juriflix',
      icon: Film,
      function: findFunction('juriflix')?.funcao || 'Juriflix',
      color: 'community'
    }
  ];

  const getItemStyles = (item: typeof menuItems[0], isActive: boolean) => {
    const baseStyles = "relative flex flex-col items-center py-3 px-3 rounded-xl transition-all duration-300 transform active:scale-95 group min-w-0 flex-1";
    
    if (isActive) {
      switch (item.color) {
        case 'special-ai':
          return `${baseStyles} text-white bg-gradient-to-br from-red-500 to-red-700 shadow-lg scale-110 animate-pulse`;
        case 'community':
          return `${baseStyles} text-white bg-gradient-to-br from-community-primary to-community-secondary shadow-lg scale-105 animate-community-glow`;
        case 'info':
          return `${baseStyles} text-white bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg scale-105`;
        case 'library':
          return `${baseStyles} text-white bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg scale-105`;
        default:
          return `${baseStyles} text-primary bg-gradient-to-br from-primary/30 to-accent-legal/30 shadow-lg scale-105 animate-glow-pulse border border-primary/20`;
      }
    } else {
      return `${baseStyles} text-muted-foreground hover:text-primary hover:bg-footer-hover transition-all duration-300`;
    }
  };

  const getIconStyles = (item: typeof menuItems[0], isActive: boolean) => {
    const baseStyles = "relative p-2 rounded-lg transition-all duration-300";
    
    if (isActive) {
      if (item.special) {
        return `${baseStyles} bg-gradient-to-br from-orange-400 to-red-500 scale-125 shadow-2xl animate-pulse`;
      }
      return `${baseStyles} bg-white/20 scale-110`;
    } else {
      if (item.special) {
        return `${baseStyles} bg-gradient-to-br from-orange-400/70 to-red-500/70 scale-115 group-hover:scale-125 group-hover:shadow-xl`;
      }
      return `${baseStyles} group-hover:bg-primary/20 group-hover:scale-105`;
    }
  };

  const handleItemClick = (item: typeof menuItems[0]) => {
    setActiveItem(item.id);
    
    if (item.id === 'assistenteia') {
      setAiDocumentOpen(true);
    } else {
      setCurrentFunction(item.function);
    }
  };

  // Desktop version
  if (isDesktop) {
    return (
      <div className={`transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="glass-effect-modern rounded-2xl overflow-hidden">
          <div className="flex justify-around items-center px-2 py-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={getItemStyles(item, isActive)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Indicador ativo */}
                  {isActive && (
                     <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                  )}
                  
                   {/* Icon container */}
                  <div className={getIconStyles(item, isActive)}>
                    <Icon className={`${item.special ? 'h-7 w-7' : 'h-5 w-5'} transition-all duration-300 ${
                      isActive ? 'icon-pulse-active' : 'icon-hover-bounce'
                    } ${item.special ? 'text-white drop-shadow-lg' : ''}`} />
                    {item.special && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-ping" />
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs font-medium transition-all duration-300 mt-1 text-center leading-tight ${
                    isActive ? 'font-semibold text-white' : 'group-hover:font-medium'
                  }`}>
                    {item.title}
                  </span>
                  
                  {/* Efeito de brilho no hover */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-xl" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {aiDocumentOpen && (
          <AIDocumentAnalyzer onBack={() => setAiDocumentOpen(false)} />
        )}
      </div>
    );
  }

  // Mobile version - melhor alinhamento
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      {/* Fundo curvo */}
      <div className="relative">
        <svg
          viewBox="0 0 375 80"
          className="w-full h-20 absolute bottom-0"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 Q187.5,0 375,20 L375,80 L0,80 Z"
            fill="hsl(var(--background))"
            opacity="0.95"
          />
        </svg>
        
        {/* Container do menu */}
        <div className="relative z-10 pb-6 pt-4">
          <div className="flex justify-between items-end relative px-6">
            {/* Itens laterais esquerda */}
            <div className="flex items-center space-x-6">
              {menuItems.slice(0, 2).map((item, index) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`flex flex-col items-center transition-all duration-300 ${
                      isActive ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${
                      isActive 
                        ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-lg text-white' 
                        : 'bg-white/10 text-muted-foreground hover:text-primary'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs mt-1 font-medium">{item.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Assistente IA Central */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -mt-6">
              <button
                onClick={() => handleItemClick(menuItems[3])}
                className="relative"
              >
                {/* Círculo de fundo */}
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-2xl flex items-center justify-center animate-pulse">
                  <Bot className="h-8 w-8 text-white" />
                  {/* Indicador de atividade */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-ping" />
                </div>
                {/* Label */}
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-white whitespace-nowrap">
                  Professora IA
                </span>
              </button>
            </div>

            {/* Itens laterais direita */}
            <div className="flex items-center space-x-6">
              {menuItems.slice(2, 5).filter(item => item.id !== 'assistenteia').map((item, index) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`flex flex-col items-center transition-all duration-300 ${
                      isActive ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${
                      isActive 
                        ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-lg text-white' 
                        : 'bg-white/10 text-muted-foreground hover:text-primary'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs mt-1 font-medium">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {aiDocumentOpen && (
        <AIDocumentAnalyzer onBack={() => setAiDocumentOpen(false)} />
      )}
    </div>
  );
};
