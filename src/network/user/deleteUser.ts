export default async function deleteUser(selectedUserIds: string | string[]) {
  const response = await fetch(`/api/user/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids: selectedUserIds }),
  });

  if (!response.ok) {
    throw new Error('Произошла ошибка при удалении клиента.');
  }

  return await response.json();
}
