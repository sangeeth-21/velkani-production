import React, { useState, useEffect } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { Package, ArrowLeft, Clock, CheckCircle, Truck, ShoppingBag, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Badge } from "@/components/ui/badge";
import Header from '../components/Header';
import Cookies from 'js-cookie';

const getStatusIcon = (status) => {
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

const getStatusColor = (status) => {
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

const formatDate = (dateString, timeString) => {
  const date = new Date(`${dateString}T${timeString}`);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const OrdersPage = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userToken = Cookies.get('userToken');
        if (!userToken) {
          navigate('/profile');
          return;
        }

        const response = await fetch(`https://srivelkanistore.site/api/user.php?action=get_orders&user_id=${userToken}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setOrders(data.data);
        } else {
          setError(t('orders_fetch_error'));
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(t('orders_fetch_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [t, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Package className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="pt-4 px-4 flex items-center">
        <Link to="/" className="mr-2 p-1 rounded-full bg-secondary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-medium">{t('orders_Orders')}</h1>
      </div>
      
      <main className="flex-1 py-4 px-4 pb-20">
        {orders.length > 0 ? (
          <div className="space-y-4 animate-fade-in">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-card rounded-lg shadow-sm p-4 border border-gray-100"
                onClick={() => navigate(`/order/${order.id}`)}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <span className="font-medium">Order #{order.id.slice(0, 8)}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(order.date, order.time)}
                    </span>
                  </div>
                  <Badge className={getStatusColor('confirmed')}>
                    <span className="flex items-center">
                      {getStatusIcon('confirmed')}
                      <span className="ml-1">Confirmed</span>
                    </span>
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-3">
                  {order.items.length > 0 ? (
                    order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="truncate max-w-[180px]">{item.productname}</span>
                        <span>₹{parseFloat(item.amount).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No items details available</div>
                  )}
                  
                  {order.items.length > 2 && (
                    <div className="text-sm text-muted-foreground">
                      +{order.items.length - 2} more items
                    </div>
                  )}
                </div>
                
                <div className="pt-3 border-t flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('order_total')}</span>
                  <span className="font-medium">₹{parseFloat(order.amount).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center bg-secondary rounded-lg animate-fade-in">
            <Package className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">{t('orders_empty')}</p>
            <Link 
              to="/" 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            >
              {t('continue_shopping')}
            </Link>
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default OrdersPage;