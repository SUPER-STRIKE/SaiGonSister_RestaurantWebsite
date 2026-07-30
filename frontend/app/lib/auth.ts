export const staffTokenKey = "saigonSisterStaffToken";
export const staffAccessCookie = "saigonSisterStaffAccess";

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
  document.cookie = `${staffAccessCookie}=allowed; path=/; SameSite=Lax`;
}

export function clearStaffToken() {
  window.localStorage.removeItem(staffTokenKey);
  clearLegacyAuth();
  document.cookie = `${staffAccessCookie}=; path=/; max-age=0; SameSite=Lax`;
}

function decodeJwtPayload(token: string) {
  const payloadPart = token.split(".")[1];
  if (!payloadPart) return null;
  const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return JSON.parse(atob(padded)) as { exp?: number };
}

export function isStaffTokenValid(token: string | null) {
  if (!token) return false;
  try {
    const payload = decodeJwtPayload(token);
    return typeof payload?.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function base64Url(value: object) {
  return btoa(JSON.stringify(value)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function createFrontendTestStaffToken() {
  const header = base64Url({ alg: "none", typ: "JWT" });
  const payload = base64Url({
    sub: "frontend-test-admin",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
  });
  return `${header}.${payload}.frontend-test`;
}
