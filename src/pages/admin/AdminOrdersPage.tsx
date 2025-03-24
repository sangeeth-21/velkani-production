
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Clock, CheckCircle, Truck, ShoppingBag, Package, X } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminBottomNavigation from '@/components/admin/AdminBottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/use-toast';

// Reuse orders data from OrdersPage with some additions
const orders = [
  {
    id: 'ORD-001',
    date: '2023-09-15',
    customer: 'John Doe',
    contact: '+91 98765 43210',
    items: [
      { name: 'Tomatoes', quantity: 2, price: 2.50 },
      { name: 'Potatoes', quantity: 1, price: 3.00 }
    ],
    total: 8.00,
    status: 'delivered',
    paymentMethod: 'Cash on Delivery',
    address: '123 Main St, Bangalore, KA'
  },
  {
    id: 'ORD-002',
    date: '2023-09-20',
    customer: 'Jane Smith',
    contact: '+91 87654 32109',
    items: [
      { name: 'Apples', quantity: 1, price: 4.50 },
      { name: 'Bananas', quantity: 2, price: 2.50 }
    ],
    total: 9.50,
    status: 'shipped',
    paymentMethod: 'Online Payment',
    address: '456 Park Ave, Chennai, TN'
  },
  {
    id: 'ORD-003',
    date: '2023-09-25',
    customer: 'Alex Johnson',
    contact: '+91 76543 21098',
    items: [
      { name: 'Rice', quantity: 1, price: 15.00 },
      { name: 'Flour', quantity: 1, price: 6.00 }
    ],
    total: 21.00,
    status: 'confirmed',
    paymentMethod: 'Cash on Delivery',
    address: '789 Tree Lane, Mumbai, MH'
  },
  {
    id: 'ORD-004',
    date: '2023-09-30',
    customer: 'Sam Wilson',
    contact: '+91 65432 10987',
    items: [
      { name: 'Milk', quantity: 2, price: 5.00 },
      { name: 'Bread', quantity: 1, price: 3.50 }
    ],
    total: 13.50,
    status: 'pending',
    paymentMethod: 'Online Payment',
    address: '321 Water St, Delhi, DL'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'confirmed':
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
    case 'shipped':
      return <Truck className="h-4 w-4 text-purple-500" />;
    case 'delivered':
      return <ShoppingBag className="h-4 w-4 text-green-500" />;
    case 'canceled':
      return <X className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'canceled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AdminOrdersPage = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [orderList, setOrderList] = useState(orders);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) {
    return null;
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrderList(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
    toast({
      title: t('order_status_updated'),
      description: `${t('order')} ${orderId} ${t('status_changed_to')} ${t(`order_status_${newStatus}`)}`
    });
    setDialogOpen(false);
  };

  const filteredOrders = orderList
    .filter(order => 
      (statusFilter === 'all' || order.status === statusFilter) &&
      (order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
       order.customer.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminHeader title={t('orders')} showBackButton backTo="/admin/dashboard" />
      
      <main className="flex-1 p-4 pb-20 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search_orders')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{t('filter_orders')}</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">{t('order_status')}</h3>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('all_orders')}</SelectItem>
                      <SelectItem value="pending">{t('order_status_pending')}</SelectItem>
                      <SelectItem value="confirmed">{t('order_status_confirmed')}</SelectItem>
                      <SelectItem value="shipped">{t('order_status_shipped')}</SelectItem>
                      <SelectItem value="delivered">{t('order_status_delivered')}</SelectItem>
                      <SelectItem value="canceled">{t('order_status_canceled')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-4">
                  <Button className="w-full">{t('apply_filters')}</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card 
              key={order.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setSelectedOrder(order);
                setDialogOpen(true);
              }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <span className="font-medium">{order.id}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{order.date}</span>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    <span className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{t(`order_status_${order.status}`)}</span>
                    </span>
                  </Badge>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm font-medium">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.contact}</p>
                </div>
                
                <div className="space-y-1">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{order.items.length - 2} {t('more_items')}
                    </p>
                  )}
                </div>
                
                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('order_total')}</span>
                  <span className="font-medium">₹{order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">{t('no_orders_found')}</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {t('order_details')} - {selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('date')}</span>
                <span>{selectedOrder.date}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('customer')}</span>
                <span>{selectedOrder.customer}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('contact')}</span>
                <span>{selectedOrder.contact}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('payment_method')}</span>
                <span>{selectedOrder.paymentMethod}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('address')}</span>
                <span className="text-right flex-1 ml-4">{selectedOrder.address}</span>
              </div>
              
              <div className="pt-2 border-t">
                <h4 className="font-medium mb-2">{t('items')}</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                  <span className="font-medium">{t('total')}</span>
                  <span className="font-medium">₹{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <h4 className="font-medium mb-2">{t('update_status')}</h4>
                <Select
                  defaultValue={selectedOrder.status}
                  onValueChange={(value) => handleStatusChange(selectedOrder.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t('order_status_pending')}</SelectItem>
                    <SelectItem value="confirmed">{t('order_status_confirmed')}</SelectItem>
                    <SelectItem value="shipped">{t('order_status_shipped')}</SelectItem>
                    <SelectItem value="delivered">{t('order_status_delivered')}</SelectItem>
                    <SelectItem value="canceled">{t('order_status_canceled')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AdminBottomNavigation />
    </div>
  );
};

export default AdminOrdersPage;
