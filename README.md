# Full-stack Monorepo Template
![Socket Badge](https://socket.dev/api/badge/npm/package/@jagadhis/fullstack-monorepo-template/1.30.0)

A modern, production-ready monorepo template featuring Next.js, Node.js, Supabase, and Prisma.

## Features

- 🏗️ **Monorepo Structure** using Turborepo
- 🎯 **Type Safety** with TypeScript
- 🚀 **Frontend** with Next.js
- 🛠️ **Backend** with Node.js & Express
- 📦 **Database** with Prisma & Supabase
- 🔄 **Version Control** with semantic-release
- 📋 **Code Quality** with ESLint & Prettier
- 🪝 **Git Hooks** with lefthook
- 🏃‍♂️ **Fast Builds** with Turborepo's caching

## Quick Start

```bash
npx @jagadhis/fullstack-monorepo-template my-app
cd my-app
npm run dev
```

## Project Structure

```
.
├── apps/
│   ├── frontend/          # Next.js frontend
│   └── backend/          # Node.js & Express backend
├── packages/
│   └── types/           # Shared TypeScript types
├── package.json
└── turbo.json
```

## Available Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
- `npm run test` - Run tests across packages

## Environment Setup

1. Frontend (.env.local):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

2. Backend (.env):
```env
DATABASE_URL=your_database_url
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding or modifying tests
- `chore:` Maintenance tasks

## License

MIT © [jagadhis]

## Support

If you find this template helpful, please consider giving it a ⭐️ on GitHub!

For issues and feature requests, please use the [GitHub issues page](https://github.com/jagadhis/fullstack-monorepo-template/issues).
