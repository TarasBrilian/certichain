"use server";

import {
  createWalletClient,
  http,
  isAddress,
  parseEther,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { BSC_TESTNET_RPC_URL, bnbSmartChainTestnet } from "@/lib/chains";
import { supabase } from "@/lib/db";

const FAUCET_AMOUNT_BNB = "0.005";
const COOLDOWN_HOURS = 8;
const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;

export type FaucetResult =
  | { success: true; txHash: `0x${string}`; amount: string }
  | { success: false; error: string; cooldownRemainingMs?: number };

function normalizePrivateKey(key: string): Hex {
  const trimmed = key.trim();
  return (trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`) as Hex;
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export async function sendFaucetTokens(
  rawAddress: string
): Promise<FaucetResult> {
  const address = rawAddress.trim();

  if (!isAddress(address)) {
    return { success: false, error: "Invalid wallet address" };
  }

  const privateKey = process.env.FAUCET_PRIVATE_KEY;
  if (!privateKey) {
    return {
      success: false,
      error: "Faucet is not configured. Please set FAUCET_PRIVATE_KEY.",
    };
  }

  const lowerAddress = address.toLowerCase();

  // Cooldown check: 1 address can claim every 8 hours
  const { data: lastClaim, error: lookupError } = await supabase
    .from("faucet_claims")
    .select("last_claim_at")
    .eq("address", lowerAddress)
    .maybeSingle();

  if (lookupError) {
    console.error("Faucet cooldown lookup error:", lookupError);
    return { success: false, error: "Failed to verify cooldown. Try again." };
  }

  if (lastClaim?.last_claim_at) {
    const elapsed = Date.now() - new Date(lastClaim.last_claim_at).getTime();
    if (elapsed < COOLDOWN_MS) {
      const remaining = COOLDOWN_MS - elapsed;
      return {
        success: false,
        error: `This address is on cooldown. Try again in ${formatRemaining(remaining)}.`,
        cooldownRemainingMs: remaining,
      };
    }
  }

  try {
    const account = privateKeyToAccount(normalizePrivateKey(privateKey));

    const client = createWalletClient({
      account,
      chain: bnbSmartChainTestnet,
      transport: http(BSC_TESTNET_RPC_URL),
    });

    const txHash = await client.sendTransaction({
      to: address as Address,
      value: parseEther(FAUCET_AMOUNT_BNB),
    });

    const { error: writeError } = await supabase
      .from("faucet_claims")
      .upsert(
        {
          address: lowerAddress,
          last_claim_at: new Date().toISOString(),
          tx_hash: txHash,
        },
        { onConflict: "address" }
      );

    if (writeError) {
      console.error("Faucet claim write error:", writeError);
    }

    return { success: true, txHash, amount: FAUCET_AMOUNT_BNB };
  } catch (err) {
    console.error("Faucet error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to send tokens";
    return { success: false, error: message };
  }
}
