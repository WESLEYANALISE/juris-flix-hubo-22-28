import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Brain, RotateCcw, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data para demonstração
const mockFlashcards = [
  {
    id: 1,
    area: "Direito Civil",
    pergunta: "O que é capacidade civil?",
    resposta: "Capacidade civil é a aptidão da pessoa para exercer os atos da vida civil, podendo ser plena (maiores de 18 anos) ou limitada (entre 16 e 18 anos).",
    dificuldade: "Básico",
    deck: "Pessoas Naturais"
  },
  {
    id: 2,
    area: "Direito Penal",
    pergunta: "Qual a diferença entre furto e roubo?",
    resposta: "Furto é a subtração de coisa alheia móvel sem violência. Roubo é a subtração com violência ou grave ameaça à pessoa.",
    dificuldade: "Básico",
    deck: "Crimes Patrimoniais"
  },
  {
    id: 3,
    area: "Direito Constitucional",
    pergunta: "O que são cláusulas pétreas?",
    resposta: "São dispositivos constitucionais que não podem ser abolidos por emenda constitucional, como a forma federativa, direitos fundamentais, separação de poderes e voto secreto.",
    dificuldade: "Intermediário",
    deck: "Poder Constituinte"
  }
];

const areas = ["Todas as Áreas", "Direito Civil", "Direito Penal", "Direito Constitucional", "Direito Administrativo"];
const decks = ["Todos os Decks", "Pessoas Naturais", "Crimes Patrimoniais", "Poder Constituinte", "Atos Administrativos"];

export const Flashcards = () => {
  const [flashcards, setFlashcards] = useState(mockFlashcards);
  const [cardAtual, setCardAtual] = useState(0);
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [areaFiltro, setAreaFiltro] = useState("Todas as Áreas");
  const [deckFiltro, setDeckFiltro] = useState("Todos os Decks");
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [cardsRevisados, setCardsRevisados] = useState(0);

  const flashcardsFiltrados = flashcards.filter(card => {
    const matchArea = areaFiltro === "Todas as Áreas" || card.area === areaFiltro;
    const matchDeck = deckFiltro === "Todos os Decks" || card.deck === deckFiltro;
    return matchArea && matchDeck;
  });

  const cardCorrente = flashcardsFiltrados[cardAtual];

  const handleAcerto = () => {
    setAcertos(prev => prev + 1);
    setCardsRevisados(prev => prev + 1);
    proximoCard();
  };

  const handleErro = () => {
    setErros(prev => prev + 1);
    setCardsRevisados(prev => prev + 1);
    proximoCard();
  };

  const proximoCard = () => {
    if (cardAtual < flashcardsFiltrados.length - 1) {
      setCardAtual(prev => prev + 1);
      setMostrarResposta(false);
    }
  };

  const cardAnterior = () => {
    if (cardAtual > 0) {
      setCardAtual(prev => prev - 1);
      setMostrarResposta(false);
    }
  };

  const reiniciarDeck = () => {
    setCardAtual(0);
    setMostrarResposta(false);
    setAcertos(0);
    setErros(0);
    setCardsRevisados(0);
  };

  if (!cardCorrente) {
    return (
      <div className="min-h-screen bg-background p-4 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Nenhum flashcard encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os filtros para encontrar flashcards.
            </p>
            <Button onClick={reiniciarDeck}>
              Reiniciar Filtros
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-bold gradient-text mb-3 text-center text-2xl">
            Flashcards Inteligentes
          </h1>
          <p className="text-muted-foreground text-base text-center">
            Sistema de repetição espaçada para memorização eficaz
          </p>
        </motion.div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{flashcardsFiltrados.length}</p>
              <p className="text-sm text-muted-foreground">Cards</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{cardsRevisados}</p>
              <p className="text-sm text-muted-foreground">Revisados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{acertos}</p>
              <p className="text-sm text-muted-foreground">Acertos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Brain className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">
                {cardsRevisados > 0 ? Math.round((acertos / cardsRevisados) * 100) : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Aproveitamento</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Configurações do Estudo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={areaFiltro} onValueChange={setAreaFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Área do Direito" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={deckFiltro} onValueChange={setDeckFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Deck de Estudo" />
                </SelectTrigger>
                <SelectContent>
                  {decks.map(deck => (
                    <SelectItem key={deck} value={deck}>{deck}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Flashcard */}
        <motion.div
          key={cardAtual}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Card className="min-h-[400px] cursor-pointer" onClick={() => setMostrarResposta(!mostrarResposta)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{cardCorrente.area}</Badge>
                    <Badge variant={cardCorrente.dificuldade === 'Básico' ? 'default' : cardCorrente.dificuldade === 'Intermediário' ? 'secondary' : 'destructive'}>
                      {cardCorrente.dificuldade}
                    </Badge>
                    <Badge variant="outline">{cardCorrente.deck}</Badge>
                  </div>
                  <CardTitle className="text-base">
                    Card {cardAtual + 1} de {flashcardsFiltrados.length}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[250px]">
              <div className="text-center">
                {!mostrarResposta ? (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Pergunta:</h3>
                    <p className="text-lg leading-relaxed">{cardCorrente.pergunta}</p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Clique para ver a resposta
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-primary">Resposta:</h3>
                    <p className="text-lg leading-relaxed">{cardCorrente.resposta}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ações */}
        {mostrarResposta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-4 mb-6"
          >
            <Button
              variant="destructive"
              onClick={handleErro}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Não Sabia
            </Button>
            <Button
              variant="default"
              onClick={handleAcerto}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Sabia
            </Button>
          </motion.div>
        )}

        {/* Navegação */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={cardAnterior}
            disabled={cardAtual === 0}
          >
            Anterior
          </Button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {cardAtual + 1} / {flashcardsFiltrados.length}
            </span>
            <Button
              variant="outline"
              onClick={reiniciarDeck}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reiniciar
            </Button>
          </div>
          
          <Button
            onClick={proximoCard}
            disabled={cardAtual === flashcardsFiltrados.length - 1}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
};