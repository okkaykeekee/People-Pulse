export const HRMS_USER_KEY = 'hrmsUser';

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(HRMS_USER_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function getUserRole() {
  return getStoredUser()?.role || null;
}
