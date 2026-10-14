import type {
  CreateTaskInput,
  Task,
} from "@/types/task";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export async function createTaskApi(
  data: CreateTaskInput,
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/tasks`,
    {
      method: "POST",

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
        "Không thể tạo công việc",
    );
  }

  return response.json();
}