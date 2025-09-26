# Transfer Management App

A Next.js application for managing data transfer sessions, snapshots, and jobs with PIN-protected updates.

## Features

- **Transfer Session Management**: Track transfer progress and timing
- **Snapshot Management**: Monitor storage usage with A/B snapshot comparison
- **Job Management**: Schedule and track transfer jobs
- **PIN Protection**: Secure updates to free space and job creation with 4-digit PIN
- **History Tracking**: View transfer speed calculations and progress over time

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Bun (recommended) or npm/yarn

### Installation

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and configure:

```bash
# Required: PostgreSQL database URL
DATABASE_URL="postgresql://username:password@localhost:5432/transfer_db"

# Optional: 4-digit PIN for protecting updates (defaults to "1234")
NEXT_PUBLIC_APP_PIN="your-4-digit-pin"
```

3. Install dependencies:
```bash
bun install
```

4. Run database migrations:
```bash
bunx prisma migrate dev
```

5. Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## PIN Protection

The app includes PIN verification for sensitive operations:

- **Free Space Updates**: Requires PIN to modify snapshot free space values
- **Job Creation**: Requires PIN to add new transfer jobs

The PIN is configured via the `NEXT_PUBLIC_APP_PIN` environment variable. If not set, it defaults to "1234".

**Security Note**: For production use, ensure you:
1. Set a secure 4-digit PIN
2. Use HTTPS to protect PIN transmission
3. Consider implementing rate limiting and account lockout policies

## Database Schema

The app uses PostgreSQL with Prisma ORM and includes:

- **TransferSession**: Main session tracking
- **Snapshot**: Storage usage snapshots (A/B comparison)
- **SnapshotHistory**: Historical data for speed calculations  
- **Job**: Transfer job management

## API Endpoints

- `GET /api/sessions` - Fetch current transfer session
- `PUT /api/sessions` - Update session data
- `PUT /api/snapshots` - Update snapshot data
- `POST /api/jobs` - Create new job
- `DELETE /api/jobs` - Remove job

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
