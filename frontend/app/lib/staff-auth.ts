export const staffSessionKey = "saigonSisterStaffSession";
export const staffAccessCookie = "saigonSisterStaffAccess";
export const staffEmail = "giabophannguyen@gmail.com";
export const staffPassword = "1";

export type StaffSession = {
  email: string;
  signedInAt: number;
};

export function isStaffEmail(email: string) {
  return email.trim().toLowerCase() === staffEmail;
}

export function isStaffPassword(password: string) {
  return password === staffPassword;
}

export function readStaffSession() {
  try {
    const savedSession = window.localStorage.getItem(staffSessionKey);
    if (!savedSession) {
      return null;
    }

    const session = JSON.parse(savedSession) as Partial<StaffSession>;
    return session.email === staffEmail ? session : null;
  } catch {
    return null;
  }
}

export function saveStaffSession() {
  window.localStorage.setItem(
    staffSessionKey,
    JSON.stringify({
      email: staffEmail,
      signedInAt: Date.now(),
    }),
  );
  document.cookie = `${staffAccessCookie}=allowed; path=/; SameSite=Lax`;
}

export function clearStaffSession() {
  window.localStorage.removeItem(staffSessionKey);
  document.cookie = `${staffAccessCookie}=; path=/; max-age=0; SameSite=Lax`;
}
