export const ethereumChainLogo = "/ethereum-chain-logo.png";
export const optimismChainLogo = "/optimism-chain-logo.svg";
export const wethTokenLogo = "/weth.png";
export const usdcTokenLogo = "/usdc.png";
export const usdtTokenLogo = "/usdt.png";
export const daiTokenLogo = "/dai.png";
export const worldcoinTokenLogo = "/worldcoin.jpeg";
export const opTokenLogo = "/optimism-chain-logo.svg"; 

export const getTokenLogo = (token: string) => {
  const tokenLower = token.toLowerCase();
  if (tokenLower.startsWith("weth")) return wethTokenLogo;
  if (tokenLower.startsWith("usdc")) return usdcTokenLogo;
  if (tokenLower.startsWith("usdt")) return usdtTokenLogo;
  if (tokenLower.startsWith("dai")) return daiTokenLogo;
  if (tokenLower.startsWith("worldcoin")) return worldcoinTokenLogo;
  if (tokenLower.startsWith("op")) return opTokenLogo;
  return ethereumChainLogo;
};
