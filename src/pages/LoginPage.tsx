
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import BottomNavigation from '../components/BottomNavigation';
import { Link } from 'react-router-dom';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';

const LoginPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneNumber.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to send OTP
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: `OTP sent to ${phoneNumber}. Use "123456" for testing.`,
      });
    }, 1500);
  };
  
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to verify OTP
    setTimeout(() => {
      setIsSubmitting(false);
      
      // For testing, let's consider 123456 as the correct OTP
      if (otp === '123456') {
        toast({
          title: "Login Successful",
          description: "You have been logged in successfully",
        });
        // Store auth state in localStorage or context
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('phoneNumber', phoneNumber);
        navigate('/profile');
      } else {
        toast({
          title: "Invalid OTP",
          description: "The OTP you entered is incorrect",
          variant: "destructive",
        });
      }
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-4 px-4 flex items-center justify-between">
        <Link to="/" className="mr-2 p-1 rounded-full bg-secondary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-medium">{t('login')}</h1>
        <div className="flex items-center">
          <GlobalLanguageSwitcher />
          <CartButton />
        </div>
      </div>
      
      <main className="flex-1 px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-md space-y-6">
          {!otpSent ? (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">{t('login_with_phone')}</h2>
              <p className="text-sm text-muted-foreground">{t('enter_phone_to_receive_otp')}</p>
              
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="text-sm font-medium">
                    {t('phone_number')}
                  </label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your 10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    className="w-full"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || phoneNumber.length !== 10}
                >
                  {isSubmitting ? t('sending_otp') : t('send_otp')}
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-medium">{t('verify_otp')}</h2>
              <p className="text-sm text-muted-foreground">
                {t('otp_sent_to')} {phoneNumber}. {' '}
                <Button 
                  variant="link" 
                  className="h-auto p-0" 
                  onClick={() => setOtpSent(false)}
                >
                  {t('change')}
                </Button>
              </p>
              
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex justify-center py-4">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    render={({ slots }) => (
                      <InputOTPGroup>
                        {slots.map((slot, index) => (
                          <InputOTPSlot key={index} {...slot} index={index} />
                        ))}
                      </InputOTPGroup>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || otp.length !== 6}
                >
                  {isSubmitting ? t('verifying') : t('verify_continue')}
                </Button>
                
                <div className="text-center">
                  <Button 
                    variant="link" 
                    className="text-sm"
                    disabled={isSubmitting}
                    onClick={handleSendOtp}
                  >
                    {t('resend_otp')}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default LoginPage;
