"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCryptoOptions } from "@/lib/crypto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, Copy, Check, ArrowLeft, Wallet, Bitcoin } from "lucide-react";

export default function CryptoPaymentPage() {
  const router = useRouter();
  const options = useMemo(() => getCryptoOptions(), []);

  const grouped = useMemo(() => {
    const map: Record<string, typeof options> = {};
    for (const opt of options) {
      if (!map[opt.symbol]) map[opt.symbol] = [];
      map[opt.symbol].push(opt);
    }
    return map;
  }, [options]);

  const symbols = useMemo(() => Object.keys(grouped), [grouped]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>(symbols[0]);
  const [selectedNetwork, setSelectedNetwork] = useState<string>(grouped[symbols[0]][0].network);

  const selected = useMemo(() => {
    return (
      grouped[selectedSymbol]?.find((o) => o.network === selectedNetwork) ||
      grouped[selectedSymbol]?.[0] ||
      options[0]
    );
  }, [selectedSymbol, selectedNetwork, grouped, options]);

  const availableNetworks = useMemo(
    () => grouped[selectedSymbol]?.map((o) => o.network) || [],
    [selectedSymbol, grouped]
  );

  const handleSymbolChange = (value: string | null) => {
    if (!value) return;
    setSelectedSymbol(value);
    const networks = grouped[value].map((o) => o.network);
    setSelectedNetwork(networks[0]);
  };

  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#f4256f]">
            <Heart className="h-6 w-6 fill-current" />
            MyLinks
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-8 sm:py-12">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 shadow-2xl backdrop-blur-sm">
          {/* Top gradient bar */}
          <div className="h-2 w-full bg-gradient-to-r from-[#f4256f] to-purple-600" />

          <div className="p-5 sm:p-8">
            {/* Title */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f4256f] to-purple-600 shadow-lg shadow-[#f4256f]/20">
                <Bitcoin className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold sm:text-3xl">Pay with Crypto</h1>
              <p className="mt-2 text-sm text-zinc-400">
                Select your preferred currency and network
              </p>
            </div>

            {/* Currency dropdown */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Currency
              </label>
              <Select value={selectedSymbol} onValueChange={handleSymbolChange}>
                <SelectTrigger className="h-14 w-full rounded-xl border-white/10 bg-zinc-950 px-4 text-base text-white hover:bg-zinc-950/80 [&_svg]:text-zinc-400">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-white/10 bg-zinc-900 text-white">
                  {symbols.map((symbol) => (
                    <SelectItem
                      key={symbol}
                      value={symbol}
                      className="cursor-pointer py-3 text-base focus:bg-white/10 focus:text-white"
                    >
                      <span className="font-bold">{symbol}</span>
                      <span className="ml-2 text-zinc-400">— {grouped[symbol][0].name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Network dropdown */}
            <div className="mb-8">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Network
              </label>
              <Select value={selectedNetwork} onValueChange={(value) => value && setSelectedNetwork(value)}>
                <SelectTrigger className="h-14 w-full rounded-xl border-white/10 bg-zinc-950 px-4 text-base text-white hover:bg-zinc-950/80 [&_svg]:text-zinc-400">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-white/10 bg-zinc-900 text-white">
                  {availableNetworks.map((network) => (
                    <SelectItem
                      key={network}
                      value={network}
                      className="cursor-pointer py-3 text-base focus:bg-white/10 focus:text-white"
                    >
                      {network}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* QR and address card */}
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <Wallet className="h-4 w-4 text-[#f4256f]" />
                  Send {selected.symbol} on {selected.network}
                </div>
                <div className="rounded-full bg-[#f4256f]/10 px-3 py-1 text-xs font-bold text-[#f4256f]">
                  {selected.symbol}
                </div>
              </div>

              <div className="mx-auto mb-6 max-w-[220px] overflow-hidden rounded-2xl border border-white/10 bg-white p-3 shadow-lg sm:max-w-[260px]">
                <Image
                  src={selected.image}
                  alt={`${selected.symbol} ${selected.network} QR code`}
                  width={260}
                  height={260}
                  className="h-auto w-full rounded-xl"
                  unoptimized
                />
              </div>

              <div className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-zinc-500">
                Wallet address
              </div>
              <div className="mb-6 flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900 p-3">
                <code className="min-w-0 flex-1 break-all text-xs text-zinc-200 sm:text-sm">
                  {selected.address}
                </code>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 rounded-lg bg-[#f4256f] p-2.5 text-white transition-colors hover:bg-[#d91d5c]"
                  aria-label="Copy address"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="w-full rounded-xl bg-gradient-to-r from-[#f4256f] to-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#f4256f]/25 transition-all hover:opacity-90 disabled:opacity-70 sm:text-base"
              >
                {confirming ? "Confirming..." : "I have sent the payment"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
