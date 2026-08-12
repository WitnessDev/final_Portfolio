// Ambient declarations to avoid spurious TypeScript errors during development
declare module '*.css'
declare module '*.scss'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.png'
declare module '*.webp'
declare module '*.gif'
declare module '*.mp3'
declare module '*.mp4'

// Keep only asset and JSX runtime shims; real React types come from node_modules/@types
declare module 'react/jsx-runtime'
declare module 'react/jsx-dev-runtime'

interface ImportMetaEnv {
	VITE_FIREBASE_API_KEY?: string
	VITE_FIREBASE_AUTH_DOMAIN?: string
	VITE_FIREBASE_PROJECT_ID?: string
	VITE_FIREBASE_STORAGE_BUCKET?: string
	VITE_FIREBASE_MESSAGING_SENDER_ID?: string
	VITE_FIREBASE_APP_ID?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
