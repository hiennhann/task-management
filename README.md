# Task Management

Ứng dụng quản lý công việc sử dụng **NestJS, TypeScript, PostgreSQL, Prisma ORM và Docker Compose**.

Hiện tại phần Ngày 1 gồm backend, database và 2 API:

- `POST /tasks` — Tạo công việc
- `GET /tasks` — Lấy danh sách công việc, mới nhất trước

---

## 1. Yêu cầu cài đặt

Máy cần cài:

- Node.js
- npm
- Docker Desktop
- Git

Kiểm tra:

```bash
node -v
npm -v
docker -v
git --version
```

---

## 2. Clone project

```bash
git clone <repository-url>
cd task-management
```

Chuyển sang branch làm bài:

```bash
git switch feat/task-manager
```

---

## 3. Cấu trúc project

```text
task-management/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── generated/
│   │   ├── prisma/
│   │   ├── tasks/
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 4. Database và Prisma

Project sử dụng **PostgreSQL** chạy bằng Docker Compose.

**Prisma ORM** được dùng để:

- Kết nối PostgreSQL.
- Thao tác dữ liệu.
- Quản lý migration.
- Tạo dữ liệu mẫu.
- Sinh Prisma Client để backend truy cập database.

---

## 5. Chuẩn bị biến môi trường

Trong thư mục `backend`, tạo file `.env` từ `.env.example`.

Git Bash:

```bash
cp backend/.env.example backend/.env
```

Ví dụ:

```env
PORT=3001

POSTGRES_USER=taskuser
POSTGRES_PASSWORD=taskpass
POSTGRES_DB=task_manager

DATABASE_URL="postgresql://taskuser:taskpass@localhost:5432/task_manager?schema=public"
```

> Không commit file `.env` lên GitHub. Chỉ commit `.env.example`.

---

## 6. Khởi động PostgreSQL

Tại thư mục gốc project:

```bash
docker compose up -d db
```

Kiểm tra container:

```bash
docker compose ps
```

Xem log database:

```bash
docker compose logs db
```

---

## 7. Cài dependency backend

```bash
cd backend
npm install
```

---

## 8. Chạy migration

Migration dùng để tạo và cập nhật cấu trúc database từ Prisma Schema.

Lần đầu:

```bash
npx prisma migrate dev --name init_tasks
```

Các lần sau:

```bash
npx prisma migrate dev
```

---

## 9. Generate Prisma Client

```bash
npx prisma generate
```

---

## 10. Tạo dữ liệu mẫu

Project chuẩn bị ít nhất 5 công việc mẫu.

```bash
npx prisma db seed
```

---

## 11. Chạy backend

Trong thư mục `backend`:

```bash
npm run start:dev
```

Khi chạy thành công sẽ xuất hiện:

```text
Nest application successfully started
```

Backend chạy tại:

```text
http://localhost:3001
```

---

# API

## GET /tasks

Lấy danh sách công việc, công việc mới nhất đứng trước.

### Request

```bash
curl http://localhost:3001/tasks
```

### Response ví dụ

```json
[
  {
    "id": 1,
    "title": "Học NestJS",
    "description": "Hoàn thành API ngày 1",
    "status": "TODO",
    "dueDate": "2026-10-20T00:00:00.000Z",
    "createdAt": "2026-10-14T02:00:00.000Z",
    "updatedAt": "2026-10-14T02:00:00.000Z"
  }
]
```

---

## POST /tasks

Tạo một công việc mới.

### Request

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hoàn thành bài tập NestJS",
    "description": "Làm API quản lý công việc",
    "status": "TODO",
    "dueDate": "2026-10-20"
  }'
```

### Response ví dụ

```json
{
  "id": 6,
  "title": "Hoàn thành bài tập NestJS",
  "description": "Làm API quản lý công việc",
  "status": "TODO",
  "dueDate": "2026-10-20T00:00:00.000Z",
  "createdAt": "2026-10-14T02:00:00.000Z",
  "updatedAt": "2026-10-14T02:00:00.000Z"
}
```

---

# Validation

Backend kiểm tra dữ liệu trước khi lưu vào database.

## Title rỗng hoặc toàn khoảng trắng

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"      "}'
```

Kết quả:

```text
400 Bad Request
```

## Title quá 100 ký tự

Backend trả:

```text
400 Bad Request
```

## Status không hợp lệ

Status hợp lệ:

```text
TODO
IN_PROGRESS
DONE
```

Ví dụ sai:

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Test task",
    "status":"ABC"
  }'
```

Kết quả:

```text
400 Bad Request
```

---

# Kiểm tra dữ liệu được lưu sau khi restart

Tạo một công việc:

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Kiểm tra persistence"}'
```

Dừng backend:

```text
Ctrl + C
```

Chạy lại backend:

```bash
npm run start:dev
```

Kiểm tra:

```bash
curl http://localhost:3001/tasks
```

Nếu công việc `Kiểm tra persistence` vẫn còn thì dữ liệu đã được lưu trong PostgreSQL và không bị mất khi restart NestJS.

---

# Docker

## Xem trạng thái

```bash
docker compose ps
```

## Xem log

```bash
docker compose logs db
```

Theo dõi log liên tục:

```bash
docker compose logs -f db
```

## Dừng hệ thống

```bash
docker compose down
```

Lệnh trên không xóa Docker volume.

## Dừng và xóa toàn bộ dữ liệu PostgreSQL

```bash
docker compose down -v
```

> Chỉ dùng khi muốn reset database.

---

# Prisma Studio

Có thể xem dữ liệu bằng Prisma Studio:

```bash
cd backend
npx prisma studio
```

---

# Luồng xử lý

Khi client gọi:

```text
POST /tasks
```

Dữ liệu đi qua:

```text
Client
  ↓
TasksController
  ↓
TasksService
  ↓
PrismaService
  ↓
Prisma Client
  ↓
PostgreSQL
```

- **Controller:** nhận HTTP request và gọi Service.
- **Service:** xử lý nghiệp vụ và gọi Prisma.
- **Prisma:** truy cập PostgreSQL.
- **Migration:** quản lý thay đổi cấu trúc database.

---

# Task Model

| Trường | Mô tả |
|---|---|
| `id` | Khóa chính, tự sinh |
| `title` | Bắt buộc, tối đa 100 ký tự, không được toàn khoảng trắng |
| `description` | Không bắt buộc |
| `status` | `TODO`, `IN_PROGRESS`, `DONE`; mặc định `TODO` |
| `dueDate` | Ngày hết hạn, không bắt buộc |
| `createdAt` | Tự sinh khi tạo |
| `updatedAt` | Tự cập nhật khi chỉnh sửa |

---

# Chạy nhanh project

Sau khi clone project:

```bash
docker compose up -d db

cd backend

npm install

npx prisma migrate dev

npx prisma generate

npx prisma db seed

npm run start:dev
```

Sau đó test API:

```text
http://localhost:3001/tasks
```

---

# Trạng thái hiện tại

## Ngày 1

- [x] NestJS backend
- [x] PostgreSQL Docker
- [x] Prisma ORM
- [x] Migration
- [x] Seed dữ liệu mẫu
- [x] `POST /tasks`
- [x] `GET /tasks`
- [x] Validation dữ liệu
- [x] Docker volume lưu dữ liệu PostgreSQL

## Ngày 2

Sẽ bổ sung:

- [ ] `GET /tasks/:id`
- [ ] `PATCH /tasks/:id`
- [ ] `DELETE /tasks/:id`
- [ ] `GET /tasks?status=DONE`
- [ ] Next.js giao diện `/tasks`
