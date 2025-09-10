import { GraduationCap, PenTool } from 'lucide-react';
import { useNavigation } from '@/context/NavigationContext';

export const SocialMediaFooter = () => {
  const { setCurrentFunction } = useNavigation();

  const handlePlanoEstudo = () => {
    setCurrentFunction('Plano de Estudo');
  };

  const handleRedacao = () => {
    setCurrentFunction('Redação');
  };

  return (
    <div className="bg-card border-t border-border py-6 mt-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center items-center gap-4">
            <button 
              onClick={handlePlanoEstudo}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[hsl(var(--info))] to-[hsl(var(--store-primary))] hover:from-[hsl(var(--info)_/_0.9)] hover:to-[hsl(var(--store-primary)_/_0.9)] text-white rounded-full transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg text-sm"
            >
              <GraduationCap className="w-5 h-5" />
              <span className="font-medium">Plano de Estudo</span>
            </button>
            <button 
              onClick={handleRedacao}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[hsl(var(--community-primary))] to-[hsl(var(--community-secondary))] hover:from-[hsl(var(--community-primary)_/_0.9)] hover:to-[hsl(var(--community-secondary)_/_0.9)] text-white rounded-full transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg text-sm"
            >
              <PenTool className="w-5 h-5" />
              <span className="font-medium">Redação Perfeita</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};