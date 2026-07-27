export const staffTokenKey = "saigonSisterStaffToken";

const legacyKeys = [
  "saigonSisterStaffSession",
  "saigonSisterStaffEmails",
  "saigonSisterStaffPasswords",
];

export function clearLegacyAuth() {
  for (const key of legacyKeys) {
    window.localStorage.removeItem(key);
  }
}

export function getStaffToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(staffTokenKey);
}

export function setStaffToken(token: string) {
  clearLegacyAuth();
  window.localStorage.setItem(staffTokenKey, token);
}

export function clearStaffToken() {
  window.localStorage.removeItem(staffTokenKey);
  clearLegacyAuth();
}

export function isStaffTokenValid(token: string | null) {
  if (!token) return false;
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return false;
    const payload = JSON.parse(atob(payloadPart)) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
