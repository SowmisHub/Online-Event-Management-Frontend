import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";

function PaymentModal({ event, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [error, setError] = useState("");

  /* ================= VALIDATION FUNCTION ================= */

  const validatePayment = () => {
    // Card Number Validation (16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
      setError("Card number must be 16 digits");
      return false;
    }

    // Expiry Validation (MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("Expiry must be in MM/YY format");
      return false;
    }

    const [month] = expiry.split("/");
    if (parseInt(month) < 1 || parseInt(month) > 12) {
      setError("Invalid expiry month");
      return false;
    }

    // CVV Validation (3 or 4 digits)
    if (!/^\d{3,4}$/.test(cvv)) {
      setError("CVV must be 3 or 4 digits");
      return false;
    }

    setError("");
    return true;
  };

  /* ================= HANDLE PAYMENT ================= */

  const handlePayment = async () => {
    if (!validatePayment()) return;

    setLoading(true);

    // simulate payment delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[450px] rounded-2xl shadow-2xl relative">
        <CardContent className="p-8 space-y-6">

          {/* Close */}
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <div className="flex items-center gap-2">
            <CreditCard className="text-purple-600" />
            <h2 className="text-xl font-semibold">
              Secure Payment
            </h2>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Event:</span> {event.title}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Amount:</span> ${event.price}
            </p>
          </div>

          {/* Card Inputs */}
          <div className="space-y-3">

            <input
              type="text"
              placeholder="Card Number"
              maxLength={16}
              className="w-full border p-3 rounded-lg"
              value={cardNumber}
              onChange={(e) =>
                setCardNumber(e.target.value.replace(/\D/g, ""))
              }
            />

            <div className="flex gap-3">

              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                className="w-1/2 border p-3 rounded-lg"
                value={expiry}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^\d]/g, "");
                  if (value.length >= 3) {
                    value =
                      value.slice(0, 2) + "/" + value.slice(2, 4);
                  }
                  setExpiry(value);
                }}
              />

              <input
                type="password"
                placeholder="CVV"
                maxLength={4}
                className="w-1/2 border p-3 rounded-lg"
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          <div className="flex items-center text-xs text-gray-500 gap-2">
            <ShieldCheck size={16} />
            Secure SSL encrypted payment
          </div>

          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Processing...
              </span>
            ) : (
              `Pay $${event.price}`
            )}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentModal;