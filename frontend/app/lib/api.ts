function normalizeApiUrl(value: string) {
  const trimmed = value.trim().replace(/\/$/, "");
  if (!trimmed) return "http://localhost:4000";
  const bare = trimmed.replace(/^(https?:\/\/)+/i, "");
  if (/^localhost\b/i.test(bare) || /^127\./.test(bare)) {
    return `http://${bare}`;
  }
  return `https://${bare}`;
}

export const API_URL = normalizeApiUrl(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
);


export type ApiCategory = "breakfast" | "lunch" | "dinner" | "drink";

export type ApiChoice = {
  name: string;
  required?: boolean;
  options: string[];
};

export type ApiAddOn = {
  name: string;
  price: number;
};

export type ApiMenuItem = {
  id: number;
  menuNumber: string | null;
  name: string;
  description: string | null;
  price: number;
  category: ApiCategory;
  sectionId?: string | null;
  sectionTitle?: string | null;
  sectionNote?: string | null;
  tags: string[];
  choices: ApiChoice[];
  addOns: ApiAddOn[];
  imageUrl: string | null;
};

type ApiErrorBody = {
  error?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.token) headers.set("Authorization", `Bearer ${init.token}`);

  const isForm = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (init.body && !isForm && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      0,
      `Cannot reach API at ${API_URL}. Check NEXT_PUBLIC_API_URL on Vercel and redeploy.`,
    );
  }

  const data = (await response.json().catch(() => ({}))) as T & ApiErrorBody;
  if (!response.ok) {
    throw new ApiError(response.status, data.error || response.statusText || "Request failed");
  }
  return data;
}

export function mediaUrl(imageUrl: string | null | undefined, fallback = "/roll-rice-rolls.png") {
  if (!imageUrl) return fallback;
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${API_URL}${imageUrl}`;
}

export function fetchMenu(query = "") {
  return apiFetch<ApiMenuItem[]>(`/api/menu${query}`);
}

export function loginRequest(username: string, password: string) {
  return apiFetch<{ message: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function verifyOtpRequest(otp: string) {
  return apiFetch<{ token: string }>("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ otp }),
  });
}

export function updateUsernameRequest(token: string, username: string) {
  return apiFetch<{ message: string }>("/api/auth/username", {
    method: "PUT",
    token,
    body: JSON.stringify({ username }),
  });
}

export function updatePasswordRequest(token: string, currentPassword: string, newPassword: string) {
  return apiFetch<{ message: string }>("/api/auth/password", {
    method: "PUT",
    token,
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export function createMenuItemRequest(token: string, form: FormData) {
  return apiFetch<ApiMenuItem>("/api/menu", { method: "POST", token, body: form });
}

export function updateMenuItemRequest(token: string, id: number, form: FormData) {
  return apiFetch<ApiMenuItem>(`/api/menu/${id}`, { method: "PUT", token, body: form });
}

export function deleteMenuItemRequest(token: string, id: number) {
  return apiFetch<{ message: string }>(`/api/menu/${id}`, { method: "DELETE", token });
}

export function setSpecialtyRequest(token: string, menuItemIds: number[]) {
  return apiFetch<ApiMenuItem[]>("/api/menu/specialty", {
    method: "PUT",
    token,
    body: JSON.stringify({ menuItemIds }),
  });
}

export type ApiRestaurantInfo = {
  location: string;
  city: string;
  email: string;
  phone: string;
  hoursByDay: Record<string, string>;
  hoursNote: string;
};

export function fetchRestaurantInfo() {
  return apiFetch<ApiRestaurantInfo>("/api/restaurant");
}

export function updateRestaurantInfoRequest(token: string, body: Partial<ApiRestaurantInfo>) {
  return apiFetch<ApiRestaurantInfo>("/api/restaurant", {
    method: "PUT",
    token,
    body: JSON.stringify(body),
  });
}

export type ApiTimer = {
  endsAt: number | null;
};

export function fetchTimer(token: string) {
  return apiFetch<ApiTimer>("/api/timer", { token });
}

export function startTimerRequest(token: string) {
  return apiFetch<ApiTimer>("/api/timer/start", {
    method: "POST",
    token,
  });
}
