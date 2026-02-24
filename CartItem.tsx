import { CartItem as CartItemType } from "../types";
import { Trash2, Minus, Plus, ShoppingCart, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";

// Base64 SVG error image - broken image icon
const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, type: "compra" | "alquiler", quantity: number) => void;
  onRemove: (productId: string, type: "compra" | "alquiler") => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const price = item.type === "compra" 
    ? item.product.salePrice || 0 
    : item.product.rentalPrice || 0;

  const totalPrice = price * item.quantity;

  const handleRemove = () => {
    onRemove(item.product.id, item.type);
    toast.success(
      `${item.product.name} eliminado del carrito 💔`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E6A4B4]/20 shadow-md hover:shadow-lg transition-all duration-300"
    >
      {/* Product Image with Fallback */}
      <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#F9E5E9] to-[#FFE8EC]">
        {/* Loading State */}
        {isImageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F9E5E9] to-[#FFE8EC] z-10">
            <div className="w-6 h-6 border-2 border-[rgba(230,164,180,0.3)] border-t-[#E6A4B4] rounded-full animate-spin" />
          </div>
        )}

        {/* Error State - Fallback */}
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#F9E5E9] to-[#FFE8EC] p-1">
            <img
              src={ERROR_IMG_SRC}
              alt="Error"
              className="w-8 h-8 opacity-70"
              style={{ animation: 'pulse 2s ease-in-out infinite' }}
            />
            <span className="text-[8px] text-[#9B8B87] text-center leading-tight">
              No disponible
            </span>
            <style>{`
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.05); opacity: 1; }
              }
            `}</style>
          </div>
        ) : (
          /* Normal Image */
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}

        {/* Type Badge */}
        <div className="absolute bottom-1 left-1 right-1">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
              item.type === "compra"
                ? "bg-gradient-to-r from-[#E6A4B4] to-[#D4859D] text-white"
                : "bg-gradient-to-r from-[#F5D0C5] to-[#E6A4B4] text-[#5C4742]"
            }`}
          >
            {item.type === "compra" ? (
              <>
                <ShoppingCart className="size-2.5" />
                Compra
              </>
            ) : (
              <>
                <Calendar className="size-2.5" />
                Alquiler
              </>
            )}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-semibold text-[#5C4742] text-sm truncate">
              {item.product.name}
            </h4>
            <p className="text-xs text-[#9B8B87] capitalize">
              {item.product.category}
            </p>
            <p className="text-[10px] text-[#E6A4B4]">
              Talla: {item.size}
            </p>
          </div>
          
          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="text-[#9B8B87] hover:text-[#d4183d] hover:bg-red-50 flex-shrink-0"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-[#E6A4B4]/30 text-[#E6A4B4] hover:bg-[#F9E5E9] hover:border-[#E6A4B4]"
              onClick={() => onUpdateQuantity(item.product.id, item.type, item.quantity - 1)}
            >
              <Minus className="size-3" />
            </Button>
            <span className="text-sm font-medium text-[#5C4742] w-6 text-center">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-[#E6A4B4]/30 text-[#E6A4B4] hover:bg-[#F9E5E9] hover:border-[#E6A4B4]"
              onClick={() => onUpdateQuantity(item.product.id, item.type, item.quantity + 1)}
            >
              <Plus className="size-3" />
            </Button>
          </div>

          <div className="text-right">
            <p className="text-xs text-[#9B8B87]">
              €{price.toFixed(2)} {item.type === "alquiler" && "/día"}
            </p>
            <p className="text-sm font-bold text-[#E6A4B4]">
              €{totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
