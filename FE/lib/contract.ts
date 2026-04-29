import type { Abi, Address } from "viem";
import certiChainAbi from "@/contracts/CertiChainABI.json";

export const CERTICHAIN_ADDRESS =
  "0xBF8F03002E91DAACC8E3597d650A4F1b2d21a39E" as Address;

export const CERTICHAIN_ABI = certiChainAbi as Abi;

export const BSCSCAN_TESTNET_URL = "https://testnet.bscscan.com";

export function contractUrl() {
  return `${BSCSCAN_TESTNET_URL}/address/${CERTICHAIN_ADDRESS}`;
}

export function txUrl(hash: `0x${string}`) {
  return `${BSCSCAN_TESTNET_URL}/tx/${hash}`;
}

export function tokenUrl(tokenId: string) {
  return `${BSCSCAN_TESTNET_URL}/token/${CERTICHAIN_ADDRESS}?a=${tokenId}`;
}
