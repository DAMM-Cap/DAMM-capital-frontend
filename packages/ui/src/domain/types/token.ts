export interface TokenType {
  icon?: React.ComponentType<{ size?: number }>;
  iconNode?: React.ReactNode;
  symbol: string;
  name: string;
  balance: number;
  conversionValue?: number;
  getConvertedValue?: (amount: number) => number;
  metadata: {
    address: string;
    decimals: number;
  };
}

export interface Tokens {
  [key: string]: TokenType; // key can be the address of the token
}
