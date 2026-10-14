const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export async function deleteTaskApi(
  id: number,
) {
  const response = await fetch(
    `${API_URL}/tasks/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Không thể xóa công việc",
    );
  }

  return response.json();
}