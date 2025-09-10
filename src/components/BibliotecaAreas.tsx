import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight } from 'lucide-react';

interface LivroJuridico {
  id: number;
  imagem: string;
  livro: string;
  autor?: string;
  area: string;
  sobre?: string;
  link?: string;
  download?: string;
}

interface BibliotecaAreasProps {
  livrosPorArea: Record<string, LivroJuridico[]>;
  areas: string[];
  onAreaClick: (area: string) => void;
}

const getAreaColor = (area: string) => {
  const colors = {
    'Direito Civil': 'from-blue-500 to-blue-600',
    'Direito Penal': 'from-red-500 to-red-600',
    'Direito Constitucional': 'from-green-500 to-green-600',
    'Direito Administrativo': 'from-purple-500 to-purple-600',
    'Direito do Trabalho': 'from-orange-500 to-orange-600',
    'Direito Tributário': 'from-yellow-500 to-yellow-600',
    'Direito Empresarial': 'from-indigo-500 to-indigo-600',
    'Direito Ambiental': 'from-emerald-500 to-emerald-600',
    'Direito Internacional': 'from-cyan-500 to-cyan-600',
    'Processo Civil': 'from-blue-600 to-blue-700',
    'Processo Penal': 'from-red-600 to-red-700',
  };
  return colors[area as keyof typeof colors] || 'from-gray-500 to-gray-600';
};

export const BibliotecaAreas = ({ livrosPorArea, areas, onAreaClick }: BibliotecaAreasProps) => {
  if (areas.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          Biblioteca em construção
        </h3>
        <p className="text-sm text-muted-foreground">
          Em breve teremos livros disponíveis para estudo
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text-legal mb-4">
          📚 Biblioteca Jurídica Completa
        </h2>
        <p className="text-muted-foreground text-lg">
          {Object.values(livrosPorArea).reduce((acc, livros) => acc + livros.length, 0)} livros organizados em {areas.length} áreas do direito
        </p>
      </div>

      {/* Grid de áreas */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {areas.map((area, index) => {
          const livros = livrosPorArea[area] || [];
          const gradientColor = getAreaColor(area);
          
          return (
            <motion.div
              key={area}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.1 
              }}
            >
              <Card 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden"
                onClick={() => onAreaClick(area)}
              >
                <div className={`h-24 bg-gradient-to-br ${gradientColor} relative`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                  <div className="absolute top-4 right-4">
                    <BookOpen className="h-8 w-8 text-white/80" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {livros.length} {livros.length === 1 ? 'livro' : 'livros'}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {area}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Explore nossa coleção de livros em {area.toLowerCase()}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  {/* Preview dos primeiros livros */}
                  {livros.length > 0 && (
                    <div className="mt-4 flex -space-x-2">
                      {livros.slice(0, 3).map((livro) => (
                        <div 
                          key={livro.id}
                          className="w-8 h-10 rounded shadow-sm border-2 border-background overflow-hidden"
                        >
                          {livro.imagem ? (
                            <img
                              src={livro.imagem}
                              alt={livro.livro}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                          )}
                        </div>
                      ))}
                      {livros.length > 3 && (
                        <div className="w-8 h-10 rounded shadow-sm border-2 border-background bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium text-muted-foreground">+{livros.length - 3}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};