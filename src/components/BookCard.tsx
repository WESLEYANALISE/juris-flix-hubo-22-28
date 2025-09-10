
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumRequired } from './PremiumRequired';

interface BookCardProps {
  book: {
    area: string;
    livro: string;
    imagem: string;
    sobre: string;
    download: string;
    profissao: string;
    logo: string;
    'proficao do logo': string;
  };
  areaColor: string;
  getProfessionLogo: (profession: string) => string | null;
  showAreaBadge?: boolean;
}

export const BookCard = ({ book, areaColor, getProfessionLogo, showAreaBadge = false }: BookCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleCardClick = () => {
    setShowDetails(true);
  };

  const handleCloseDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(false);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.download) {
      window.open(book.download, '_blank');
    }
  };

  return (
    <>
      <motion.div
        layout
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
        onClick={handleCardClick}
      >
        <Card className="h-full shadow-professional hover:shadow-deep hover:shadow-red-glow transition-all duration-300 border-l-4 overflow-hidden" 
              style={{ borderLeftColor: areaColor }}>
          <CardContent className="p-4">
            <div className="flex gap-4 h-full">
              {/* Imagem do livro */}
              <div className="w-20 h-28 flex-shrink-0 rounded-md overflow-hidden shadow-md">
                {book.imagem ? (
                  <img
                    src={book.imagem}
                    alt={book.livro}
                    className="w-full h-full object-cover"
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
                      {book.livro}
                    </h3>
                    {showAreaBadge && (
                      <Badge className={`ml-2 text-xs flex-shrink-0 ${areaColor}`}>
                        {book.area}
                      </Badge>
                    )}
                  </div>
                  
                  {book.sobre && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {book.sobre}
                    </p>
                  )}

                  {/* Profissões */}
                  {book.profissao && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1 items-center">
                        {book.profissao.split(',').map((profession: string, idx: number) => {
                          const trimmedProfession = profession.trim();
                          const logo = getProfessionLogo(trimmedProfession);
                          return (
                            <div key={idx} className="flex items-center gap-1">
                              {logo && (
                                <div className="w-4 h-4 p-0.5 bg-white rounded-sm shadow-sm border">
                                  <img
                                    src={logo}
                                    alt={trimmedProfession}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              )}
                              <Badge variant="outline" className="text-xs py-0 px-2">
                                {trimmedProfession}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Botão de download direto */}
                <div className="flex justify-end">
                  {book.download && (
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
                      {book.livro}
                    </h2>
                    <Badge className={`${areaColor} mb-2`}>
                      {book.area}
                    </Badge>
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
                    {book.imagem ? (
                      <img
                        src={book.imagem}
                        alt={book.livro}
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
                    {book.sobre && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Sinopse</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {book.sobre}
                        </p>
                      </div>
                    )}

                    {/* Profissões */}
                    {book.profissao && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Profissões Recomendadas</h3>
                        <div className="flex flex-wrap gap-2">
                          {book.profissao.split(',').map((profession: string, idx: number) => {
                            const trimmedProfession = profession.trim();
                            const logo = getProfessionLogo(trimmedProfession);
                            return (
                              <div key={idx} className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                                {logo && (
                                  <div className="w-6 h-6 p-1 bg-white rounded-md shadow-sm border">
                                    <img
                                      src={logo}
                                      alt={trimmedProfession}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                )}
                                <span className="text-sm font-medium">{trimmedProfession}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Botão de download direto */}
                    {book.download && (
                      <Button 
                        className="w-full"
                        onClick={handleDownloadClick}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Livro
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};
