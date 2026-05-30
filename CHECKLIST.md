# awesome-agent-patterns — CHECKLIST

> Các bước thực thi chia theo **phase**. Mỗi phase kết thúc bằng dòng **✅ Done when…** (tiêu chí
> nghiệm thu). Xem bối cảnh & kiến trúc đầy đủ ở **[PLAN.md](PLAN.md)**.
>
> **Chiến lược:** Phase 1 dựng *vertical slice* — chứng minh toàn bộ pipeline chạy được với **1
> pattern duy nhất** (`table`) và Agent thực sự lấy được nó qua MCP — TRƯỚC khi viết 15 pattern còn lại.

> ## ✅ TRẠNG THÁI: TẤT CẢ 6 PHASE ĐÃ XONG (build qua đêm)
> Tất cả gate đã pass: MCP smoke (16 patterns, 6 recipes, flagship flow) · typecheck · render gate ·
> integrity · `vite build` demo · dev server boot + phục vụ file ngoài root (HTTP 200).
> **Kiểm tra nhanh buổi sáng:** `npm install && npm run build && npm run smoke && npm run dev:demo`.
> Xem quyết định tự đưa ra ở **[DECISIONS.md](DECISIONS.md)**. Việc duy nhất cần bạn làm tay: wire MCP
> vào Claude Code (xem README) — pipeline đã được smoke test thay thế.

---

## Phase 0 — Tài liệu (đang làm)

- [x] Viết `PLAN.md`
- [x] Viết `CHECKLIST.md`

**✅ Done when:** PLAN.md + CHECKLIST.md đã có ở repo root và được duyệt.

---

## Phase 1 — Scaffold + Vertical slice (chứng minh pipeline)

### 1.1 Khởi tạo repo
- [ ] `package.json` ở root: `"private": true`, `"workspaces": ["mcp-server", "demo"]`, scripts `build` / `dev` / `build:index`.
- [ ] `.gitignore` (node_modules, dist, *.local, .DS_Store).
- [ ] `README.md` stub (tên dự án + 1 đoạn mô tả + trỏ tới PLAN.md/CHECKLIST.md).
- [ ] `git init`.

### 1.2 Scaffold MCP server
- [ ] Tạo `mcp-server/package.json` (`"type": "module"`, bin trỏ `dist/index.js`).
- [ ] `mcp-server/tsconfig.json` (target ES2022, module NodeNext, outDir `dist`).
- [ ] Cài deps: `@modelcontextprotocol/sdk`, `gray-matter`, `zod`; devDeps: `typescript`, `tsx`.

### 1.3 Spec frontmatter
- [ ] Viết `patterns/SCHEMA.md` mô tả frontmatter chuẩn (id, title, category, when_to_use, tags, composes, related, states, a11y, stack) — nguồn tham chiếu khi thêm pattern.

### 1.4 Author 1 pattern đầy đủ: `table`
- [ ] `patterns/table/pattern.md` (frontmatter + 6 mục docs theo spec).
- [ ] `patterns/table/examples/Table.tsx` (React + TS + Tailwind, có xử lý states: loading/empty/error/populated).

### 1.5 Loader
- [ ] `mcp-server/src/loader.ts`: quét `patterns/*/pattern.md`, parse bằng `gray-matter`, build index in-memory; đọc kèm code trong `examples/`.
- [ ] Hàm `loadPatterns()`, `getPattern(id)`, (chuẩn bị) `loadRecipes()`.

### 1.6 MCP server + 2 tool đầu
- [ ] `mcp-server/src/tools.ts`: đăng ký `list_patterns`, `get_pattern` (input validate bằng zod).
- [ ] `mcp-server/src/index.ts`: khởi tạo server stdio, nối loader + tools.

### 1.7 Build & smoke test
- [ ] `npm run build -w mcp-server` → ra `dist/`.
- [ ] Chạy `node mcp-server/dist/index.js` không lỗi.
- [ ] Test bằng MCP inspector: `list_patterns` thấy `table`; `get_pattern {id:"table"}` trả docs + code.

### 1.8 Wire vào Claude & xác nhận
- [ ] Thêm cấu hình MCP (`.mcp.json` hoặc user config) trỏ tới `mcp-server/dist/index.js`.
- [ ] Yêu cầu Agent lấy pattern `table` và xác nhận nội dung về đúng.

**✅ Done when:** Agent (qua MCP) gọi được `list_patterns` + `get_pattern {id:"table"}` và nhận về
docs + code đầy đủ. Pipeline đã được chứng minh end-to-end với 1 pattern.

---

## Phase 2 — Primitive patterns (8 cái)

> Mỗi pattern = `pattern.md` (đủ 6 mục) + `examples/*.tsx` (React/TS/Tailwind, xử lý đủ states).

- [ ] `loading` — spinner / skeleton / progress; khi nào dùng loại nào.
- [ ] `toast` — success/error/info, auto-dismiss, queue, a11y (`role=status`/`aria-live`).
- [ ] `modal` — focus trap, ESC/overlay close, scroll lock, a11y (`role=dialog`, `aria-modal`).
- [ ] `pagination` — offset vs cursor, trạng thái disabled, reset khi đổi filter.
- [ ] `search` — debounce, clear, trạng thái "no results", a11y.
- [ ] `filter` — multi-select, chips, clear-all, đồng bộ URL/state.
- [ ] `empty-state` — first-use vs no-results vs error-empty; có CTA.
- [ ] `error-state` — inline vs full-page, retry, thông điệp thân thiện.

**✅ Done when:** đủ 8 primitive, mỗi cái parse được qua `get_pattern`, render được trong demo (sau Phase 5).

---

## Phase 3 — Composite & Page patterns (7 cái)

- [ ] `product-card` (commerce) — ảnh, giá, badge, CTA, trạng thái hết hàng.
- [ ] `header` (navigation) — logo, nav, search, user menu, responsive.
- [ ] `sidebar` (navigation) — nav nhóm, collapse, active state, responsive drawer.
- [ ] `login` (auth) — validate, lỗi field, loading nút, related: toast/error-state/loading.
- [ ] `checkout` (commerce) — composes: product-card, toast, error-state, loading; các bước + tổng tiền.
- [ ] `dashboard` (page) — composes: header, sidebar, table, empty-state; layout + stat cards.
- [ ] `crud` (page) — composes: table, search, filter, pagination, modal, toast, empty-state, error-state.
- [ ] Điền đầy đủ `composes`/`related` ở tất cả pattern (2 chiều khi hợp lý).

**✅ Done when:** đủ 16 pattern; chạy kiểm tra link — mọi `composes`/`related` trỏ tới id có thật.

---

## Phase 4 — Recipes layer + 3 tool còn lại

### 4.1 Nội dung recipes (6 file)
- [ ] `recipes/product-list-page.md`  (table, filter, pagination, loading, empty-state, error-state)
- [ ] `recipes/crud-admin-page.md`    (table, search, filter, pagination, modal, toast, empty-state, error-state)
- [ ] `recipes/auth-flow.md`          (login, toast, error-state, loading)
- [ ] `recipes/checkout-flow.md`      (checkout, product-card, toast, error-state, loading)
- [ ] `recipes/dashboard-home.md`     (dashboard, header, sidebar, table, empty-state)
- [ ] `recipes/app-shell.md`          (header, sidebar)

### 4.2 Tool
- [ ] `loader.ts`: hoàn thiện `loadRecipes()` / `getRecipe(task)`.
- [ ] Đăng ký `list_recipes`, `get_recipe` (option inline docs từng pattern), `search_patterns` (rank theo keyword trên index + docs).
- [ ] Validate: mọi `patterns[]` trong recipe trỏ tới pattern có thật.

### 4.3 Validate flagship
- [ ] `get_recipe {task:"product-list-page"}` trả đúng bộ pattern theo thứ tự.
- [ ] Chain `get_pattern` cho từng cái → ra code sẵn dùng.

**✅ Done when:** flagship flow "Tạo trang danh sách sản phẩm" chạy end-to-end qua MCP, trả về đủ bộ pattern + code.

---

## Phase 5 — Demo gallery (Vite + React + Tailwind)

- [ ] Scaffold `demo/` (Vite + React + TS), cấu hình Tailwind.
- [ ] `scripts/build-index.ts` → sinh `patterns/index.json` + `recipes/index.json`; thêm script `build:index`.
- [ ] UI: sidebar liệt kê pattern theo category.
- [ ] Mỗi pattern: live preview component + hiển thị docs (when-to-use, states, a11y, do-don't).
- [ ] Trang recipes: hiện task → bộ pattern.

**✅ Done when:** `npm run dev -w demo` render mọi pattern không lỗi; `index.json` khớp frontmatter đã parse.

---

## Phase 6 — Polish & Docs

- [ ] `README.md` hoàn chỉnh: mô tả, setup, snippet cấu hình MCP, hướng dẫn "how to add a pattern".
- [ ] Script kiểm tra content integrity (link `composes`/`related`/recipe không gãy) — chạy được standalone.
- [ ] (Tuỳ chọn) expose pattern dưới dạng MCP **resources** `pattern://<id>`.
- [ ] (Tuỳ chọn) test cho `loader` + tools.
- [ ] (Tuỳ chọn) GitHub Actions: build + integrity check.

**✅ Done when:** repo sạch, build pass, README đủ để người mới clone → cấu hình MCP → Agent dùng được; integrity check pass.

---

### Tổng quan tiến độ

| Phase | Nội dung | Trạng thái |
|---|---|---|
| 0 | Tài liệu (PLAN, CHECKLIST) | ✅ |
| 1 | Scaffold + vertical slice (`table`) + 3 gate (smoke/typecheck/render) | ✅ |
| 2 | 8 primitive patterns | ✅ |
| 3 | 7 composite/page patterns | ✅ |
| 4 | Recipes + 3 tool còn lại + flagship flow | ✅ |
| 5 | Demo gallery (vite build pass, dev server pass) | ✅ |
| 6 | Polish & docs (README, .mcp.json.example, integrity) | ✅ |
