import { X, ClipboardList, Truck, Shield, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export default function OrderHistoryModal({ isOpen, onClose, orders }: OrderHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 bg-neutral-950/80 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-100">
          <h2 className="text-base font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-500" /> My Order History
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100">
                <ClipboardList className="w-8 h-8 text-neutral-300" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-neutral-800">No Orders Found</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  You have not placed any simulated orders yet. Add items to your cart and checkout!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Merchant Simulation Feature</p>
                  <p className="text-[10px] text-amber-700 mt-0.5">
                    Switch to the <strong>Seller Portal</strong> in the top bar to modify the logistics status of these orders (e.g. mark them as 'Shipped' or 'Delivered') to see the tracking timelines update in real-time here!
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {orders.map((order) => {
                  const isPending = order.status === 'Pending';
                  const isProcessing = order.status === 'Processing';
                  const isShipped = order.status === 'Shipped';
                  const isDelivered = order.status === 'Delivered';

                  return (
                    <div key={order.id} className="bg-white border border-neutral-200 rounded-3xl p-5 space-y-4 shadow-xs">
                      {/* Summary Title row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                        <div>
                          <span className="block text-xs font-black text-neutral-900 uppercase">
                            Order ID: <span className="font-mono text-amber-600 font-extrabold">{order.id}</span>
                          </span>
                          <span className="block text-[10px] text-neutral-400">
                            Date: {order.date} • Tracking: {order.trackingNumber}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${
                            isPending
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : isProcessing
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : isShipped
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Stepper Tracking Timeline */}
                      <div className="bg-neutral-50/75 p-4 rounded-2xl border border-neutral-100 space-y-4">
                        <h4 className="text-[10px] font-black text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-amber-500" /> Live Delivery timeline
                        </h4>

                        <div className="relative flex justify-between items-center max-w-md mx-auto pt-1 pb-2">
                          {/* Track background */}
                          <div className="absolute left-0 right-0 top-[15px] h-1 bg-neutral-200 z-0" />
                          <div
                            className="absolute left-0 top-[15px] h-1 bg-amber-500 transition-all duration-500 z-0"
                            style={{
                              width: isPending
                                ? '0%'
                                : isProcessing
                                ? '33%'
                                : isShipped
                                ? '66%'
                                : '100%'
                            }}
                          />

                          {/* step 1: Ordered */}
                          <div className="flex flex-col items-center gap-1 z-10">
                            <div className="w-6 h-6 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center text-[9px] font-extrabold border border-white">
                              ✓
                            </div>
                            <span className="text-[9px] font-extrabold text-neutral-800">Ordered</span>
                          </div>

                          {/* step 2: Processing */}
                          <div className="flex flex-col items-center gap-1 z-10">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-extrabold border border-white ${
                              isProcessing || isShipped || isDelivered
                                ? 'bg-amber-500 text-neutral-950'
                                : 'bg-neutral-200 text-neutral-500'
                            }`}>
                              {isProcessing ? '2' : isShipped || isDelivered ? '✓' : '2'}
                            </div>
                            <span className={`text-[9px] font-extrabold ${
                              isProcessing || isShipped || isDelivered ? 'text-neutral-800 font-extrabold' : 'text-neutral-400 font-semibold'
                            }`}>
                              Processing
                            </span>
                          </div>

                          {/* step 3: Shipped */}
                          <div className="flex flex-col items-center gap-1 z-10">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-extrabold border border-white ${
                              isShipped || isDelivered
                                ? 'bg-amber-500 text-neutral-950'
                                : 'bg-neutral-200 text-neutral-500'
                            }`}>
                              {isShipped ? '3' : isDelivered ? '✓' : '3'}
                            </div>
                            <span className={`text-[9px] font-extrabold ${
                              isShipped || isDelivered ? 'text-neutral-800 font-extrabold' : 'text-neutral-400 font-semibold'
                            }`}>
                              Shipped
                            </span>
                          </div>

                          {/* step 4: Delivered */}
                          <div className="flex flex-col items-center gap-1 z-10">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-extrabold border border-white ${
                              isDelivered ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-500'
                            }`}>
                              {isDelivered ? '✓' : '4'}
                            </div>
                            <span className={`text-[9px] font-extrabold ${
                              isDelivered ? 'text-emerald-700 font-black' : 'text-neutral-400 font-semibold'
                            }`}>
                              Delivered
                            </span>
                          </div>
                        </div>

                        <p className="text-[10px] text-neutral-400 text-center">
                          {isPending && 'Our warehouse staff has accepted the order. Pending picking.'}
                          {isProcessing && 'Order is being sorted, verified, and carefully packaged for shipping.'}
                          {isShipped && `Courier dispatched with tracking number: ${order.trackingNumber}.`}
                          {isDelivered && 'Delivered successfully. Thank you for shopping with AURA!'}
                        </p>
                      </div>

                      {/* Items Details */}
                      <div className="space-y-2">
                        <h5 className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">Items List</h5>
                        <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-2xl px-4 py-2 bg-white">
                          {order.items.map((itm, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2">
                                <img src={itm.product.image} alt={itm.product.name} className="w-8 h-8 rounded-lg object-cover" />
                                <div>
                                  <span className="block font-bold text-neutral-900">{itm.product.name}</span>
                                  <span className="block text-[9px] text-neutral-400">
                                    Qty: {itm.quantity} {itm.selectedSize && `• Size: ${itm.selectedSize}`} {itm.selectedColor && `• Color: ${itm.selectedColor}`}
                                  </span>
                                </div>
                              </div>
                              <span className="font-mono font-bold text-neutral-700">${itm.product.price * itm.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery details + Cost Summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                        <div>
                          <span className="block text-[9px] font-black text-neutral-400 uppercase">Shipping Address</span>
                          <p className="text-neutral-600 text-[11px]">
                            {order.shippingAddress.fullName}, {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                          </p>
                        </div>
                        <div className="text-right self-end">
                          <span className="text-neutral-500 mr-2 font-medium">Paid via {order.paymentMethod.cardType} ending {order.paymentMethod.cardLast4}:</span>
                          <span className="font-mono text-sm font-black text-neutral-950">${order.total}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* security seal */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 font-semibold border-t border-neutral-100 pt-4">
            <Shield className="w-3.5 h-3.5 text-neutral-300" />
            Fully secured simulation order history database.
          </div>
        </div>

      </div>
    </div>
  );
}
