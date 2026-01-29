import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, User, AlertCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstSetup, setIsFirstSetup] = useState<boolean | null>(null);
  const [checkingSetup, setCheckingSetup] = useState(true);

  useEffect(() => {
    checkIfSetupNeeded();
  }, []);

  const checkIfSetupNeeded = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-auth", {
        body: { action: "check" }
      });

      if (error) throw error;
      setIsFirstSetup(!data.exists);
    } catch (err) {
      console.error("Error checking setup:", err);
      setIsFirstSetup(true); // Default to setup mode if error
    } finally {
      setCheckingSetup(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("admin-auth", {
        body: { action: "setup", username, password }
      });

      if (error) throw error;

      if (data.success) {
        toast.success("Credenciais de admin criadas com sucesso!");
        localStorage.setItem("admin_authenticated", "true");
        navigate("/admin/dashboard");
      } else {
        setError(data.error || "Erro ao criar credenciais");
      }
    } catch (err: any) {
      console.error("Setup error:", err);
      setError("Erro ao configurar credenciais");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.functions.invoke("admin-auth", {
        body: { action: "login", username, password }
      });

      if (error) throw error;

      if (data.success) {
        localStorage.setItem("admin_authenticated", "true");
        toast.success("Login realizado com sucesso!");
        navigate("/admin/dashboard");
      } else {
        setError("Usuário ou senha incorretos");
        toast.error("Credenciais inválidas");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800/50 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className={`mx-auto w-16 h-16 ${isFirstSetup ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-emerald-400 to-emerald-600'} rounded-2xl flex items-center justify-center shadow-lg ${isFirstSetup ? 'shadow-blue-500/25' : 'shadow-emerald-500/25'}`}>
            {isFirstSetup ? <UserPlus className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {isFirstSetup ? "Configurar Admin" : "Admin Dashboard"}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {isFirstSetup 
              ? "Configure seu primeiro acesso ao painel" 
              : "Acesse o painel de gerenciamento"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isFirstSetup ? handleSetup : handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {isFirstSetup && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-sm">
                <p>⚡ Primeiro acesso detectado!</p>
                <p className="text-xs mt-1 text-blue-300/70">
                  Crie suas credenciais de administrador. Elas serão usadas para todos os acessos futuros.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isFirstSetup ? "Escolha um usuário" : "Digite seu usuário"}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isFirstSetup ? "Escolha uma senha (mín. 6 caracteres)" : "Digite sua senha"}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                  required
                />
              </div>
            </div>

            {isFirstSetup && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    required
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isFirstSetup 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25' 
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25'
              } text-white font-semibold py-2.5 transition-all duration-200`}
            >
              {isLoading 
                ? (isFirstSetup ? "Configurando..." : "Entrando...") 
                : (isFirstSetup ? "Criar Credenciais" : "Entrar")
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
