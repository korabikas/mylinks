"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCryptoOptions } from "@/lib/crypto";
import { Heart, Copy, Check, ArrowLeft, Wallet } from "lucide-react";

export default function CryptoPaymentPage() {
  const router = useRouter();
  const options = useMemo(() => getCryptoOptions(), []);
  const [selectedId, setSelectedId] = useState<string>(`${options[0].symbol}-${options[0].network}`);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const selected = useMemo(() => {
    return options.find((o) => `${o.symbol}-${o.network}` === selectedId) || options[0];
  }, [selectedId, options]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof options> = {};
    for (const opt of options) {
      if (!map[opt.symbol]) map[opt.symbol] = [];
      map[opt.symbol].push(opt);
    }
    return map;
  }, [options]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selected.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      router.push("/pay/thank-you");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#f4256f]">
            <Heart className="h-6 w-6 fill-current" />
            MyLinks
          </Link>
          <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="inline h-4 w-4 mr-1" />
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-zinc-900 sm:text-3xl">Crypto Payment</h1>
          <p className="mb-6 text-sm text-zinc-500 sm:text-base">
            Select a currency, send your payment, then confirm.
          </p>

          {/* Currency selection */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-zinc-700">Select currency</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {Object.entries(grouped).map(([symbol, opts]) => (
                <button
                  key={symbol}
                  onClick={() => setSelectedId(`${opts[0].symbol}-${opts[0].network}`)}
                  className={`rounded-xl border px-3 py-3 text-left transition-colors sm:px-4 ${
                    selected.symbol === symbol
                      ? "border-[#f4256f] bg-pink-50 text-[#f4256f]"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <span className="block text-sm font-bold sm:text-base">{symbol}</span>
                  <span className="block text-xs text-zinc-500">{opts[0].name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Network selection if multiple networks */}
          {grouped[selected.symbol].length > 1 && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-zinc-700">Select network</label>
              <div className="flex flex-wrap gap-2">
                {grouped[selected.symbol].map((opt) => (
                  <button
                    key={`${opt.symbol}-${opt.network}`}
                    onClick={() => setSelectedId(`${opt.symbol}-${opt.network}`)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedId === `${opt.symbol}-${opt.network}`
                        ? "border-[#f4256f] bg-[#f4256f] text-white"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {opt.network}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QR and address */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-700">
              <Wallet className="h-4 w-4" />
              Send {selected.symbol} on {selected.network}
            </div>

            <div className="mx-auto mb-6 max-w-[240px] overflow-hidden rounded-xl border bg-white p-2 shadow-sm sm:max-w-[280px]">
              <Image
                src={selected.image}
                alt={`${selected.symbol} ${selected.network} QR code`}
                width={280}
                height={280}
                className="h-auto w-full"
                unoptimized
              />
            </div>

            <div className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-zinc-500">
              Wallet address
            </div>
            <div className="mb-6 flex items-center gap-2 rounded-xl border bg-white p-3">
              <code className="min-w-0 flex-1 break-all text-xs text-zinc-800 sm:text-sm">
                {selected.address}
              </code>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 rounded-lg bg-[#f4256f] p-2 text-white transition-colors hover:bg-[#d91d5c]"
                aria-label="Copy address"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full rounded-xl bg-[#f4256f] py-3 text-sm font-bold text-white transition-colors hover:bg-[#d91d5c] disabled:opacity-70 sm:text-base"
            >
              {confirming ? "Confirming..." : "I have sent the payment"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
