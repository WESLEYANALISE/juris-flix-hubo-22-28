import { lazy } from 'react';

// Lazy loading para componentes pesados com preloading
export const LazyFeaturesGrid = lazy(() => 
  import('@/components/FeaturesGrid').then(module => ({ default: module.FeaturesGrid }))
);

export const LazyFeaturesCarousel = lazy(() => 
  import('@/components/FeaturesCarousel').then(module => ({ default: module.FeaturesCarousel }))
);

export const LazyStatsSection = lazy(() => 
  import('@/components/StatsSection').then(module => ({ default: module.StatsSection }))
);

export const LazySocialMediaFooter = lazy(() => 
  import('@/components/SocialMediaFooter').then(module => ({ default: module.SocialMediaFooter }))
);

export const LazySuporteTab = lazy(() => 
  import('@/components/SuporteTab').then(module => ({ default: module.SuporteTab }))
);

export const LazyAppFunction = lazy(() => 
  import('@/components/AppFunctionOptimized').then(module => ({ default: module.AppFunction }))
);

// Novos componentes lazy para otimização
export const LazyProductCarousel = lazy(() => 
  import('@/components/ProductCarousel')
);

export const LazyQuickAccessSection = lazy(() => 
  import('@/components/QuickAccessSection').then(module => ({ default: module.QuickAccessSection }))
);

export const LazyVideoaulas = lazy(() => 
  import('@/components/Videoaulas').then(module => ({ default: module.Videoaulas }))
);

export const LazyNoticiasJuridicas = lazy(() => 
  import('@/components/NoticiasJuridicas').then(module => ({ default: module.NoticiasJuridicas }))
);

export const LazyBancoQuestoes = lazy(() => 
  import('@/components/BancoQuestoes').then(module => ({ default: module.BancoQuestoes }))
);

export const LazyFlashcards = lazy(() => 
  import('@/components/Flashcards').then(module => ({ default: module.Flashcards }))
);

export const LazyBibliotecaClassicos = lazy(() => 
  import('@/components/BibliotecaClassicos').then(module => ({ default: module.BibliotecaClassicos }))
);

export const LazyLoja = lazy(() => 
  import('@/components/Loja').then(module => ({ default: module.Loja }))
);

export const LazyAssistenteIA = lazy(() => 
  import('@/components/AssistenteIA').then(module => ({ default: module.AssistenteIA }))
);

export const LazyAIDocumentAnalyzer = lazy(() => 
  import('@/components/AIDocumentAnalyzer').then(module => ({ default: module.AIDocumentAnalyzer }))
);

export const LazyProfessoraIA = lazy(() => 
  import('@/components/ProfessoraIA').then(module => ({ default: module.ProfessoraIA }))
);

export const LazyCategoryAccessSection = lazy(() => 
  import('@/components/CategoryAccessSection').then(module => ({ default: module.CategoryAccessSection }))
);

export const LazyPlanoEstudo = lazy(() => 
  import('@/components/PlanoEstudo/PlanoEstudo').then(module => ({ default: module.PlanoEstudo }))
);

export const LazyRedacao = lazy(() => 
  import('@/components/Redacao').then(module => ({ default: module.Redacao }))
);

export const LazyMapasMentais = lazy(() => 
  import('@/components/MapasMentais').then(module => ({ default: module.MapasMentais }))
);

// Preload functions para componentes críticos
export const preloadCriticalComponents = () => {
  // Preload componentes que serão usados com frequência
  import('@/components/ProductCarousel');
  import('@/components/CategoryAccessSection');
  import('@/components/AppFunctionOptimized');
  
  // Preload recursos críticos
  requestIdleCallback(() => {
    import('@/components/Videoaulas');
    import('@/components/NoticiasJuridicas');
    import('@/components/BancoQuestoes');
    import('@/components/PlanoEstudo/PlanoEstudo');
  });
};
