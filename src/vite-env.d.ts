/// <reference types="vite/client" />

declare interface Window {
  ethereum?: {
    request: (args: { method: string }) => Promise<string[]>;
  };
}

declare module 'lenis' {
  interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    smooth?: boolean;
    direction?: 'vertical' | 'horizontal';
  }

  class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    destroy(): void;
  }

  export default Lenis;
}
