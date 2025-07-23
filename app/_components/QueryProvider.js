"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const qc = new QueryClient();

export default function QueryProvider({ children }) {
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
