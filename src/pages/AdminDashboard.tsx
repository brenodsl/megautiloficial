import { useEffect, useState } from "react";
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
  Radio
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { usePresenceCleanup } from "@/hooks/usePresence";
import { ptBR } from "date-fns/locale";

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

  // Cleanup old presence entries
  usePresenceCleanup();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_authenticated");
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
    await Promise.all([fetchOrders(), fetchPixels(), fetchLiveVisitors()]);
    setIsLoading(false);
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
    sessionStorage.removeItem("admin_authenticated");
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

  // Stats calculations
  const totalOrders = orders.length;
  const paidOrders = orders.filter(o => o.payment_status === 'paid');
  const pendingOrders = orders.filter(o => o.payment_status === 'pending');
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
          <TabsList className="bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="orders" className="data-[state=active]:bg-slate-700">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="pixels" className="data-[state=active]:bg-slate-700">
              <Eye className="w-4 h-4 mr-2" />
              Pixels
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Pedidos Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum pedido encontrado</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Cliente</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Valor</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Status</th>
                          <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Data</th>
                          <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
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
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
