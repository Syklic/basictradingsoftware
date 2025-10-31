import { ShoppingCart } from 'lucide-react'

interface OrdersPanelProps {
  orders: any[]
}

export default function OrdersPanel({ orders }: OrdersPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="h-5 w-5 text-accent" />
        <h3 className="font-semibold">Recent Orders</h3>
      </div>
      <div className="space-y-3">
        {orders && orders.length > 0 ? (
          orders.map((order, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0"
            >
              <div>
                <p className="font-medium">{order.symbol}</p>
                <p className="text-xs text-muted-foreground">{order.timestamp}</p>
              </div>
              <div className="text-right">
                <p className={order.side === 'BUY' ? 'text-green-600' : 'text-red-600'}>
                  {order.side} {order.quantity}
                </p>
                <p className="text-sm text-muted-foreground">${order.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">
            No orders yet
          </p>
        )}
      </div>
    </div>
  )
}
