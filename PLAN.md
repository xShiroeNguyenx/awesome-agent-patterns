# awesome-agent-patterns — PLAN

> **Knowledge Base UI/UX cho AI Agent, truy cập qua MCP.**
> Thay vì mỗi lần code AI lại "bịa" UI từ đầu, Agent sẽ tham khảo các pattern mẫu đã được
> chuẩn hoá (Loading, Toast, Table, Pagination, ...) thông qua một MCP server.

---

## 1. Vision & Mục tiêu

Mục tiêu: xây một **thư viện pattern UI/UX** mà AI coding agent có thể **đọc/tham khảo qua MCP**.

Khi Agent được yêu cầu *"Tạo trang danh sách sản phẩm"*, nó sẽ tự động:

1. Hỏi MCP server: recipe cho `product-list-page` là gì?
2. Nhận về bộ pattern theo thứ tự: `table → filter → pagination → loading → empty-state → error-state`.
3. Lấy chi tiết từng pattern (docs + code React/TS/Tailwind sẵn dùng).
4. Lắp ráp trang từ các pattern đã được kiểm chứng, thay vì tự nghĩ ra.

**Nguyên tắc cốt lõi:** người tiêu thụ là **Agent, không phải con người**. Do đó thiết kế phải:
- **Rẻ để quét** (index gọn trước, chi tiết tải sau).
- **Có thể ghép nối** (composite trỏ về primitive).
- **Tối ưu cho truy xuất theo nhu cầu** (on-demand retrieval).

---

## 2. Quyết định kiến trúc (đã chốt)

| Hạng mục | Lựa chọn |
|---|---|
| Stack của pattern | **React + TypeScript + Tailwind CSS** |
| MCP server | **TypeScript / Node.js** (`@modelcontextprotocol/sdk`) |
| Format | **Rich docs** (when-to-use / states / a11y / do-don't / code) **+ Recipes + Demo gallery** |
| Cấu trúc dự án | **npm workspaces monorepo** |
| Single source of truth | **frontmatter trong `pattern.md`** (server parse bằng `gray-matter`) |

---

## 3. Danh sách 16 Pattern + Phân loại (category)

| # | Pattern | id | Category |
|---|---|---|---|
| 1 | Loading | `loading` | feedback |
| 2 | Toast | `toast` | feedback |
| 3 | Modal | `modal` | feedback |
| 4 | Empty State | `empty-state` | feedback |
| 5 | Error State | `error-state` | feedback |
| 6 | Pagination | `pagination` | data-display |
| 7 | Table | `table` | data-display |
| 8 | Search | `search` | data-display |
| 9 | Filter | `filter` | data-display |
| 10 | Product Card | `product-card` | commerce |
| 11 | Checkout | `checkout` | commerce |
| 12 | Login | `login` | auth |
| 13 | Header | `header` | navigation |
| 14 | Sidebar | `sidebar` | navigation |
| 15 | Dashboard | `dashboard` | page |
| 16 | CRUD | `crud` | page |

**Category chuẩn:** `primitive | feedback | data-display | navigation | page | auth | commerce`.

**Phân tầng primitive ↔ composite (cơ chế `composes`/`related`):**
- *Primitive/đơn lẻ:* loading, toast, modal, pagination, search, filter, empty-state, error-state, product-card, header, sidebar.
- *Composite/page (ghép từ primitive):*
  - `table` → related: pagination, filter, empty-state, loading, error-state
  - `crud` → composes: table, modal, toast, pagination, empty-state, error-state, search
  - `dashboard` → composes: header, sidebar, table, empty-state
  - `checkout` → composes: product-card, toast, error-state, loading
  - `login` → related: toast, error-state, loading

---

## 4. Cấu trúc thư mục (repo layout)

```
awesome-agent-patterns/
├── README.md                    # setup, MCP config, "how to add a pattern"
├── PLAN.md                      # tài liệu này
├── CHECKLIST.md                 # các phase + bước chi tiết (checkbox)
├── package.json                 # workspaces: ["mcp-server","demo"]
├── .gitignore
├── patterns/                    # NỘI DUNG knowledge base (shared, không phải package)
│   ├── table/
│   │   ├── pattern.md           # frontmatter + rich docs
│   │   └── examples/Table.tsx   # code React + TS + Tailwind
│   ├── loading/ … (đủ 16, cùng cấu trúc)
│   └── index.json               # ARTIFACT sinh ra tự động (cho demo/người đọc)
├── recipes/
│   ├── product-list-page.md     # task → bộ pattern theo thứ tự + ghi chú lắp ráp
│   ├── crud-admin-page.md
│   ├── auth-flow.md
│   ├── checkout-flow.md
│   ├── dashboard-home.md
│   ├── app-shell.md
│   └── index.json               # ARTIFACT sinh ra tự động
├── mcp-server/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts             # entry MCP server (stdio)
│       ├── loader.ts            # quét + parse patterns/recipes (gray-matter)
│       └── tools.ts             # đăng ký tool + zod schema
├── scripts/
│   └── build-index.ts           # sinh patterns/index.json + recipes/index.json
└── demo/                        # Vite + React + Tailwind — gallery xem pattern
    ├── package.json
    ├── vite.config.ts
    └── src/                     # sidebar theo category, live preview + docs
```

---

## 5. Định dạng file Pattern — `patterns/<id>/pattern.md`

```markdown
---
id: table
title: Data Table
category: data-display
when_to_use: Display many structured rows with sorting, selection and row actions.
tags: [table, data, grid, sorting, selection]
composes: []                    # primitive mà pattern này dùng để lắp (rỗng nếu là primitive)
related: [pagination, filter, empty-state, loading, error-state]
states: [loading, empty, error, populated]
a11y: [role=table, keyboard-nav, aria-sort, focus-visible]
stack: react-ts-tailwind
---

## When to use / when NOT to use
## States to handle (loading / empty / error / populated)
## UX guidance — Do & Don't
## Accessibility checklist
## Code (React + TS + Tailwind)   → trỏ tới examples/Table.tsx
## Anti-patterns / common mistakes
```

**Quy ước nội dung (guidance trước, code sau):** mỗi pattern phải mở đầu bằng phần hướng dẫn
framework-agnostic (states cần xử lý, a11y, quyết định UX), rồi mới tới code. Điều này giúp pattern
sống sót nếu sau này đổi stack.

---

## 6. Định dạng file Recipe — `recipes/<task>.md`

```markdown
---
task: product-list-page
title: Product list / catalog page
patterns: [table, filter, pagination, loading, empty-state, error-state]   # theo thứ tự
tags: [list, catalog, ecommerce, admin]
---

## Goal
## Pattern composition (vì sao chọn các pattern này, theo thứ tự nào, ghép với nhau ra sao)
## Data/state flow notes
## Edge cases dễ quên (empty results, slow fetch, failed fetch, reset page khi đổi filter)
```

**6 recipe khởi đầu:**

| task | Bộ pattern (theo thứ tự) |
|---|---|
| `product-list-page` | table, filter, pagination, loading, empty-state, error-state |
| `crud-admin-page` | table, search, filter, pagination, modal, toast, empty-state, error-state |
| `auth-flow` | login, toast, error-state, loading |
| `checkout-flow` | checkout, product-card, toast, error-state, loading |
| `dashboard-home` | dashboard, header, sidebar, table, empty-state |
| `app-shell` | header, sidebar |

---

## 7. MCP Tool surface (`mcp-server/src/tools.ts`)

| Tool | Input | Trả về |
|---|---|---|
| `list_patterns` | — | index: id, title, category, when_to_use, tags |
| `get_pattern` | `{ id }` | toàn bộ `pattern.md` + code example được inline |
| `search_patterns` | `{ query }` | kết quả xếp hạng theo keyword (index + docs) |
| `list_recipes` | — | task, title, patterns[], tags |
| `get_recipe` | `{ task }` | recipe md + bộ pattern theo thứ tự (tuỳ chọn inline docs từng pattern) |

*(Tuỳ chọn về sau: expose pattern dưới dạng MCP **resources** `pattern://<id>`.)*

**Cơ chế index 2 tầng:** `list_patterns`/`list_recipes` trả về dữ liệu **gọn** để Agent quét trước
(tốn ít token); `get_pattern`/`get_recipe` mới trả **chi tiết đầy đủ** khi cần.

---

## 8. Flagship flow cần validate

```
Agent nhận: "Tạo trang danh sách sản phẩm"
   → get_recipe("product-list-page")
   → nhận [table, filter, pagination, loading, empty-state, error-state]
   → get_pattern() cho từng cái
   → lắp trang từ pattern đã kiểm chứng (không tự bịa)
```

Đây là tính năng giá trị nhất — và là lý do tồn tại của lớp **recipes**: keyword search đơn thuần
không đủ tin cậy để map "product list page" → đúng 5 pattern, còn recipe (task → pattern-set) thì có.

---

## 9. Tech stack & Dependencies

- **mcp-server:** `@modelcontextprotocol/sdk`, `gray-matter` (parse frontmatter), `zod` (validate input tool), `typescript`, `tsx`/`tsup` (build).
- **demo:** `vite`, `react`, `react-dom`, `tailwindcss`, `@vitejs/plugin-react`, `typescript`.
- **root:** npm workspaces; script `build`, `dev`, `build:index`.
- **Node:** >= 18.

---

## 10. Cách Agent tiêu thụ (kết nối MCP)

Thêm vào cấu hình MCP của Claude Code (ví dụ `.mcp.json` ở project hoặc user config):

```jsonc
{
  "mcpServers": {
    "awesome-agent-patterns": {
      "command": "node",
      "args": ["<đường-dẫn>/awesome-agent-patterns/mcp-server/dist/index.js"]
    }
  }
}
```

Sau khi kết nối, Agent có các tool `list_patterns`, `get_pattern`, `search_patterns`,
`list_recipes`, `get_recipe`.

---

## 11. Cách mở rộng (thêm 1 pattern mới)

1. Tạo `patterns/<id>/pattern.md` đúng frontmatter spec (mục 5).
2. Thêm code mẫu `patterns/<id>/examples/<Component>.tsx`.
3. Cập nhật `composes`/`related` ở các pattern liên quan (và recipe nếu cần).
4. Chạy `npm run build:index` để cập nhật `index.json`.
5. Server tự nhận pattern mới ở lần khởi động kế tiếp (không cần sửa code server).

---

## 12. Verification (tiêu chí nghiệm thu tổng)

- **Pipeline (cuối Phase 1):** `node mcp-server/dist/index.js` chạy sạch; trong MCP inspector,
  `list_patterns` thấy `table`, `get_pattern {id:"table"}` trả docs + code. Sau khi wire vào Claude
  config, yêu cầu Agent lấy pattern `table` và xác nhận nhận được.
- **Flagship (cuối Phase 4):** `get_recipe {task:"product-list-page"}` trả đúng bộ pattern theo thứ
  tự; chain `get_pattern` cho từng cái ra code React/TS/Tailwind sẵn dùng.
- **Demo (cuối Phase 5):** `npm run dev -w demo` render mọi pattern không lỗi; `index.json` sinh ra
  khớp với frontmatter đã parse.
- **Content integrity:** mọi id trong `composes`/`related`/recipe `patterns` đều trỏ tới pattern có
  thật (không có link gãy).

---

> Chi tiết từng bước thực thi nằm ở **[CHECKLIST.md](CHECKLIST.md)** — chia theo phase, có checkbox
> và dòng *"Done when…"* cho mỗi phase.
