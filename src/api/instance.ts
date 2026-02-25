// src/api/instance.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});
