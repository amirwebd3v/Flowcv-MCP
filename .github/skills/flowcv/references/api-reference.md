# FlowCV API Reference

Base URL: `https://app.flowcv.com`
Auth: Cookie-based (`flowcvsidapp` session cookie)

## Endpoints

### Auth & Account
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/init_user` | Get user profile, active plans, AI credits |
| GET | `/api/users/fetch_subscription_infos` | Subscription details and billing |

### Resumes
| Method | Endpoint | Body/Params | Description |
|--------|----------|-------------|-------------|
| GET | `/api/resumes/all` | - | List all resumes |
| GET | `/api/resumes/{id}` | - | Get full resume data |
| POST | `/api/resumes/create` | `{clientResume: {title}}` | Create resume |
| POST | `/api/resumes/duplicate` | `{duplicateId}` | Duplicate resume |
| PATCH | `/api/resumes/rename_resume` | `{resumeId, resumeTitle}` | Rename resume |
| DELETE | `/api/resumes/delete_resume` | `?resumeId=` | Delete resume |
| POST | `/api/resumes/download` | `{resumeId}` | Download PDF |
| POST | `/api/resumes/translate` | `{resumeId, targetLng}` | Translate resume |

### Personal Details
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| PATCH | `/api/resumes/save_personal_details` | `{resumeId, personalDetails}` | Update personal info |

**personalDetails fields:**
- `fullName`, `jobTitle`, `displayEmail`, `phone`, `address`, `website`, `websiteLink`
- `usAddress` (boolean) - US-style address format
- `detailsOrder` - Array of field keys defining display order
- `social` - Object: `{github: {link, display}, linkedIn: {link, display}, twitter: ...}`
- `photo` - Object: `{shape, imageId, xPct, yPct, widthPct, heightPct}` — **Note:** photo `shape` is set here (valid: `"round"`, `"square"`, `"squareRounded"`, `"portrait"`, `"portraitRounded"`), not via customization

### Section Entries
| Method | Endpoint | Body/Params | Description |
|--------|----------|-------------|-------------|
| PATCH | `/api/resumes/save_entry` | `{resumeId, sectionId, ...entry}` | Create/update entry |
| DELETE | `/api/resumes/delete_entry` | `?resumeId=&sectionId=&entryId=` | Delete entry |
| PATCH | `/api/resumes/save_entries_order` | `{resumeId, sectionId, newEntriesIdsOrder}` | Reorder entries |

**Entry fields by section type:**

| Section | Fields |
|---------|--------|
| `profile` | `id, text` |
| `education` | `id, degree, school, schoolLink, location, startDateNew, endDateNew, description` |
| `experience` (custom) | `id, title, titleLink, subTitle, location, startDateNew, endDateNew, description` |
| `skill` | `id, skill, level, infoHtml` |
| `project` | `id, projectTitle, projectTitleLink, subTitle, startDateNew, endDateNew, description` |
| `award` | `id, awardTitle, awardTitleLink, issuer, date:{year,month}, description` |
| `language` | `id, language, level, infoHtml` |
| `interest` | `id, interest, interestLink, infoHtml` |
| `reference` | `id, name, nameLink, jobTitle, organisation, email, phone` |
| `custom/custom2/3/4` | `id, title, titleLink, subTitle, location, startDateNew, endDateNew, description` |
| `customSkill1/2` | `id, skill, level, infoHtml` |
| `certificate` | `id, certificate, certificateLink, infoHtml` |
| `declaration` | `id, fullName, place, date, declarationText, signatureDataUrl` |

**Date format (startDateNew/endDateNew):**
```json
{"year": "2024", "month": "6", "day": "15", "hideDay": true, "hideMonth": false, "present": false}
```

**Description format (HTML):**
```html
<p>Text content</p>
<ul><li>Bullet point</li></ul>
<strong>Bold</strong>, <em>Italic</em>, <a href="url">Link</a>
```

**Update behavior note:**
- Raw `/api/resumes/save_entry` calls behave like full-entry replacement in practice.
- The CLI `flowcv entry update` command and MCP `flowcv_save_entry` tool in this repo merge the current stored entry by ID before saving, so partial updates preserve omitted fields.
- Custom scripts that call `/api/resumes/save_entry` directly should still send every field they want to keep.

### Section Management
| Method | Endpoint | Body/Params |
|--------|----------|-------------|
| PATCH | `/api/resumes/save_section_name` | `{resumeId, sectionId, displayName}` |
| PATCH | `/api/resumes/save_section_icon` | `{resumeId, sectionId, iconKey}` |
| PATCH | `/api/resumes/update_section_type` | `{resumeId, sectionId, sectionType}` |
| DELETE | `/api/resumes/delete_section` | `?resumeId=&sectionId=` |

### Design Customization
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| PATCH | `/api/resumes/save_customization` | `{resumeId, path, value}` | Update a single customization path |
| PATCH | `/api/resumes/save_all_customizations` | `{resumeId, customization}` | Replace full customization object |

### Templates
| Method | Endpoint | Body/Params | Description |
|--------|----------|-------------|-------------|
| GET | `/api/user_templates/list` | - | List templates |
| POST | `/api/resumes/apply_template` | `{resumeId, templateId}` | Apply template |

### Publishing, Language, Tags
| Method | Endpoint | Body/Params | Description |
|--------|----------|-------------|-------------|
| PATCH | `/api/resumes/publish_web_resume` | `{resumeId, live}` | Publish/unpublish web resume |
| PATCH | `/api/resumes/enable_download_button` | `{resumeId, enabled}` | Toggle download button |
| PATCH | `/api/resumes/save_language` | `{resumeId, lngCode}` | Set language |
| PATCH | `/api/resumes/save_tags` | `{resumeId, tags}` | Save tags |

### Cover Letters
| Method | Endpoint | Body/Params | Description |
|--------|----------|-------------|-------------|
| GET | `/api/cover_letters/all` | - | List cover letters |
| GET | `/api/cover_letters/{id}` | - | Get letter |
| POST | `/api/cover_letters/create` | `{title}` | Create letter |
| PATCH | `/api/cover_letters/save_body` | `{coverLetterId, bodyHtml}` | Save body |
| PATCH | `/api/cover_letters/save_recipient` | `{coverLetterId, recipient}` | Save recipient |
| PATCH | `/api/cover_letters/save_date` | `{coverLetterId, date}` | Save date |
| PATCH | `/api/cover_letters/save_personal_details` | `{coverLetterId, personalDetails}` | Save personal details |
| PATCH | `/api/cover_letters/save_design` | `{coverLetterId, design}` | Save design |
| PATCH | `/api/cover_letters/sync_with_resume` | `{coverLetterId, resumeId}` | Sync with resume |
| POST | `/api/cover_letters/duplicate` | `{coverLetterId}` | Duplicate letter |
| DELETE | `/api/cover_letters/delete` | `?coverLetterId=` | Delete letter |
| POST | `/api/cover_letters/download` | `{coverLetterId}` | Download PDF |

### Job Tracker
| Method | Endpoint | Body/Params | Description |
|--------|----------|-------------|-------------|
| GET | `/api/job_trackers/all` | - | List job trackers |
| PATCH | `/api/job_trackers/save_card` | `{trackerId, card}` | Create/update card |
| PATCH | `/api/job_trackers/save_columns` | `{trackerId, columns}` | Save columns |

### AI Features
| Method | Endpoint | Body/Params | Description |
|--------|----------|-------------|-------------|
| POST | `/api/ai/fill_resume` | `{prompt}` | Generate resume from prompt |
| POST | `/api/ai/skills/suggest` | `{resumeId}` | Suggest skills |
| POST | `/api/ai/grammar/check` | `{resumeId}` | Grammar check |

### Images and Sharing
| Method | Endpoint | Body/Params | Description |
|--------|----------|-------------|-------------|
| GET | `/api/unsplash/search` | `?query=` | Search Unsplash |
| PATCH | `/api/resumes/save_unsplash_image` | `{resumeId, image}` | Save background image |
| POST | `/api/user_templates/share` | `{resumeId}` | Share template |
| POST | `/api/user_templates/unshare` | `{resumeId}` | Unshare template |