import { useCart } from "../context/CartContext";
import { Trash2, ShoppingBag, Calendar, Package, Heart, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useState } from "react";

// Base64 SVG error image - broken image icon
const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

// Reusable Image with Fallback component for Cart
function CartProductImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <div className="size-24 rounded-xl overflow-hidden shadow-md relative bg-gradient-to-br from-[#F9E5E9] to-[#FFE8EC]">
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
            No disp.
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
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
    </div>
  );
}

export function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();

  const handleCheckout = () => {
    toast.success("¡Pedido realizado con éxito! Gracias por tu compra 💕✨");
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[600px] flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Package className="size-32 text-[#E6A4B4] mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 text-[#5C4742]">Tu carrito está vacío 😢</h2>
          <p className="text-[#9B8B87] mb-8">
            Agrega productos desde nuestra tienda o catálogo de alquiler
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compra">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="w-full sm:w-auto bg-gradient-to-r from-[#E6A4B4] to-[#D4859D] hover:shadow-lg">
                  <ShoppingBag className="mr-2 size-4" />
                  Ir a Comprar
                </Button>
              </motion.div>
            </Link>
            <Link to="/alquiler">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="w-full sm:w-auto border-2 border-[#E6A4B4] text-[#E6A4B4] hover:bg-[#F9E5E9]">
                  <Calendar className="mr-2 size-4" />
                  Ir a Alquilar
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const purchaseItems = cart.filter((item) => item.type === "compra");
  const rentalItems = cart.filter((item) => item.type === "alquiler");

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="size-10 text-[#E6A4B4]" />
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#E6A4B4] to-[#D4859D] bg-clip-text text-transparent">
              Tu Carrito
            </h1>
          </div>
          {cart.length > 0 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-500 border-2 border-red-500 hover:bg-red-50"
              >
                Vaciar Carrito
              </Button>
            </motion.div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Purchase Items */}
            {purchaseItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-[#E6A4B4]/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBag className="size-6 text-[#E6A4B4]" />
                  <h2 className="text-2xl font-bold text-[#5C4742]">Compra</h2>
                </div>
                <div className="space-y-4">
                  {purchaseItems.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${item.type}-${item.size}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 pb-4 border-b border-[#E6A4B4]/20 last:border-0"
                    >
                      {/* Product Image with Fallback */}
                      <CartProductImage 
                        src={item.product.image} 
                        alt={item.product.name} 
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#5C4742]">{item.product.name}</h3>
                        <p className="text-sm text-[#9B8B87]">Talla: {item.size}</p>
                        <p className="text-sm text-[#E6A4B4] capitalize font-medium">
                          {item.product.category}
                        </p>
                        <p className="font-bold text-[#E6A4B4] mt-2">
                          €{item.product.salePrice?.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.product.id, item.type)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="size-5" />
                        </motion.button>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item.product.id, item.type, item.quantity - 1)
                            }
                            className="size-8 flex items-center justify-center border-2 border-[#E6A4B4] rounded-lg hover:bg-[#F9E5E9] text-[#E6A4B4] font-bold"
                          >
                            -
                          </motion.button>
                          <span className="w-8 text-center font-semibold text-[#5C4742]">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item.product.id, item.type, item.quantity + 1)
                            }
                            className="size-8 flex items-center justify-center border-2 border-[#E6A4B4] rounded-lg hover:bg-[#F9E5E9] text-[#E6A4B4] font-bold"
                          >
                            +
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Rental Items */}
            {rentalItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#F9E5E9] to-[#FFE8EC] rounded-2xl shadow-lg p-6 border border-[#E6A4B4]/30"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="size-6 text-[#E6A4B4]" />
                  <h2 className="text-2xl font-bold text-[#5C4742]">Alquiler</h2>
                </div>
                <div className="space-y-4">
                  {rentalItems.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${item.type}-${item.size}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 pb-4 border-b border-[#E6A4B4]/20 last:border-0"
                    >
                      {/* Product Image with Fallback */}
                      <CartProductImage 
                        src={item.product.image} 
                        alt={item.product.name} 
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#5C4742]">{item.product.name}</h3>
                        <p className="text-sm text-[#9B8B87]">Talla: {item.size}</p>
                        <p className="text-sm text-[#E6A4B4] capitalize font-medium">
                          {item.product.category}
                        </p>
                        <p className="font-bold text-[#F5D0C5] mt-2">
                          €{item.product.rentalPrice?.toFixed(2)}/día
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.product.id, item.type)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="size-5" />
                        </motion.button>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item.product.id, item.type, item.quantity - 1)
                            }
                            className="size-8 flex items-center justify-center border-2 border-[#E6A4B4] rounded-lg hover:bg-white/80 text-[#E6A4B4] font-bold"
                          >
                            -
                          </motion.button>
                          <span className="w-8 text-center font-semibold text-[#5C4742]">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item.product.id, item.type, item.quantity + 1)
                            }
                            className="size-8 flex items-center justify-center border-2 border-[#E6A4B4] rounded-lg hover:bg-white/80 text-[#E6A4B4] font-bold"
                          >
                            +
                          </motion.button>
                        </div>
                        <p className="text-xs text-[#9B8B87]">días</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-[#E6A4B4] to-[#D4859D] text-white rounded-2xl shadow-2xl p-6 sticky top-24"
            >
              <div className="flex items-center gap-2 mb-6">
                <Heart className="size-6 fill-white" />
                <h2 className="text-2xl font-bold">Resumen del Pedido</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                {purchaseItems.length > 0 && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm text-white/90 mb-1">Compras:</p>
                    <p className="text-2xl font-bold">
                      €
                      {purchaseItems
                        .reduce(
                          (sum, item) =>
                            sum + (item.product.salePrice || 0) * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                )}
                {rentalItems.length > 0 && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm text-white/90 mb-1">Alquileres (por día):</p>
                    <p className="text-2xl font-bold">
                      €
                      {rentalItems
                        .reduce(
                          (sum, item) =>
                            sum + (item.product.rentalPrice || 0) * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-white/30 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-3xl font-bold">
                    €{getTotal().toFixed(2)}
                  </span>
                </div>
                {rentalItems.length > 0 && (
                  <p className="text-xs text-white/80">
                    * Precio de alquileres calculado por día
                  </p>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-white text-[#E6A4B4] hover:bg-[#FFF9F5] shadow-xl font-bold text-lg py-6"
                  size="lg"
                >
                  Finalizar Pedido ✨
                </Button>
              </motion.div>

              <div className="mt-4">
                <Link to="/compra">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      Seguir Comprando
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
