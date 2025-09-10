import { lazy, Suspense, memo } from 'react';
import { useInstantLoader } from '@/utils/instantLoader';

// Loading component otimizado
const OptimizedLoading = memo(() => (
  <div className="w-full h-32 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
));
OptimizedLoading.displayName = 'OptimizedLoading';

// HOC para componentes instantâneos
export const withInstantLoading = <P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  componentPath: string
) => {
  const LazyComponent = lazy(importFn);
  
  const InstantComponent = memo((props: P) => {
    const { preload, isLoaded } = useInstantLoader();
    
    // Preload no mount se ainda não carregou
    if (!isLoaded(componentPath)) {
      preload(componentPath);
    }
    
    return (
      <Suspense fallback={<OptimizedLoading />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    );
  });
  
  InstantComponent.displayName = `InstantComponent(${componentPath})`;
  return InstantComponent;
};

// Componentes principais com carregamento instantâneo
export const InstantCategoryAccessSection = withInstantLoading(
  () => import('@/components/CategoryAccessSection').then(m => ({ default: m.CategoryAccessSection })),
  '@/components/CategoryAccessSection'
);

export const InstantSocialMediaFooter = withInstantLoading(
  () => import('@/components/SocialMediaFooter').then(m => ({ default: m.SocialMediaFooter })),
  '@/components/SocialMediaFooter'
);

export const InstantAppFunction = withInstantLoading(
  () => import('@/components/AppFunctionOptimized').then(m => ({ default: m.AppFunction })),
  '@/components/AppFunctionOptimized'
);

export const InstantVideoaulas = withInstantLoading(
  () => import('@/components/Videoaulas').then(m => ({ default: m.Videoaulas })),
  '@/components/Videoaulas'
);

export const InstantNoticiasJuridicas = withInstantLoading(
  () => import('@/components/NoticiasJuridicas').then(m => ({ default: m.NoticiasJuridicas })),
  '@/components/NoticiasJuridicas'
);

export const InstantBancoQuestoes = withInstantLoading(
  () => import('@/components/BancoQuestoes').then(m => ({ default: m.BancoQuestoes })),
  '@/components/BancoQuestoes'
);

export const InstantFlashcards = withInstantLoading(
  () => import('@/components/Flashcards').then(m => ({ default: m.Flashcards })),
  '@/components/Flashcards'
);

export const InstantAssistenteIA = withInstantLoading(
  () => import('@/components/AssistenteIA').then(m => ({ default: m.AssistenteIA })),
  '@/components/AssistenteIA'
);

export const InstantPlanoEstudo = withInstantLoading(
  () => import('@/components/PlanoEstudo/PlanoEstudo').then(m => ({ default: m.PlanoEstudo })),
  '@/components/PlanoEstudo/PlanoEstudo'
);