import { Product } from "../types";
import { ShoppingCart, Calendar, Heart, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { motion } from "motion/react";

interface ProductCardProps {
  product: Product;
  mode: "sale" | "rental" | "both";
}

// Base64 SVG error image - broken image icon
const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

export function ProductCard({ product, mode }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { addToCart } = useCart();

  const handleAddToCart = (type: "compra" | "alquiler") => {
    addToCart(product, type, selectedSize);
    toast.success(
      type === "compra"
        ? `${product.name} añadido al carrito de compra 💕`
        : `${product.name} añadido al carrito de alquiler ✨`
    );
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#E6A4B4]/20 group"
    >
      <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#F9E5E9] to-[#FFE8EC] relative">
        {/* Loading State */}
        {isImageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F9E5E9] to-[#FFE8EC] z-10">
            <div
              className="w-10 h-10 border-3 border-[rgba(230,164,180,0.3)] border-t-[#E6A4B4] rounded-full animate-spin"
              style={{
                borderWidth: '3px',
                borderStyle: 'solid',
                borderColor: 'rgba(230, 164, 180, 0.3) transparent rgba(230, 164, 180, 0.3) #E6A4B4',
              }}
            />
          </div>
        )}

        {/* Error State - Fallback Image */}
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#F9E5E9] to-[#FFE8EC] p-4">
            <img
              src={ERROR_IMG_SRC}
              alt="Error al cargar imagen"
              className="w-16 h-16 opacity-70 mb-2"
              style={{ animation: 'pulse 2s ease-in-out infinite' }}
            />
            <span className="text-xs text-[#9B8B87] text-center">
              Imagen no disponible
            </span>
            <span 
              className="text-[10px] text-[#9B8B87] opacity-60 mt-1 max-w-full truncate" 
              title={product.image}
            >
              {product.image}
            </span>
            <style>{`
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.05); opacity: 1; }
              }
            `}</style>
          </div>
        ) : (
          /* Normal Image State */
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
        
        {/* Overlay with heart */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
          >
            <Heart
              className={`size-5 transition-all duration-300 ${
                isLiked ? "fill-[#E6A4B4] text-[#E6A4B4]" : "text-[#9B8B87]"
              }`}
            />
          </motion.button>
        </div>

        {/* Sparkle effect */}
        <motion.div
          className="absolute top-4 left-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="size-5 text-[#E6A4B4]" />
        </motion.div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-[#5C4742] text-lg">{product.name}</h3>
            <p className="text-sm text-[#9B8B87]">{product.type}</p>
            <p className="text-xs text-[#E6A4B4] capitalize font-medium mt-1">
              {product.category}
            </p>
          </div>
        </div>

        <p className="text-sm text-[#9B8B87] mb-4">{product.description}</p>

        <div className="mb-4">
          <label className="text-sm text-[#5C4742] font-medium block mb-2">Talla:</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full px-4 py-2 border-2 border-[#E6A4B4]/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E6A4B4] focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
          >
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {(mode === "sale" || mode === "both") && product.salePrice && (
            <div className="flex items-center justify-between">
              <span className="text-[#E6A4B4] font-bold text-xl">
                €{product.salePrice.toFixed(2)}
              </span>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => handleAddToCart("compra")}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#E6A4B4] to-[#D4859D] hover:shadow-lg transition-all duration-300"
                  size="sm"
                >
                  <ShoppingCart className="size-4" />
                  Comprar
                </Button>
              </motion.div>
            </div>
          )}

          {(mode === "rental" || mode === "both") && product.rentalPrice && (
            <div className="flex items-center justify-between">
              <span className="text-[#F5D0C5] font-bold text-lg">
                €{product.rentalPrice.toFixed(2)}/día
              </span>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => handleAddToCart("alquiler")}
                  variant="outline"
                  className="flex items-center gap-2 border-2 border-[#F5D0C5] text-[#E6A4B4] hover:bg-[#F9E5E9] hover:border-[#E6A4B4] transition-all duration-300"
                  size="sm"
                >
                  <Calendar className="size-4" />
                  Alquilar
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
