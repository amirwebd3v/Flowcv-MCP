# FlowCV Customization Guide

Use `flowcv_save_customization` with `{path, value}` pairs for granular updates.
Use `flowcv_save_all_customizations` to replace the entire customization object.

## Font

| Path | Values | Description |
|------|--------|-------------|
| `font.selected` | `"serif"`, `"sans"`, `"mono"` | Font category |
| `font.fontFamily` | Any font name | Specific font (e.g., "Zilla Slab", "Arial", "Poppins", "Roboto", "Inter", "Lato", "Montserrat", "Open Sans") |

## Colors

| Path | Values | Description |
|------|--------|-------------|
| `colors.mode` | `"basic"`, `"advanced"` | Color mode |
| `colors.basic.selected` | `"single"`, `"multi"` | Single accent or multi-color |
| `colors.basic.single` | Hex color (e.g., `"#0e374e"`) | Single accent color |
| `colors.basic.multi.textColor` | Hex color | Text color (multi mode) |
| `colors.basic.multi.accentColor` | Hex color | Accent color (multi mode) |
| `colors.basic.multi.backgroundColor` | Hex color | Background color (multi mode) |
| `colors.advanced.selected` | `"single"`, `"multi"` | Advanced color selection |
| `colors.advanced.single` | Hex color | Advanced single color |
| `colors.advanced.multi` | Object with color keys | Advanced multi colors |

### Colors — Border

| Path | Values | Description |
|------|--------|-------------|
| `colors.border.top` | Hex color | Top border color |
| `colors.border.bottom` | Hex color | Bottom border color |
| `colors.border.left` | Hex color | Left border color |
| `colors.border.right` | Hex color | Right border color |
| `colors.border.width` | `"1"` to `"5"` | Border width |
| `colors.border.single` | Hex color | Single border color (all sides) |
| `colors.border.selected` | `"single"`, `"multi"` | Single vs per-side border colors |

## Spacing

| Path | Values | Description |
|------|--------|-------------|
| `spacing.fontSize` | `"1"` to `"5"` | Font size (1=x-small, 5=x-large) |
| `spacing.lineHeight` | `"1"` to `"5"` | Line height |
| `spacing.spacingFactor` | `"1"` to `"5"` | Section spacing |
| `spacing.marginVertical` | `"1"` to `"5"` | Vertical margin |
| `spacing.marginHorizontal` | `"1"` to `"5"` | Horizontal margin |

## Page Format

| Path | Values | Description |
|------|--------|-------------|
| `pageFormat` | `"A4"`, `"letter"` | Page size |

## Layout

| Path | Values | Description |
|------|--------|-------------|
| `layout.detailsPosition` | `"top"`, `"left"`, `"right"` | Personal details position |
| `layout.colsFromDetails.top` | `"one"`, `"two"`, `"mix"` | Column count when details on top |
| `layout.colsFromDetails.left` | `"one"`, `"two"`, `"mix"` | Column count when details on left |
| `layout.colsFromDetails.right` | `"one"`, `"two"`, `"mix"` | Column count when details on right |
| `layout.colWidthsFromDetails.top.leftWidth` | Number (e.g., `50`) | Left column width % (top layout) |
| `layout.colWidthsFromDetails.top.rightWidth` | Number (e.g., `50`) | Right column width % (top layout) |
| `layout.colWidthsFromDetails.left.leftWidth` | Number | Left column width % (left layout) |
| `layout.colWidthsFromDetails.left.rightWidth` | Number | Right column width % (left layout) |
| `layout.colWidthsFromDetails.right.leftWidth` | Number | Left column width % (right layout) |
| `layout.colWidthsFromDetails.right.rightWidth` | Number | Right column width % (right layout) |

## Headings

| Path | Values | Description |
|------|--------|-------------|
| `heading.style` | `"simple"`, `"line"`, `"topBottomLine"`, `"box"`, `"underline"`, `"thinLine"`, `"thickShortUnderline"`, `"zigZagLine"` | Heading decoration (8 styles) |
| `heading.headingSize` | `"xs"`, `"s"`, `"m"`, `"l"`, `"xl"` | Heading text size |
| `heading.capitalization` | `"capitalize"`, `"uppercase"`, `"none"` | Text case |
| `heading.icons` | `"none"`, `"outline"`, `"filled"` | Section icons |

## Header

| Path | Values | Description |
|------|--------|-------------|
| `header.photo.show` | `true`, `false` | Show/hide photo |
| `header.photo.size` | `"xs"`, `"s"`, `"m"`, `"l"`, `"xl"` | Photo size |
| `header.photo.grayscale` | `true`, `false` | Grayscale photo filter |
| `header.nameSize` | `"xs"`, `"s"`, `"m"`, `"l"`, `"xl"` | Name text size |
| `header.accentuateName` | `true`, `false` | Bold/accent the name |
| `header.jobTitlePosition` | `"below"`, `"sameLine"` | Job title placement |
| `header.jobTitleSize` | `"xs"`, `"s"`, `"m"`, `"l"`, `"xl"` | Job title text size |
| `header.jobTitleStyle` | `"normal"`, `"bold"`, `"italic"` | Job title text style |
| `header.iconFrame` | `"none"`, `"circle"`, `"square"` | Frame shape around contact icons |
| `header.iconFrameStyle` | `"filled"`, `"outline"` | Icon frame fill style |
| `header.detailsArrangement` | `"row"`, `"column"` | Contact details layout direction |
| `header.detailsDisplayCenter` | `"row"`, `"column"` | Details layout when centered |
| `header.detailsDisplayLeftRight` | `"row"`, `"column"` | Details layout when left/right |
| `header.detailsGrid` | `true`, `false` | Grid layout for details |
| `header.photoPositionFromHeaderPosition.top` | `"left"`, `"right"`, `"center"` | Photo position when header is top |
| `header.photoPositionFromHeaderPosition.left` | `"top"`, `"bottom"`, `"center"` | Photo position when header is left |
| `header.photoPositionFromHeaderPosition.right` | `"top"`, `"bottom"`, `"center"` | Photo position when header is right |

**Note:** Photo `shape` is set via `flowcv_save_personal_details` in the `photo` object (`photo.shape`), not via customization. Valid shapes: `"round"`, `"square"`, `"squareRounded"`, `"portrait"`, `"portraitRounded"`.

## Entry Layout

| Path | Values | Description |
|------|--------|-------------|
| `entryLayout.displayMode` | `"dateLocationLeft"`, `"dateLocationRight"`, `"dateContentLocation"` | Entry date/location placement |
| `entryLayout.subtitleStyle` | `"normal"`, `"bold"`, `"italic"` | Subtitle text style |
| `entryLayout.titleAndSubtitleSize` | `"xs"`, `"s"`, `"m"`, `"l"` | Title/subtitle text size |
| `entryLayout.bodyIndentation` | `true`, `false` | Indent entry body text |
| `entryLayout.dateLocationOpacity` | Number (0 to 1) | Opacity for date/location text |
| `entryLayout.colMode` | `"one"`, `"two"` | Column mode for entries |
| `entryLayout.colWidths.leftWidth` | Number | Left column width % |
| `entryLayout.colWidths.rightWidth` | Number | Right column width % |

## Skill Display

| Path | Values | Description |
|------|--------|-------------|
| `skillDisplay.selected` | `"grid"`, `"level"`, `"text"` | Skill visualization mode |
| `skillDisplay.showLevelText` | `true`, `false` | Show textual level labels |
| `skillDisplay.levelMax` | Number | Maximum level value |

## Language Display

| Path | Values | Description |
|------|--------|-------------|
| `languageDisplay.selected` | `"grid"`, `"level"`, `"text"` | Language visualization mode |

## Footer

| Path | Values | Description |
|------|--------|-------------|
| `footer.show` | `true`, `false` | Show footer |
| `footer.pageNumber` | `true`, `false` | Show page numbers |
| `footer.text` | String | Footer text |

## Custom Skill Sections

| Path | Values | Description |
|------|--------|-------------|
| `customSkillSections.customSkill1.selected` | `"grid"`, `"level"`, `"text"` | Custom skill 1 display |
| `customSkillSections.customSkill2.selected` | `"grid"`, `"level"`, `"text"` | Custom skill 2 display |