import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import perfilAtendente from "@/assets/perfil-atendente.png";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBalloon, setShowBalloon] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! 👋 Sou a Ana, especialista em câmeras de segurança da MegaUtil. Como posso ajudar você hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-hide balloon after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBalloon(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);


  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('customer-support-chat', {
        body: { 
          message: userMessage,
          history: messages.slice(-10)
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, tive um problema. Tente novamente ou envie um e-mail para contato@megautil.com.br - respondemos em menos de 10 min! 📧' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button with Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-16 h-16 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 overflow-hidden border-3 border-white"
        aria-label="Abrir chat de suporte"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <img 
            src={perfilAtendente} 
            alt="Ana - Atendente" 
            className="w-full h-full object-cover"
          />
        )}
      </button>

      {/* Online indicator */}
      {!isOpen && (
        <span className="fixed bottom-4 right-4 z-[51] w-4 h-4 bg-green-500 border-2 border-white rounded-full translate-x-1 -translate-y-1 animate-pulse" />
      )}

      {/* Floating Label */}
      {!isOpen && showBalloon && (
        <div className="fixed bottom-[88px] right-4 z-40 bg-white rounded-xl shadow-lg px-4 py-3 text-sm font-medium text-foreground animate-bounce max-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-semibold text-primary">Ana está online</span>
          </div>
          <span className="text-muted-foreground text-xs">Tire suas dúvidas sobre as câmeras!</span>
          <div className="absolute bottom-0 right-6 w-3 h-3 bg-white transform rotate-45 translate-y-1.5" />
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-[88px] right-4 z-50 w-[350px] max-w-[calc(100vw-32px)] h-[480px] max-h-[calc(100vh-120px)] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary p-4 text-white flex items-center gap-3">
            <div className="relative">
              <img 
                src={perfilAtendente} 
                alt="Ana - Atendente" 
                className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Ana</h3>
              <p className="text-sm text-white/80 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Online agora
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <img 
                    src={perfilAtendente} 
                    alt="Ana" 
                    className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
                  />
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <img 
                  src={perfilAtendente} 
                  alt="Ana" 
                  className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
                />
                <div className="bg-white text-gray-800 border border-gray-200 p-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-gray-100 border-0 focus-visible:ring-primary/40"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-primary hover:bg-primary/90 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBot;
