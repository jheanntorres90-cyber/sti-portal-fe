export const endpoints = {
  login: (role: string) => `login/${encodeURIComponent(role)}`,
};