
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Search, 
  Tag, 
  Edit2, 
  Trash2, 
  Save,
  X,
  Calendar,
  Filter,
  Bold,
  Italic,
  List,
  Hash
} from 'lucide-react';

interface Anotacao {
  id: string;
  titulo: string;
  conteudo: string;
  tags: string[];
  categoria: string;
  dataModificacao: Date;
  formatacao?: {
    negrito?: boolean;
    italico?: boolean;
    lista?: boolean;
  };
}

interface Categoria {
  nome: string;
  cor: string;
}

const categoriasPadrao: Categoria[] = [
  { nome: 'Geral', cor: 'bg-blue-500' },
  { nome: 'Estudo', cor: 'bg-green-500' },
  { nome: 'Trabalho', cor: 'bg-purple-500' },
  { nome: 'Projeto', cor: 'bg-orange-500' },
  { nome: 'Importante', cor: 'bg-red-500' }
];

export const Anotacoes = () => {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroTag, setFiltroTag] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novaAnotacao, setNovaAnotacao] = useState({
    titulo: '',
    conteudo: '',
    categoria: 'Geral',
    tags: ''
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Carregar anotações do localStorage
  useEffect(() => {
    const anotacoesSalvas = localStorage.getItem('anotacoes-juridicas');
    if (anotacoesSalvas) {
      const parsed = JSON.parse(anotacoesSalvas);
      // Converter strings de data para objetos Date
      const anotacoesComData = parsed.map((anotacao: any) => ({
        ...anotacao,
        dataModificacao: new Date(anotacao.dataModificacao)
      }));
      setAnotacoes(anotacoesComData);
    }
  }, []);

  // Salvar anotações no localStorage
  const salvarAnotacoes = (novasAnotacoes: Anotacao[]) => {
    localStorage.setItem('anotacoes-juridicas', JSON.stringify(novasAnotacoes));
    setAnotacoes(novasAnotacoes);
  };

  const criarAnotacao = () => {
    if (!novaAnotacao.titulo.trim()) return;

    const anotacao: Anotacao = {
      id: Date.now().toString(),
      titulo: novaAnotacao.titulo,
      conteudo: novaAnotacao.conteudo,
      categoria: novaAnotacao.categoria,
      tags: novaAnotacao.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      dataModificacao: new Date()
    };

    const novasAnotacoes = [anotacao, ...anotacoes];
    salvarAnotacoes(novasAnotacoes);
    
    setNovaAnotacao({ titulo: '', conteudo: '', categoria: 'Geral', tags: '' });
    setMostrarFormulario(false);
  };

  const editarAnotacao = (id: string, dadosAtualizados: Partial<Anotacao>) => {
    const novasAnotacoes = anotacoes.map(anotacao => 
      anotacao.id === id 
        ? { ...anotacao, ...dadosAtualizados, dataModificacao: new Date() }
        : anotacao
    );
    salvarAnotacoes(novasAnotacoes);
    setEditandoId(null);
  };

  const excluirAnotacao = (id: string) => {
    const novasAnotacoes = anotacoes.filter(anotacao => anotacao.id !== id);
    salvarAnotacoes(novasAnotacoes);
  };

  // Filtrar anotações
  const anotacoesFiltradas = anotacoes.filter(anotacao => {
    const textoMatch = !filtroTexto || 
      anotacao.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      anotacao.conteudo.toLowerCase().includes(filtroTexto.toLowerCase());
    
    const categoriaMatch = !filtroCategoria || anotacao.categoria === filtroCategoria;
    
    const tagMatch = !filtroTag || 
      anotacao.tags.some(tag => tag.toLowerCase().includes(filtroTag.toLowerCase()));

    return textoMatch && categoriaMatch && tagMatch;
  });

  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data);
  };

  const obterCorCategoria = (categoria: string) => {
    const cat = categoriasPadrao.find(c => c.nome === categoria);
    return cat ? cat.cor : 'bg-gray-500';
  };

  const todasAsTags = [...new Set(anotacoes.flatMap(a => a.tags))];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold gradient-text">Minhas Anotações</h1>
            <p className="text-muted-foreground">
              Organize suas ideias e conhecimentos jurídicos
            </p>
          </div>
        </div>

        {/* Botão Nova Anotação */}
        <Button 
          onClick={() => setMostrarFormulario(true)}
          className="mb-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Anotação
        </Button>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título ou conteúdo..."
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Todas as categorias</option>
                {categoriasPadrao.map(categoria => (
                  <option key={categoria.nome} value={categoria.nome}>
                    {categoria.nome}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Tag className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Filtrar por tag..."
                  value={filtroTag}
                  onChange={(e) => setFiltroTag(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário Nova Anotação */}
      {mostrarFormulario && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Nova Anotação
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setMostrarFormulario(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Título da anotação..."
              value={novaAnotacao.titulo}
              onChange={(e) => setNovaAnotacao({...novaAnotacao, titulo: e.target.value})}
            />
            
            <select
              value={novaAnotacao.categoria}
              onChange={(e) => setNovaAnotacao({...novaAnotacao, categoria: e.target.value})}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {categoriasPadrao.map(categoria => (
                <option key={categoria.nome} value={categoria.nome}>
                  {categoria.nome}
                </option>
              ))}
            </select>

            <Input
              placeholder="Tags (separadas por vírgula)..."
              value={novaAnotacao.tags}
              onChange={(e) => setNovaAnotacao({...novaAnotacao, tags: e.target.value})}
            />

            <Textarea
              placeholder="Conteúdo da anotação..."
              value={novaAnotacao.conteudo}
              onChange={(e) => setNovaAnotacao({...novaAnotacao, conteudo: e.target.value})}
              className="min-h-[120px]"
            />

            <div className="flex gap-2">
              <Button onClick={criarAnotacao}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setMostrarFormulario(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Anotações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {anotacoesFiltradas.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma anotação encontrada</h3>
            <p className="text-muted-foreground">
              {anotacoes.length === 0 
                ? 'Crie sua primeira anotação clicando no botão acima.'
                : 'Tente ajustar os filtros para encontrar suas anotações.'
              }
            </p>
          </div>
        ) : (
          anotacoesFiltradas.map((anotacao) => (
            <Card key={anotacao.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {anotacao.titulo}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${obterCorCategoria(anotacao.categoria)} text-white`}>
                        {anotacao.categoria}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatarData(anotacao.dataModificacao)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditandoId(anotacao.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => excluirAnotacao(anotacao.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {anotacao.conteudo || 'Sem conteúdo...'}
                </p>
                
                {anotacao.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {anotacao.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Hash className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Estatísticas */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Estatísticas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{anotacoes.length}</div>
              <div className="text-sm text-muted-foreground">Total de Anotações</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{todasAsTags.length}</div>
              <div className="text-sm text-muted-foreground">Tags Únicas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">
                {new Set(anotacoes.map(a => a.categoria)).size}
              </div>
              <div className="text-sm text-muted-foreground">Categorias</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">
                {anotacoes.filter(a => a.dataModificacao > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-muted-foreground">Esta Semana</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
