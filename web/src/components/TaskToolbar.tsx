"use client";

import styles from "@/app/tasks/tasks.module.css";

import type {
  TaskStatus,
} from "@/types/task";

type FilterStatus =
  | TaskStatus
  | "ALL";

type Props = {
  keyword: string;

  status: FilterStatus;

  onKeywordChange: (
    value: string,
  ) => void;

  onStatusChange: (
    value: FilterStatus,
  ) => void;

  onRefresh: () => void;
};

export default function TaskToolbar({
  keyword,
  status,
  onKeywordChange,
  onStatusChange,
  onRefresh,
}: Props) {
  return (
    <section
      className={
        styles.toolbar
      }
    >
      {/* Search */}

      <div
        className={
          styles.searchBox
        }
      >
        <span>⌕</span>

        <input
          type="text"
          value={keyword}
          placeholder="Tìm theo tiêu đề hoặc mô tả công việc..."
          onChange={(e) =>
            onKeywordChange(
              e.target.value,
            )
          }
        />
      </div>

      {/* Status */}

      <select
        className={
          styles.statusSelect
        }
        value={status}
        onChange={(e) =>
          onStatusChange(
            e.target
              .value as FilterStatus,
          )
        }
      >
        <option value="ALL">
          Tất cả trạng thái
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

      {/* Refresh */}

      <button
        type="button"
        className={
          styles.refreshButton
        }
        onClick={onRefresh}
      >
        ↻ Làm mới
      </button>
    </section>
  );
}