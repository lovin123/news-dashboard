# News Dashboard

A modern, responsive news dashboard built with Next.js, TypeScript, and Tailwind CSS. This application provides a personalized news experience with user authentication and customizable news feeds.

![image](https://github.com/user-attachments/assets/215bb1dd-524f-4e0f-9634-66da65203e81)

![image](https://github.com/user-attachments/assets/c5f05bae-5012-4465-990f-61ddeba60985)



## Features

- 🔐 User Authentication with NextAuth.js
- 📰 Real-time news updates from News API
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 📱 Fully responsive design
- 🌙 Dark/Light mode support
- 🔄 Real-time data updates
- 📊 Interactive charts and visualizations
- 🎯 Personalized news preferences

## Admin Functionality

The dashboard includes a comprehensive admin panel with the following capabilities:

- 👥 User Management

  - View and manage user accounts
  - Monitor user activity and preferences
  - Handle user roles and permissions

- 📰 Content Management

  - Curate and manage news categories
  - Set featured news articles
  - Control content visibility and scheduling

- 📊 Analytics Dashboard

  - Track user engagement metrics
  - Monitor news article performance
  - View user interaction statistics

- ⚙️ System Settings

  - Configure API integrations
  - Manage system preferences
  - Handle notification settings

- 🔒 Security Controls

  - Manage authentication settings
  - Control access permissions
  - Monitor security logs

- 💰 Payout Management

  - Calculate payouts based on content type

    - Configurable rates for news articles and blog posts
    - Real-time payout calculations
    - Per-author payment tracking

  - Comprehensive Payout Dashboard

    - Interactive payout calculator
    - Detailed payout table with per-author breakdown
    - Track news and blog post counts
    - View individual and total payout amounts

  - Export Capabilities

    - Export payout reports to CSV
    - PDF export support (planned)
    - Google Sheets integration (planned)
    - Customizable report formats

  - Persistent Settings
    - Save and manage payout rates
    - Configure news article and blog post rates
    - Local storage for rate preferences

## Tech Stack

- **Framework:** Next.js 15.1.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **Database:** Prisma
- **UI Components:** Radix UI
- **Charts:** Recharts
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **Date Handling:** date-fns

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or pnpm
- A News API key

## Getting Started

1. Clone the repository:

   ```bash
   git clone [your-repository-url]
   cd news-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:

   - Copy `.env.sample` to `.env`
   - Fill in the required environment variables:
     ```
     NEWS_API_KEY=your_news_api_key
     DATABASE_URL=your_database_url
     NEXTAUTH_SECRET=your_nextauth_secret
     ```

4. Set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
news-dashboard/
├── src/                # Source directory
│   ├── app/           # Next.js app directory
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utility functions and configurations
│   ├── hooks/         # Custom React hooks
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
├── prisma/            # Database schema and migrations
├── public/            # Static assets
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [News API](https://newsapi.org/)
