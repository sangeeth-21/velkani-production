import React from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { Package, ArrowLeft, Clock, CheckCircle, Truck, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Badge } from "@/components/ui/badge";
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';

// Mock orders data for demonstration
const orders = [
  {
    id: 'ORD-001',
    date: '2023-09-15',
    items: [
      { name: 'Tomatoes', quantity: 2, price: 2.50 },
      { name: 'Potatoes', quantity: 1, price: 3.00 }
    ],
    total: 8.00,
    status: 'delivered'
  },
  {
    id: 'ORD-002',
    date: '2023-09-20',
    items: [
      { name: 'Apples', quantity: 1, price: 4.50 },
      { name: 'Bananas', quantity: 2, price: 2.50 }
    ],
    total: 9.50,
    status: 'shipped'
  },
  {
    id: 'ORD-003',
    date: '2023-09-25',
    items: [
      { name: 'Rice', quantity: 1, price: 15.00 },
      { name: 'Flour', quantity: 1, price: 6.00 }
    ],
    total: 21.00,
    status: 'confirmed'
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
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrdersPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-4 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="mr-2 p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-medium">{t('orders_title')}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <GlobalLanguageSwitcher />
          <CartButton />
        </div>
      </div>
      
      <main className="flex-1 py-4 px-4 pb-20">
        {orders.length > 0 ? (
          <div className="space-y-4 animate-fade-in">
            {orders.map((order) => (
              <div key={order.id} className="bg-card rounded-lg shadow-sm p-4">
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
                
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('order_total')}</span>
                  <span className="font-medium">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center bg-secondary rounded-lg animate-fade-in">
            <Package className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">{t('orders_empty')}</p>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default OrdersPage;
