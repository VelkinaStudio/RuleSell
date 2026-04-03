"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface BuyButtonProps {
  rulesetId: string;
  price: number;
  accessState: string;
}

export function BuyButton({ rulesetId, price, accessState }: BuyButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [confirmed, setConfirmed] = useState(accessState === "PURCHASED" || accessState === "SUBSCRIPTION_ACTIVE");
  const pollCount = useRef(0);
  const pollTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (searchParams.get("purchase") !== "success" || confirmed) return;

    pollCount.current = 0;

    async function poll() {
      if (pollCount.current >= 15) {
        setPolling(false);
        toast("Payment processing... check your purchases in a moment", "info");
        return;
      }

      pollCount.current++;

      try {
        const res = await fetch(`/api/purchases/status?rulesetId=${rulesetId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.data.status === "COMPLETED") {
            setPolling(false);
            setConfirmed(true);
            toast("Purchase confirmed — your ruleset is ready", "success");
            router.refresh();
            return;
          }
        }
      } catch {
        // Continue polling
      }

      pollTimer.current = setTimeout(poll, 2000);
    }

    // Kick off polling asynchronously to avoid sync setState in effect body
    pollTimer.current = setTimeout(() => {
      setPolling(true);
      poll();
    }, 0);
    return () => clearTimeout(pollTimer.current);
  }, [searchParams, confirmed, rulesetId, router]);

  if (confirmed) return null;

  if (accessState === "FREE_DOWNLOAD") {
    return <Button>Get (Free)</Button>;
  }

  if (accessState === "REFUNDED") {
    return (
      <Button disabled variant="outline">
        Refunded
      </Button>
    );
  }

  if (accessState === "SUBSCRIPTION_EXPIRED") {
    return (
      <Button variant="outline" disabled>
        Subscription Expired
      </Button>
    );
  }

  async function handleBuy() {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rulesetId }),
      });

      if (res.ok) {
        const data = await res.json();
        window.location.href = data.data.checkoutUrl;
      } else {
        const err = await res.json();
        toast(err.error?.message || "Checkout failed", "error");
      }
    } catch {
      toast("Checkout failed", "error");
    }
    setLoading(false);
  }

  if (polling) {
    return (
      <Button disabled>
        Confirming purchase...
      </Button>
    );
  }

  return (
    <Button onClick={handleBuy} disabled={loading}>
      {loading ? "Opening checkout..." : `Buy $${price.toFixed(2)}`}
    </Button>
  );
}
