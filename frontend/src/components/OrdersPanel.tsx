import { ShoppingCart } from 'lucide-react'
import EmptyState from './ui/EmptyState'

interface OrdersPanelProps {
  orders: any[]
}

export default function OrdersPanel({ orders }: OrdersPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="h-5 w-5 text-accent" />
        <h3 className="font-semibold">Recent Orders</h3>
        {orders && orders.length > 0 && (
          <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
            {orders.length}
          </span>
        )}
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-3 flex-1 overflow-y-auto">
          {orders.map((order, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0 hover:bg-muted/50 p-2 rounded transition-colors"
            >
              <div>
                <p className="font-medium">{order.symbol}</p>
                <p className="text-xs text-muted-foreground">{order.timestamp}</p>
              </div>
              <div className="text-right">
                <p
                  className={`font-medium ${
                    order.side === 'BUY' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                  }`}
                >
                  {order.side} {order.quantity}
                </p>
                <p className="text-sm text-muted-foreground">${order.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<ShoppingCart className="h-12 w-12" />}
            title="No Orders Yet"
            description="Your orders will appear here once you start trading"
            size="md"
            actions={[
              {
                label: 'Place Your First Trade',
                onClick: () => console.log('Open trade modal'),
                variant: 'primary',
              },
            ]}
            tip="💡 Tip: Set up your risk limits in Settings first to control your trading risk"
          />
        </div>
      )}
    </div>
  )
}
