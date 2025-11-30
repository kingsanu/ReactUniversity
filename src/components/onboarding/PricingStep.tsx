import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Info } from "lucide-react";

interface PricingStepProps {
  data: {
    hourlyRate: number;
    currency?: string;
  };
  onNext: (data: { hourlyRate: number; currency: string }) => void;
  onBack: () => void;
}

const PLATFORM_FEE_PERCENTAGE = 15;

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
];

export function PricingStep({ data, onNext, onBack }: PricingStepProps) {
  const [hourlyRate, setHourlyRate] = useState(data.hourlyRate || 50);
  const [currency, setCurrency] = useState(data.currency || "USD");
  const [errors, setErrors] = useState<{ hourlyRate?: string }>({});

  const selectedCurrency = CURRENCIES.find((c) => c.code === currency);
  const platformFee = (hourlyRate * PLATFORM_FEE_PERCENTAGE) / 100;
  const yourEarnings = hourlyRate - platformFee;

  const validate = () => {
    const newErrors: { hourlyRate?: string } = {};

    if (!hourlyRate || hourlyRate < 10) {
      newErrors.hourlyRate = "Hourly rate must be at least $10";
    }
    if (hourlyRate > 500) {
      newErrors.hourlyRate = "Hourly rate cannot exceed $500";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext({ hourlyRate, currency });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.name} ({curr.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hourlyRate">
            Hourly Rate ({selectedCurrency?.symbol})
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="hourlyRate"
              type="number"
              min="10"
              max="500"
              step="5"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="pl-9"
              placeholder="50"
            />
          </div>
          {errors.hourlyRate && (
            <p className="text-sm text-red-600">{errors.hourlyRate}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Set your hourly coaching rate (minimum {selectedCurrency?.symbol}10, maximum {selectedCurrency?.symbol}500)
          </p>
        </div>

        {/* Earnings Breakdown */}
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2 mb-4">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Earnings Breakdown
                </p>
                <p>
                  Our platform charges a {PLATFORM_FEE_PERCENTAGE}% service fee to cover payment processing, platform maintenance, and support.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Client pays:</span>
                <span className="font-medium">
                  {selectedCurrency?.symbol}{hourlyRate.toFixed(2)}/hour
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Platform fee ({PLATFORM_FEE_PERCENTAGE}%):
                </span>
                <span className="text-red-600">
                  -{selectedCurrency?.symbol}{platformFee.toFixed(2)}
                </span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between text-base font-semibold">
                <span>You earn:</span>
                <span className="text-green-600">
                  {selectedCurrency?.symbol}{yourEarnings.toFixed(2)}/hour
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-background rounded-md border">
              <p className="text-xs text-muted-foreground">
                <strong>Example:</strong> If you complete 20 hours of coaching per month, you'll earn approximately{" "}
                <span className="font-semibold text-foreground">
                  {selectedCurrency?.symbol}{(yourEarnings * 20).toFixed(2)}/month
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  );
}
