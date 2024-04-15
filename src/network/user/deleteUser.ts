export default async function deleteUser(selectedUserIds: string | string[]) {
  const response = await fetch(`/api/user/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids: selectedUserIds }),
  });

  return response;
}
