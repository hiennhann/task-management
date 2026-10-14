"use client";

import { useEffect, useState } from "react";

import { getAllTasksApi } from "@/api/get-all-tasks.api";
import {
  Task,
  TaskStatus,
} from "@/types/task";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] =
    useState<TaskStatus | "ALL">("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");

      const data = await getAllTasksApi(
        status === "ALL"
          ? undefined
          : status,
      );

      setTasks(data);
    } catch {
      setError(
        "Không thể tải danh sách công việc",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [status]);

  return (
    <main>
      <h1>Quản lý công việc</h1>

      <div>
        <label>Lọc trạng thái: </label>

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as
                | TaskStatus
                | "ALL",
            )
          }
        >
          <option value="ALL">
            Tất cả
          </option>

          <option value="TODO">
            Chưa làm
          </option>

          <option value="IN_PROGRESS">
            Đang làm
          </option>

          <option value="DONE">
            Hoàn thành
          </option>
        </select>
      </div>

      {loading && (
        <p>Đang tải dữ liệu...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!loading &&
        !error &&
        tasks.length === 0 && (
          <p>Chưa có công việc.</p>
        )}

      {!loading &&
        !error &&
        tasks.map((task) => (
          <div key={task.id}>
            <h3>{task.title}</h3>

            {task.description && (
              <p>{task.description}</p>
            )}

            <p>
              Trạng thái: {task.status}
            </p>

            {task.dueDate && (
              <p>
                Hạn:{" "}
                {new Date(
                  task.dueDate,
                ).toLocaleDateString(
                  "vi-VN",
                )}
              </p>
            )}

            <hr />
          </div>
        ))}
    </main>
  );
}