import { useState } from "react";
import { Star, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReviewFormProps {
  onReviewSubmitted?: () => void;
}

const ReviewForm = ({ onReviewSubmitted }: ReviewFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.comment.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("reviews").insert({
        customer_name: formData.name.trim(),
        customer_email: formData.email.trim(),
        comment: formData.comment.trim(),
        rating,
        status: "pending",
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Avaliação enviada para análise!");
      onReviewSubmitted?.();
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ name: "", email: "", comment: "" });
        setRating(5);
        setIsOpen(false);
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-emerald-900 mb-1">Obrigado pela sua avaliação!</h3>
        <p className="text-sm text-emerald-700">
          Seu comentário foi enviado para análise e será publicado em breve.
        </p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full py-6 border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-gray-600 hover:text-emerald-700 rounded-xl transition-all"
      >
        <Star className="h-5 w-5 mr-2" />
        Deixar minha avaliação
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Sua Avaliação</h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancelar
        </button>
      </div>

      {/* Star Rating */}
      <div className="space-y-2">
        <label className="text-sm text-gray-600">Nota</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoveredRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm text-gray-600">Nome</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Seu nome"
          className="bg-white"
          maxLength={100}
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm text-gray-600">E-mail</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="seu@email.com"
          className="bg-white"
          maxLength={255}
          required
        />
        <p className="text-xs text-gray-400">Seu e-mail não será publicado</p>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <label className="text-sm text-gray-600">Comentário</label>
        <Textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Conte sua experiência com o produto..."
          className="bg-white min-h-[100px]"
          maxLength={1000}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-12 rounded-xl"
      >
        {isSubmitting ? (
          "Enviando..."
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Enviar Avaliação
          </>
        )}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        Sua avaliação passará por uma análise antes de ser publicada.
      </p>
    </form>
  );
};

export default ReviewForm;