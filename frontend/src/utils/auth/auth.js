
const BASE_URL = 'http://api.forestpk13.nomoreparties.sbs';

export const register = async (password, email) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
    credentials: 'include',
  });
  if (res.ok) {
    return await res.json();
  }
  const err = await res.json();
  return Promise.reject(err);
};

export const login = async (password, email) => {
  const res = await fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
    credentials: 'include',
  });
  if (res.ok) {
    return await res.json();
  }
  const err = await res.json();
  return Promise.reject(err);
};

export const getContent = async () => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    credentials: 'include',
  });
  if (res.ok) {
    return await res.json();
  }
  const err = await res.json();
  return Promise.reject(err);
};