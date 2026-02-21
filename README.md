# POS App

A comprehensive Point of Sale (POS) system built with modern web technologies, designed for retail businesses.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PHP](https://img.shields.io/badge/PHP-8.0+-777BB4.svg)
![Laravel](https://img.shields.io/badge/Laravel-9+-FF2D20.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)
![Next.js](https://img.shields.io/badge/Next.js-13+-000000.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)

## 🚀 Features

### Backend (Laravel)
- RESTful API with comprehensive CRUD operations
- JWT Authentication system
- Database sharding for receipts (monthly tables)
- Search and pagination across all entities
- Role-based access control
- Comprehensive audit logging
- API documentation with Swagger/OpenAPI

### Admin Portal (Next.js)
- Modern, responsive dashboard interface
- Real-time search with debounced API calls
- Pagination controls with customizable page sizes
- Customer management system
- Cashier administration
- Inventory and item management
- Free item promotions system
- Location management
- Receipt viewing and management
- Dark mode support
- Mobile-responsive design

### Cashier Application (React Native/Expo)
- Intuitive POS interface for cashiers
- Real-time inventory updates
- Customer management
- Receipt generation and printing
- Offline mode support
- Barcode scanning capabilities

## 📋 Prerequisites

- PHP 8.0 or higher
- Composer 2.0 or higher
- Node.js 16.0 or higher
- npm or yarn
- MySQL 8.0 or higher
- Redis (for caching and sessions)

## 🛠️ Installation

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/hafizhzikry24/pos-app.git
cd pos-app
```

2. Install PHP dependencies:
```bash
cd backend
composer install
```

3. Environment setup:
```bash
cp .env.example .env
php artisan key:generate
```

4. Configure your database in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pos_app
DB_USERNAME=your_username
DB_PASSWORD=your_password (if exists)

TOKEN_IDENTIFIER=set_your_token_identifier_here_for_admin_portal
POS_TOKEN_IDENTIFIER=set_your_pos_token_identifier_here_for_cashier_app
```

5. Run database migrations:
```bash
php artisan migrate
php artisan db:seed
```

6. Start the development server:
```bash
php artisan serve
```

### Admin Portal Setup

1. Navigate to the portal directory:
```bash
cd portal-frontend
```

2. Install Node.js dependencies:
```bash
npm install
# or
yarn install
```

3. Environment setup:
```bash
cp .env.example .env.local
```

4. Configure API endpoint in `.env.local`:
```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_TOKEN_IDENTIFIER=your_token_identifier
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

### Cashier App Setup

1. Navigate to the cashier app directory:
```bash
cd cashier-pos
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Environment setup:
```bash
cp .env.example .env.local
```

4. Configure API endpoint in `.env.local`:
```env
EXPO_PUBLIC_API_URL=your_backend_api_url
EXPO_PUBLIC_TOKEN_IDENTIFIER=your_token_identifier
EXPO_PUBLIC_DUAL_SCREEN=true if you want to use dual screen feature
```

5. Start the development server:
```bash
npm start
# or
yarn start
```

## 🏗️ Architecture

```
pos-app/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/ # API Controllers
│   │   ├── Models/          # Eloquent Models
│   │   ├── Services/        # Business Logic
│   │   └── Repositories/    # Data Access Layer
│   ├── database/            # Migrations & Seeders
│   └── routes/              # API Routes
├── portal-frontend/         # Next.js Admin Portal
│   ├── src/
│   │   ├── app/            # App Router Pages
│   │   ├── components/     # Reusable Components
│   │   ├── services/       # API Services
│   │   └── hooks/          # Custom Hooks
└── cashier-pos/            # React Native App
    ├── src/
    │   ├── screens/        # App Screens
    │   ├── components/     # UI Components
    │   └── services/       # API Services
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
php artisan test
```

### Frontend Tests
```bash
cd portal-frontend
npm run test
# or
yarn test
```

## 📝 API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8000/api/documentation`
- API Routes: `http://localhost:8000/api/routes`

## 🚀 Deployment

### Backend Deployment
1. Configure production environment variables
2. Run `php artisan config:cache`
3. Run `php artisan route:cache`
4. Set up web server (Apache/Nginx) to point to `/public`
5. Configure SSL certificate
6. Set up cron jobs for scheduled tasks

### Frontend Deployment
1. Build the application:
```bash
npm run build
```
2. Deploy to Vercel, Netlify, or any Node.js hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Changelog

### [1.0.0] - 2024-02-22
- Initial release
- Complete CRUD operations for all entities
- Search and pagination functionality
- Database sharding for receipts
- Responsive admin dashboard
- Mobile cashier application

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **CORS Issues**
   - Check `config/cors.php` settings
   - Ensure frontend URL is allowed

3. **Authentication Issues**
   - Verify JWT secret is set
   - Check token expiration settings

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Hafizh Zikry** - *Initial work* - [hafizhzikry24](https://github.com/hafizhzikry24)

## 🙏 Acknowledgments

- [Laravel](https://laravel.com/) - The PHP framework for web artisans
- [Next.js](https://nextjs.org/) - The React framework for production
- [React Native](https://reactnative.dev/) - Build native mobile apps using React
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit

## 📞 Support

If you have any questions or need support, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Made with ❤️ for modern retail businesses**
