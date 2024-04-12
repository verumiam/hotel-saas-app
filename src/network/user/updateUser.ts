export async function updateUser(userData: Record<string, unknown>, id: string) {
  const response = await fetch(`/api/user/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: userData, id }),
  });

  if (!response.ok) {
    throw new Error('Failed to update the user');
  }

  return response.json();
}
