import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { LucideIcon, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';
import { LazyProductCarousel } from '@/components/lazy/LazyComponents';
interface Category {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  functions: string[];
}
interface CategoryDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFunctionSelect: (functionName: string) => void;
}
export const CategoryDialog = ({
  category,
  open,
  onOpenChange,
  onFunctionSelect
}: CategoryDialogProps) => {
  const {
    isMobile,
    isTablet
  } = useDeviceDetection();
  if (!category) return null;
  const handleFunctionClick = (functionName: string) => {
    onFunctionSelect(functionName);
  };
  const handleBack = () => {
    onOpenChange(false);
  };
  const Icon = category.icon;

  // Get the gradient based on category color - usando vermelho para todas
  const getDialogGradient = (categoryColor: string) => {
    return 'from-red-700 to-red-900'; // Vermelho do app para todas as categorias
  };
  const dialogGradient = getDialogGradient(category.color);
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="category-dialog-fullscreen p-0 m-0 border-0 rounded-none shadow-none max-w-none max-h-none w-screen h-screen">
        <div className={`
          w-full h-full bg-gradient-to-br ${dialogGradient} 
          flex flex-col overflow-hidden
          data-[state=open]:animate-in data-[state=closed]:animate-out 
          data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom
        `}>
          
          {/* Fixed Header */}
          <div className={`
            flex-shrink-0 bg-black/10 backdrop-blur-sm border-b border-white/10
            ${isMobile ? 'h-16 px-4 py-3' : isTablet ? 'h-18 px-6 py-3' : 'h-20 px-8 py-4'}
            flex items-center justify-between w-full
          `}>
            <Button variant="ghost" size="sm" onClick={handleBack} className="text-white hover:bg-white/10 flex items-center gap-2 px-3 py-2 flex-shrink-0">
              <ArrowLeft className={`${isMobile ? 'h-5 w-5' : 'h-5 w-5'}`} strokeWidth={3} />
              {!isMobile && 'Voltar'}
            </Button>
            
            <div className="flex-1 text-center px-4">
              <div className={`${isMobile ? 'w-8 h-8 mb-1' : isTablet ? 'w-10 h-10 mb-2' : 'w-12 h-12 mb-2'} bg-white/20 rounded-xl flex items-center justify-center mx-auto`}>
                <Icon className={`${isMobile ? 'w-4 h-4' : isTablet ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
              </div>
              <h1 className={`${isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-xl'} font-bold text-white leading-tight`}>
                {category.title}
              </h1>
              
            </div>
            
            <div className={`${isMobile ? 'w-[60px]' : 'w-[80px]'} flex-shrink-0`} />
          </div>

          {/* Scrollable Content */}
          <div className={`
            flex-1 overflow-y-auto overscroll-contain
            ${isMobile ? 'px-4 py-4' : isTablet ? 'px-6 py-5' : 'px-8 py-6'}
            w-full
          `}>
            <div className="max-w-4xl mx-auto w-full space-y-6">
              {/* Livros em destaque apenas para Biblioteca */}
              {category.title === 'Biblioteca e Leituras' && <div className="mb-6">
                  
                  <Suspense fallback={<div className="h-32 bg-white/10 rounded-xl animate-pulse" />}>
                    <LazyProductCarousel />
                  </Suspense>
                </div>}

              <div className={`grid gap-3 w-full ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-5'}`}>
                {category.functions.map((functionName, index) => <div key={index} onClick={() => handleFunctionClick(functionName)} className={`
                      cursor-pointer rounded-2xl transition-all duration-300 hover:scale-[1.02]
                      bg-white/10 hover:bg-white/20 shadow-lg hover:shadow-xl group backdrop-blur-sm 
                      border border-white/10 ${isMobile ? 'p-4' : isTablet ? 'p-4' : 'p-5'}
                      active:scale-[0.98] touch-manipulation w-full
                    `}>
                    <div className="flex items-center w-full">
                      <div className={`${isMobile ? 'w-10 h-10' : isTablet ? 'w-12 h-12' : 'w-14 h-14'} bg-white/20 rounded-xl flex items-center justify-center mr-3 flex-shrink-0`}>
                        <Icon className={`${isMobile ? 'w-5 h-5' : isTablet ? 'w-6 h-6' : 'w-7 h-7'} text-white`} />
                      </div>
                      
                      <div className="flex-1 min-w-0 pr-3">
                        <h3 className={`${isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'} font-semibold text-white mb-1 leading-tight`}>
                          {functionName}
                        </h3>
                        <p className={`text-white/70 ${isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-base'} leading-relaxed`}>
                          {getFunctionDescription(functionName)}
                        </p>
                      </div>
                      
                      <div className="text-white/70 group-hover:text-white transition-colors flex-shrink-0">
                        <ChevronRight className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};

// Helper function to get descriptions for each function
const getFunctionDescription = (functionName: string): string => {
  const descriptions: Record<string, string> = {
    'Videoaulas': 'Aprenda com professores especializados através de vídeos didáticos',
    'Cursos Preparatórios': 'Trilhas organizadas de aprendizado para sua preparação',
    'Áudio-aulas': 'Estude enquanto se desloca com conteúdo em áudio',
    'Mapas Mentais': 'Visualize conexões entre conceitos de forma clara',
    'Biblioteca Clássicos': 'Livros fundamentais e clássicos do direito',
    'Biblioteca de Estudos': 'Acervo completo de obras jurídicas especializadas',
    'Indicações de Livros': 'Sugestões personalizadas para seus estudos',
    'Artigos Comentados': 'Análises detalhadas de artigos relevantes',
    'Vade Mecum Digital': 'Legislação sempre atualizada em formato digital',
    'Assistente IA Jurídica': 'Tire dúvidas instantaneamente com inteligência artificial',
    'Plataforma Desktop': 'Ambiente completo de estudos para desktop',
    'Flashcards': 'Sistema de memorização eficiente e inteligente',
    'Banco de Questões': 'Pratique com milhares de exercícios comentados',
    'Simulados OAB': 'Prepare-se para a prova da OAB com simulados reais',
    'Notícias Comentadas': 'Analise casos atuais e jurisprudências',
    'Exercícios Práticos': 'Aplique o conhecimento com casos práticos'
  };
  return descriptions[functionName] || 'Explore esta funcionalidade especializada';
};