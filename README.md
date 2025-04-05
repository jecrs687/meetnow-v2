# MeetNow

MeetNow is a social platform that helps people discover, organize, and join meetups and events based on shared interests, particularly around coffee shops, restaurants, and other social venues.

## Features

- **Event Discovery**: Find local events and meetups based on your interests and location
- **Group Management**: Create and join groups with like-minded people
- **Place Recommendations**: Discover popular venues for meetups and social gatherings
- **Profile Management**: Customize your profile to connect with people who share your interests
- **Interactive Maps**: Easily find event locations and venues
- **Real-time Notifications**: Stay updated on event changes and messages
- **Mobile-Friendly Design**: Enjoy a seamless experience across all devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **Database**: Prisma with PostgreSQL
- **Maps Integration**: Google Maps API
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- PostgreSQL database (or use a Docker container)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/meetnow.git
   cd meetnow
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/meetnow"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
meetnow/
├── prisma/              # Prisma schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── (public)/    # Public routes (landing, login, etc.)
│   │   ├── (private)/   # Protected routes (dashboard, events, etc.)
│   │   └── api/         # API routes
│   ├── container/       # Reusable components and utilities
│   │   ├── common/      # Common components (navigation, etc.)
│   │   ├── core/        # UI components
│   │   ├── store/       # Zustand stores
│   │   └── constants/   # Application constants
│   └── lib/             # Utility functions
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Google Maps Platform](https://developers.google.com/maps)
