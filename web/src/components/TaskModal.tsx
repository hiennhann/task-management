"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import styles from "@/app/tasks/tasks.module.css";

import type {
  CreateTaskInput,
  Task,
  TaskStatus,
} from "@/types/task";

type Props = {
  open: boolean;
  editingTask: Task | null;
  onClose: () => void;
  onSubmit: (
    data: CreateTaskInput,
  ) => Promise<void>;
};

export default function TaskModal({
  open,
  editingTask,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [status, setStatus] =
    useState<TaskStatus>("TODO");
  const [dueDate, setDueDate] =
    useState("");
  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    if (!open) return;

    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(
        editingTask.description ?? "",
      );
      setStatus(editingTask.status);
      setDueDate(
        editingTask.dueDate
          ? editingTask.dueDate.slice(0, 10)
          : "",
      );
    } else {
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setDueDate("");
    }
  }, [editingTask, open]);

  if (!open) return null;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSubmitting(true);

      await onSubmit({
        title,
        description:
          description.trim() || undefined,
        status,
        dueDate:
          dueDate || undefined,
      });

      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={styles.modalOverlay}
      onMouseDown={onClose}
    >
      <div
        className={styles.modal}
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <div className={styles.modalHeader}>
          <div
            className={styles.modalHeaderContent}
          >
            <div
              className={styles.modalIcon}
            >
              {editingTask ? "✎" : "+"}
            </div>

            <div>
              <h2>
                {editingTask
                  ? "Cập nhật công việc"
                  : "Tạo công việc mới"}
              </h2>

              <p>
                {editingTask
                  ? "Thay đổi thông tin và trạng thái công việc."
                  : "Điền thông tin bên dưới để thêm công việc mới."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          className={styles.modalForm}
          onSubmit={handleSubmit}
        >
          <div className={styles.formGroup}>
            <div
              className={
                styles.labelHeader
              }
            >
              <label>Tiêu đề công việc</label>

              <span>
                {title.length}/100
              </span>
            </div>

            <input
              type="text"
              required
              maxLength={100}
              value={title}
              placeholder="Ví dụ: Hoàn thành báo cáo cuối tuần"
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mô tả</label>

            <textarea
              value={description}
              placeholder="Mô tả chi tiết nội dung công việc..."
              onChange={(e) =>
                setDescription(
                  e.target.value,
                )
              }
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Trạng thái</label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target
                      .value as TaskStatus,
                  )
                }
              >
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

            <div className={styles.formGroup}>
              <label>Ngày hết hạn</label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(
                    e.target.value,
                  )
                }
              />
            </div>
          </div>

          <div
            className={styles.modalInfo}
          >
            <div>
              <strong>Lưu ý</strong>
              <p>
                Tiêu đề không được để trống
                và tối đa 100 ký tự.
              </p>
            </div>
          </div>

          <div
            className={styles.modalFooter}
          >
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={submitting}
            >
              Hủy
            </button>

            <button
              type="submit"
              className={styles.saveButton}
              disabled={submitting}
            >
              {submitting
                ? "Đang xử lý..."
                : editingTask
                  ? "Lưu thay đổi"
                  : "Tạo công việc"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}