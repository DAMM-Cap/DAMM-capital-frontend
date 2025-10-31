export const ethereumChainLogo = "/ethereum-chain-logo.png";
export const optimismChainLogo = "/optimism-chain-logo.svg";
export const wethTokenLogo = "/weth.png";
export const usdcTokenLogo = "/usdc.png";
export const usdtTokenLogo = "/usdt.png";
export const daiTokenLogo = "/dai.png";
export const worldcoinTokenLogo = "/worldcoin.jpeg";

export const getTokenLogo = (token: string) => {
  if (token.toLowerCase().startsWith("weth")) return wethTokenLogo;
  if (token.toLowerCase().startsWith("usdc")) return usdcTokenLogo;
  if (token.toLowerCase().startsWith("usdt")) return usdtTokenLogo;
  if (token.toLowerCase().startsWith("dai")) return daiTokenLogo;
  if (token.toLowerCase().startsWith("worldcoin")) return worldcoinTokenLogo;
  return ethereumChainLogo;
};
