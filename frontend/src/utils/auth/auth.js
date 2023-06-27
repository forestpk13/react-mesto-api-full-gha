
const BASE_URL = 'https://api.forestpk13.nomoreparties.sbs';

export const register = async (email, password) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
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
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return;
  }
  const err = await res.json();
  return Promise.reject(err);
};

export const getContent = async (token) => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return await res.json();
  }
  const err = await res.json();
  return Promise.reject(err);
};