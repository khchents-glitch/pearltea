#!/bin/bash

# PearlTea POS - PostgreSQL Setup Script
# This script helps you set up PostgreSQL quickly

echo "🚀 PearlTea POS - PostgreSQL Quick Setup"
echo "========================================\n"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed"
    echo "\n📝 Install PostgreSQL:"
    echo "   Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "   macOS: brew install postgresql@17"
    echo "   Using Docker: docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres:16-alpine"
    exit 1
fi

echo "✅ PostgreSQL is installed\n"

# Check if PostgreSQL is running
if ! sudo systemctl is-active --quiet postgresql; then
    echo "📋 Starting PostgreSQL service..."
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    echo "✅ PostgreSQL service started\n"
else
    echo "✅ PostgreSQL service is running\n"
fi

# Create database and user
echo "📦 Setting up database and user..."

sudo -u postgres psql <<EOF
-- Create database
DROP DATABASE IF EXISTS pearltea;
CREATE DATABASE pearltea;

-- Create user (adjust password as needed)
CREATE USER IF NOT EXISTS pearltea_user WITH PASSWORD 'pearltea_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE pearltea TO pearltea_user;
\c pearltea
GRANT ALL ON SCHEMA public TO pearltea_user;
GRANT USAGE ON SCHEMA public TO pearltea_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO pearltea_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO pearltea_user;
\q
EOF

echo "✅ Database 'pearltea' and user 'pearltea_user' created\n"

# Update .env file
echo "⚙️  Updating .env file..."
if [ -f .env ]; then
    cat > .env <<EOF
# PearlTea POS - Environment Variables

# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://pearltea_user:pearltea_password@localhost:5432/pearltea"

# JWT Secret
JWT_SECRET="pearl-tea-development-secret-key-please-change-in-production"

# Application Configuration
NODE_ENV="development"
PORT=3001
EOF
    echo "✅ .env file updated\n"
else
    echo "❌ .env file not found"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed\n"
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated\n"

# Push schema to database
echo "🗄️  Pushing database schema..."
npx prisma db push
echo "✅ Database schema pushed\n"

# Run tests
echo "🧪 Running tests..."
node tests/simple-test.js
if [ $? -eq 0 ]; then
    echo "\n✅ All tests passed! 🎉"
    echo "\n🎉 Setup complete!"
    echo "\n📝 Next steps:"
    echo "   1. Start development server: npm run dev"
    echo "   2. Open browser: http://localhost:3001"
    echo "   3. Or test with: npm run db:studio"
else
    echo "\n❌ Some tests failed"
    echo "\n🔧 Troubleshooting:"
    echo "   1. Check: sudo systemctl status postgresql"
    echo "   2. Database: sudo -u postgres psql"
    echo "   3. Logs: sudo tail -f /var/log/postgresql/postgresql-16-main.log"
fi