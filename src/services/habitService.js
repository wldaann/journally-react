
const API_URL = "http://localhost:5000/api/habits";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Mengambil semua habit
export async function getHabits() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil habit.");
  }

  return data;
}

// Menambahkan habit baru
export async function addHabit(habit) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name: habit.name,
      icon: habit.icon || "💻",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal menambahkan habit.");
  }

  return data;
}

// Mengubah nama atau ikon habit
export async function updateHabit(id, updates) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengubah habit.");
  }

  return data;
}

// Checklist atau batalkan checklist
export async function toggleHabitCompletion(id, date, completed) {
  const response = await fetch(
    `${API_URL}/${id}/completions/${date}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ completed }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal memperbarui checklist.");
  }

  return data;
}

// Menghapus habit
export async function deleteHabit(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal menghapus habit.");
  }

  return data;
}
