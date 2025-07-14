import axios from "axios";
import { Transaction } from "@/types/transactions.ts";

export const axiosInstance = axios.create({
  baseURL:"http://localhost:5000/api",
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await axiosInstance.get("/transactions/mine");

  return response.data;
};
