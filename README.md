# FinanceFlow

A modern, AI-powered personal finance management application built with React, TypeScript, and Supabase. Track expenses, analyze spending patterns, and get personalized financial advice to achieve your money goals.

## 🌟 Features

### Core Functionality
- **Expense Tracking**: Easily categorize and track your expenses with an intuitive interface
- **Smart Dashboard**: Visual spending breakdowns with interactive charts and analytics
- **Budget Management**: Set budgets for different categories with real-time alerts
- **AI Financial Assistant**: Get personalized financial advice powered by advanced AI
- **User Profiles**: Comprehensive profile management with financial goals and preferences

### Premium Features
- **Advanced Analytics**: Detailed spending pattern analysis and projections
- **Subscription Management**: Integrated Stripe payments for premium features
- **Enhanced AI Insights**: More sophisticated financial recommendations
- **Priority Support**: Dedicated customer support for premium users

### Security & Authentication
- **Secure Authentication**: Email/password authentication via Supabase Auth
- **Two-Factor Authentication**: Optional 2FA for enhanced account security
- **Row Level Security**: Database-level security ensuring users only access their own data
- **Session Management**: Secure session handling with automatic token refresh

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for development and building

### Backend & Database
- **Supabase** for database, authentication, and real-time features
- **PostgreSQL** with Row Level Security (RLS)
- **Supabase Edge Functions** for serverless API endpoints

### Payments & Subscriptions
- **Stripe** for payment processing
- **Stripe Checkout** for subscription management
- **Webhook handling** for real-time subscription updates

### AI & Analytics
- **Custom AI Service** for financial advice generation
- **Advanced analytics** for spending pattern recognition
- **Personalized recommendations** based on user data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Stripe account (for payments)

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd financeflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations from `supabase/migrations/`
   - Configure authentication settings
   - Set up Row Level Security policies

4. **Configure Stripe**
   - Create Stripe products and prices
   - Set up webhook endpoints
   - Configure test mode for development

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### Core Tables
- **expenses**: User expense records with categories, amounts, and dates
- **user_profiles**: Extended user information and financial preferences
- **subscriptions**: Stripe subscription management

### Key Features
- **Row Level Security**: All tables have RLS policies ensuring data privacy
- **Automatic timestamps**: Created/updated timestamps on all records
- **Foreign key constraints**: Proper data relationships and integrity
- **Indexes**: Optimized queries for better performance

## 🔧 Architecture

### Frontend Structure
```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── pages/              # Main application pages
├── services/           # API and external service integrations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── lib/                # Configuration and setup
```

### Backend Structure
```
supabase/
├── functions/          # Edge Functions for serverless API
├── migrations/         # Database schema migrations
└── config/            # Supabase configuration
```

## 🎯 Key Pages & Features

### Landing Page
- Modern, responsive design with gradient backgrounds
- Feature highlights and call-to-action sections
- Smooth animations and micro-interactions

### Dashboard
- Real-time expense analytics with interactive charts
- Spending summaries by category and time period
- AI-generated financial insights and tips

### Expense Management
- Quick expense entry with category selection
- Recent transactions display
- Bulk operations and filtering

### AI Assistant
- Interactive chat interface for financial advice
- Context-aware responses based on user data
- Personalized recommendations and action plans

### Profile Management
- Comprehensive user settings and preferences
- Financial goal tracking and progress monitoring
- Security settings including 2FA setup

### Pricing & Subscriptions
- Tiered pricing plans (Free, Pro, Premium)
- Stripe-powered checkout and billing
- Subscription management and cancellation

## 🔐 Security Features

- **Authentication**: Secure email/password authentication
- **Authorization**: Role-based access control
- **Data Protection**: Row Level Security on all database operations
- **Session Security**: Automatic token refresh and secure session handling
- **Payment Security**: PCI-compliant payment processing via Stripe

## 🚀 Deployment

### Frontend Deployment
The application can be deployed to any static hosting service:
- Netlify (recommended)
- Vercel
- AWS S3 + CloudFront

### Backend Services
- **Database**: Hosted on Supabase
- **Edge Functions**: Deployed via Supabase CLI
- **File Storage**: Supabase Storage for user avatars

## 📈 Performance & Optimization

- **Code Splitting**: Automatic code splitting with Vite
- **Lazy Loading**: Components loaded on demand
- **Optimized Images**: Responsive images with proper sizing
- **Caching**: Efficient data caching and state management
- **Bundle Optimization**: Tree shaking and minification

## 🧪 Testing

### Test Payment Cards
For testing Stripe integration:
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Insufficient Funds**: 4000 0000 0000 9995

Use any future expiry date and any 3-digit CVC.

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support and questions:
- Create an issue in the repository
- Contact support at support@financeflow.com
- Check the documentation and FAQ sections

## 🔮 Roadmap

### Upcoming Features
- **Mobile App**: React Native mobile application
- **Bank Integration**: Connect bank accounts for automatic transaction import
- **Investment Tracking**: Portfolio management and investment analytics
- **Bill Reminders**: Automated bill tracking and payment reminders
- **Family Sharing**: Shared budgets and expense tracking for families
- **Advanced Reporting**: Custom reports and data export options

---

Built with ❤️ using React, TypeScript, Supabase, and Stripe.