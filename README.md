# FlowCV MCP Server + CLI

MCP (Model Context Protocol) server and CLI tool that gives AI assistants full control over [FlowCV](https://flowcv.com) — the resume builder. 50 MCP tools + a full CLI covering everything from writing content to pixel-level design customization.

Includes **Claude Code skills** plus **GitHub Copilot / VS Code customizations** (`.vscode/mcp.json`, `.github/copilot-instructions.md`, `.github/prompts/`, and `.github/skills/`) so both ecosystems can use the same server and CLI workflow.

## What Can It Do?

**Resume Management** — Create, duplicate, rename, delete, download PDF, translate to 20+ languages

**Content Editing** — Edit every section: profile summary, education, experience, skills, projects, awards, languages, interests, references, and up to 4 custom sections. Add/remove/reorder entries, rename section headings, set icons.

**Design Customization** — Full control over fonts, colors (single/multi/advanced), spacing (font size, line height, margins), page format (A4/Letter), layout (top/left/right details, 1-2 columns), heading styles (box/line/simple), entry layout, skill/language display modes (grid/level/text), accent color targeting, footer options, list styles, link icons.

**Cover Letters** — Full CRUD + body editing, recipient, date, personal details, design, download PDF.

**Job Tracker** — Kanban boards with columns and cards for tracking applications.

**AI Features** — AI-generated resumes, skill suggestions, grammar check (uses FlowCV AI credits).

**Publishing** — Publish resumes as web pages, toggle download buttons, share as templates.

**Images** — Search Unsplash and apply background images for creative templates.

## About Authentication (Cookie-Based)

FlowCV does not offer a public API or OAuth/API-key authentication. The only known way to interact with FlowCV programmatically is through the session cookie (`flowcvsidapp`) that the FlowCV web app sets when you log in.

This project uses that session cookie for authentication. If there were a better way (API keys, OAuth, etc.), we would use it — but as of now, this is the only option.

### How the CLI handles it

The `flowcv login` command launches Chrome, navigates to the FlowCV login page, and waits for you to log in. Once logged in, it automatically extracts the `flowcvsidapp` cookie via Chrome DevTools Protocol (CDP) and stores it securely at `~/.config/flowcv/config.json` (with `0600` file permissions).

If Chrome is not available, it falls back to manual paste mode where you copy the cookie from browser DevTools yourself.

### Security notes

- The cookie is stored with restricted file permissions (`0600` — owner read/write only)
- The config directory is created with `0700` permissions
- Cookies expire periodically and need to be refreshed (just run `flowcv login` again)
- The repository ships a cookie-free `.vscode/mcp.json` for VS Code / GitHub Copilot workspace setup
- The legacy `.mcp.json` file (which may contain the cookie for MCP server usage) is in `.gitignore`

## Install the CLI

One-liner — clones, builds, and links the `flowcv` command globally:

```bash
curl -fsSL https://raw.githubusercontent.com/amirwebd3v/Flowcv-mcp/master/install.sh | bash
```

Then authenticate:

```bash
flowcv login    # Opens Chrome, extracts cookie automatically
```

**GitHub Copilot / VS Code**

- Open this repository in VS Code to load the workspace instructions from `.github/copilot-instructions.md`
- Use the reusable slash prompts in `.github/prompts/`
- Use the native Copilot slash skills in `.github/skills/flowcv` and `.github/skills/flowcv-cli` for FlowCV MCP and CLI workflows
- After building, VS Code can start the local MCP server from `.vscode/mcp.json`

**Or let Claude Code do it** — paste this into Claude Code:

```
Install the FlowCV CLI: clone https://github.com/amirwebd3v/Flowcv-mcp, run ./setup.sh to
build and link the CLI, then run "flowcv login" to authenticate me.
```

### CLI Usage

```bash
flowcv resume list                    # List all resumes
flowcv resume list --json             # JSON output for scripting
flowcv resume create --title "My CV"  # Create new resume
flowcv resume download <id>           # Download PDF

flowcv entry add <id> skill --data '{"skill":"TypeScript","level":"5"}'
flowcv design set <id> font.fontFamily "Inter"
flowcv design set <id> colors.basic.single "#2563eb"

flowcv letter list                    # List cover letters
flowcv ai fill "Senior React developer with 5 years experience"
```

If you are tailoring one resume at a time on FlowCV's free plan, prefer updating the existing resume in place:

- Save a local JSON snapshot first with `flowcv resume get <id>`
- Update content on the same resume ID instead of duplicating
- Hide irrelevant entries or sections instead of keeping a second live copy
- Use `flowcv resume duplicate` only when you intentionally want another live resume

See [CLI_MANUAL.md](CLI_MANUAL.md) for the full command reference.

## Install the MCP Server

One-liner — installs CLI + MCP server + Claude Code skills. The repository also includes GitHub Copilot / VS Code workspace customizations:

```bash
curl -fsSL https://raw.githubusercontent.com/amirwebd3v/Flowcv-mcp/master/install.sh | bash -s -- --mcp
```

Then authenticate:

```bash
flowcv login
```

**GitHub Copilot / VS Code**

- When you open this repo in VS Code, the committed `.vscode/mcp.json` registers a workspace `flowcv` server that runs `${workspaceFolder}/dist/index.js`
- Trust or start the server from the MCP Servers UI or `MCP: List Servers`
- Test in chat with `flowcv_get_user` and `flowcv_list_resumes`

If you installed to `~/.local/share/flowcv-mcp` and want a global VS Code config instead, add this to your user `mcp.json`:

```json
{
    "servers": {
        "flowcv": {
            "type": "stdio",
            "command": "node",
            "args": ["~/.local/share/flowcv-mcp/dist/index.js"]
        }
    }
}
```

On Windows, replace the `args` path with your full install path.

**Claude Code**

```bash
claude mcp add -s user flowcv -- node ~/.local/share/flowcv-mcp/dist/index.js
```

The MCP server automatically reads your cookie from `~/.config/flowcv/config.json` (set by `flowcv login`), so no env var is needed. It also understands workspace `.vscode/mcp.json` and legacy `.mcp.json` when those configs already define `FLOWCV_SESSION_COOKIE`.

**Or let Claude Code do everything** — paste this:

```
Install FlowCV MCP server: clone https://github.com/amirwebd3v/Flowcv-mcp, run
"./setup.sh --mcp" to build and install skills, then run "flowcv login" to get my cookie,
then add the MCP server with "claude mcp add". Test with flowcv_get_user and flowcv_list_resumes.
```

### What Gets Installed

| Component | Location | Purpose |
|-----------|----------|---------|
| CLI | `flowcv` (globally linked) | Terminal commands for FlowCV |
| Claude CLI Skill | `~/.claude/skills/flowcv-cli/` | Teaches Claude the CLI commands |
| Claude MCP Skill | `~/.claude/skills/flowcv/` | Teaches Claude the MCP tools, schemas, and customization paths |
| Copilot Instructions | `.github/copilot-instructions.md` | Project-wide guidance for GitHub Copilot in VS Code |
| Copilot Prompts | `.github/prompts/` | Reusable slash prompts for setup workflows |
| Copilot Skills | `.github/skills/` | Native Copilot slash skills for FlowCV MCP and CLI workflows |
| Workspace MCP Config | `.vscode/mcp.json` | Shared VS Code / GitHub Copilot MCP server definition |
| MCP Server | `~/.local/share/flowcv-mcp/dist/index.js` | 50-tool server runtime |

## All 49 Tools

### Session Management

| Tool | Description |
|------|-------------|
| `flowcv_check_auth` | Check if the current session cookie is valid and return user info |
| `flowcv_update_cookie` | Hot-swap the session cookie at runtime without restarting the server |

### Account & Auth

| Tool | Description |
|------|-------------|
| `flowcv_get_user` | Get user profile including email, plan, AI credits, and account details |
| `flowcv_get_subscription` | Get subscription details including plan, billing interval, and validity |

### Resume Management

| Tool | Description |
|------|-------------|
| `flowcv_list_resumes` | List all resumes with IDs, titles, web publish status, and last change date |
| `flowcv_get_resume` | Get complete resume data — all sections, entries, personal details, and customization |
| `flowcv_create_resume` | Create a new blank resume (free plan limited to 2) |
| `flowcv_duplicate_resume` | Create a copy of an existing resume when you intentionally want a second live version |
| `flowcv_rename_resume` | Change the title of a resume |
| `flowcv_delete_resume` | Permanently delete a resume |
| `flowcv_download_resume` | Download a resume as PDF |
| `flowcv_translate_resume` | Create a translated copy of a resume in a target language |

### Content Editing

| Tool | Description |
|------|-------------|
| `flowcv_save_personal_details` | Update name, job title, email, phone, address, photo, and social links |
| `flowcv_save_entry` | Create or update an entry in any section; existing entries are merged by ID so partial updates preserve omitted fields |
| `flowcv_delete_entry` | Remove a specific entry from a section |
| `flowcv_save_entries_order` | Change the display order of entries within a section |
| `flowcv_save_section_name` | Rename a section heading (e.g., "Skills" → "Technical Skills") |
| `flowcv_save_section_icon` | Set the icon for a section heading |
| `flowcv_update_section_type` | Change the type of a custom section |
| `flowcv_delete_section` | Remove an entire section and all its entries |

### Design Customization

| Tool | Description |
|------|-------------|
| `flowcv_save_customization` | Update specific design settings via dot-path (e.g., `font.fontFamily`, `colors.basic.single`) |
| `flowcv_save_all_customizations` | Replace the entire customization object for bulk design changes |

### Templates

| Tool | Description |
|------|-------------|
| `flowcv_apply_template` | Apply a design template to a resume |
| `flowcv_list_templates` | List user's custom templates from the template library |

### Publishing & Sharing

| Tool | Description |
|------|-------------|
| `flowcv_publish_web_resume` | Publish or unpublish a resume as a public web page |
| `flowcv_enable_download_button` | Toggle the download button on the published web resume |
| `flowcv_share_template` | Share your resume design as a public or private template |
| `flowcv_unshare_template` | Stop sharing a resume template publicly |

### Language & Tags

| Tool | Description |
|------|-------------|
| `flowcv_save_language` | Set the resume language (affects date formats and section labels) |
| `flowcv_save_tags` | Assign color tags to a resume for organization |

### Cover Letters

| Tool | Description |
|------|-------------|
| `flowcv_list_letters` | List all cover letters in the account |
| `flowcv_get_letter` | Get full cover letter data including body, recipient, and design |
| `flowcv_create_letter` | Create a new cover letter |
| `flowcv_save_letter_body` | Write or update the main body text (supports HTML) |
| `flowcv_save_letter_recipient` | Set hiring manager name, company, and address |
| `flowcv_save_letter_date` | Set the cover letter date |
| `flowcv_save_letter_personal_details` | Update sender's personal details on the letter |
| `flowcv_save_letter_design` | Update the cover letter styling and design |
| `flowcv_sync_letter_with_resume` | Link a cover letter to a resume so they share personal details |
| `flowcv_duplicate_letter` | Create a copy of an existing cover letter |
| `flowcv_delete_letter` | Permanently delete a cover letter |
| `flowcv_download_letter` | Download a cover letter as PDF |

### Job Tracker

| Tool | Description |
|------|-------------|
| `flowcv_list_trackers` | List all job tracker boards with columns and cards |
| `flowcv_save_tracker_card` | Create or update a job application card in a tracker |
| `flowcv_save_tracker_columns` | Update columns and card assignments in a tracker board |

### AI Features

| Tool | Description |
|------|-------------|
| `flowcv_fill_resume_with_ai` | Generate a full resume from a text prompt (uses AI credits) |
| `flowcv_ai_suggest_skills` | Get AI-powered skill suggestions for a resume |
| `flowcv_ai_grammar_check` | Run AI grammar check on resume content |

### Unsplash Images

| Tool | Description |
|------|-------------|
| `flowcv_search_unsplash` | Search Unsplash for background images |
| `flowcv_save_unsplash_image` | Apply an Unsplash image as the resume background |

## Customization Paths

The `flowcv_save_customization` tool accepts dot-separated paths for granular design changes:

```
font.fontFamily                → "Inter", "Roboto", "Arial", ...
colors.basic.single            → "#2563eb" (hex color)
colors.border.single           → hex color (border)
spacing.fontSize               → "1" to "5"
layout.detailsPosition         → "top", "left", "right"
layout.colsFromDetails.top     → "one", "two", "mix"
heading.style                  → "simple", "line", "topBottomLine", "box", "underline",
                                  "thinLine", "thickShortUnderline", "zigZagLine"
heading.icons                  → "none", "outline", "filled"
header.jobTitlePosition        → "below", "sameLine"
header.iconFrame               → "none", "circle", "square"
header.photo.grayscale         → true/false
entryLayout.displayMode        → "dateLocationLeft", "dateLocationRight", "dateContentLocation"
entryLayout.bodyIndentation    → true/false
skillDisplay.selected          → "grid", "level", "text"
skillDisplay.level.selected    → "bar", "dots", "bubbles"
certificateDisplay.selected    → "grid", "level", "text"
declarationDisplay.showSignature → true/false
educationDisplay.degreeFirst   → true/false
workDisplay.titleFirst         → true/false
applyAccentColor.headings      → true/false
applyAccentColor.dotsBarsBubbles → true/false
expert.subTitlePlacement       → "sameLine", "below"
advanced.listStyle             → "bullet", "dash", "circle", "none"
advanced.underlineLinks        → true/false
advanced.groupPromotions       → true/false
pageFormat                     → "A4", "letter"
sectionOrder.one               → [...section keys]
sectionOrder.two               → {left: [...], right: [...]}
```

See the full list in `skill/references/customization-guide.md`.

## Section Entry Fields

| Section | Key Fields |
|---------|-----------|
| Profile | `text` |
| Education | `degree`, `school`, `location`, `startDateNew`, `endDateNew`, `description` |
| Experience | `title`, `subTitle`, `location`, `startDateNew`, `endDateNew`, `description` |
| Skills | `skill`, `level`, `infoHtml` |
| Projects | `projectTitle`, `subTitle`, `description` |
| Awards | `awardTitle`, `issuer`, `date`, `description` |
| Languages | `language`, `level`, `infoHtml` |
| Interests | `interest`, `interestLink`, `infoHtml` |
| References | `name`, `jobTitle`, `organisation`, `email`, `phone` |
| Certificates | `certificate`, `certificateLink`, `infoHtml` |
| Declarations | `fullName`, `place`, `date`, `declarationText`, `signatureDataUrl` |

Dates use: `{year: "2024", month: "6", present: false}`
Descriptions support HTML: `<p>`, `<strong>`, `<ul><li>`, `<a href>`

## Free vs Pro

| Feature | Free | Pro |
|---------|------|-----|
| Resumes | 2 | Unlimited |
| Templates | Basic | All |
| AI Features | No credits | Included |
| PDF Download | Watermark | Clean |
| Web Resume | Yes | Yes |

## Cookie Expiry

Session cookies expire periodically. When that happens, just run `flowcv login` again. Both the CLI and MCP server read from the same config file, so re-authenticating once fixes both.

For the MCP server, an agent can also use the `flowcv_update_cookie` tool to hot-swap the cookie at runtime without restarting.

## Tech Stack

- TypeScript + Node.js 18+
- `@modelcontextprotocol/sdk` for MCP protocol
- `zod` for input validation
- `chrome-launcher` for automated cookie extraction (CLI)
- Native `fetch` for HTTP requests
- Native `WebSocket` for Chrome DevTools Protocol (Node 22+)
- stdio transport (MCP server)

## License

MIT
