import { Suspense, memo, useEffect, useState } from 'react';

import { MobileLayout } from '@/components/MobileLayout';
import { DesktopLayout } from '@/components/DesktopLayout';
import { TabletLayout } from '@/components/TabletLayout';
import { IntroOnboarding } from '@/components/IntroOnboarding';
import { useNavigation } from '@/context/NavigationContext';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { 
  LazyFeaturesGrid, 
  LazySuporteTab, 
  LazyProductCarousel,
  preloadCriticalComponents
} from '@/components/lazy/LazyComponents';
import { 
  InstantCategoryAccessSection, 
  InstantSocialMediaFooter, 
  InstantAppFunction 
} from '@/components/performance/InstantComponents';
import { optimizeAppLoading } from '@/utils/bundleOptimization';

// Loading fallback component
const LoadingComponent = memo(() => <div className="w-full h-32 flex items-center justify-center animate-pulse">
    <div className="text-muted-foreground">Carregando...</div>
  </div>);
LoadingComponent.displayName = 'LoadingComponent';

const Index = memo(() => {
  const {
    isInFunction
  } = useNavigation();
  const {
    isMobile,
    isTablet,
    isDesktop
  } = useDeviceDetection();

  const [showIntro, setShowIntro] = useState(false);

  // Check if intro should be shown
  useEffect(() => {
    const introSeen = localStorage.getItem('intro_seen_v1');
    if (!introSeen) {
      setShowIntro(true);
    }
  }, []);

  // Preload componentes críticos na inicialização
  useEffect(() => {
    preloadCriticalComponents();
    optimizeAppLoading();
  }, []);

  // Handle intro completion
  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  // Show intro onboarding if first visit
  if (showIntro) {
    return <IntroOnboarding onComplete={handleIntroComplete} />;
  }

  // If we're in a function, show the function component with instant loading
  if (isInFunction) {
    return <InstantAppFunction />;
  }

  // Main content for both mobile and desktop with instant loading
  const mainContent = <>
      {/* Category Access Section - Instant loading */}
      <InstantCategoryAccessSection />

      {/* Social Media Footer - Instant loading */}
      <InstantSocialMediaFooter />
    </>;

  // Return appropriate layout based on device
  if (isMobile) {
    return <MobileLayout>{mainContent}</MobileLayout>;
  }
  if (isTablet) {
    return <TabletLayout>{mainContent}</TabletLayout>;
  }
  return <DesktopLayout>{mainContent}</DesktopLayout>;
});
Index.displayName = 'Index';
export default Index;