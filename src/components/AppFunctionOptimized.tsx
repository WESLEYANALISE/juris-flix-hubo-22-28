
import React, { Suspense, memo, useMemo } from 'react';
import { useNavigation } from '@/context/NavigationContext';
import { useAppFunctions } from '@/hooks/useAppFunctions';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Componentes instantâneos para funcionalidades críticas
import { 
  InstantVideoaulas,
  InstantNoticiasJuridicas, 
  InstantBancoQuestoes,
  InstantFlashcards,
  InstantAssistenteIA,
  InstantPlanoEstudo
} from '@/components/performance/InstantComponents';

// Imports diretos para componentes nativos (sem loading)
import { Downloads } from '@/components/Downloads';
import { PlataformaDesktop } from '@/components/PlataformaDesktop';
import { BibliotecaEstudos } from '@/components/BibliotecaEstudos';
import { Redacao } from '@/components/Redacao';

// Lazy imports para componentes menos críticos
import { 
  LazyLoja,
  LazyMapasMentais
} from '@/components/lazy/LazyComponents';

const LoadingComponent = memo(() => (
  <div className="w-full h-64 flex items-center justify-center animate-pulse">
    <div className="text-muted-foreground">Carregando...</div>
  </div>
));
LoadingComponent.displayName = 'LoadingComponent';

// Componente de Header Consistente
const FunctionHeader = memo(({ title, onBack }: { title: string; onBack: () => void }) => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/30 h-14">
    <div className="flex items-center h-full px-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="flex items-center gap-2 hover:bg-accent/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>
      <h1 className="ml-4 text-lg font-semibold truncate">{title}</h1>
    </div>
  </div>
));
FunctionHeader.displayName = 'FunctionHeader';

export const AppFunction = memo(() => {
  const { currentFunction, setCurrentFunction } = useNavigation();
  const { functions, loading, findFunction } = useAppFunctions();

  // Memoizar dados da função atual
  const functionData = useMemo(() => {
    if (!currentFunction) return null;
    return findFunction(currentFunction);
  }, [currentFunction, findFunction]);

  const handleBack = () => {
    setCurrentFunction(null);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (!currentFunction) {
    return null;
  }

  // Componentes específicos que sempre devem ser internos (não usar links da tabela)
  const lowerCaseFunction = currentFunction.toLowerCase();
  
  console.log('AppFunctionOptimized - currentFunction:', currentFunction);
  console.log('AppFunctionOptimized - lowerCaseFunction:', lowerCaseFunction);
  console.log('AppFunctionOptimized - functionData:', functionData);
  
  // Downloads e Plataforma Desktop sempre usam componentes internos
  if (lowerCaseFunction.includes('downloads') || currentFunction === 'Downloads') {
    return <Downloads />;
  }
  
  if (lowerCaseFunction.includes('plataforma desktop') || currentFunction === 'Plataforma Desktop') {
    return <PlataformaDesktop />;
  }

  // Videoaulas sempre interno - carregamento instantâneo
  if (lowerCaseFunction.includes('videoaulas') || lowerCaseFunction.includes('vídeoaulas') || currentFunction === 'Videoaulas') {
    return <InstantVideoaulas />;
  }
  
  // Notícias Jurídicas/Portais Jurídicos sempre interno - carregamento instantâneo
  if (lowerCaseFunction.includes('notícias jurídicas') || 
      lowerCaseFunction.includes('portais jurídicos') ||
      lowerCaseFunction.includes('noticias juridicas') ||
      lowerCaseFunction.includes('portais juridicos') ||
      currentFunction === 'Notícias Jurídicas' ||
      currentFunction === 'Portais Jurídicos') {
    return <InstantNoticiasJuridicas />;
  }

  // Biblioteca de Estudos sempre interno - sobrescrever qualquer link da tabela
  if (lowerCaseFunction.includes('biblioteca') && (lowerCaseFunction.includes('clássicos') || lowerCaseFunction.includes('estudos'))) {
    return <BibliotecaEstudos />;
  }

  // Outros componentes específicos - carregamento instantâneo para os mais usados
  if (lowerCaseFunction.includes('banco de questões') || lowerCaseFunction.includes('banco questoes')) {
    return <InstantBancoQuestoes />;
  }
  
  if (lowerCaseFunction.includes('flashcards')) {
    return <InstantFlashcards />;
  }

  // Para qualquer outra função que tenha link na tabela APP, usar iframe
  if (functionData?.link && functionData.link.trim() !== '') {
    console.log('AppFunctionOptimized - Usando iframe para:', functionData.funcao);
    return (
      <div className="fixed inset-0 bg-background">
        <FunctionHeader title={functionData.funcao || currentFunction} onBack={handleBack} />
        <div className="pt-14 h-full">
          <iframe 
            src={functionData.link} 
            className="w-full h-full border-0" 
            title={functionData.funcao || currentFunction}
            loading="lazy"
          />
        </div>
      </div>
    );
  }
  
  if (lowerCaseFunction.includes('loja')) {
    return <Suspense fallback={<LoadingComponent />}><LazyLoja /></Suspense>;
  }
  
  // Assistente IA - verificação mais ampla - carregamento instantâneo
  if (lowerCaseFunction.includes('assistente') || currentFunction === 'Assistente IA Jurídica' || currentFunction === 'Assistente IA') {
    console.log('AppFunctionOptimized - Renderizando InstantAssistenteIA');
    return <InstantAssistenteIA />;
  }
  
  // Plano de Estudo - carregamento instantâneo
  if (lowerCaseFunction.includes('plano') || currentFunction === 'Plano de Estudo') {
    return <InstantPlanoEstudo />;
  }

  // Redação - componente nativo (sem loading)
  if (lowerCaseFunction.includes('redação') || lowerCaseFunction.includes('redacao') || currentFunction === 'Redação') {
    return <Redacao />;
  }

  // Mapas Mentais - lazy loading
  if (lowerCaseFunction.includes('mapas mentais') || lowerCaseFunction.includes('mapa mental') || currentFunction === 'Mapas Mentais') {
    return <Suspense fallback={<LoadingComponent />}><LazyMapasMentais /></Suspense>;
  }

  // Fallback padrão - layout não fullscreen para funcionalidades em desenvolvimento
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center p-4 border-b bg-card/50 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="ml-4 text-lg font-semibold">{currentFunction}</h1>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Funcionalidade em Desenvolvimento</h2>
          <p className="text-muted-foreground">
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </p>
        </div>
      </div>
    </div>
  );
});

AppFunction.displayName = 'AppFunction';
