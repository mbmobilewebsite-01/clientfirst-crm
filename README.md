# ClientFirst CRM — MB Mobile Edition

A full-featured CRM for MB Mobile, built with React + Vite.

## Quick Start

```bash
npm install
npm run dev
```

## Deploy to Netlify

### Option A — Drag & Drop (fastest)
1. Run `npm run build`
2. Drag the `dist/` folder to netlify.com/drop

### Option B — GitHub Integration (recommended)
1. Push this folder to a GitHub repo
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy

## Demo Accounts
| Email | Password | Role |
|-------|----------|------|
| ops@mbmobile.pk | ops123 | User (Saif) |
| haroon@mbmobile.pk | haroon123 | User (Haroon) |
| admin@mbmobile.pk | admin123 | Admin (Bilal) |
| super@clientfirst.com | super123 | Super Admin |

## Project Structure
```
src/
  components/    # Reusable UI (buttons, cards, charts)
  pages/         # One file per screen
  hooks/         # useStore — central state
  utils/         # Constants (colors, users, categories)
```

## Connecting Supabase (Next Step)
1. Create project at supabase.com
2. Replace USERS array with Supabase Auth
3. Replace useState in useStore with Supabase queries
4. Add environment variables to Netlify
