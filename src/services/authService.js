const API_URL = "http://localhost:5000/api/auth";

export async function registerUser(name, email, password) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registrasi gagal.");
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login gagal.");
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getCurrentUser() {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}