import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, BookOpen, User, Download, ExternalLink, Filter, X } from 'lucide-react';
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
interface BibliotecaListaProps {
  area: string;
  livros: LivroJuridico[];
  onBack: () => void;
  onBookClick: (livro: LivroJuridico) => void;
}
export const BibliotecaLista = ({
  area,
  livros,
  onBack,
  onBookClick
}: BibliotecaListaProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'titulo' | 'autor'>('titulo');
  const [previewBook, setPreviewBook] = useState<LivroJuridico | null>(null);

  // Filtrar e ordenar livros
  const filteredAndSortedBooks = useMemo(() => {
    let filtered = livros.filter(livro => livro.livro.toLowerCase().includes(searchTerm.toLowerCase()) || livro.autor && livro.autor.toLowerCase().includes(searchTerm.toLowerCase()) || livro.sobre && livro.sobre.toLowerCase().includes(searchTerm.toLowerCase()));

    // Ordenar
    filtered.sort((a, b) => {
      if (sortBy === 'titulo') {
        return a.livro.localeCompare(b.livro);
      } else {
        return (a.autor || '').localeCompare(b.autor || '');
      }
    });
    return filtered;
  }, [livros, searchTerm, sortBy]);
  const handleDownload = (e: React.MouseEvent, livro: LivroJuridico) => {
    e.stopPropagation();
    if (livro.download) {
      window.open(livro.download, '_blank');
    }
  };
  const handleExternalLink = (e: React.MouseEvent, livro: LivroJuridico) => {
    e.stopPropagation();
    if (livro.link) {
      window.open(livro.link, '_blank');
    }
  };
  return <>
      <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{area}</h1>
          <p className="text-muted-foreground">
            {filteredAndSortedBooks.length} {filteredAndSortedBooks.length === 1 ? 'livro' : 'livros'} encontrado{filteredAndSortedBooks.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por título, autor ou descrição..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value as 'titulo' | 'autor')} className="bg-background border border-border rounded px-3 py-2 text-sm">
            <option value="titulo">Ordenar por Título</option>
            <option value="autor">Ordenar por Autor</option>
          </select>
        </div>
      </div>

      {/* Lista de livros */}
      {filteredAndSortedBooks.length === 0 ? <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Nenhum livro encontrado
          </h3>
          <p className="text-sm text-muted-foreground">
            Tente buscar com outros termos ou verifique a ortografia
          </p>
        </div> : <div className="space-y-4">
          {filteredAndSortedBooks.map((livro, index) => <motion.div key={livro.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3,
          delay: index * 0.05
        }}>
              <Card className="group cursor-pointer hover:shadow-md transition-all duration-300 border-l-4 border-l-primary/50 hover:border-l-primary overflow-hidden" onClick={() => setPreviewBook(livro)}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Imagem do livro - menor */}
                    <div className="w-20 h-28 flex-shrink-0 relative overflow-hidden rounded-lg shadow-sm">
                      {livro.imagem ? <img src={livro.imagem} alt={livro.livro} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-gray-400" />
                        </div>}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Conteúdo - mais compacto */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            
                          </div>
                          
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                            {livro.livro}
                          </h3>
                          
                          {livro.autor && <div className="flex items-center gap-1 text-muted-foreground mb-2">
                              <User className="h-3 w-3" />
                              <span className="text-sm">{livro.autor}</span>
                            </div>}
                        </div>
                        
                        {/* Botões de ação - menores */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {livro.download && <Button variant="outline" size="sm" onClick={e => handleDownload(e, livro)} className="h-8 px-2 text-xs">
                              <Download className="h-3 w-3 mr-1" />
                              Baixar
                            </Button>}
                          {livro.link && <Button variant="outline" size="sm" onClick={e => handleExternalLink(e, livro)} className="h-8 px-2 text-xs">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Link
                            </Button>}
                        </div>
                      </div>
                      
                      {/* Descrição - mais compacta */}
                      {livro.sobre && <div className="mb-3">
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                            {livro.sobre}
                          </p>
                        </div>}
                      
                      {/* Call to action - menor */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Clique para ler
                        </span>
                        <div className="flex items-center gap-1 text-primary">
                          <span className="text-xs font-medium">Abrir livro</span>
                          <BookOpen className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>)}
        </div>}
    </div>

    {/* Preview Modal */}
    <AnimatePresence>
      {previewBook && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setPreviewBook(null)}>
          <motion.div initial={{
          scale: 0.95,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.95,
          opacity: 0
        }} className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="pr-4">
                  <h2 className="text-xl font-bold text-foreground mb-1">{previewBook.livro}</h2>
                  {previewBook.autor && <p className="text-sm text-muted-foreground">Autor: {previewBook.autor}</p>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => setPreviewBook(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-6">
                <div className="w-28 h-40 flex-shrink-0 rounded-md overflow-hidden shadow">
                  {previewBook.imagem ? <img src={previewBook.imagem} alt={previewBook.livro} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>}
                </div>
                <div className="flex-1">
                  {previewBook.sobre && <div className="mb-4">
                      <h3 className="text-base font-semibold mb-2">Sobre o livro</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{previewBook.sobre}</p>
                    </div>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <Button onClick={() => {
                    onBookClick(previewBook);
                    setPreviewBook(null);
                  }}>
                      Ler agora
                    </Button>
                    {previewBook.download && <Button variant="outline" onClick={() => window.open(previewBook.download!, '_blank')}>
                        Download
                      </Button>}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>}
    </AnimatePresence>
    </>;
};