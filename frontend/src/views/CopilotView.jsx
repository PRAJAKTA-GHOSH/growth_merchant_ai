import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Database, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Globe, 
  Layers,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import api from '../api/client';
import AIOrb from '../components/AIOrb';

export default function CopilotView() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Namaste! I am your Vyapar Copilot. I analyze your Paytm Soundbox transactions, inventory velocity, and customer retention metrics in real-time. Ask me anything about your sales dips, top products, restock requirements, or ask in Hinglish!",
      evidence: [],
      followups: [
        "Why did my sales decrease?",
        "Which products are performing best?",
        "What should I restock right now?",
        "Meri dukaan ka sabse best product kaunsa hai?"
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [languageMode, setLanguageMode] = useState('auto'); // auto, en, hinglish
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.askCopilot(textToSend, languageMode);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.data.answer,
        evidence: res.data.evidence,
        followups: res.data.suggested_followups,
        llmPowered: res.data.llm_powered,
        language: res.data.language
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: "I encountered a momentary connection issue with the database. Please try again.",
          evidence: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    { label: "📉 Why did sales dip?", query: "Why did my sales decrease?" },
    { label: "⭐ Top selling products", query: "Which products are performing best?" },
    { label: "📦 Urgent Restocks", query: "What should I restock right now?" },
    { label: "💰 Estimated Net Profit", query: "How much profit did I make this month?" },
    { label: "⚠️ At-Risk Customers", query: "Which customers are at risk of becoming inactive?" },
    { label: "🗣️ Hinglish Query", query: "Meri dukaan ka sabse zyada bikne wala product kaunsa hai aur kitna munafa hua?" }
  ];

  return (
    <div className="space-y-4 pb-8 max-w-4xl mx-auto h-[calc(100vh-6.5rem)] flex flex-col justify-between">
      {/* Top Bar with Language Toggle and Status */}
      <div className="glass-card p-3 rounded-2xl flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-paytm-dark border border-paytm-cyan/30 flex items-center justify-center text-paytm-cyan shadow-glow-cyan">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Vyapar Copilot Intelligence</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                Grounded Live DB
              </span>
            </h2>
            <p className="text-[10px] text-slate-400">Zero Hallucinations • Real-Time Financial Evidence</p>
          </div>
        </div>

        {/* Language Mode Selector */}
        <div className="flex items-center space-x-1 bg-navy-900 border border-slate-800 rounded-xl p-1 text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          <button
            onClick={() => setLanguageMode('auto')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              languageMode === 'auto' ? 'bg-paytm-blue text-navy-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Auto
          </button>
          <button
            onClick={() => setLanguageMode('en')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              languageMode === 'en' ? 'bg-paytm-blue text-navy-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguageMode('hinglish')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              languageMode === 'hinglish' ? 'bg-paytm-blue text-navy-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hinglish
          </button>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';

          return (
            <div key={msg.id} className={`flex items-start space-x-3 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                isBot 
                  ? 'bg-gradient-to-tr from-paytm-dark to-paytm-blue text-paytm-cyan border border-cyan-500/30' 
                  : 'bg-navy-800 text-slate-300 border border-slate-700'
              }`}>
                {isBot ? <Sparkles className="w-4 h-4" /> : 'You'}
              </div>

              {/* Message Bubble & Evidence Cards */}
              <div className={`max-w-[85%] space-y-2 ${isBot ? '' : 'text-right'}`}>
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  isBot 
                    ? 'glass-card border-cyan-500/20 text-slate-100' 
                    : 'bg-paytm-blue text-navy-950 font-semibold shadow-glow-cyan'
                }`}>
                  {msg.text}
                </div>

                {/* Grounded Evidence Cards */}
                {isBot && msg.evidence && msg.evidence.length > 0 && (
                  <div className="p-3 rounded-xl bg-navy-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-paytm-cyan">
                      <Database className="w-3 h-3 text-paytm-cyan" />
                      <span>Verified Merchant Database Evidence</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {msg.evidence.map((ev, i) => (
                        <div key={i} className="p-2 rounded-lg bg-navy-950 border border-slate-800 text-[11px]">
                          <p className="text-[10px] text-slate-400 truncate">{ev.metric}</p>
                          <p className="font-extrabold text-white font-mono mt-0.5">{ev.value}</p>
                          <p className="text-[9px] text-slate-500 font-mono mt-0.5 truncate">{ev.timeframe}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Suggestion Chips */}
                {isBot && msg.followups && msg.followups.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.followups.map((fText, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(fText)}
                        className="px-2.5 py-1 rounded-lg bg-navy-900/80 border border-slate-700 hover:border-paytm-cyan text-[11px] text-slate-300 hover:text-white transition-all flex items-center space-x-1 group"
                      >
                        <span>{fText}</span>
                        <ArrowRight className="w-3 h-3 text-paytm-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-paytm-dark border border-cyan-500/30 flex items-center justify-center text-paytm-cyan shrink-0">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <div className="glass-card p-3 rounded-2xl text-xs text-slate-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-paytm-cyan animate-pulse" />
              <span>Querying transaction records & compiling data evidence...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Area: Sample Prompts & Input Bar */}
      <div className="space-y-2 pt-2 border-t border-slate-800 shrink-0">
        {/* Sample Prompt Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="px-2.5 py-1 rounded-xl bg-navy-900/80 border border-slate-800 hover:border-paytm-cyan text-slate-300 hover:text-white shrink-0 text-[11px] transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Query Input Box */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about sales dips, restock alerts, profits (Supports English & Hinglish)..."
            className="flex-1 px-4 py-3 bg-navy-900 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:border-paytm-cyan"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputQuery.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-paytm-blue to-paytm-cyan text-navy-950 hover:opacity-95 shadow-glow-cyan transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
