---
name: flowcv-cli
description: 'Run the FlowCV CLI for resume, cover letter, design, template, publishing, job tracker, and AI tasks from the terminal. Use when the user explicitly wants shell commands, scripting, or direct `flowcv` CLI operations instead of MCP tools.'
---

# FlowCV CLI Skill

Use the `flowcv` command to manage FlowCV from a shell.

## When to Use

- The user wants direct terminal commands or scripting output
- You need `--json` output for automation or follow-up shell processing
- You are working outside an MCP-enabled chat client
- You want to authenticate or inspect account state with CLI commands

Prefer the MCP skill when the user is already working through the `flowcv` MCP server in chat.

## Authentication

```bash
flowcv login
flowcv login --paste
flowcv logout
flowcv status
flowcv whoami
```

## Resume Commands

```bash
flowcv resume list
flowcv resume get <id>
flowcv resume create [--title "..."]
flowcv resume duplicate <id>
flowcv resume rename <id> "New Title"
flowcv resume delete <id>
flowcv resume download <id>
flowcv resume translate <id> <lang>
```

For free-plan or single-resume workflows, prefer updating the existing resume in place and hiding irrelevant entries instead of duplicating unless the user explicitly wants a second live copy.

## Entry Commands

```bash
flowcv entry add <resume_id> <section> --data '{...}'
flowcv entry update <resume_id> <section> <entry_id> --data '{...}'
flowcv entry delete <resume_id> <section> <entry_id>
flowcv entry list <resume_id> <section>
flowcv entry reorder <resume_id> <section> --data '["id1","id2"]'
```

`flowcv entry update` merges the provided fields with the current stored entry by ID before saving, so omitted fields are preserved.

Section types: `profile`, `education`, `skill`, `project`, `award`, `language`, `interest`, `reference`, `certificate`, `declaration`, `custom`, `custom2`, `custom3`, `custom4`, `customSkill1`, `customSkill2`

## Personal Details

```bash
flowcv personal set <resume_id> --data '{"fullName":"...","jobTitle":"..."}'
flowcv personal get <resume_id>
```

## Design Commands

```bash
flowcv design set <resume_id> <path> <value>
flowcv design get <resume_id> [path]
flowcv design bulk <resume_id> --data '[{"path":"...","value":...}]'
```

Common paths: `font.fontFamily`, `font.selected`, `colors.basic.single`, `spacing.fontSize`, `layout.detailsPosition`, `heading.style`, `header.nameSize`, `entryLayout.displayMode`, `skillDisplay.selected`, `pageFormat`

## Sections and Templates

```bash
flowcv section rename <resume_id> <section> "New Name"
flowcv section icon <resume_id> <section> <icon_key>
flowcv section type <resume_id> <section> <type>
flowcv section delete <resume_id> <section>

flowcv template list
flowcv template apply <resume_id> <template_id>
```

## Publishing

```bash
flowcv publish <resume_id>
flowcv unpublish <resume_id>
flowcv download-btn <resume_id> [on|off]
flowcv lang set <resume_id> <lang_code>
flowcv tags set <resume_id> --data '[{"id":"...","name":"...","hexColor":"#..."}]'
```

## Cover Letters

```bash
flowcv letter list
flowcv letter get <id>
flowcv letter create [--title "..."]
flowcv letter body <id> --html "..."
flowcv letter recipient <id> --data '{"hrName":"...","company":"..."}'
flowcv letter date <id> [--today | --custom "March 4, 2026"]
flowcv letter design <id> --data '{...}'
flowcv letter personal <id> --data '{...}'
flowcv letter sync <id> <resume_id>
flowcv letter duplicate <id>
flowcv letter delete <id>
flowcv letter download <id>
```

## Job Tracker, AI, and Images

```bash
flowcv tracker list
flowcv tracker add-card <tracker_id> --data '{...}'
flowcv tracker columns <tracker_id> --data '[...]'

flowcv ai fill "Senior React developer with 5 years experience"
flowcv ai suggest-skills <resume_id>
flowcv ai grammar <resume_id>

flowcv image search "abstract background"
flowcv image set <resume_id> --data '{...}'
```

## Output Modes

- Default output is human-readable
- Use `--json` for scripting-friendly output
- Use `--quiet`, `-q`, `--yes`, or `-y` to skip confirmations