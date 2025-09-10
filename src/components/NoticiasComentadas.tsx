
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';
import { useAppFunctions } from '@/hooks/useAppFunctions';

export const NoticiasComentadas = () => {
  const { setCurrentFunction } = useNavigation();
  const { functions, loading } = useAppFunctions();

  // Buscar dados específicos de "Notícias Comentadas" da tabela APP
  const noticiasData = functions.find(func => 
    func.funcao?.toLowerCase().trim() === 'notícias comentadas' || 
    func.funcao?.toLowerCase().includes('noticias comentadas') || 
    func.funcao?.toLowerCase().includes('notícias comentadas')
  );

  const handleBack = () => {
    setCurrentFunction(null);
  };

  return (
    <div className="fixed inset-0 bg-background">
      {/* Header Consistente */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/30 h-14">
        <div className="flex items-center h-full px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 hover:bg-accent/80"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={3} />
            Voltar
          </Button>
          <h1 className="ml-4 text-lg font-semibold">Notícias Comentadas</h1>
        </div>
      </div>
      
      {/* Iframe ocupando o resto da tela */}
      <div className="pt-14 h-full">
        <iframe 
          src="https://noticia-juridica.vercel.app/" 
          className="w-full h-full border-0" 
          title="Notícias Comentadas" 
        />
      </div>
    </div>
  );
};
