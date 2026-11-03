
const API_URL = "http://localhost:5000/api/journals";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Mengambil semua jurnal
export async function getJournals() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil jurnal.");
  }

  return data;
}

// Mengambil detail jurnal
export async function getJournalById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal mengambil detail jurnal.");
  }

  return data;
}

// Menambahkan jurnal
export async function saveJournal(journal) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(journal),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal menyimpan jurnal.");
  }

  return data;
}

// Mengedit jurnal
export async function updateJournal(journal) {
  const response = await fetch(`${API_URL}/${journal.id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(journal),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal memperbarui jurnal.");
  }

  return data;
}

// Menghapus jurnal
export async function deleteJournal(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal menghapus jurnal.");
  }

  return data;
}

// Mengubah status favorite
export async function toggleFavorite(id, favorite) {
  const response = await fetch(`${API_URL}/${id}/favorite`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ favorite }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal memperbarui favorite.");
  }

  return data;
}
