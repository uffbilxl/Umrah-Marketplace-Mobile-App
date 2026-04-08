import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { toast } from 'sonner';

type Msg = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const QUICK_REPLIES = [
  '🛒 Where is my basket?',
  '🔥 Show me deals',
  '📍 Store locations',
  '⭐ How do U-Points work?',
];

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Assalamu Alaikum! 👋 How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Msg = { role: 'user', content: trimmed };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setLoading(true);

    let assistantSoFar = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: history }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Something went wrong');
      }

      if (!resp.body) throw new Error('No response body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && prev.length === history.length + 1) {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: 'assistant', content: assistantSoFar }];
        });
      };

      let done = false;
      while (!done) {
        const { done: readerDone, value } = await reader.read();
        if (readerDone) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch { buffer = line + '\n' + buffer; break; }
        }
      }

      if (!assistantSoFar) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that. Try again?" }]);
      }
    } catch (e: any) {
      console.error('Chat error:', e);
      toast.error(e.message || 'Chat error');
      setMessages(prev => [...prev, { role: 'assistant', content: "Oops, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating chat button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed z-[60] bottom-[calc(var(--mobile-dock-height)+env(safe-area-inset-bottom,0px)+0.75rem)] right-4 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-transform active:scale-90 hover:scale-105"
          aria-label="Open chat"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      )}

      {/* Compact chat popup */}
      {open && (
        <div className="fixed z-[70] bottom-[calc(var(--mobile-dock-height)+env(safe-area-inset-bottom,0px)+0.75rem)] right-4 w-[320px] max-w-[calc(100vw-2rem)] h-[420px] max-h-[60vh] flex flex-col rounded-2xl border border-border/50 bg-background shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-150">
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground">
            <div className="h-7 w-7 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs leading-tight">UMRAH Assistant</p>
              <p className="text-[0.6rem] opacity-75">Always here to help</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30"
              aria-label="Close chat"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2.5 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-1.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <Bot className="h-2.5 w-2.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl px-2.5 py-1.5 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-1.5">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-2.5 w-2.5 text-primary" />
                </div>
                <div className="bg-muted rounded-xl rounded-bl-sm px-3 py-2">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-1 pt-1">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-[0.6rem] rounded-full border border-primary/30 bg-primary/5 text-primary px-2 py-0.5 hover:bg-primary/10 active:scale-95 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input bar */}
          <form onSubmit={handleSubmit} className="flex items-center gap-1.5 px-2.5 py-2 border-t border-border">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-input bg-muted/50 px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary/30"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 active:scale-90"
            >
              <Send className="h-3 w-3" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
