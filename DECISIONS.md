# DECISIONS — autonomous build log

> Các quyết định tôi tự đưa ra trong lúc build qua đêm (Phase 1→6), để bạn review buổi sáng.
> Mỗi mục: **quyết định** + *lý do* + (cách đổi nếu bạn không thích).

## Stack & tooling
- **Tailwind CSS v3** (không phải v4) cho demo. *Lý do:* config ổn định, tài liệu nhiều, ít rủi ro qua đêm. Đổi sang v4: cập nhật `demo` deps + `postcss`/`@tailwindcss/postcss`.
- **MCP SDK `@modelcontextprotocol/sdk` ^1.12**, dùng API cấp cao `McpServer.registerTool` + `StdioServerTransport`. *Lý do:* gọn, đúng chuẩn hiện tại.
- **zod ^3.23** để validate input tool. **gray-matter** để parse frontmatter. **tsx** để chạy script TS.
- **Node 18** (máy bạn). tsconfig server dùng `module: NodeNext`.
- Thêm **`@types/node`** vào `mcp-server` (build TS cần). Lần đầu `npm i -w` lỗi npm bug "Cannot set properties of null (setting 'peer')" → đã xoá `node_modules`+`package-lock.json` và `npm install` lại sạch.

## Kiến trúc nội dung
- **Mỗi example `.tsx` là component self-contained, default export, không cần props**, dùng sample data inline, render được độc lập trong demo. *Lý do:* demo tự động import mọi example qua `import.meta.glob`; nếu cần props/context thì không render được.
- **Example KHÔNG import chéo giữa các pattern.** Composite (crud, dashboard, checkout) tự re-implement bản tối giản inline; quan hệ ghép nối thể hiện qua `composes`/`related` trong frontmatter + link `[[id]]` trong docs. *Lý do:* mỗi file build độc lập, demo không gãy dây chuyền khi 1 file lỗi.
- **Component có state switcher** (populated/loading/empty/error...) ở các pattern có nhiều state, để demo show trực quan mọi trạng thái.
- **Index 2 tầng:** `list_*` trả meta gọn; `get_*` trả full. Server parse frontmatter lúc startup (cache in-memory) — không có index thủ công để lệch.

## MCP tool surface (đã chốt)
`list_patterns`, `get_pattern{id}`, `search_patterns{query}`, `list_recipes`, `get_recipe{task, inline_patterns?}`.
- `get_recipe` có cờ `inline_patterns` để nhét luôn docs+code của từng pattern (tiện cho agent lấy 1 phát).

## Cross-link graph (frontmatter composes/related) — nguồn chân lý để integrity check pass
- loading → related: table, error-state, empty-state
- toast → related: modal, error-state, crud
- modal → related: toast, crud, login
- empty-state → related: table, search, filter, error-state
- error-state → related: loading, empty-state, toast
- pagination → related: table, filter, search
- table → related: pagination, filter, search, empty-state, error-state, loading
- search → related: filter, table, empty-state
- filter → related: search, table, pagination, empty-state
- product-card → related: checkout, table, empty-state
- checkout → composes: product-card, toast, error-state, loading ; related: login
- login → related: toast, error-state, loading, modal
- header → related: sidebar, search
- sidebar → related: header, dashboard
- dashboard → composes: header, sidebar, table, empty-state ; related: filter
- crud → composes: table, search, filter, pagination, modal, toast, empty-state, error-state ; related: loading

## Verification (tự động, không cần Claude live)
- `npm run build -w mcp-server` + `npm run smoke` → roundtrip MCP client↔server thật (đã pass Phase 1 với 1 pattern).
- `tsconfig.patterns.json` + `tsc --noEmit` → typecheck mọi example `.tsx`.
- `npm run build:demo` → vite build compile toàn bộ example (gate cuối).
- `npm run check:integrity` → không có link gãy.

## Demo gallery (Phase 5)
- **Auto-discovery bằng `import.meta.glob`** — demo tự nạp mọi `patterns/*/examples/*.tsx` (component + source raw) và `pattern.md` (raw), không hard-code 16 import. Thêm pattern mới là demo tự hiện.
- **Tài liệu hiển thị dạng preformatted text** (không render markdown) để khỏi thêm dependency markdown. Có 3 tab: Preview / Code / Docs.
- **Vite `server.fs.allow = [repoRoot]`** để dev server đọc được `patterns/` & `recipes/` nằm ngoài thư mục `demo/`. Đã test thật: dev server boot 736ms, phục vụ file qua `@fs` HTTP 200.
- **Demo metadata đọc từ `patterns/index.json` + `recipes/index.json`** (sinh bởi `build-index`, chạy tự động ở `predev`/`prebuild`).

## Kết quả verification cuối (đã chạy, đều PASS)
- `npm run build -w mcp-server` → OK (tsc sạch).
- `npm run smoke` → 16 patterns, 6 recipes, flagship `product-list-page` flow verified.
- `npm run check:types` (tsconfig.patterns.json) → 16 example .tsx typecheck sạch.
- `npm run check:render` → 16/16 example render OK trong Node (đúng demo contract).
- `npm run check:integrity` → no dangling references, frontmatter đầy đủ.
- `npm run build -w demo` (vite build) → 81 modules transformed, CSS 25KB — toàn bộ example compile qua Rollup.
- Dev server (`npm run dev:demo`) → boot sạch, phục vụ root + file ngoài root (HTTP 200).

## Bổ sung: 5 style variant cho mỗi pattern (theo yêu cầu sau khi xem demo)
- Mỗi pattern giờ có **5 biến thể**: `standard` (file gốc, vd `Table.tsx`) + 4 file độc lạ: `brutalism.tsx`, `glass.tsx`, `neon.tsx`, `neumorphism.tsx` → tổng **80 component**.
- **Spec ở [patterns/STYLES.md](patterns/STYLES.md)** — token class (border/shadow/bg/text) cố định cho từng style để 16 pattern *nhất quán trong cùng một style* (1 nút Glass trông giống nhau ở mọi pattern). Đây là "neo" giữ nhất quán.
- **KHÔNG đổi tên file standard** (tránh sửa 16 reference trong pattern.md). Demo phân loại biến thể theo tên file: `brutalism/glass/neon/neumorphism.tsx` → biến thể tương ứng; file khác → `standard`.
- **Creative = re-skin của standard** (giữ nguyên logic/state/a11y, chỉ đổi class). Biến thể nhiều-state (loading, empty-state, error-state, table) giữ switcher; dashboard rút gọn về view populated để gọn.
- **Mỗi creative tự bọc background riêng** (gradient/đen/slate-200) vì demo card nền trắng — nếu không glass/neon/neumorphism sẽ "chìm".
- Demo có **bộ chọn Variant** (pill fuchsia) ở mỗi pattern; tab Preview/Code đổi theo biến thể đang chọn.
- Subagent fix vài chỗ a11y khi re-skin: neumorphism đơn sắc nên thêm `focus-visible:ring` thay cho `focus:outline-none`, lỗi (validation/error) vẫn dùng đỏ để đọc được. Đã đọc tay xác nhận chất lượng `product-card/brutalism` (khớp spec, giữ 4 state + a11y).
- Gate sau khi thêm: typecheck **80** file OK · render gate **80/80** OK · `vite build` OK (JS ~1MB, chỉ là cảnh báo chunk-size) · MCP smoke OK.

## Release + CI/CD (sau khi push GitHub)
- **MCP server đóng gói self-contained để publish npm:** thêm `mcp-server/scripts/bundle-content.mjs` (chạy ở `prepack`) copy `patterns/`+`recipes/` vào `mcp-server/content/`. Loader resolve theo thứ tự: env override → repo `../../patterns` (dev) → `../content/patterns` (đã publish). Đã verify: tarball `npm pack` gồm dist + content (16 pattern.md, 80 .tsx, 6 recipe) — 109 files, 121 kB.
- **Tên package npm:** `awesome-agent-patterns-mcp` (unscoped, để `npx awesome-agent-patterns-mcp` chạy thẳng). *Nếu tên đã bị chiếm* → đổi sang scoped `@<npm-username>/awesome-agent-patterns-mcp` + `publishConfig.access=public`.
- **3 workflow** (`.github/workflows/`): `ci.yml` (gate mỗi push/PR), `pages.yml` (deploy demo lên Pages khi push `main`, base `/awesome-agent-patterns/`), `release.yml` (tag `v*` → npm publish + GitHub Release `--generate-notes`).
- `mcp-server/package.json` bỏ `private`, thêm metadata (license/repo/keywords/files/bin/engines). `mcp-server/content/` đã thêm vào `.gitignore` (artifact, sinh lúc pack).
- Demo build cho Pages dùng `--base=/awesome-agent-patterns/` (Pages phục vụ ở `/<repo>/`).

## Việc CẦN BẠN làm tay (không tự làm qua đêm được)
- **Bật npm publish:** tạo npm **Automation token** → thêm secret **`NPM_TOKEN`** vào repo (Settings → Secrets and variables → Actions). Thiếu token thì job release sẽ fail ở bước publish.
- **Bật GitHub Pages:** Settings → Pages → Source = **GitHub Actions** (lần đầu). Push `main` xong demo sẽ lên `https://xshiroenguyenx.github.io/awesome-agent-patterns/`.
- **Cắt release:** `git tag v0.1.0 && git push origin v0.1.0` → tự publish npm + tạo GitHub Release.
- **(nếu tên npm bị trùng)** đổi `name` trong `mcp-server/package.json` sang scoped như trên.
- **Wire MCP vào Claude Code** rồi hỏi agent thử (xem README + `.mcp.json.example`). Tôi đã chứng minh pipeline bằng smoke test thay cho bước này.
- **Xem demo bằng mắt + thử tương tác:** `npm run dev:demo` → mở http://localhost:5173 (hoặc port hiện trong terminal) để duyệt 16 pattern.
  - ⚠️ **Giới hạn của các gate:** chúng đều là gate *cấu trúc* — typecheck (compile sạch), render gate chỉ chứng minh component **mount lần đầu không throw** (`renderToStaticMarkup` KHÔNG chạy `useEffect`/timer/event handler), vite build (bundle sạch), integrity (link không gãy), smoke (MCP roundtrip). **Hành vi tương tác KHÔNG được tự động kiểm tra**: toast auto-dismiss, modal ESC/restore-focus, search debounce, login submit, CRUD add/edit/delete — nên click thử trong demo để xác nhận.
  - Tôi đã đọc tay & xác nhận chất lượng: `table`, `crud`, `modal` (code khớp docs, a11y thật, interactivity hợp lý). 13 pattern còn lại do subagent viết theo cùng template, đã qua typecheck + render gate; nên liếc nhanh phần nhìn.
- **`git init` + commit** nếu muốn (repo chưa init git).
