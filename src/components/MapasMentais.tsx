import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Upload, 
  FileImage, 
  FileText, 
  Download,
  Copy,
  Plus,
  Trash2,
  Share2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MindMapNode {
  id: string;
  title: string;
  content: string;
  children: MindMapNode[];
  level: number;
}

interface MapaMental {
  id: string;
  titulo: string;
  descricao: string;
  nodes: MindMapNode[];
  createdAt: Date;
}

export const MapasMentais = () => {
  const [activeTab, setActiveTab] = useState('criar');
  const [mapas, setMapas] = useState<MapaMental[]>([]);
  const [currentMapa, setCurrentMapa] = useState<MapaMental | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, uploading } = useFileUpload();

  const createEmptyMindMap = (): MapaMental => ({
    id: Date.now().toString(),
    titulo: titulo || 'Novo Mapa Mental',
    descricao: descricao || '',
    nodes: [{
      id: '1',
      title: 'Tópico Central',
      content: '',
      children: [],
      level: 0
    }],
    createdAt: new Date()
  });

  const handleCreateMindMap = () => {
    if (!titulo.trim()) {
      toast.error('Digite um título para o mapa mental');
      return;
    }
    
    const novoMapa = createEmptyMindMap();
    setMapas(prev => [...prev, novoMapa]);
    setCurrentMapa(novoMapa);
    setTitulo('');
    setDescricao('');
    toast.success('Mapa mental criado com sucesso!');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsGenerating(true);
      
      // Converter arquivo para base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const base64Content = base64Data.split(',')[1];
        
        await generateMindMapFromFile({
          data: base64Content,
          mimeType: file.type,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast.error('Erro ao processar arquivo');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMindMapFromFile = async (fileData: {
    data: string;
    mimeType: string;
    name: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke('openai-legal-chat', {
        body: {
          message: `Analise este documento e crie um mapa mental detalhado em formato JSON. O mapa deve ter:
          1. Um nó central com o tema principal
          2. Nós filhos com os subtemas principais
          3. Até 3 níveis de profundidade
          4. Conteúdo resumido em cada nó
          
          Retorne apenas o JSON no formato:
          {
            "titulo": "Título do Mapa",
            "descricao": "Descrição breve",
            "nodes": [
              {
                "id": "1",
                "title": "Tópico Central",
                "content": "Conteúdo resumido",
                "children": [...],
                "level": 0
              }
            ]
          }`,
          fileData
        }
      });

      if (error) throw error;

      // Tentar extrair JSON da resposta
      let mindMapData;
      try {
        const jsonMatch = data.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          mindMapData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('JSON não encontrado na resposta');
        }
      } catch (parseError) {
        // Se não conseguir parsear, criar um mapa básico
        mindMapData = {
          titulo: `Mapa Mental - ${fileData.name}`,
          descricao: 'Gerado automaticamente a partir do documento',
          nodes: [{
            id: '1',
            title: 'Documento Analisado',
            content: data.response.substring(0, 200) + '...',
            children: [],
            level: 0
          }]
        };
      }

      const novoMapa: MapaMental = {
        id: Date.now().toString(),
        titulo: mindMapData.titulo,
        descricao: mindMapData.descricao,
        nodes: mindMapData.nodes,
        createdAt: new Date()
      };

      setMapas(prev => [...prev, novoMapa]);
      setCurrentMapa(novoMapa);
      setActiveTab('visualizar');
      toast.success('Mapa mental gerado com sucesso!');

    } catch (error) {
      console.error('Erro ao gerar mapa mental:', error);
      toast.error('Erro ao gerar mapa mental. Tente novamente.');
    }
  };

  const addChildNode = (parentId: string) => {
    if (!currentMapa) return;
    
    const newNode: MindMapNode = {
      id: Date.now().toString(),
      title: 'Novo Tópico',
      content: '',
      children: [],
      level: 1
    };

    const addToParent = (nodes: MindMapNode[]): MindMapNode[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return { ...node, children: [...node.children, newNode] };
        }
        if (node.children.length > 0) {
          return { ...node, children: addToParent(node.children) };
        }
        return node;
      });
    };

    const updatedMapa = {
      ...currentMapa,
      nodes: addToParent(currentMapa.nodes)
    };

    setCurrentMapa(updatedMapa);
    setMapas(prev => prev.map(m => m.id === updatedMapa.id ? updatedMapa : m));
  };

  const exportMindMap = () => {
    if (!currentMapa) return;
    
    const dataStr = JSON.stringify(currentMapa, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentMapa.titulo}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Mapa mental exportado!');
  };

  const copyMindMapText = () => {
    if (!currentMapa) return;
    
    const generateText = (nodes: MindMapNode[], indent = ''): string => {
      return nodes.map(node => {
        let text = `${indent}• ${node.title}`;
        if (node.content) text += `\n${indent}  ${node.content}`;
        if (node.children.length > 0) {
          text += '\n' + generateText(node.children, indent + '  ');
        }
        return text;
      }).join('\n');
    };
    
    const text = `${currentMapa.titulo}\n${currentMapa.descricao}\n\n${generateText(currentMapa.nodes)}`;
    navigator.clipboard.writeText(text);
    toast.success('Mapa mental copiado para área de transferência!');
  };

  const renderMindMapNode = (node: MindMapNode, index: number = 0) => (
    <div key={node.id} className={`mb-4 ${node.level > 0 ? 'ml-8' : ''}`}>
      <Card className="relative">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className={`${node.level === 0 ? 'text-xl' : 'text-lg'}`}>
              {node.title}
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addChildNode(node.id)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {node.content && (
            <p className="text-sm text-muted-foreground mb-2">{node.content}</p>
          )}
          <Badge variant="secondary" className="text-xs">
            Nível {node.level + 1}
          </Badge>
        </CardContent>
      </Card>
      
      {node.children.length > 0 && (
        <div className="mt-2">
          {node.children.map((child, idx) => renderMindMapNode(child, idx))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mapas Mentais</h1>
                <p className="text-sm text-muted-foreground">Organize suas ideias visualmente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="criar" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Criar
            </TabsTrigger>
            <TabsTrigger value="gerar" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Gerar com IA
            </TabsTrigger>
            <TabsTrigger value="visualizar" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Visualizar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="criar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Mapa Mental</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Título</label>
                  <Input
                    placeholder="Digite o título do mapa mental"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Descrição</label>
                  <Textarea
                    placeholder="Descreva brevemente o conteúdo do mapa"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button onClick={handleCreateMindMap} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Mapa Mental
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gerar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerar Mapa Mental com IA</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Envie um documento PDF ou imagem e nossa IA criará um mapa mental automaticamente
                </p>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    className="hidden"
                  />
                  
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground">Gerando mapa mental...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center space-x-4">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                        <FileImage className="h-12 w-12 text-muted-foreground" />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Envie seu documento</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Suporta PDF, PNG, JPG e WEBP
                        </p>
                        
                        <Button 
                          onClick={() => fileInputRef.current?.click()}
                          size="lg"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Selecionar Arquivo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visualizar" className="space-y-6">
            {currentMapa ? (
              <div className="space-y-6">
                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{currentMapa.titulo}</h2>
                    <p className="text-sm text-muted-foreground">{currentMapa.descricao}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={copyMindMapText}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                    
                    <Button variant="outline" onClick={exportMindMap}>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                    
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Mind Map Visualization */}
                <div className="space-y-4">
                  {currentMapa.nodes.map((node, index) => renderMindMapNode(node, index))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum mapa mental selecionado</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Crie um novo mapa mental ou gere um com IA para visualizar aqui
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Lista de Mapas Salvos */}
        {mapas.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Mapas Mentais Salvos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mapas.map((mapa) => (
                  <Card key={mapa.id} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          setCurrentMapa(mapa);
                          setActiveTab('visualizar');
                        }}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{mapa.titulo}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{mapa.descricao}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{mapa.nodes.length} nós</Badge>
                        <span className="text-xs text-muted-foreground">
                          {mapa.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};