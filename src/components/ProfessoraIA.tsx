import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Send, GraduationCap, X, Volume2, VolumeX, Mic, MicOff, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { ExplainThisPartModal } from './ExplainThisPartModal';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageData?: string;
}

interface ProfessoraIAProps {
  video?: any;
  livro?: any;
  area?: string;
  isOpen: boolean;
  onClose: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export const ProfessoraIA = ({ video, livro, area, isOpen, onClose }: ProfessoraIAProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showExplainModal, setShowExplainModal] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const { 
    isRecording, 
    isTranscribing, 
    startRecording, 
    stopRecording, 
    canRecord 
  } = useVoiceRecording();

  // Mensagem inicial da professora baseada no contexto
  useEffect(() => {
    if (isOpen) {
      let content = '';
      
      if (video) {
        content = `👋 Olá! Sou a Professora IA e estou aqui para ajudar você com a videoaula "${video.title}"${video.area ? ` da área de ${video.area}` : ''}.

📖 Posso explicar conceitos jurídicos desta videoaula
📝 Esclarecer dúvidas sobre o conteúdo apresentado
🔍 Dar exemplos práticos dos temas abordados
📚 Criar exercícios para fixar o aprendizado
💡 Conectar este conteúdo com outras matérias

O que você gostaria de saber sobre esta videoaula?`;
      } else if (livro) {
        content = `👋 Olá! Sou a Professora IA e estou aqui para ajudar você com o livro "${livro.livro}"${livro.area ? ` da área de ${livro.area}` : ''}${livro.autor ? ` do autor ${livro.autor}` : ''}.

📖 Posso explicar conceitos e capítulos do livro
📝 Esclarecer dúvidas sobre a obra
🔍 Dar exemplos práticos dos temas abordados
📚 Sugerir exercícios baseados no conteúdo
💡 Relacionar com jurisprudência e casos práticos

O que você gostaria de saber sobre este livro?`;
      } else {
        content = `👋 Olá! Sou a Professora IA especializada em Direito${area ? ` com foco em ${area}` : ''}.

📖 Posso explicar conceitos jurídicos
📝 Esclarecer dúvidas
🔍 Dar exemplos práticos
📚 Criar exercícios
💡 Conectar diferentes áreas do Direito

Como posso ajudar você hoje?`;
      }

      const initialMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }
  }, [video, livro, area, isOpen]);

  const sendMessage = async (imageData?: string) => {
    if ((!inputMessage.trim() && !imageData) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: imageData ? 'Pode explicar esta parte?' : inputMessage,
      timestamp: new Date(),
      imageData
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    console.log('Enviando mensagem para Professora IA:', inputMessage);

    try {
      let contextMessage = '';
      
      if (video) {
        contextMessage = `Contexto: O usuário está assistindo à videoaula "${video.title}"${video.area ? ` da área de ${video.area}` : ''}${video.channelTitle ? ` do canal ${video.channelTitle}` : ''}.`;
      } else if (livro) {
        contextMessage = `Contexto: O usuário está lendo o livro "${livro.livro}"${livro.area ? ` da área de ${livro.area}` : ''}${livro.autor ? ` do autor ${livro.autor}` : ''}.`;
      } else {
        contextMessage = `Contexto: O usuário está estudando${area ? ` na área de ${area}` : ' Direito'}.`;
      }

      let messageToSend = inputMessage;
      let fileDataToSend = null;

      if (imageData) {
        messageToSend = `${contextMessage}

Como Professora IA especializada em Direito, analise a imagem anexada e explique de forma didática, clara e amigável o conteúdo mostrado. Se for parte de um livro ou documento jurídico, contextualize com a obra que o usuário está estudando.

Foque especificamente na área selecionada da imagem e forneça uma explicação detalhada dos conceitos apresentados.`;

        // Convert data URL to base64 without prefix
        const base64Data = imageData.split(',')[1];
        fileDataToSend = {
          data: base64Data,
          mimeType: 'image/png',
          name: 'screenshot.png'
        };
      } else {
        messageToSend = `${contextMessage}
          
Como Professora IA especializada em Direito, responda de forma didática, clara e amigável. Use exemplos práticos quando possível e conecte com o conteúdo específico que o usuário está estudando.

Pergunta do usuário: ${inputMessage}`;
      }

      const { data, error } = await supabase.functions.invoke('gemini-ai-chat', {
        body: {
          message: messageToSend,
          fileData: fileDataToSend,
          conversationHistory: messages.slice(-5).map(m => ({
            role: m.type === 'user' ? 'user' : 'model',
            content: m.content
          }))
        }
      });

      console.log('Resposta da API:', { data, error });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Se áudio estiver habilitado, reproduzir resposta
      if (audioEnabled) {
        playAudio(data.response);
      }

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Desculpe, houve um erro temporário. A chave da API foi configurada e a professora IA já deve estar funcionando. Tente novamente em alguns segundos.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('gemini-tts', {
        body: {
          text: text.substring(0, 500), // Limitar texto para TTS
          voice: 'nova'
        }
      });

      if (error) throw error;

      if (data.success && data.audioData) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioData}`);
        audio.play();
      }
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
    }
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      // Parar gravação e transcrever
      const transcriptionText = await stopRecording();
      if (transcriptionText) {
        setInputMessage(transcriptionText);
      }
    } else {
      // Iniciar gravação
      await startRecording();
    }
  };

  const handleExplainImageSelected = (imageData: string) => {
    sendMessage(imageData);
    setShowExplainModal(false);
  };

  const showExplainButton = livro || area === 'Biblioteca Jurídica';

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 ${isMobile ? 'inset-0' : 'bottom-4 right-4 w-96 h-[600px]'} flex items-end justify-center`}>
      {isMobile && (
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Chat Container - Mobile Otimizado */}
      <div className={`relative ${isMobile ? 'w-full max-w-md h-[85vh] mx-4 mb-4' : 'w-full h-full'} bg-gradient-to-br from-purple-600 to-purple-800 ${isMobile ? 'rounded-t-3xl' : 'rounded-lg'} shadow-2xl overflow-hidden ${isMobile ? 'animate-slide-up' : ''}`}>
        
        {/* Header - Mobile Otimizado */}
        <div className="bg-black/30 backdrop-blur-sm p-4 flex items-center justify-between border-b border-white/20 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Professora IA</h3>
              <p className="text-white/70 text-sm">Especialista em Direito</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showExplainButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExplainModal(true)}
                className="text-white hover:bg-white/10 rounded-full p-2"
                title="Explicar esta parte"
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="text-white hover:bg-white/10 rounded-full p-2"
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10 rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages - Mobile Otimizado */}
        <div className={`flex-1 p-4 overflow-y-auto ${isMobile ? 'h-[calc(85vh-160px)]' : 'h-[calc(600px-160px)]'} space-y-4`}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl break-words ${
                  message.type === 'user'
                    ? 'bg-white text-gray-800 rounded-br-md'
                    : 'bg-white/20 text-white rounded-bl-md'
                }`}
              >
                {message.imageData && (
                  <div className="mb-2">
                    <img 
                      src={message.imageData} 
                      alt="Imagem enviada" 
                      className="max-w-32 h-auto rounded border"
                    />
                  </div>
                )}
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-2xl bg-white/20 text-white rounded-bl-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin text-purple-300" />
                  <span className="text-sm">Professora IA está pensando...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input - Mobile Otimizado */}
        <div className="p-4 bg-black/30 backdrop-blur-sm border-t border-white/20 shrink-0">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={livro ? "Digite sua dúvida sobre o livro..." : "Digite sua dúvida sobre a videoaula..."}
              className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
            />
            
            {canRecord && (
              <Button
                variant="ghost"
                size="sm"
                onMouseDown={handleVoiceRecording}
                onMouseUp={handleVoiceRecording}
                onTouchStart={handleVoiceRecording}
                onTouchEnd={handleVoiceRecording}
                className={`text-white hover:bg-white/10 shrink-0 transition-colors ${
                  isRecording ? 'bg-red-500/30 text-red-200' : ''
                } ${
                  isTranscribing ? 'bg-blue-500/30 text-blue-200' : ''
                }`}
                disabled={isLoading || isTranscribing}
                title={isRecording ? "Solte para parar" : "Pressione e segure para gravar"}
              >
                {isTranscribing ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : isRecording ? (
                  <MicOff className="w-4 h-4 animate-pulse" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            )}
            
            <Button
              onClick={() => sendMessage()}
              className="bg-white/30 hover:bg-white/40 text-white border-white/40 shrink-0"
              size="sm"
              disabled={!inputMessage.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ExplainThisPartModal
          isOpen={showExplainModal}
          onClose={() => setShowExplainModal(false)}
          onImageSelected={handleExplainImageSelected}
        />
      </div>
    </div>
  );
};