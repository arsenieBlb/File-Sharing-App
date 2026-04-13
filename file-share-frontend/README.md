# Secure-File-Sharing-Platform — frontend

This folder is the **Next.js 14** (App Router) UI for [**Secure-File-Sharing-Platform**](../README.md). In the app it is branded as **Secure File Sharing Platform** (natural spacing in headers and auth screens).

See the [repository root README](../README.md) for a **non-IT description** of what to expect, security notes, and environment variables.

## Stack

Next.js 14, TypeScript, Tailwind CSS, shadcn/ui (Radix), NextAuth (Auth.js) credentials, React Hook Form + Zod, TanStack Table.

## Setup

```bash
cd file-share-frontend
npm install
npm run dev
```

Create `.env` as documented in the root README (`NEXT_PUBLIC_API_URL` must include the `/api` prefix).

## Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Development server                       |
| `npm run build`   | Production build (output under `.next`) |
| `npm run start`   | Production server after build            |
| `npm run lint`    | ESLint                                   |

## License

MIT — see [LICENSE](./LICENSE) if present in this package.
