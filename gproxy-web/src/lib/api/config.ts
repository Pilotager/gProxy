export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:19998";

export interface ApiConfig {
  baseUrl: string;
  mockEnabled: boolean;
  mockDelay: number;
}

export const apiConfig: ApiConfig = {
  baseUrl: API_BASE_URL,
  mockEnabled: process.env.NEXT_PUBLIC_MOCK_ENABLED === "true",
  mockDelay: Number(process.env.NEXT_PUBLIC_MOCK_DELAY || "200"),
};
