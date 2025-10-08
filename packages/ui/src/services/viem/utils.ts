import { type Address, getAddress, keccak256, slice, toHex } from "viem";

/**
 * Deterministically map an arbitrary string to an EVM address.
 * Solidity-equivalent: address(uint160(uint256(keccak256(bytes(input)))))
 *
 * Options:
 * - normalize: make mapping case-insensitive / trimmed, etc.
 * - namespace: prefix to avoid cross-app collisions ("ref:", "myapp", etc.)
 */
export function referralToAddress(
  referral: string,
  opts?: { caseInsensitive?: boolean; namespace?: string },
): Address {
  const normalized = (opts?.caseInsensitive ? referral.toLowerCase() : referral).trim();
  const input = opts?.namespace ? `${opts.namespace}:${normalized}` : normalized;

  // 1) keccak256 over the bytes of the string
  const hash = keccak256(toHex(input)); // hash is 0x + 32 bytes

  // 2) take the last 20 bytes (i.e., bytes [12, 32))
  const last20 = slice(hash, 12, 32); // 0x + 20 bytes

  // 3) EIP-55 checksum
  return getAddress(last20);
}
