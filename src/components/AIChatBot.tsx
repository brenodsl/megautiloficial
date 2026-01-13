import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
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
  const [showBubble, setShowBubble] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! 👋 Sou o João Lucas, atendente da Max Runner. Como posso ajudar você hoje?' }
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

  // Hide bubble after 10 seconds or when chat is opened
  useEffect(() => {
    if (isOpen) {
      setShowBubble(false);
      return;
    }
    const timer = setTimeout(() => setShowBubble(false), 10000);
    return () => clearTimeout(timer);
  }, [isOpen]);

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
        content: 'Desculpe, tive um problema. Tente novamente ou envie um e-mail para contato@maxrunner.com.br - respondemos em menos de 10 min! 📧' 
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
      {/* Speech Bubble */}
      {showBubble && !isOpen && (
        <div className="fixed bottom-[88px] right-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="relative bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-xl shadow-lg border border-gray-200">
            Alguma dúvida? 💬
            <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-16 h-16 rounded-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-200 overflow-hidden border-2 border-white"
        aria-label="Abrir chat de suporte"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <img 
            src={perfilAtendente} 
            alt="João Lucas" 
            className="w-full h-full object-cover"
          />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-[88px] right-4 z-50 w-[350px] max-w-[calc(100vw-32px)] h-[480px] max-h-[calc(100vh-120px)] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header with Attendant */}
          <div className="bg-gray-900 p-4 text-white flex items-center gap-3">
            <img 
              src={perfilAtendente} 
              alt="João Lucas - Atendente" 
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
            />
            <div>
              <h3 className="font-bold text-lg">João Lucas</h3>
              <p className="text-sm text-gray-300">Atendente Max Runner</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-gray-900 text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 p-3 rounded-2xl rounded-bl-md shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
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
                className="flex-1 bg-gray-100 border-0 focus-visible:ring-gray-400"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-gray-900 hover:bg-gray-800 shrink-0"
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
