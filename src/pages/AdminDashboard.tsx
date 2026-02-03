import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { 
  LogOut, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  TrendingUp,
  Users,
  Package,
  Radio,
  CreditCard,
  Save,
  Gift,
  ExternalLink,
  CalendarIcon,
  X,
  Tag,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { format, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { usePresenceCleanup } from "@/hooks/usePresence";
import { ptBR } from "date-fns/locale";
import FunnelAnalytics from "@/components/admin/FunnelAnalytics";
import { KitPriceOption, DEFAULT_KIT_PRICES, updateKitPricing } from "@/hooks/useKitPricing";

interface Order {
  id: string;
  transaction_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_cpf: string;
  address_city: string | null;
  address_state: string | null;
  items: unknown;
  total_amount: number;
  payment_status: string;
  created_at: string;
  paid_at: string | null;
  gateway_used: string | null;
}

interface Pixel {
  id: string;
  platform: string;
  pixel_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface PresenceCount {
  page: string;
  count: number;
}

interface GatewaySetting {
  id: string;
  gateway_name: string;
  api_token: string;
  product_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UpsellConfig {
  enabled: boolean;
  redirect_url: string;
}

interface ProductPriceConfig {
  unit_price: number;
  original_price: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newPixelId, setNewPixelId] = useState("");
  const [newPixelName, setNewPixelName] = useState("");
  const [newPixelPlatform, setNewPixelPlatform] = useState("tiktok");
  const [isAddingPixel, setIsAddingPixel] = useState(false);
  const [liveVisitors, setLiveVisitors] = useState<PresenceCount[]>([]);
  const [gatewaySettings, setGatewaySettings] = useState<GatewaySetting[]>([]);
  const [isSavingGateway, setIsSavingGateway] = useState(false);
  const [upsellConfig, setUpsellConfig] = useState<UpsellConfig>({ enabled: true, redirect_url: '/upsell' });
  const [isSavingUpsell, setIsSavingUpsell] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [productPrice, setProductPrice] = useState<ProductPriceConfig>({ unit_price: 77.98, original_price: 239.80 });
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [kitPrices, setKitPrices] = useState<KitPriceOption[]>(DEFAULT_KIT_PRICES);
  const [isSavingKitPrices, setIsSavingKitPrices] = useState(false);

  // Cleanup old presence entries
  usePresenceCleanup();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_authenticated");
    if (!isAuthenticated) {
      navigate("/admin");
      return;
    }
    
    fetchData();
    fetchLiveVisitors();
    
    // Refresh live visitors every 10 seconds
    const visitorInterval = setInterval(fetchLiveVisitors, 10000);
    
    // Subscribe to realtime updates for orders
    const ordersChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    // Subscribe to realtime updates for presence
    const presenceChannel = supabase
      .channel('presence-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'presence' },
        () => {
          fetchLiveVisitors();
        }
      )
      .subscribe();

    return () => {
      clearInterval(visitorInterval);
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([fetchOrders(), fetchPixels(), fetchLiveVisitors(), fetchGatewaySettings(), fetchUpsellConfig(), fetchProductPrice(), fetchKitPrices()]);
    setIsLoading(false);
  };

  const fetchKitPrices = async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_key', 'kit_pricing')
      .maybeSingle();

    if (!error && data?.setting_value) {
      const config = data.setting_value as unknown as { kits: KitPriceOption[] };
      if (config.kits && Array.isArray(config.kits)) {
        const kitsWithSavings = config.kits.map(kit => ({
          ...kit,
          savings: kit.originalPrice - kit.salePrice
        }));
        setKitPrices(kitsWithSavings);
      }
    }
  };

  const handleSaveKitPrices = async () => {
    setIsSavingKitPrices(true);
    const success = await updateKitPricing(kitPrices);
    if (success) {
      toast.success("Preços dos kits atualizados! Recarregue a página para ver as alterações.");
    } else {
      toast.error("Erro ao salvar preços dos kits");
    }
    setIsSavingKitPrices(false);
  };

  const handleUpdateKitPrice = (index: number, field: 'originalPrice' | 'salePrice', value: number) => {
    setKitPrices(prev => prev.map((kit, i) => {
      if (i === index) {
        const updated = { ...kit, [field]: value };
        updated.savings = updated.originalPrice - updated.salePrice;
        return updated;
      }
      return kit;
    }));
  };

  const fetchProductPrice = async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_key', 'product_price')
      .maybeSingle();

    if (!error && data) {
      const value = data.setting_value as unknown as ProductPriceConfig;
      setProductPrice(value);
    }
  };

  const handleSaveProductPrice = async () => {
    setIsSavingPrice(true);
    const { error } = await supabase
      .from('app_settings')
      .upsert([{ 
        setting_key: 'product_price',
        setting_value: JSON.parse(JSON.stringify(productPrice)),
        updated_at: new Date().toISOString()
      }], { onConflict: 'setting_key' });

    if (error) {
      toast.error("Erro ao salvar preço do produto");
      console.error(error);
    } else {
      toast.success("Preço do produto atualizado! Recarregue a página para ver as alterações.");
    }
    setIsSavingPrice(false);
  };

  const fetchUpsellConfig = async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_key', 'upsell_config')
      .single();

    if (!error && data) {
      const value = data.setting_value as unknown as UpsellConfig;
      setUpsellConfig(value);
    }
  };

  const handleSaveUpsellConfig = async () => {
    setIsSavingUpsell(true);
    const { error } = await supabase
      .from('app_settings')
      .update({ setting_value: JSON.parse(JSON.stringify(upsellConfig)) })
      .eq('setting_key', 'upsell_config');

    if (error) {
      toast.error("Erro ao salvar configurações de upsell");
      console.error(error);
    } else {
      toast.success("Configurações de upsell salvas!");
    }
    setIsSavingUpsell(false);
  };

  const fetchGatewaySettings = async () => {
    const { data, error } = await supabase
      .from('gateway_settings')
      .select('*')
      .order('gateway_name', { ascending: true });

    if (error) {
      console.error('Erro ao carregar configurações de gateway:', error);
    } else {
      setGatewaySettings(data || []);
    }
  };

  const handleUpdateGatewayToken = (gatewayName: string, value: string) => {
    setGatewaySettings(prev => 
      prev.map(g => g.gateway_name === gatewayName ? { ...g, api_token: value } : g)
    );
  };

  const handleUpdateGatewayProductId = (gatewayName: string, value: string) => {
    setGatewaySettings(prev => 
      prev.map(g => g.gateway_name === gatewayName ? { ...g, product_id: value } : g)
    );
  };

  const handleToggleGateway = async (selectedGateway: GatewaySetting) => {
    // Set selected gateway as active and others as inactive
    const updates = gatewaySettings.map(g => ({
      id: g.id,
      is_active: g.gateway_name === selectedGateway.gateway_name
    }));

    for (const update of updates) {
      await supabase
        .from('gateway_settings')
        .update({ is_active: update.is_active })
        .eq('id', update.id);
    }

    toast.success(`Gateway ${selectedGateway.gateway_name.toUpperCase()} ativado!`);
    fetchGatewaySettings();
  };

  const handleSaveGatewaySettings = async (gateway: GatewaySetting) => {
    if (!gateway.api_token.trim() || !gateway.product_id.trim()) {
      toast.error("Preencha o API Token e o ID do Produto");
      return;
    }

    setIsSavingGateway(true);
    const { error } = await supabase
      .from('gateway_settings')
      .update({
        api_token: gateway.api_token.trim(),
        product_id: gateway.product_id.trim()
      })
      .eq('id', gateway.id);

    if (error) {
      toast.error("Erro ao salvar configurações");
      console.error(error);
    } else {
      toast.success(`Configurações do ${gateway.gateway_name.toUpperCase()} salvas!`);
    }
    setIsSavingGateway(false);
  };

  const fetchLiveVisitors = async () => {
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
    const { data, error } = await supabase
      .from('presence')
      .select('page')
      .gte('last_seen', oneMinuteAgo);

    if (!error && data) {
      // Count visitors per page
      const counts: Record<string, number> = {};
      data.forEach(row => {
        counts[row.page] = (counts[row.page] || 0) + 1;
      });
      
      const presenceCounts: PresenceCount[] = Object.entries(counts).map(([page, count]) => ({
        page,
        count
      }));
      
      setLiveVisitors(presenceCounts);
    }
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Erro ao carregar pedidos");
      console.error(error);
    } else {
      setOrders(data || []);
    }
  };

  const fetchPixels = async () => {
    const { data, error } = await supabase
      .from('pixels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Erro ao carregar pixels");
      console.error(error);
    } else {
      setPixels(data || []);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    navigate("/admin");
    toast.success("Logout realizado");
  };

  const handleAddPixel = async () => {
    if (!newPixelId.trim()) {
      toast.error("Informe o ID do pixel");
      return;
    }

    setIsAddingPixel(true);
    const { error } = await supabase
      .from('pixels')
      .insert({
        platform: newPixelPlatform,
        pixel_id: newPixelId.trim(),
        name: newPixelName.trim() || `Pixel ${pixels.length + 1}`,
        is_active: true
      });

    if (error) {
      toast.error("Erro ao adicionar pixel");
      console.error(error);
    } else {
      toast.success("Pixel adicionado com sucesso!");
      setNewPixelId("");
      setNewPixelName("");
      fetchPixels();
    }
    setIsAddingPixel(false);
  };

  const handleTogglePixel = async (pixel: Pixel) => {
    const { error } = await supabase
      .from('pixels')
      .update({ is_active: !pixel.is_active })
      .eq('id', pixel.id);

    if (error) {
      toast.error("Erro ao atualizar pixel");
    } else {
      toast.success(pixel.is_active ? "Pixel desativado" : "Pixel ativado");
      fetchPixels();
    }
  };

  const handleDeletePixel = async (id: string) => {
    const { error } = await supabase
      .from('pixels')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Erro ao remover pixel");
    } else {
      toast.success("Pixel removido");
      fetchPixels();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const updateData: any = { payment_status: status };
    if (status === 'paid') {
      updateData.paid_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      toast.success("Status atualizado!");
      fetchOrders();
      setSelectedOrder(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pendente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelado</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Falhou</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter orders by selected date
  const filteredOrders = useMemo(() => {
    if (!selectedDate) return orders;
    
    const dayStart = startOfDay(selectedDate);
    const dayEnd = endOfDay(selectedDate);
    
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return isWithinInterval(orderDate, { start: dayStart, end: dayEnd });
    });
  }, [orders, selectedDate]);

  // Stats calculations based on filtered orders
  const totalOrders = filteredOrders.length;
  const paidOrders = filteredOrders.filter(o => o.payment_status === 'paid');
  const pendingOrders = filteredOrders.filter(o => o.payment_status === 'pending');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const conversionRate = totalOrders > 0 ? ((paidOrders.length / totalOrders) * 100).toFixed(1) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Max Runner</h1>
                <p className="text-xs text-slate-400">Painel Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchData}
                className="text-slate-400 hover:text-white"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-400 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total de Vendas</p>
                  <p className="text-2xl font-bold text-white">{totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Receita Total</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Pendentes</p>
                  <p className="text-2xl font-bold text-amber-400">{pendingOrders.length}</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Conversão</p>
                  <p className="text-2xl font-bold text-purple-400">{conversionRate}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Visitors Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              Visitantes ao Vivo
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({liveVisitors.reduce((sum, v) => sum + v.count, 0)} online)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {liveVisitors.length === 0 ? (
              <p className="text-slate-400 text-sm">Nenhum visitante ativo no momento</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {liveVisitors.map((visitor) => (
                  <div key={visitor.page} className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm capitalize">
                        {visitor.page === "/" ? "Página Inicial" : 
                         visitor.page === "/checkout" ? "Checkout" :
                         visitor.page === "/upsell" ? "Upsell" :
                         visitor.page === "/obrigado" ? "Obrigado" :
                         visitor.page}
                      </p>
                      <p className="text-slate-400 text-xs">{visitor.page}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-green-400 font-bold">{visitor.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700 flex-wrap">
            <TabsTrigger value="orders" className="data-[state=active]:bg-slate-700">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Funil
            </TabsTrigger>
            <TabsTrigger value="pixels" className="data-[state=active]:bg-slate-700">
              <Eye className="w-4 h-4 mr-2" />
              Pixels
            </TabsTrigger>
            <TabsTrigger value="gateway" className="data-[state=active]:bg-slate-700">
              <CreditCard className="w-4 h-4 mr-2" />
              Gateway
            </TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-slate-700">
              <Tag className="w-4 h-4 mr-2" />
              Preço
            </TabsTrigger>
            <TabsTrigger value="upsell" className="data-[state=active]:bg-slate-700">
              <Gift className="w-4 h-4 mr-2" />
              Upsell
            </TabsTrigger>
          </TabsList>

          {/* Funnel Analytics Tab */}
          <TabsContent value="analytics">
            <FunnelAnalytics />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-white flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Pedidos {selectedDate ? `- ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}` : '- Todos'}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[200px] justify-start text-left font-normal bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                            !selectedDate && "text-slate-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="end">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          locale={ptBR}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    {selectedDate && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDate(undefined)}
                        className="text-slate-400 hover:text-white hover:bg-slate-700"
                        title="Limpar filtro"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{selectedDate ? `Nenhum pedido em ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}` : 'Nenhum pedido encontrado'}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Cliente</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Valor</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Status</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Gateway</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Data</th>
                          <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-white font-medium">{order.customer_name}</p>
                                <p className="text-slate-400 text-sm">{order.customer_email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-emerald-400 font-semibold">
                                R$ {Number(order.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {getStatusBadge(order.payment_status)}
                            </td>
                            <td className="py-4 px-4">
                              {order.gateway_used ? (
                                <Badge variant="outline" className={cn(
                                  "text-xs",
                                  order.gateway_used === 'goatpay' 
                                    ? "border-purple-500/50 text-purple-400 bg-purple-500/10"
                                    : "border-blue-500/50 text-blue-400 bg-blue-500/10"
                                )}>
                                  {order.gateway_used.toUpperCase()}
                                </Badge>
                              ) : (
                                <span className="text-slate-500 text-sm">-</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-slate-400 text-sm">
                              {format(new Date(order.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedOrder(order)}
                                    className="text-slate-400 hover:text-white"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">Detalhes do Pedido</DialogTitle>
                                  </DialogHeader>
                                  {selectedOrder && (
                                    <div className="space-y-6">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-slate-400">Cliente</Label>
                                          <p className="text-white">{selectedOrder.customer_name}</p>
                                        </div>
                                        <div>
                                          <Label className="text-slate-400">Email</Label>
                                          <p className="text-white">{selectedOrder.customer_email}</p>
                                        </div>
                                        <div>
                                          <Label className="text-slate-400">Telefone</Label>
                                          <p className="text-white">{selectedOrder.customer_phone}</p>
                                        </div>
                                        <div>
                                          <Label className="text-slate-400">CPF</Label>
                                          <p className="text-white">{selectedOrder.customer_cpf}</p>
                                        </div>
                                        <div>
                                          <Label className="text-slate-400">Cidade/Estado</Label>
                                          <p className="text-white">{selectedOrder.address_city}/{selectedOrder.address_state}</p>
                                        </div>
                                        <div>
                                          <Label className="text-slate-400">Total</Label>
                                          <p className="text-emerald-400 font-bold">
                                            R$ {Number(selectedOrder.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-slate-400">Gateway</Label>
                                          {selectedOrder.gateway_used ? (
                                            <Badge variant="outline" className={cn(
                                              "mt-1",
                                              selectedOrder.gateway_used === 'goatpay' 
                                                ? "border-purple-500/50 text-purple-400 bg-purple-500/10"
                                                : "border-blue-500/50 text-blue-400 bg-blue-500/10"
                                            )}>
                                              {selectedOrder.gateway_used.toUpperCase()}
                                            </Badge>
                                          ) : (
                                            <p className="text-slate-500">Não identificado</p>
                                          )}
                                        </div>
                                      </div>

                                      <div>
                                        <Label className="text-slate-400">Itens</Label>
                                        <div className="mt-2 space-y-2">
                                          {(selectedOrder.items as any[]).map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                                              <div>
                                                <p className="text-white">{item.name}</p>
                                                <p className="text-slate-400 text-sm">
                                                  Cor: {item.color} | Tam: {item.size} | Qtd: {item.quantity}
                                                </p>
                                              </div>
                                              <p className="text-emerald-400">
                                                R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-4">
                                        <Label className="text-slate-400">Atualizar Status:</Label>
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            variant={selectedOrder.payment_status === 'paid' ? 'default' : 'outline'}
                                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'paid')}
                                            className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
                                          >
                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                            Pago
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant={selectedOrder.payment_status === 'pending' ? 'default' : 'outline'}
                                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'pending')}
                                            className="bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/30"
                                          >
                                            <Clock className="w-4 h-4 mr-1" />
                                            Pendente
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant={selectedOrder.payment_status === 'cancelled' ? 'default' : 'outline'}
                                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                                            className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                                          >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Cancelado
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pixels Tab */}
          <TabsContent value="pixels">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Gerenciar Pixels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Pixel Form */}
                <div className="bg-slate-700/30 p-4 rounded-xl space-y-4">
                  <h3 className="text-white font-medium">Adicionar Novo Pixel</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-slate-400 text-sm">Plataforma</Label>
                      <Select value={newPixelPlatform} onValueChange={setNewPixelPlatform}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="google">Google</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-400 text-sm">ID do Pixel</Label>
                      <Input
                        value={newPixelId}
                        onChange={(e) => setNewPixelId(e.target.value)}
                        placeholder="Ex: D5FHVOBC77UA7T087GJ0"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-400 text-sm">Nome (opcional)</Label>
                      <Input
                        value={newPixelName}
                        onChange={(e) => setNewPixelName(e.target.value)}
                        placeholder="Ex: Pixel Principal"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleAddPixel}
                        disabled={isAddingPixel}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Pixels List */}
                <div className="space-y-3">
                  {pixels.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum pixel configurado</p>
                    </div>
                  ) : (
                    pixels.map((pixel) => (
                      <div
                        key={pixel.id}
                        className="flex items-center justify-between bg-slate-700/30 p-4 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            pixel.platform === 'tiktok' ? 'bg-pink-500/20' :
                            pixel.platform === 'facebook' ? 'bg-blue-500/20' : 'bg-amber-500/20'
                          }`}>
                            <Eye className={`w-5 h-5 ${
                              pixel.platform === 'tiktok' ? 'text-pink-400' :
                              pixel.platform === 'facebook' ? 'text-blue-400' : 'text-amber-400'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-white font-medium">{pixel.name || 'Sem nome'}</p>
                              <Badge variant="outline" className="text-xs capitalize">
                                {pixel.platform}
                              </Badge>
                            </div>
                            <p className="text-slate-400 text-sm font-mono">{pixel.pixel_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Label className="text-slate-400 text-sm">Ativo</Label>
                            <Switch
                              checked={pixel.is_active}
                              onCheckedChange={() => handleTogglePixel(pixel)}
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePixel(pixel.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gateway Tab */}
          <TabsContent value="gateway">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Configuração de Gateway de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-400 text-sm">
                  Selecione o gateway ativo e configure as credenciais de cada um. Apenas um gateway pode estar ativo por vez.
                </p>

                {gatewaySettings.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum gateway configurado</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {gatewaySettings.map((gateway) => (
                      <div
                        key={gateway.id}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          gateway.is_active 
                            ? 'bg-emerald-500/10 border-emerald-500' 
                            : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              gateway.gateway_name === 'sigmapay' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                            }`}>
                              <CreditCard className={`w-6 h-6 ${
                                gateway.gateway_name === 'sigmapay' ? 'text-blue-400' : 'text-purple-400'
                              }`} />
                            </div>
                            <div>
                              <h3 className="text-white font-bold text-lg uppercase">
                                {gateway.gateway_name}
                              </h3>
                              <p className="text-slate-400 text-sm">
                                {gateway.gateway_name === 'sigmapay' 
                                  ? 'SigmaPay - Gateway Principal'
                                  : 'GoatPay - Gateway Alternativo'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {gateway.is_active ? (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Ativo
                              </Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleGateway(gateway)}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                              >
                                Ativar este gateway
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-slate-400 text-sm">API Token</Label>
                            <Input
                              type="password"
                              value={gateway.api_token}
                              onChange={(e) => handleUpdateGatewayToken(gateway.gateway_name, e.target.value)}
                              placeholder="Cole o token da API aqui"
                              className="bg-slate-700/50 border-slate-600 text-white font-mono"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-400 text-sm">ID do Produto</Label>
                            <Input
                              value={gateway.product_id}
                              onChange={(e) => handleUpdateGatewayProductId(gateway.gateway_name, e.target.value)}
                              placeholder="Ex: nufdla4nza"
                              className="bg-slate-700/50 border-slate-600 text-white font-mono"
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={() => handleSaveGatewaySettings(gateway)}
                            disabled={isSavingGateway}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Credenciais
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Configuração de Preços dos Kits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-400 text-sm">
                  Configure o preço de cada kit que será exibido em todo o site. Os preços serão atualizados automaticamente na página do produto, checkout e PIX gerado.
                </p>

                {/* Kit Prices */}
                <div className="space-y-4">
                  {kitPrices.map((kit, index) => (
                    <div
                      key={kit.quantity}
                      className={`p-5 rounded-xl border-2 transition-all ${
                        kit.isPopular 
                          ? 'bg-emerald-500/10 border-emerald-500' 
                          : 'bg-slate-700/30 border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            kit.isPopular ? 'bg-emerald-500/20' : 'bg-slate-600/50'
                          }`}>
                            <Package className={`w-5 h-5 ${
                              kit.isPopular ? 'text-emerald-400' : 'text-slate-400'
                            }`} />
                          </div>
                          <div>
                            <h3 className="text-white font-bold">
                              {kit.label}
                              {kit.isPopular && (
                                <Badge className="ml-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                  MAIS VENDIDO
                                </Badge>
                              )}
                            </h3>
                            <p className="text-slate-400 text-xs">
                              {kit.quantity} {kit.quantity === 1 ? 'unidade' : 'unidades'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">Economia</p>
                          <p className={`font-bold ${kit.savings > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {kit.savings > 0 ? `R$ ${kit.savings.toFixed(2).replace(".", ",")}` : '-'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-slate-400 text-xs">Preço Original (R$)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={kit.originalPrice}
                            onChange={(e) => handleUpdateKitPrice(index, 'originalPrice', parseFloat(e.target.value) || 0)}
                            className="bg-slate-700/50 border-slate-600 text-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-slate-400 text-xs">Preço de Venda (R$)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={kit.salePrice}
                            onChange={(e) => handleUpdateKitPrice(index, 'salePrice', parseFloat(e.target.value) || 0)}
                            className="bg-slate-700/50 border-slate-600 text-white font-bold"
                          />
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="mt-3 flex items-center gap-3 text-sm">
                        <span className="text-slate-500">Prévia:</span>
                        <span className="text-slate-500 line-through">
                          R$ {kit.originalPrice.toFixed(2).replace(".", ",")}
                        </span>
                        <span className="font-bold text-emerald-400">
                          R$ {kit.salePrice.toFixed(2).replace(".", ",")}
                        </span>
                        {kit.originalPrice > 0 && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                            -{Math.round(((kit.originalPrice - kit.salePrice) / kit.originalPrice) * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveKitPrices}
                    disabled={isSavingKitPrices}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSavingKitPrices ? 'Salvando...' : 'Salvar Preços dos Kits'}
                  </Button>
                </div>

                {/* Info box */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <h4 className="text-blue-400 font-medium flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Alterações Automáticas
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Ao salvar, os novos preços serão aplicados automaticamente em toda a loja: página do produto, carrinho, checkout, valor do PIX gerado e rastreamento de pixels. 
                    Recarregue a página após salvar para ver as alterações.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upsell Tab */}
          <TabsContent value="upsell">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Configuração de Upsell
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-400 text-sm">
                  Configure o redirecionamento após o pagamento ser confirmado. Quando ativado, o cliente será redirecionado para a página de upsell informada. Quando desativado, irá direto para a página de obrigado.
                </p>

                <div className={`p-6 rounded-xl border-2 transition-all ${
                  upsellConfig.enabled 
                    ? 'bg-emerald-500/10 border-emerald-500' 
                    : 'bg-slate-700/30 border-slate-600'
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        upsellConfig.enabled ? 'bg-emerald-500/20' : 'bg-slate-600/20'
                      }`}>
                        <Gift className={`w-6 h-6 ${
                          upsellConfig.enabled ? 'text-emerald-400' : 'text-slate-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">
                          Página de Upsell
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {upsellConfig.enabled 
                            ? 'O cliente verá ofertas adicionais após o pagamento'
                            : 'O cliente irá direto para a página de obrigado'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label className="text-slate-400">Ativar Upsell</Label>
                      <Switch
                        checked={upsellConfig.enabled}
                        onCheckedChange={(checked) => setUpsellConfig(prev => ({ ...prev, enabled: checked }))}
                      />
                    </div>
                  </div>

                  {upsellConfig.enabled && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-slate-400 text-sm flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          URL de Redirecionamento
                        </Label>
                        <Input
                          value={upsellConfig.redirect_url}
                          onChange={(e) => setUpsellConfig(prev => ({ ...prev, redirect_url: e.target.value }))}
                          placeholder="/upsell ou URL externa"
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                        <p className="text-slate-500 text-xs">
                          Use "/upsell" para a página interna ou informe uma URL externa completa (ex: https://exemplo.com/oferta)
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleSaveUpsellConfig}
                      disabled={isSavingUpsell}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Configurações
                    </Button>
                  </div>
                </div>

                {/* Info boxes */}
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                    <h4 className="text-emerald-400 font-medium flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Upsell Ativado
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Após o pagamento, o cliente será redirecionado para a URL configurada onde poderá ver ofertas adicionais.
                    </p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                    <h4 className="text-amber-400 font-medium flex items-center gap-2 mb-2">
                      <XCircle className="w-4 h-4" />
                      Upsell Desativado
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Após o pagamento, o cliente será direcionado diretamente para a página de obrigado (/obrigado).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
