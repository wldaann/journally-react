
const API_URL = "http://localhost:5000/api/todos";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Mengambil semua Todo milik akun yang sedang login
export async function getTodos() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil Todo.");
  }

  return data;
}

// Menambahkan Todo baru
export async function addTodo(todo) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      title: todo.title,
      priority: todo.priority || "medium",
      deadline: todo.deadline || null,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal menambahkan Todo.");
  }

  return data;
}

// Mengubah Todo
export async function updateTodo(id, updates) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengubah Todo.");
  }

  return data;
}

// Menghapus Todo
export async function deleteTodo(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal menghapus Todo.");
  }

  return data;
}
