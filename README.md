# Task Management

Ứng dụng quản lý công việc gồm giao diện **Next.js**, API **NestJS**, **PostgreSQL** và **Prisma ORM**. Docker Compose chạy ba service `web`, `api` và `db`.

## Chức năng

- Xem danh sách công việc, mới nhất trước; lọc theo trạng thái và tìm theo từ khóa.
- Tạo, xem, sửa và xóa công việc.
- Trạng thái: `TODO`, `IN_PROGRESS`, `DONE`.
- Backend kiểm tra dữ liệu đầu vào và trả lỗi phù hợp.

Một công việc có `id`, `title`, `description`, `status`, `dueDate`, `createdAt` và `updatedAt`. Tiêu đề bắt buộc, tối đa 100 ký tự và không được chỉ chứa khoảng trắng.

## Phần mềm cần cài

- Git.
- Docker Desktop có Docker Compose. Đây là cách chạy toàn hệ thống được khuyến nghị.
- Node.js 22 và npm nếu muốn chạy web/API trực tiếp để phát triển.

## Lấy mã nguồn

```bash
git clone <repository-url>
cd task-management
git switch feat/task-manager
```

## Chạy toàn hệ thống bằng Docker Compose

Từ thư mục gốc, build và chạy ba service:

```bash
docker compose up --build -d
```

Áp dụng migration đã có và tạo dữ liệu mẫu:

```bash
docker compose exec api npx prisma migrate deploy
docker compose exec api npx prisma db seed
```

Seed hiện xóa các công việc đang có trước khi tạo 5 công việc mẫu. Chỉ chạy seed khi muốn nạp lại dữ liệu mẫu.

Truy cập:

- Web: <http://localhost:3000/tasks>
- API: <http://localhost:3001/tasks>

Compose tạo volume `postgres_data` để lưu dữ liệu PostgreSQL. URL kết nối từ API container dùng hostname `db`.

## Chạy web và API trực tiếp

Nếu chạy ứng dụng ngoài Docker, PostgreSQL vẫn có thể chạy bằng Compose. Từ thư mục gốc:

```powershell
Copy-Item backend/.env.example backend/.env
docker compose up -d db
```

Trên Bash, dùng `cp backend/.env.example backend/.env` thay cho `Copy-Item`.

Cài dependency, sinh Prisma Client, áp dụng migration, nạp dữ liệu mẫu và chạy API:

```bash
cd backend
npm ci
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

Trong một terminal khác, tạo `web/.env.local` với nội dung sau rồi chạy Next.js:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

```bash
cd web
npm ci
npm run dev
```

Mở <http://localhost:3000/tasks>. `NEXT_PUBLIC_API_URL` là URL mà trình duyệt dùng để gọi API. File `.env.local` không được commit.

## Database, Prisma và migration

Project dùng **Prisma ORM** làm công cụ truy cập PostgreSQL. Cấu trúc dữ liệu được khai báo trong `backend/prisma/schema.prisma`; migration khởi tạo nằm trong `backend/prisma/migrations/`.

**Migration** là thay đổi database được ghi lại thành các file SQL có phiên bản. Migration đầu tiên tạo enum trạng thái và bảng `Task`, gồm khóa chính, giới hạn độ dài tiêu đề và các giá trị mặc định. Khi áp dụng migration, Prisma cập nhật cấu trúc PostgreSQL theo lịch sử migration trong repository. Migration không chứa dữ liệu công việc; các dòng công việc được lưu trong bảng `Task` của PostgreSQL.

- Dùng `npx prisma migrate dev` khi phát triển cục bộ; lệnh này áp dụng migration và hỗ trợ tạo migration mới khi schema thay đổi.
- Dùng `npx prisma migrate deploy` để áp dụng các migration đã có trong Docker.
- Dùng `npx prisma db seed` để chạy `backend/prisma/seed.ts` và thêm dữ liệu mẫu.

Khi chạy bằng Compose, PostgreSQL lưu dữ liệu trong volume Docker `postgres_data`, được gắn vào `/var/lib/postgresql/data` bên trong container. Dừng hoặc tạo lại container không xóa volume. `docker compose down -v` sẽ xóa volume và toàn bộ dữ liệu PostgreSQL.

## API

Base URL khi chạy theo hướng dẫn là `http://localhost:3001`.

| Method | Đường dẫn | Chức năng |
|---|---|---|
| `POST` | `/tasks` | Tạo công việc |
| `GET` | `/tasks` | Lấy danh sách mới nhất trước |
| `GET` | `/tasks/:id` | Xem một công việc |
| `PATCH` | `/tasks/:id` | Cập nhật các trường được gửi lên |
| `DELETE` | `/tasks/:id` | Xóa công việc |
| `GET` | `/tasks?status=DONE` | Lọc theo `TODO`, `IN_PROGRESS` hoặc `DONE` |

Ví dụ sau dùng `curl.exe` trong Windows PowerShell; trên Bash thay `curl.exe` bằng `curl`.

Tạo công việc:

```powershell
curl.exe -X POST http://localhost:3001/tasks -H "Content-Type: application/json" -d '{"title":"Chuẩn bị demo","description":"Kiểm tra luồng tạo task","status":"TODO"}'
```

Lấy danh sách và lọc theo trạng thái:

```powershell
curl.exe http://localhost:3001/tasks
curl.exe "http://localhost:3001/tasks?status=DONE"
```

Xem, sửa và xóa công việc có ID `1`:

```powershell
curl.exe http://localhost:3001/tasks/1
curl.exe -X PATCH http://localhost:3001/tasks/1 -H "Content-Type: application/json" -d '{"status":"DONE"}'
curl.exe -X DELETE http://localhost:3001/tasks/1
```

ID hợp lệ nhưng không tồn tại trả `404`. Dữ liệu sai hoặc ID không đúng định dạng trả `400` với thông báo lỗi.

## Các phần trong backend làm gì?

- **Controller** (`backend/src/tasks/tasks.controller.ts`) nhận request HTTP và ánh xạ method/path vào thao tác tương ứng. Nó lấy dữ liệu từ body, query hoặc URL parameter, sau đó gọi service. Controller không trực tiếp viết truy vấn database.
- **DTO** (`backend/src/tasks/dto/`) mô tả dữ liệu đầu vào. `ValidationPipe` trong `main.ts` kiểm tra DTO trước khi controller gọi service.
- **Service** (`backend/src/tasks/tasks.service.ts`) điều phối các thao tác task. Service gọi các hàm truy cập dữ liệu trong `backend/src/tasks/api/` và chuyển kết quả về controller.
- **PrismaService** (`backend/src/prisma/prisma.service.ts`) khởi tạo Prisma Client và kết nối PostgreSQL. Các hàm truy cập dữ liệu dùng Prisma Client để đọc hoặc ghi bảng `Task`.

### Khi bấm “Thêm”, dữ liệu đi qua đâu?

1. Người dùng nhập tiêu đề, mô tả, trạng thái và ngày hết hạn trong form `TaskModal`. Trình duyệt kiểm tra cơ bản như trường bắt buộc và giới hạn 100 ký tự để báo lỗi sớm.
2. Khi gửi form, `TaskModal` gọi `handleSubmit` của trang `web/src/app/tasks/page.tsx`.
3. Trang gọi `createTaskApi` ở frontend. Hàm này gửi `POST /tasks` với JSON tới URL `NEXT_PUBLIC_API_URL`.
4. `TasksController.createTask()` nhận JSON qua `@Body()` thành `CreateTaskDto`.
5. `ValidationPipe` kiểm tra dữ liệu: tiêu đề phải là chuỗi sau khi trim, không rỗng, tối đa 100 ký tự; trạng thái phải thuộc enum; ngày hết hạn phải hợp lệ. Nếu sai, NestJS trả `400` và không gọi thao tác ghi dữ liệu.
6. Nếu hợp lệ, controller gọi `TasksService.createTask()`. Service chuyển DTO tới hàm tạo task, hàm này dùng Prisma Client để ghi vào PostgreSQL.
7. Bản ghi được lưu trong bảng `Task`: PostgreSQL tự tăng `id` và đặt các giá trị mặc định của cột; Prisma tự cập nhật `updatedAt`. API trả task mới về web.
8. Frontend tải lại danh sách bằng `GET /tasks`, cập nhật state React và hiển thị công việc vừa tạo.

### Vì sao backend vẫn phải kiểm tra dữ liệu?

Kiểm tra ở frontend giúp người dùng nhận phản hồi nhanh, nhưng không bảo vệ được API: request có thể được gửi trực tiếp bằng curl/Postman, gọi từ một giao diện khác hoặc bị sửa trong trình duyệt. Backend là nơi tiếp nhận dữ liệu trước khi ghi vào database, nên phải tự xác thực để mọi client đều theo cùng quy tắc và tránh lưu dữ liệu sai.

## Kiểm tra dữ liệu còn sau khi restart

Với Docker Compose, sau khi đã áp dụng migration và seed, tạo một task bằng API hoặc giao diện. Restart API rồi đọc lại danh sách:

```powershell
docker compose restart api
curl.exe http://localhost:3001/tasks
```

Task vẫn còn vì dữ liệu được lưu trong PostgreSQL volume, không nằm trong bộ nhớ của tiến trình NestJS. `docker compose down` giữ volume; `docker compose down -v` xóa volume.

## Xem log và dừng hệ thống

```bash
docker compose ps
docker compose logs -f web api db
docker compose down
```

Muốn xóa cả database và dữ liệu đã lưu:

```bash
docker compose down -v
```

## Git và commit

Các phần việc được thực hiện trên nhánh `feat/task-manager`. Khi tiếp tục làm bài, tạo commit theo từng phần việc có ý nghĩa và không commit `.env`, `node_modules` hoặc thư mục build.

## Hạn chế đã biết

- Ứng dụng không có đăng nhập hoặc phân quyền, đúng phạm vi đề bài.
- Script seed xóa task hiện có trước khi thêm 5 task mẫu; không chạy lại seed nếu cần giữ dữ liệu demo.
- Chưa có bộ kiểm thử tự động riêng cho toàn bộ luồng API task; cần kiểm tra thủ công bằng curl và giao diện.
- Khi sửa task trên giao diện, mô tả/ngày hết hạn để trống không xóa giá trị cũ; API PATCH vẫn hỗ trợ cập nhật từng trường được gửi lên.
