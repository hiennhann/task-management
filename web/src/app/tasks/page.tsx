"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import styles from "./tasks.module.css";

import TaskModal from "@/components/TaskModal";
import TaskTable from "@/components/TaskTable";
import TaskToolbar from "@/components/TaskToolbar";

import { createTaskApi } from "@/api/create-task.api";
import { deleteTaskApi } from "@/api/delete-task.api";
import { getAllTasksApi } from "@/api/get-all-tasks.api";
import { updateTaskApi } from "@/api/update-task.api";

import type {
  CreateTaskInput,
  Task,
  TaskStatus,
} from "@/types/task";

type FilterStatus =
  | TaskStatus
  | "ALL";

export default function TasksPage() {
  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [allTasks, setAllTasks] =
    useState<Task[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [keyword, setKeyword] =
    useState("");

  const [status, setStatus] =
    useState<FilterStatus>("ALL");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  /*
   * Load dữ liệu:
   * - allTasks dùng cho thống kê
   * - tasks dùng cho bảng và filter status
   */
  const loadTasks = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const allData =
          await getAllTasksApi();

        setAllTasks(allData);

        if (status === "ALL") {
          setTasks(allData);
        } else {
          const filteredData =
            await getAllTasksApi(
              status,
            );

          setTasks(filteredData);
        }
      } catch {
        setError(
          "Không thể tải danh sách công việc.",
        );
      } finally {
        setLoading(false);
      }
    },
    [status],
  );

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  /*
   * Tìm kiếm phía frontend.
   */
  const filteredTasks =
    useMemo(() => {
      const search =
        keyword
          .trim()
          .toLowerCase();

      if (!search) {
        return tasks;
      }

      return tasks.filter(
        (task) =>
          task.title
            .toLowerCase()
            .includes(search) ||
          (
            task.description ?? ""
          )
            .toLowerCase()
            .includes(search),
      );
    }, [tasks, keyword]);

  /*
   * Thống kê.
   */
  const totalCount =
    allTasks.length;

  const todoCount =
    allTasks.filter(
      (task) =>
        task.status === "TODO",
    ).length;

  const progressCount =
    allTasks.filter(
      (task) =>
        task.status ===
        "IN_PROGRESS",
    ).length;

  const doneCount =
    allTasks.filter(
      (task) =>
        task.status === "DONE",
    ).length;

  function openCreateModal() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEditModal(
    task: Task,
  ) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingTask(null);
  }

  async function handleSubmit(
    data: CreateTaskInput,
  ) {
    try {
      setError("");

      if (editingTask) {
        await updateTaskApi(
          editingTask.id,
          {
            title: data.title,

            description:
              data.description ||
              undefined,

            status: data.status,

            dueDate:
              data.dueDate ||
              undefined,
          },
        );
      } else {
        await createTaskApi(data);
      }

      await loadTasks();
    } catch (error) {
      if (
        error instanceof Error
      ) {
        setError(error.message);
      } else {
        setError(
          "Có lỗi xảy ra khi lưu công việc.",
        );
      }

      throw error;
    }
  }

  async function handleDelete(
    id: number,
  ) {
    const confirmed =
      window.confirm(
        "Bạn có chắc chắn muốn xóa công việc này?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteTaskApi(id);

      await loadTasks();
    } catch (error) {
      if (
        error instanceof Error
      ) {
        setError(error.message);
      } else {
        setError(
          "Không thể xóa công việc.",
        );
      }
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        {/* TOP BAR */}

        <header
          className={
            styles.topbar
          }
        >
          {/* Brand */}

          <div
            className={
              styles.brand
            }
          >
            <div
              className={
                styles.brandIcon
              }
            >
              ✓
            </div>

            <div>
              <span
                className={
                  styles.brandSmall
                }
              >
                TASK MANAGEMENT
              </span>

              <strong>
                Quản lý công việc
              </strong>
            </div>
          </div>

          {/* Search trên topbar */}

          <div
            className={
              styles.topSearch
            }
          >
            <span>⌕</span>

            <input
              type="text"
              value={keyword}
              placeholder="Tìm kiếm công việc..."
              onChange={(e) =>
                setKeyword(
                  e.target.value,
                )
              }
            />
          </div>

          {/* Profile */}

          <div
            className={
              styles.profile
            }
          >
            <div
              className={
                styles.notification
              }
            >
              ●
            </div>

            <div
              className={
                styles.avatar
              }
            >
              NV
            </div>

            <div
              className={
                styles.profileInfo
              }
            >
              <strong>
                Admin Workspace
              </strong>

              <span>
                Task Management
              </span>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}

        <div
          className={
            styles.content
          }
        >
          {/* TITLE */}

          <section
            className={
              styles.pageHeader
            }
          >
            <div>
              <h1>
                Hệ thống theo dõi
                nhiệm vụ
              </h1>

              <p>
                Theo dõi tiến độ,
                deadline và trạng
                thái công việc một
                cách trực quan.
              </p>
            </div>

            <button
              type="button"
              className={
                styles.addButton
              }
              onClick={
                openCreateModal
              }
            >
              + Thêm công việc
            </button>
          </section>

          {/* STATISTIC CARDS */}

          <section
            className={
              styles.statsGrid
            }
          >
            {/* Tổng cộng */}

            <div
              className={
                styles.statCard
              }
            >
              <div>
                <span>
                  TỔNG CỘNG
                </span>

                <strong>
                  {totalCount}
                </strong>

                <p>
                  công việc
                </p>
              </div>

              <div
                className={`${styles.statIcon} ${styles.totalIcon}`}
              >
                ▣
              </div>
            </div>

            {/* Đang làm */}

            <div
              className={
                styles.statCard
              }
            >
              <div>
                <span>
                  ĐANG LÀM
                </span>

                <strong
                  className={
                    styles.orangeText
                  }
                >
                  {progressCount}
                </strong>

                <p>
                  đang thực hiện
                </p>
              </div>

              <div
                className={`${styles.statIcon} ${styles.progressIcon}`}
              >
                ◷
              </div>
            </div>

            {/* Hoàn thành */}

            <div
              className={
                styles.statCard
              }
            >
              <div>
                <span>
                  HOÀN THÀNH
                </span>

                <strong
                  className={
                    styles.greenText
                  }
                >
                  {doneCount}
                </strong>

                <p>
                  đạt kết quả
                </p>
              </div>

              <div
                className={`${styles.statIcon} ${styles.doneIcon}`}
              >
                ✓
              </div>
            </div>

            {/* Chưa làm */}

            <div
              className={
                styles.statCard
              }
            >
              <div>
                <span>
                  CHƯA LÀM
                </span>

                <strong>
                  {todoCount}
                </strong>

                <p>
                  trong hàng đợi
                </p>
              </div>

              <div
                className={`${styles.statIcon} ${styles.todoIcon}`}
              >
                □
              </div>
            </div>
          </section>

          {/* TOOLBAR */}

          <TaskToolbar
            keyword={keyword}
            status={status}
            onKeywordChange={
              setKeyword
            }
            onStatusChange={
              setStatus
            }
            onRefresh={
              loadTasks
            }
          />

          {/* ERROR */}

          {error && (
            <div
              className={
                styles.errorBox
              }
            >
              {error}
            </div>
          )}

          {/* TABLE */}

          <section
            className={
              styles.tableCard
            }
          >
            <div
              className={
                styles.tableHeader
              }
            >
              <div>
                <strong>
                  Danh sách công việc
                </strong>

                <span>
                  Hiển thị{" "}
                  {
                    filteredTasks.length
                  }{" "}
                  mục
                </span>
              </div>

              <small>
                Đồng bộ tự động
              </small>
            </div>

            {loading ? (
              <div
                className={
                  styles.stateBox
                }
              >
                Đang tải dữ liệu...
              </div>
            ) : filteredTasks.length ===
              0 ? (
              <div
                className={
                  styles.stateBox
                }
              >
                Không có công việc
                phù hợp.
              </div>
            ) : (
              <TaskTable
                tasks={
                  filteredTasks
                }
                onEdit={
                  openEditModal
                }
                onDelete={
                  handleDelete
                }
              />
            )}

            <div
              className={
                styles.tableFooter
              }
            >
              <span>
                Hiển thị toàn bộ
                nhiệm vụ phù hợp
              </span>

              <span>
                Tổng:{" "}
                {
                  filteredTasks.length
                }{" "}
                công việc
              </span>
            </div>
          </section>
        </div>

        {/* POPUP ADD / EDIT */}

        <TaskModal
          open={modalOpen}
          editingTask={
            editingTask
          }
          onClose={
            closeModal
          }
          onSubmit={
            handleSubmit
          }
        />
      </div>
    </main>
  );
}
