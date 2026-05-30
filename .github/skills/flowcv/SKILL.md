---
name: flowcv
description: 'Manage FlowCV resumes, cover letters, templates, design customization, account data, job tracker boards, publishing, translations, and FlowCV authentication through MCP tools. Use when working with FlowCV, editing a resume on flowcv.com, listing resumes, changing fonts or colors, downloading PDFs, sharing templates, or fixing expired FlowCV sessions.'
---

# FlowCV MCP Skill

Use the `flowcv` MCP server to manage FlowCV resumes, cover letters, and job trackers through in-chat tools.

## When to Use

- Create, update, duplicate, translate, publish, or download FlowCV resumes
- Edit resume content sections such as profile, education, experience, skills, projects, awards, languages, interests, references, certificates, declarations, or custom sections
- Customize resume design, layout, fonts, colors, spacing, headings, entry layout, or skill display
- Create and manage FlowCV cover letters and job tracker boards
- Check FlowCV account state, plan details, or AI credit availability
- Recover from `SESSION_EXPIRED` or missing-cookie auth failures

## Preconditions

1. A `flowcv` MCP server must already be configured and running.
2. Authentication normally comes from `flowcv login`, which stores the session cookie in `~/.config/flowcv/config.json`.
3. If a workspace or user MCP config already defines `FLOWCV_SESSION_COOKIE`, the server can also read or update that value.

## Authentication Workflow

1. Start with `flowcv_check_auth` if auth status is unknown.
2. If the server reports `SESSION_EXPIRED` or `NO_COOKIE`, guide the user to refresh auth with `flowcv login` or provide a fresh `flowcvsidapp` cookie.
3. Use `flowcv_update_cookie` when you need to hot-swap the cookie at runtime without restarting the server.
4. Retry the original tool after auth succeeds.

## Core Resume Workflow

1. Call `flowcv_list_resumes` to get candidate resume IDs.
2. Call `flowcv_get_resume` for the specific resume before making edits.
3. If the user is on FlowCV's free plan or wants one live resume, update that resume in place and hide irrelevant entries instead of duplicating first.
4. Use `flowcv_save_personal_details` for header and personal data.
5. Use `flowcv_save_entry` to add or update entries in a section.
6. Use `flowcv_save_entries_order`, `flowcv_save_section_name`, `flowcv_save_section_icon`, or `flowcv_update_section_type` when adjusting structure.
7. Use `flowcv_save_customization` for targeted design changes and `flowcv_save_all_customizations` only when replacing the full customization object.
8. Re-read the resume or list data if the user wants confirmation.

## Tool Categories

### Session Management
- `flowcv_check_auth`
- `flowcv_update_cookie`

### Account
- `flowcv_get_user`
- `flowcv_get_subscription`

### Resume Management
- `flowcv_list_resumes`
- `flowcv_get_resume`
- `flowcv_create_resume`
- `flowcv_duplicate_resume` (use only when the user explicitly wants a second live resume)
- `flowcv_rename_resume`
- `flowcv_delete_resume`
- `flowcv_download_resume`
- `flowcv_translate_resume`

### Content Editing
- `flowcv_save_personal_details`
- `flowcv_save_entry` (existing entries are merged by ID before save, so partial updates preserve omitted fields)
- `flowcv_delete_entry`
- `flowcv_save_entries_order`
- `flowcv_save_section_name`
- `flowcv_save_section_icon`
- `flowcv_update_section_type`
- `flowcv_delete_section`

### Design Customization
- `flowcv_save_customization`
- `flowcv_save_all_customizations`

For supported customization paths and values, see [customization-guide.md](./references/customization-guide.md).

### Templates and Publishing
- `flowcv_apply_template`
- `flowcv_list_templates`
- `flowcv_publish_web_resume`
- `flowcv_enable_download_button`
- `flowcv_share_template`
- `flowcv_unshare_template`

### Language and Tags
- `flowcv_save_language`
- `flowcv_save_tags`

### Cover Letters
- `flowcv_list_letters`
- `flowcv_get_letter`
- `flowcv_create_letter`
- `flowcv_save_letter_body`
- `flowcv_save_letter_recipient`
- `flowcv_save_letter_date`
- `flowcv_save_letter_personal_details`
- `flowcv_save_letter_design`
- `flowcv_sync_letter_with_resume`
- `flowcv_duplicate_letter`
- `flowcv_delete_letter`
- `flowcv_download_letter`

### Job Tracker
- `flowcv_list_trackers`
- `flowcv_save_tracker_card`
- `flowcv_save_tracker_columns`

### AI Features
- `flowcv_fill_resume_with_ai`
- `flowcv_ai_suggest_skills`
- `flowcv_ai_grammar_check`

### Images
- `flowcv_search_unsplash`
- `flowcv_save_unsplash_image`

## Data Modeling Notes

- Generate UUIDs for brand-new entries when the API expects an `id`.
- `flowcv_save_entry` merges partial updates into the current stored entry when the ID already exists; new entries still need full data.
- Most rich text fields are HTML, not Markdown.
- Date objects typically use `{ year, month, day, hideDay, hideMonth, present }`.
- Free accounts are limited on resumes and AI features; do not assume premium capabilities.

## Reference Material

- [api-reference.md](./references/api-reference.md) for endpoints and per-section entry schemas
- [customization-guide.md](./references/customization-guide.md) for dot-path customization keys and accepted values