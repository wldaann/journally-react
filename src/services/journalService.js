export function getJournals() {
  return JSON.parse(localStorage.getItem("journals")) || [];
}

export function saveJournal(journal) {
  const journals = getJournals();

  journals.push(journal);

  localStorage.setItem(
    "journals",
    JSON.stringify(journals)
  );
}

export function deleteJournal(id) {
  const journals = getJournals().filter(
    (journal) => journal.id !== id
  );

  localStorage.setItem(
    "journals",
    JSON.stringify(journals)
  );
}

export function getJournalById(id) {
  const journals = getJournals();

  return journals.find(
    (journal) => journal.id === Number(id)
  );
}

export function updateJournal(updatedJournal) {
  const journals = getJournals().map((journal) =>
    journal.id === updatedJournal.id
      ? updatedJournal
      : journal
  );

  localStorage.setItem(
    "journals",
    JSON.stringify(journals)
  );
}

export function toggleFavorite(id) {
  const journals = getJournals().map((journal) => {
    if (journal.id === id) {
      return {
        ...journal,
        favorite: !journal.favorite,
      };
    }

    return journal;
  });

  localStorage.setItem(
    "journals",
    JSON.stringify(journals)
  );
}