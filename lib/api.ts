/* eslint-disable @typescript-eslint/no-explicit-any */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// Farmers API
export const farmersApi = {
  getAll: () => apiCall("/farmers"),
  getOne: (id: string) => apiCall(`/farmers/${id}`),
  create: (data: any) =>
    apiCall("/farmers", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    apiCall(`/farmers/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/farmers/${id}`, { method: "DELETE" }),
  getStats: () => apiCall("/farmers/stats"),
};

// Crops API
export const cropsApi = {
  getAll: () => apiCall("/crops"),
  getOne: (id: string) => apiCall(`/crops/${id}`),
  create: (data: any) =>
    apiCall("/crops", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    apiCall(`/crops/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/crops/${id}`, { method: "DELETE" }),
  getStats: () => apiCall("/crops/stats"),
};
