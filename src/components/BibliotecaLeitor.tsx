import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { FloatingProfessoraButton } from '@/components/FloatingProfessoraButton';
import { BotaoAudioRelaxante } from '@/components/BotaoAudioRelaxante';
import { motion } from 'framer-motion';

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

interface BibliotecaLeitorProps {
  livro: LivroJuridico;
  onClose: () => void;
}

export const BibliotecaLeitor = ({ livro, onClose }: BibliotecaLeitorProps) => {
  const [showAudioModal, setShowAudioModal] = useState(false);

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAudioModal(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white border-green-500"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              Som Ambiente
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-hidden">
        {livro.link ? (
          <div className="w-full h-full">
            <iframe 
              src={livro.link} 
              className="w-full h-full border-0" 
              title={livro.livro}
              loading="lazy"
              allow="fullscreen"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md p-8">
              {livro.imagem && (
                <div className="w-48 h-64 mx-auto mb-6 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={livro.imagem}
                    alt={livro.livro}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {livro.livro}
              </h2>
              
              {livro.autor && (
                <p className="text-muted-foreground mb-4">
                  Autor: {livro.autor}
                </p>
              )}
              
              {livro.sobre && (
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {livro.sobre}
                </p>
              )}
              
              <div className="space-y-3">
                {livro.link && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(livro.link, '_blank')}
                    className="w-full flex items-center gap-2"
                  >
                    Abrir Link Original
                  </Button>
                )}
                
                {!livro.link && (
                  <p className="text-sm text-muted-foreground">
                    Este livro não possui link disponível no momento.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botões flutuantes - Apenas na área da biblioteca */}
      <div className="fixed bottom-8 right-8 z-40">
        <FloatingProfessoraButton 
          forceShow={true} 
          video={null}
          livro={livro}
          area={livro.area}
        />
      </div>
    </motion.div>
    
    {/* Modal de áudio relaxante controlado manualmente */}
    {showAudioModal && (
      <div className="fixed inset-0 z-[60]">
        <BotaoAudioRelaxante />
        <button 
          onClick={() => setShowAudioModal(false)}
          className="fixed inset-0 bg-transparent"
        />
      </div>
    )}
    </>
  );
};