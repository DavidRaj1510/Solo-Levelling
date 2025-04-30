
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Bot, MessageCircle, Headphones, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';

const AiAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast: uiToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false);

  useEffect(() => {
    // Check if welcome message has already been spoken in this session
    const welcomeSpoken = sessionStorage.getItem('aiWelcomeSpoken');
    
    // Only play welcome message if it hasn't been played yet in this session
    if (!welcomeSpoken) {
      const welcomeMessage = async () => {
        try {
          setIsLoading(true);
          
          // Add initial message before API call
          const initialMessage = "King, Tell me how can I help you Today";
          setMessages([{ role: 'assistant', content: initialMessage }]);
          
          try {
            // Try to get voice response
            const { data, error } = await supabase.functions.invoke('ai-assistant', {
              body: { prompt: 'Give a brief welcome as Beru greeting the king' }
            });

            if (error) {
              console.error('Error with welcome message:', error);
              // Still show the message but without audio
              playInitialWelcome();
              return;
            }
            
            if (data.audio) {
              playAudio(data.audio);
            } else {
              playInitialWelcome();
            }
            
            // Mark that welcome message has been spoken
            sessionStorage.setItem('aiWelcomeSpoken', 'true');
            setHasSpokenWelcome(true);
            
          } catch (error) {
            console.error('Error with welcome message API call:', error);
            playInitialWelcome();
          }
        } finally {
          setIsLoading(false);
        }
      };

      // Slight delay before welcome message
      setTimeout(() => {
        welcomeMessage();
      }, 1000);
    } else {
      // If welcome was already spoken, just initialize with the message
      setMessages([{ role: 'assistant', content: "King, Tell me how can I help you Today" }]);
      setHasSpokenWelcome(true);
    }
  }, []);

  // Fallback for when audio doesn't work
  const playInitialWelcome = () => {
    if ('speechSynthesis' in window && !isMuted) {
      const utterance = new SpeechSynthesisUtterance("King, Tell me how can I help you Today");
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
      
      // Mark that welcome message has been spoken
      sessionStorage.setItem('aiWelcomeSpoken', 'true');
      setHasSpokenWelcome(true);
    }
  };

  const playAudio = (base64Audio: string) => {
    if (isMuted) return;
    
    try {
      const audioUrl = `data:audio/mp3;base64,${base64Audio}`;
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error('Audio playback error:', err);
            fallbackToSpeech(messages[messages.length - 1]?.content || "");
          });
      }
    } catch (error) {
      console.error('Error setting up audio playback:', error);
      fallbackToSpeech(messages[messages.length - 1]?.content || "");
    }
  };

  const fallbackToSpeech = (text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { prompt: userMessage }
      });

      if (error) {
        console.error('Error with AI assistant:', error);
        handleApiError();
        return;
      }
      
      if (data.error) {
        console.error('Error from AI assistant function:', data.error);
        // Use fallback text if provided
        const responseText = data.fallbackText || "I'm sorry, King. I'm having trouble accessing my powers. Please try again later.";
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
        fallbackToSpeech(responseText);
        return;
      }
      
      // Add assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      
      if (data.audio) {
        playAudio(data.audio);
      } else {
        fallbackToSpeech(data.text);
      }

      // Reset retry counter on successful response
      setRetryCount(0);
      
    } catch (error) {
      console.error('Error with AI assistant request:', error);
      handleApiError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiError = () => {
    setRetryCount(prev => prev + 1);
    
    const fallbackMessages = [
      "Forgive me, King. My powers seem to be temporarily weakened. Please try again in a moment.",
      "My humble apologies, Your Majesty. I'm unable to channel my full abilities right now. Perhaps another question?",
      "A thousand pardons, King. The mana in the air is disturbed. I'll serve you better soon."
    ];
    
    const fallbackText = fallbackMessages[Math.min(retryCount, fallbackMessages.length - 1)];
    
    setMessages(prev => [...prev, { role: 'assistant', content: fallbackText }]);
    fallbackToSpeech(fallbackText);
    
    toast.error("AI assistant connection error", {
      description: "There was an issue connecting to the AI service",
      duration: 5000
    });
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    if (audioRef.current && audioRef.current.paused === false) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  // Support scrolling to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="py-16 bg-solo-dark-bg">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Arise <span className="text-solo-purple">AI Assistant</span>
        </h2>
        
        <div className="solo-card max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Bot className="h-8 w-8 text-solo-purple mr-3" />
            <h3 className="text-xl font-bold text-white">Beru</h3>
            <div className="ml-auto flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-gray-400 hover:text-white"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              
              {isPlaying && (
                <div className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-solo-purple animate-pulse" />
                  <span className="text-gray-400 text-sm">Speaking...</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 h-80 overflow-y-auto mb-4">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-lg max-w-[80%] ${
                      message.role === 'user' 
                        ? 'bg-solo-purple text-white rounded-br-none'
                        : 'bg-gray-800 text-gray-200 rounded-bl-none'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Your conversation with Beru will appear here...</p>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Ask Beru for advice..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className="bg-solo-purple hover:bg-solo-light-purple"
            >
              {isLoading ? (
                <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
              ) : (
                <MessageCircle className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>
        
        <audio 
          ref={audioRef} 
          onEnded={() => setIsPlaying(false)} 
          onError={(e) => {
            console.error('Audio error:', e);
            setIsPlaying(false);
            // Try to use speech synthesis as backup if audio fails
            if (messages.length > 0) {
              fallbackToSpeech(messages[messages.length - 1].content);
            }
          }}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default AiAssistant;
