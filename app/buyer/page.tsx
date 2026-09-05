'use client';

import { useState } from 'react';
import {
  Send,
  ShoppingBag,
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Layers,
  HelpCircle,
  Star,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ProductItem, CartItem, CartState, AgentStep, UpsellRecommendation } from '@/types';
import { AgentActivityPanel } from '@/components/AgentActivityPanel';
import { CartDrawer } from '@/components/CartDrawer';
import { RazorpayModal } from '@/components/RazorpayModal';

export default function BuyerPage() {
  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);

  const [messages, setMessages] = useState<
    Array<{
      id: string;
      sender: 'user' | 'agent';
      text: string;
      product?: ProductItem | null;
      upsell?: UpsellRecommendation | null;
    }>
  >([
    {
      id: 'msg_welcome',
      sender: 'agent',
      text: 'Hello! I am your AI Buyer Agent. Ask me anything about our merchant catalog, or specify your constraints (e.g. "I need a mechanical keyboard for programming under ₹6,000").',
    },
  ]);

  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [cart, setCart] = useState<CartState>({
    items: [],
    subtotal: 0,
    discountTotal: 0,
    total: 0,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUpsell, setCurrentUpsell] = useState<UpsellRecommendation | null>(null);

  // Razorpay Checkout State
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [activeRazorpayOrderId, setActiveRazorpayOrderId] = useState<string | null>(null);
  const [activeDbOrderId, setActiveDbOrderId] = useState<string | null>(null);
  const [activeOrderTotal, setActiveOrderTotal] = useState<number>(0);
  const [isMockRazorpay, setIsMockRazorpay] = useState<boolean>(true);
  const [isInitiatingCheckout, setIsInitiatingCheckout] = useState(false);

  const samplePrompts = [
    'I need a mechanical keyboard for programming under ₹6,000.',
    'I need a laptop for coding under ₹70,000.',
    "What's the cheapest option?",
    'Show me ultrawide monitors under ₹35,000.',
  ];

  const speakText = (text: string) => {
    if (!isTtsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, '').substring(0, 200);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const toggleListening = () => {
    if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPromptInput(transcript);
        setIsListening(false);
        handleSendPrompt(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  const updateCartTotals = (items: CartItem[]) => {
    let subtotal = 0;
    let discountTotal = 0;
    items.forEach((i) => {
      const price = i.product.price * i.quantity;
      subtotal += price;
      if (i.appliedDiscount) discountTotal += i.appliedDiscount;
    });
    setCart({
      items,
      subtotal,
      discountTotal,
      total: subtotal - discountTotal,
    });
  };

  const handleAddToCart = (product: ProductItem, isUpsell = false, upsellReason?: string) => {
    const existingIndex = cart.items.findIndex((i) => i.product.id === product.id);
    let newItems = [...cart.items];

    if (existingIndex >= 0) {
      newItems[existingIndex].quantity += 1;
    } else {
      newItems.push({
        product,
        quantity: 1,
        isUpsell,
        upsellReason,
      });
    }

    updateCartTotals(newItems);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    const newItems = cart.items.filter((i) => i.product.id !== productId);
    updateCartTotals(newItems);
  };

  const handleSendPrompt = async (userQuery?: string) => {
    const query = userQuery || promptInput;
    if (!query.trim() || isProcessing) return;

    setPromptInput('');
    setIsProcessing(true);

    const userMsgId = `usr_${Date.now()}`;
    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text: query }]);

    try {
      const res = await fetch('/api/buyer/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await res.json();

      if (data.success) {
        setSteps(data.steps || []);
        if (data.upsellRecommendation) {
          setCurrentUpsell(data.upsellRecommendation);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `agent_${Date.now()}`,
            sender: 'agent',
            text: data.replyText,
            product: data.recommendedProduct,
            upsell: data.upsellRecommendation,
          },
        ]);

        speakText(data.replyText);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `agent_err_${Date.now()}`,
            sender: 'agent',
            text: `Sorry, I encountered an error: ${data.error}`,
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `agent_err_${Date.now()}`,
          sender: 'agent',
          text: 'Network error communicating with AI agent.',
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInitiateCheckout = async () => {
    if (cart.items.length === 0) return;
    setIsInitiatingCheckout(true);

    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Alex Chen (AI Buyer)',
          customerEmail: 'alex.chen@devmail.com',
          items: cart.items,
          totalAmount: cart.total,
          baseAmount: cart.subtotal,
          upsellAmount: cart.items.filter((i) => i.isUpsell).reduce((acc, i) => acc + i.product.price, 0),
          isAiAssisted: true,
        }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert('Order creation failed: ' + orderData.error);
        return;
      }

      const rzpRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cart.total,
          receipt: `rcpt_${orderData.order.id}`,
        }),
      });
      const rzpData = await rzpRes.json();

      if (!rzpData.success) {
        alert('Razorpay order creation blocked or failed: ' + (rzpData.error || 'Check policy rules'));
        return;
      }

      setActiveDbOrderId(orderData.order.id);
      setActiveRazorpayOrderId(rzpData.order.orderId);
      setActiveOrderTotal(cart.total);
      setIsMockRazorpay(rzpData.order.isMock);

      setIsCartOpen(false);
      setIsRazorpayOpen(true);
    } catch (err: any) {
      alert('Checkout error: ' + err.message);
    } finally {
      setIsInitiatingCheckout(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="h-5 w-5 text-blue-400" />
            <h1 className="text-xl font-extrabold text-white tracking-tight">AI Buyer Agent Hub</h1>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Conversational agent with hands-free voice intent, technical ranking, and Merchant Growth upsell recommendations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* TTS Audio Toggle */}
          <button
            onClick={() => setIsTtsEnabled(!isTtsEnabled)}
            className={`p-2.5 rounded-xl border text-xs transition-all ${
              isTtsEnabled
                ? 'bg-blue-950/60 border-blue-600/40 text-blue-400'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
            title={isTtsEnabled ? 'Voice Audio Output Enabled' : 'Voice Audio Output Muted'}
          >
            {isTtsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all relative shadow-md"
          >
            <ShoppingBag className="h-4 w-4 text-blue-400" />
            <span>Cart ({cart.items.length})</span>
            {cart.total > 0 && (
              <span className="font-mono font-bold text-emerald-400 ml-1">
                ₹{cart.total.toLocaleString('en-IN')}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Chat Area */}
        <div className="lg:col-span-7 space-y-4">
          {/* Sample Query Chips */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
              Try sample buyer intents:
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(sp)}
                  disabled={isProcessing}
                  className="text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 transition-all text-left font-sans"
                >
                  "{sp}"
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Feed */}
          <div className="h-[520px] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-4 shadow-inner">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20 font-sans'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                  {/* Recommended Product Card */}
                  {msg.product && (
                    <div className="mt-4 p-4 rounded-xl border border-blue-800/80 bg-slate-950 text-left space-y-3.5 shadow-xl">
                      <div className="relative h-44 w-full rounded-lg overflow-hidden border border-slate-800 group">
                        <img
                          src={
                            msg.product.imageUrl ||
                            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'
                          }
                          alt={msg.product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-md font-bold">
                            ★ TOP MATCH
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold text-blue-400">
                          ₹{msg.product.price.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-white">{msg.product.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400">{msg.product.category}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-800/80">
                        {msg.product.features.slice(0, 4).map((feat, fidx) => (
                          <div key={fidx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                            <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleAddToCart(msg.product!)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Add Product to Cart</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Prompt Input Form with Voice Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="flex gap-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl border flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-lg shadow-rose-600/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title={isListening ? 'Stop Listening' : 'Voice Input (Hands-free Dictation)'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={isListening ? 'Listening for voice intent...' : 'Ask AI Buyer: e.g. I need a mechanical keyboard under ₹6,000...'}
              disabled={isProcessing}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-all font-sans"
            />

            <button
              type="submit"
              disabled={isProcessing || !promptInput.trim()}
              className="flex items-center justify-center px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          {currentUpsell && (
            <div className="rounded-2xl border border-indigo-900/90 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-5 shadow-2xl space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                    Merchant Growth Opportunity
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700 font-bold">
                  {Math.round(currentUpsell.confidenceScore * 100)}% AFFINITY
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">"{currentUpsell.reason}"</p>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-800/80 flex items-center gap-3">
                <img
                  src={
                    currentUpsell.product.imageUrl ||
                    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80'
                  }
                  alt={currentUpsell.product.name}
                  className="h-14 w-14 rounded-lg object-cover border border-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{currentUpsell.product.name}</div>
                  <div className="text-xs font-mono font-extrabold text-emerald-400 mt-0.5">
                    ₹{currentUpsell.discountedPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(currentUpsell.product, true, currentUpsell.reason)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all shrink-0"
                >
                  <span>Accept Upsell</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          <AgentActivityPanel steps={steps} isThinking={isProcessing} />
        </div>
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveItem={handleRemoveFromCart}
        onAddUpsell={(upsell) => handleAddToCart(upsell.product, true, upsell.reason)}
        upsellOffer={currentUpsell}
        onCheckout={handleInitiateCheckout}
        isCheckingOut={isInitiatingCheckout}
      />

      {activeRazorpayOrderId && activeDbOrderId && (
        <RazorpayModal
          isOpen={isRazorpayOpen}
          onClose={() => setIsRazorpayOpen(false)}
          orderId={activeDbOrderId}
          razorpayOrderId={activeRazorpayOrderId}
          totalAmount={activeOrderTotal}
          isMock={isMockRazorpay}
          onSuccess={() => {
            setIsRazorpayOpen(false);
            setCart({ items: [], subtotal: 0, discountTotal: 0, total: 0 });
            alert('🎉 Razorpay Payment Verified! Order status marked CAPTURED.');
          }}
        />
      )}
    </div>
  );
}
