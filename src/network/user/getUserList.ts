export async function getUserList() {
  const response = await fetch(`/api/user/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
}
