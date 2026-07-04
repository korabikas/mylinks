import cryptoData from "@/data/crypto.json";

export interface CryptoOption {
  symbol: string;
  name: string;
  network: string;
  address: string;
  image: string;
}

export function getCryptoOptions(): CryptoOption[] {
  return cryptoData as CryptoOption[];
}

export function getCryptoBySymbolAndNetwork(
  symbol: string,
  network: string
): CryptoOption | undefined {
  return getCryptoOptions().find(
    (c) =>
      c.symbol.toLowerCase() === symbol.toLowerCase() &&
      c.network.toLowerCase() === network.toLowerCase()
  );
}
