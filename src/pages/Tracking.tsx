import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { fetchOrderById, fetchOrderTracking, fetchOrderItems } from '@/lib/supabase';
import { Order, OrderTracking, OrderItem } from '@/types';
import { CheckCircle2, Clock, Truck, MapPin, AlertCircle } from 'lucide-react';

const Tracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<OrderTracking[]>([]);
  const [orderItems, setOrderItems] = useState<(OrderItem & { product?: Product })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTracking = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const orderData = await fetchOrderById(id);
      setOrder(orderData);

      const trackingData = await fetchOrderTracking(id);
      setTracking(trackingData);

      const itemsData = await fetchOrderItems(id);
      setOrderItems(itemsData);
    } catch (err) {
      setError('Order not found. Please check the order ID.');
      setOrder(null);
      setTracking([]);
      setOrderItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      setSearchParams({ id: orderId });
      loadTracking(orderId);
    }
  };

  useEffect(() => {
    if (searchParams.get('id')) {
      loadTracking(searchParams.get('id')!);
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case 'preparing':
        return <Clock className="w-5 h-5 text-accent" />;
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-accent" />;
      case 'delivered':
        return <CheckCircle2 className="w-5 h-5 text-primary" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Order Confirmed',
      preparing: 'Preparing',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'delivered':
        return 'bg-primary text-primary-foreground';
      case 'preparing':
      case 'out_for_delivery':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1578519603510-481e80a772b8?w=1200&h=800&fit=crop)',
        backgroundAttachment: 'fixed'
      }}
    >
      <Header cartItemCount={0} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white">Track Your Shipment</h1>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Tracking ID</CardTitle>
              <CardDescription>
                Find your shipment using the tracking ID from your confirmation email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Enter tracking ID..."
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Searching...' : 'Track Shipment'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="mb-8 border-destructive bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex gap-3 items-center">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <p className="text-destructive">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Details */}
          {order && (
            <>
              {/* Order Header */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Shipment #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
                      <CardDescription>
                        Shipped on {new Date(order.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Recipient</p>
                      <p className="font-semibold">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold text-sm break-all">{order.customer_email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Delivery Address</p>
                      <p className="font-semibold">
                        {order.delivery_address}, {order.city} {order.postal_code}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-semibold text-lg">${order.total_amount.toFixed(2)}</p>
                    </div>
                    {order.estimated_delivery && (
                      <div>
                        <p className="text-sm text-muted-foreground">Est. Delivery</p>
                        <p className="font-semibold">
                          {new Date(order.estimated_delivery).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Timeline */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Tracking Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  {tracking.length > 0 ? (
                    <div className="space-y-6">
                      {tracking.map((event, index) => (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="rounded-full p-2 bg-primary/10">
                              {getStatusIcon(event.status)}
                            </div>
                            {index < tracking.length - 1 && (
                              <div className="w-0.5 h-12 bg-border mt-2" />
                            )}
                          </div>
                          <div className="pb-6 flex-1">
                            <p className="font-semibold">{getStatusLabel(event.status)}</p>
                            <p className="text-sm text-muted-foreground">{event.status_message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Tracking information will be updated shortly
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center pb-4 border-b last:border-0">
                        <div className="flex-1">
                          <p className="font-semibold">{item.product?.name || 'Product'}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 flex gap-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/catalog">Continue Shopping</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </>
          )}

          {!order && !error && !loading && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-white mx-auto mb-4" />
              <p className="text-white">Enter a tracking ID to track your shipment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
