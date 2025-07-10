
import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function CurrencyCard() {
  const [rate, setRate] = useState(0.9998);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRate = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRate(0.9998 + (Math.random() - 0.5) * 0.0002);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRate();
  }, []);

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium">USD to USDC Rate</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchRate}
          disabled={isLoading}
          className="text-white hover:bg-white/20"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <DollarSign className="w-8 h-8" />
          <div>
            <div className="text-3xl font-bold">
              {rate.toFixed(4)}
            </div>
            <div className="flex items-center space-x-1 text-sm opacity-90">
              <TrendingUp className="w-4 h-4" />
              <span>+0.02% (24h)</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm opacity-75">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}
