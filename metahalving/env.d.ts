// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_COINGECKO_API_KEY?: string
  readonly VITE_BINANCE_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}