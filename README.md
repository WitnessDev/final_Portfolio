HONESTY VISUALS — Starter site and Admin CMS

This repository is a production-ready starter scaffold using React + TypeScript + Tailwind + Firebase.

Quick setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file at project root with these variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Run dev server

```bash
npm run dev
```

What I implemented

- Project scaffold (Vite, TypeScript, Tailwind)
- `VISUALS` page with fullscreen lightbox (keyboard, swipe, captions, counter)
- `MOVING STORIES` video grid with cinematic thumbnails
- `MUSIC` section with minimal audio player
- `WHAT I CREATED` services, `ABOUT`, `PURPOSE`, social preview and contact sections
- Admin scaffold with Firebase authentication and placeholders for uploads
- Fonts: Cormorant Garamond, Manrope, Space Mono

Next steps to finish

- Implement full Firestore data models and Storage upload flows
- Add image optimization on upload (resize / WebP conversion)
- Implement security rules for Firestore and Storage
- Polish animations and responsive tweaks

If you want, I can now:
- Wire full Admin CRUD for Photos/Projects/Videos/Music using Firestore + Storage
- Add image upload UI with drag-and-drop and progress
- Add Firestore security rules and deployment steps

