import type {
  Task,
  UpdateTaskInput,
} from "@/types/task";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export async function updateTaskApi(
  id: number,
  data: UpdateTaskInput,
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/tasks/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorData =
      await response.json();

    const message = Array.isArray(
      errorData.message,
    )
      ? errorData.message.join(", ")
      : errorData.message;

    throw new Error(
      message ||
        "Không thể cập nhật công việc",
    );
  }

  return response.json();
}