# Custom Remix Starter

This starter is a custom remix starter that includes:

- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn-ui](https://ui.shadcn.com/)

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

Using render:

Set up a postgres database and set the `DATABASE_URL` environment variable.

for the app build command, use:

```sh
npm ci --production=false && npm run build && npx prisma migrate deploy && npm prune --production
```
