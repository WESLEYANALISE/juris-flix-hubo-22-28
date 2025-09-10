import { useState, Suspense, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { LazyProfessoraIA } from '@/components/lazy/LazyComponents';

interface FloatingProfessoraButtonProps {
  video?: any;
  livro?: any;
  area?: string;
  forceShow?: boolean;
}

export const FloatingProfessoraButton = ({ video, livro, area, forceShow = false }: FloatingProfessoraButtonProps) => {
  const [showProfessoraIA, setShowProfessoraIA] = useState(false);
  const [isComponentReady, setIsComponentReady] = useState(false);
  const isMobile = useIsMobile();

  // Só aparecer quando forceShow for true (contexto específico)
  const shouldShow = forceShow;

  // Precarregar o componente quando necessário
  useEffect(() => {
    if (shouldShow) {
      // Dar um tempo para o componente se preparar
      const timer = setTimeout(() => {
        setIsComponentReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [shouldShow]);

  // Mostrar apenas quando forceShow for true
  if (!shouldShow) return null;

  const handleOpenIA = () => {
    if (isComponentReady) {
      setShowProfessoraIA(true);
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      <Button
        onClick={handleOpenIA}
        className={`fixed ${isMobile ? 'bottom-20 right-4' : 'bottom-8 right-20'} z-40 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-2xl border-2 border-white/20 transition-all duration-300 hover:scale-105`}
        size="lg"
        disabled={!isComponentReady}
      >
        <GraduationCap className="h-8 w-8 text-white" />
      </Button>

      {/* Professora IA Modal */}
      {isComponentReady && (
        <Suspense fallback={
          showProfessoraIA ? (
            <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
              <div className="bg-background rounded-lg p-6 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span>Carregando Professora IA...</span>
                </div>
              </div>
            </div>
          ) : null
        }>
          <LazyProfessoraIA 
            video={video}
            livro={livro}
            area={area}
            isOpen={showProfessoraIA}
            onClose={() => setShowProfessoraIA(false)}
          />
        </Suspense>
      )}
    </>
  );
};