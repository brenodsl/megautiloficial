import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { format, startOfDay, endOfDay, subDays, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  CalendarIcon, 
  X, 
  TrendingDown, 
  Eye, 
  ShoppingCart, 
  CreditCard, 
  CheckCircle2,
  AlertTriangle,
  MousePointerClick,
  Users,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, PieChart, Pie } from "recharts";

interface FunnelEvent {
  id: string;
  session_id: string;
  event_type: string;
  event_data: unknown;
  page: string;
  created_at: string;
}

interface FunnelStep {
  name: string;
  eventType: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const FunnelAnalytics = () => {
  const [events, setEvents] = useState<FunnelEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 7),
    to: new Date()
  });

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('funnel_events')
      .select('*')
      .gte('created_at', startOfDay(dateRange.from).toISOString())
      .lte('created_at', endOfDay(dateRange.to).toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching funnel events:', error);
    } else {
      setEvents(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEvents();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('funnel-events-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'funnel_events' },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dateRange]);

  // Calculate unique sessions per event type
  const funnelData = useMemo(() => {
    const sessionsByEvent: Record<string, Set<string>> = {};
    
    events.forEach(event => {
      if (!sessionsByEvent[event.event_type]) {
        sessionsByEvent[event.event_type] = new Set();
      }
      sessionsByEvent[event.event_type].add(event.session_id);
    });

    return {
      pageViews: sessionsByEvent['page_view']?.size || 0,
      productViews: sessionsByEvent['product_view']?.size || 0,
      addToCart: sessionsByEvent['add_to_cart']?.size || 0,
      checkoutStarted: sessionsByEvent['checkout_started']?.size || 0,
      checkoutStep1: sessionsByEvent['checkout_step_1']?.size || 0,
      checkoutStep2: sessionsByEvent['checkout_step_2']?.size || 0,
      checkoutStep3: sessionsByEvent['checkout_step_3']?.size || 0,
      pixGenerated: sessionsByEvent['pix_generated']?.size || 0,
      paymentConfirmed: sessionsByEvent['payment_confirmed']?.size || 0,
    };
  }, [events]);

  // Calculate drop-off rates
  const dropOffRates = useMemo(() => {
    const { pageViews, addToCart, checkoutStarted, checkoutStep1, checkoutStep2, checkoutStep3, pixGenerated, paymentConfirmed } = funnelData;
    
    return {
      cartToCheckout: addToCart > 0 ? Math.round(((addToCart - checkoutStarted) / addToCart) * 100) : 0,
      step1ToStep2: checkoutStep1 > 0 ? Math.round(((checkoutStep1 - checkoutStep2) / checkoutStep1) * 100) : 0,
      step2ToStep3: checkoutStep2 > 0 ? Math.round(((checkoutStep2 - checkoutStep3) / checkoutStep2) * 100) : 0,
      step3ToPix: checkoutStep3 > 0 ? Math.round(((checkoutStep3 - pixGenerated) / checkoutStep3) * 100) : 0,
      pixToPayment: pixGenerated > 0 ? Math.round(((pixGenerated - paymentConfirmed) / pixGenerated) * 100) : 0,
      overallConversion: pageViews > 0 ? ((paymentConfirmed / pageViews) * 100).toFixed(2) : '0',
    };
  }, [funnelData]);

  // Funnel steps for visualization
  const funnelSteps: FunnelStep[] = [
    { name: "Visualizações", eventType: "page_view", count: funnelData.pageViews, icon: <Eye className="w-4 h-4" />, color: "#3b82f6" },
    { name: "Add ao Carrinho", eventType: "add_to_cart", count: funnelData.addToCart, icon: <ShoppingCart className="w-4 h-4" />, color: "#8b5cf6" },
    { name: "Checkout Iniciado", eventType: "checkout_started", count: funnelData.checkoutStarted, icon: <CreditCard className="w-4 h-4" />, color: "#f59e0b" },
    { name: "PIX Gerado", eventType: "pix_generated", count: funnelData.pixGenerated, icon: <CreditCard className="w-4 h-4" />, color: "#10b981" },
    { name: "Pagamento", eventType: "payment_confirmed", count: funnelData.paymentConfirmed, icon: <CheckCircle2 className="w-4 h-4" />, color: "#22c55e" },
  ];

  // Checkout steps breakdown
  const checkoutSteps = [
    { name: "Dados Pessoais", count: funnelData.checkoutStep1, dropOff: dropOffRates.step1ToStep2 },
    { name: "Endereço", count: funnelData.checkoutStep2, dropOff: dropOffRates.step2ToStep3 },
    { name: "Pagamento", count: funnelData.checkoutStep3, dropOff: dropOffRates.step3ToPix },
  ];

  // Abandonment insights
  const abandonmentInsights = useMemo(() => {
    const insights: { title: string; description: string; severity: 'high' | 'medium' | 'low' }[] = [];
    
    if (dropOffRates.cartToCheckout > 60) {
      insights.push({
        title: "Alto abandono antes do checkout",
        description: `${dropOffRates.cartToCheckout}% dos usuários adicionam ao carrinho mas não iniciam o checkout. Considere adicionar mais incentivos ou reduzir fricção.`,
        severity: 'high'
      });
    }
    
    if (dropOffRates.step1ToStep2 > 40) {
      insights.push({
        title: "Abandono na etapa de Dados Pessoais",
        description: `${dropOffRates.step1ToStep2}% abandonam após preencher dados pessoais. Verifique se o formulário não está muito longo.`,
        severity: 'medium'
      });
    }
    
    if (dropOffRates.step2ToStep3 > 30) {
      insights.push({
        title: "Abandono na etapa de Endereço",
        description: `${dropOffRates.step2ToStep3}% abandonam após o endereço. Verifique se o cálculo de frete está funcionando corretamente.`,
        severity: 'medium'
      });
    }
    
    if (dropOffRates.pixToPayment > 50) {
      insights.push({
        title: "Alto abandono após gerar PIX",
        description: `${dropOffRates.pixToPayment}% geram o PIX mas não pagam. Considere lembretes via WhatsApp ou email.`,
        severity: 'high'
      });
    }

    if (insights.length === 0) {
      insights.push({
        title: "Funil saudável",
        description: "As taxas de conversão estão dentro do esperado. Continue monitorando!",
        severity: 'low'
      });
    }
    
    return insights;
  }, [dropOffRates]);

  // Time distribution data
  const timeDistribution = useMemo(() => {
    const hourCounts: Record<number, number> = {};
    
    events.forEach(event => {
      if (event.event_type === 'checkout_started') {
        const hour = new Date(event.created_at).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });
    
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}h`,
      checkouts: hourCounts[i] || 0
    }));
  }, [events]);

  const totalSessions = new Set(events.map(e => e.session_id)).size;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[280px] justify-start text-left font-normal bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ from: range.from, to: range.to });
                }
              }}
              numberOfMonths={2}
              locale={ptBR}
              className="p-3"
            />
          </PopoverContent>
        </Popover>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDateRange({ from: new Date(), to: new Date() })}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            Hoje
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDateRange({ from: subDays(new Date(), 7), to: new Date() })}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            7 dias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDateRange({ from: subDays(new Date(), 30), to: new Date() })}
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            30 dias
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={fetchEvents}
          className="text-slate-400 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Sessões Únicas</p>
                <p className="text-xl font-bold text-white">{totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Checkouts Iniciados</p>
                <p className="text-xl font-bold text-white">{funnelData.checkoutStarted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Conversões</p>
                <p className="text-xl font-bold text-white">{funnelData.paymentConfirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Taxa de Conversão</p>
                <p className="text-xl font-bold text-white">{dropOffRates.overallConversion}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MousePointerClick className="w-5 h-5" />
            Funil de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelSteps.map((step, index) => {
              const prevCount = index > 0 ? funnelSteps[index - 1].count : step.count;
              const percentage = prevCount > 0 ? Math.round((step.count / prevCount) * 100) : 0;
              const width = funnelSteps[0].count > 0 ? (step.count / funnelSteps[0].count) * 100 : 0;
              
              return (
                <div key={step.eventType} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${step.color}20` }}
                      >
                        <span style={{ color: step.color }}>{step.icon}</span>
                      </div>
                      <span className="text-white font-medium">{step.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white font-bold">{step.count}</span>
                      {index > 0 && (
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            percentage >= 70 ? "border-emerald-500/50 text-emerald-400" :
                            percentage >= 40 ? "border-amber-500/50 text-amber-400" :
                            "border-red-500/50 text-red-400"
                          )}
                        >
                          {percentage}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={width} 
                    className="h-3 bg-slate-700"
                    style={{ '--progress-color': step.color } as React.CSSProperties}
                  />
                  {index < funnelSteps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-600 mx-auto my-2" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Checkout Steps Breakdown */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Etapas do Checkout (Onde Abandonam)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {checkoutSteps.map((step, index) => (
              <div key={step.name} className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-300 text-sm">Etapa {index + 1}</span>
                  <Badge 
                    variant="outline"
                    className={cn(
                      "text-xs",
                      step.dropOff <= 20 ? "border-emerald-500/50 text-emerald-400" :
                      step.dropOff <= 40 ? "border-amber-500/50 text-amber-400" :
                      "border-red-500/50 text-red-400"
                    )}
                  >
                    -{step.dropOff}% abandono
                  </Badge>
                </div>
                <p className="text-white font-semibold text-lg">{step.name}</p>
                <p className="text-slate-400 text-sm mt-1">{step.count} usuários chegaram</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PIX Abandonment Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Abandono do PIX
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-slate-700/30 rounded-xl">
              <p className="text-4xl font-bold text-emerald-400">{funnelData.pixGenerated}</p>
              <p className="text-slate-400 text-sm mt-2">PIX Gerados</p>
            </div>
            <div className="text-center p-6 bg-slate-700/30 rounded-xl">
              <p className="text-4xl font-bold text-green-400">{funnelData.paymentConfirmed}</p>
              <p className="text-slate-400 text-sm mt-2">Pagamentos Confirmados</p>
            </div>
            <div className="text-center p-6 bg-slate-700/30 rounded-xl">
              <p className="text-4xl font-bold text-red-400">{dropOffRates.pixToPayment}%</p>
              <p className="text-slate-400 text-sm mt-2">Taxa de Abandono</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Insights e Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {abandonmentInsights.map((insight, index) => (
              <div 
                key={index} 
                className={cn(
                  "p-4 rounded-lg border-l-4",
                  insight.severity === 'high' ? "bg-red-500/10 border-red-500" :
                  insight.severity === 'medium' ? "bg-amber-500/10 border-amber-500" :
                  "bg-emerald-500/10 border-emerald-500"
                )}
              >
                <p className={cn(
                  "font-semibold",
                  insight.severity === 'high' ? "text-red-400" :
                  insight.severity === 'medium' ? "text-amber-400" :
                  "text-emerald-400"
                )}>
                  {insight.title}
                </p>
                <p className="text-slate-300 text-sm mt-1">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hourly Distribution */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Horários de Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeDistribution}>
                <XAxis dataKey="hour" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="checkouts" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunnelAnalytics;
