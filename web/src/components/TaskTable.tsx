"use client";

import styles from "@/app/tasks/tasks.module.css";
import type { Task } from "@/types/task";

type Props = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
};

function getStatusLabel(
  status: Task["status"],
) {
  switch (status) {
    case "TODO":
      return "● Chưa làm";

    case "IN_PROGRESS":
      return "● Đang làm";

    case "DONE":
      return "✓ Hoàn thành";
  }
}

export default function TaskTable({
  tasks,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div
      className={
        styles.tableWrapper
      }
    >
      <table
        className={
          styles.taskTable
        }
      >
        <thead>
          <tr>
            <th>TIÊU ĐỀ</th>
            <th>MÔ TẢ</th>
            <th>TRẠNG THÁI</th>
            <th>NGÀY HẾT HẠN</th>
            <th>CẬP NHẬT</th>
            <th>THAO TÁC</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map(
            (task) => (
              <tr key={task.id}>
                <td
                  className={
                    styles.titleCell
                  }
                >
                  {task.title}
                </td>

                <td
                  className={
                    styles.descCell
                  }
                >
                  {task.description ||
                    "Không có mô tả"}
                </td>

                <td>
                  <span
                    className={`${styles.statusBadge} ${styles[task.status]}`}
                  >
                    {getStatusLabel(
                      task.status,
                    )}
                  </span>
                </td>

                <td>
                  {task.dueDate
                    ? new Date(
                        task.dueDate,
                      ).toLocaleDateString(
                        "vi-VN",
                      )
                    : "--"}
                </td>

                <td>
                  {new Date(
                    task.updatedAt,
                  ).toLocaleDateString(
                    "vi-VN",
                  )}
                </td>

                <td>
                  <div
                    className={
                      styles.actionGroup
                    }
                  >
                    <button
                      className={
                        styles.editButton
                      }
                      onClick={() =>
                        onEdit(
                          task,
                        )
                      }
                    >
                      Sửa
                    </button>

                    <button
                      className={
                        styles.deleteButton
                      }
                      onClick={() =>
                        onDelete(
                          task.id,
                        )
                      }
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}