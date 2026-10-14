import { Task, TaskStatus } from "@/types/task";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllTasksApi(
  status?: TaskStatus,
): Promise<Task[]> {
  const url = status
    ? `${API_URL}/tasks?status=${status}`
    : `${API_URL}/tasks`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Không thể lấy danh sách công việc");
  }

  return response.json();
}