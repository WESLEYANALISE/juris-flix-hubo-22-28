import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface JuridicalBookCardProps {
  livro: LivroJuridico;
  showAreaBadge?: boolean;
  onClick?: () => void;
}

const getAreaColor = (area: string) => {
  const colors = {
    'Direito Civil': 'bg-blue-500/80 text-white',
    'Direito Penal': 'bg-red-500/80 text-white',
    'Direito Constitucional': 'bg-green-500/80 text-white',
    'Direito Administrativo': 'bg-purple-500/80 text-white',
    'Direito do Trabalho': 'bg-orange-500/80 text-white',
    'Direito Tributário': 'bg-yellow-600/80 text-white',
    'Direito Empresarial': 'bg-indigo-500/80 text-white',
    'Direito Ambiental': 'bg-emerald-500/80 text-white',
    'Direito Internacional': 'bg-cyan-500/80 text-white',
    'Processo Civil': 'bg-blue-600/80 text-white',
    'Processo Penal': 'bg-red-600/80 text-white',
  };
  return colors[area as keyof typeof colors] || 'bg-gray-500/80 text-white';
};

export const JuridicalBookCard = ({ livro, showAreaBadge = false, onClick }: JuridicalBookCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowDetails(true);
    }
  };

  const handleCloseDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(false);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (livro.download) {
      window.open(livro.download, '_blank');
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (livro.link) {
      setShowLinkModal(true);
    }
  };

  const closeLinkModal = () => {
    setShowLinkModal(false);
  };

  const areaColor = getAreaColor(livro.area);

  return (
    <>
      <motion.div
        layout
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
        onClick={handleCardClick}
      >
        <Card className="h-full shadow-professional hover:shadow-deep transition-all duration-300 border-l-4 overflow-hidden" 
              style={{ borderLeftColor: areaColor.includes('bg-') ? undefined : areaColor }}>
          <CardContent className="p-4">
            <div className="flex gap-4 h-full">
              {/* Imagem do livro */}
              <div className="w-20 h-28 flex-shrink-0 rounded-md overflow-hidden shadow-md">
                {livro.imagem ? (
                  <img
                    src={livro.imagem}
                    alt={livro.livro}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Conteúdo */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-base leading-tight text-foreground">
                      {livro.livro}
                    </h3>
                    {showAreaBadge && (
                      <Badge className={`ml-2 text-xs flex-shrink-0 ${areaColor}`}>
                        {livro.area}
                      </Badge>
                    )}
                  </div>
                  
                  {livro.autor && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {livro.autor}
                    </p>
                  )}
                  
                  {livro.sobre && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {livro.sobre}
                    </p>
                  )}
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2 justify-end">
                  {livro.link && (
                    <Button 
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={handleLinkClick}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Ler
                    </Button>
                  )}
                  {livro.download && (
                    <Button 
                      size="sm"
                      className="h-8 text-xs"
                      onClick={handleDownloadClick}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Baixar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal de detalhes */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseDetails}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      {livro.livro}
                    </h2>
                    <Badge className={areaColor}>
                      {livro.area}
                    </Badge>
                    {livro.autor && (
                      <p className="text-muted-foreground mt-2">
                        Autor: {livro.autor}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseDetails}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-6">
                  {/* Imagem do livro */}
                  <div className="w-32 h-44 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                    {livro.imagem ? (
                      <img
                        src={livro.imagem}
                        alt={livro.livro}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Detalhes */}
                  <div className="flex-1">
                    {livro.sobre && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Sobre o Livro</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {livro.sobre}
                        </p>
                      </div>
                    )}

                    {/* Botões de ação */}
                    <div className="flex gap-3">
                      {livro.link && (
                        <Button 
                          className="flex-1"
                          onClick={handleLinkClick}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ler agora
                        </Button>
                      )}
                      {livro.download && (
                        <Button 
                          variant="outline"
                          className="flex-1"
                          onClick={handleDownloadClick}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Baixar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para visualizar o link dentro do app */}
      <AnimatePresence>
        {showLinkModal && livro.link && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeLinkModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg w-full h-[90vh] max-w-6xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-border">
                <h3 className="text-lg font-semibold">{livro.livro}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeLinkModal}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <iframe 
                src={livro.link} 
                className="w-full flex-1 h-[calc(90vh-80px)]" 
                title={livro.livro}
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};