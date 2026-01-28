import { useState, useEffect } from "react";
import { ShoppingBag, X } from "lucide-react";

const FIRST_NAMES = [
  "João", "Maria", "Pedro", "Ana", "Lucas", "Julia", "Carlos", "Fernanda",
  "Rafael", "Beatriz", "Bruno", "Camila", "Diego", "Amanda", "Gabriel",
  "Larissa", "Mateus", "Patricia", "Thiago", "Vanessa", "Eduardo", "Mariana",
  "Felipe", "Isabela", "Rodrigo", "Leticia", "Marcelo", "Natalia", "André",
  "Bruna", "Gustavo", "Carolina", "Leonardo", "Juliana", "Vinicius", "Renata"
];

const CITIES = [
  "São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Curitiba, PR",
  "Porto Alegre, RS", "Salvador, BA", "Brasília, DF", "Fortaleza, CE",
  "Recife, PE", "Manaus, AM", "Goiânia, GO", "Campinas, SP", "Florianópolis, SC",
  "Vitória, ES", "Natal, RN", "João Pessoa, PB", "Campo Grande, MS",
  "Maceió, AL", "Teresina, PI", "Cuiabá, MT"
];

const TIMES_AGO = [
  "agora mesmo", "há 1 min", "há 2 min", "há 3 min", "há 5 min", "há 8 min"
];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const PurchaseNotifications = () => {
  const [notification, setNotification] = useState<{
    name: string;
    city: string;
    timeAgo: string;
    quantity: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showNotification = () => {
      const newNotification = {
        name: getRandomItem(FIRST_NAMES),
        city: getRandomItem(CITIES),
        timeAgo: getRandomItem(TIMES_AGO),
        quantity: Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 2 : 1,
      };
      
      setNotification(newNotification);
      setIsVisible(true);

      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    // Show first notification after 5-10 seconds
    const initialDelay = 5000 + Math.random() * 5000;
    const initialTimeout = setTimeout(showNotification, initialDelay);

    // Show subsequent notifications every 15-30 seconds
    const interval = setInterval(() => {
      const randomDelay = 15000 + Math.random() * 15000;
      setTimeout(showNotification, randomDelay);
    }, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!notification) return null;

  const quantityText = notification.quantity === 1 
    ? "1 câmera" 
    : `${notification.quantity} câmeras`;

  return (
    <div
      className={`fixed bottom-20 left-4 z-50 max-w-[280px] transition-all duration-500 ease-out ${
        isVisible 
          ? "translate-x-0 opacity-100" 
          : "-translate-x-full opacity-0"
      }`}
    >
      <div className="bg-white rounded-xl shadow-lg border border-border p-3 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="h-5 w-5 text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-tight">
            <span className="font-bold">{notification.name}</span> comprou {quantityText}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {notification.city} • {notification.timeAgo}
          </p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground p-1 -mr-1 -mt-1"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PurchaseNotifications;
