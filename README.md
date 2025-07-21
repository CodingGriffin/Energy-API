# Network API - Solar System Management Platform

A comprehensive RESTful API for managing solar energy systems, financial calculations, and user authentication. Built with Node.js, Express, and Sequelize ORM.

## 🚀 Features

- **Authentication System**: JWT-based authentication with OTP verification
- **Solar System Calculator**: Advanced financial modeling for solar installations
- **System Management**: CRUD operations for solar systems and components
- **Geographic Integration**: Location-based system mapping and zoning
- **Financial Analytics**: ROI, IRR, NPV, and LCOE calculations
- **Multi-tenant Architecture**: Support for different user roles and companies
- **API Documentation**: Swagger/OpenAPI integration

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL or MySQL database
- Docker (optional, for containerized deployment)
- Google Cloud Platform account (for deployment)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd network-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=8081
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=network_api
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_email
   SMTP_PASS=your_password
   ```

4. **Database Setup**
   ```bash
   # Run database migrations (if available)
   npm run migrate
   
   # Seed initial data (if available)
   npm run seed
   ```

## 🚀 Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The API will be available at `http://localhost:8081`

### API Documentation
Access Swagger documentation at: `http://localhost:8081/api-docs`

## 📁 Project Structure

```
├── app.js                 # Application entry point
├── package.json          # Dependencies and scripts
├── Dockerfile           # Docker configuration
├── swagger.js           # Swagger configuration
├── common/
│   └── calc.js         # Financial calculation utilities
├── database/
│   └── database.js     # Database configuration and models
├── models/             # Sequelize models
│   └── System.js      # Solar system model
├── services/          # API services organized by domain
│   ├── auth/         # Authentication services
│   ├── api/          # Core API endpoints
│   └── calculator/   # Solar calculation services
└── cloudbuild*.yaml  # Google Cloud Build configurations
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/otp/send` - Request OTP for authentication
- `POST /api/auth/otp/resend` - Resend OTP
- `POST /api/auth/otp/verify` - Verify OTP and login
- `GET /api/auth/logout` - Logout user

### Solar Calculator
- `POST /api/calculator/calculate` - Calculate solar system specifications and costs

### System Management
- `GET /api/tender` - Get solar system tenders with filtering
- `GET /api/tender/:id` - Get detailed tender information
- `POST /api/system/submit` - Submit new solar system
- `GET /api/map/systems` - Get systems for map display
- `GET /api/map/zones` - Get zones by location

### User Management
- `POST /api/lead/submit` - Submit lead information
- `POST /api/role/submit` - Create user roles
- `POST /api/company/submit` - Register companies
- `GET /api/view-type` - Get available view types for user

## 💰 Financial Calculations

The system provides comprehensive financial modeling including:

- **ROI (Return on Investment)**: Percentage return over investment period
- **IRR (Internal Rate of Return)**: Discount rate for NPV = 0
- **NPV (Net Present Value)**: Present value of future cash flows
- **LCOE (Levelized Cost of Energy)**: Cost per kWh over system lifetime
- **Payback Period**: Time to recover initial investment

### Key Parameters
- System life expectancy: 20 years
- Degradation rate: 2.9% per annum
- Escalation rate: 2.5% per annum
- Discount rate: 3% per annum

## 🏗️ System Specifications

### Solar Panel Configuration
- Panel rating: 500W per panel
- Daily generation: 4.5 kWh per panel
- Peak power: 0.5 kW per panel
- Battery capacity: 2.5 kWh per panel
- Panel cost: R27,000 per panel

### EMS (Energy Management System)
- EMS cost: R9,000 per unit
- Configuration: 1 EMS per 12 panels (minimum)
- Distribution board integration

## 🐳 Docker Deployment

Build and run with Docker:
```bash
docker build -t network-api .
docker run -p 8081:8080 network-api
```

## ☁️ Google Cloud Deployment

The project includes Cloud Build configurations for different environments:

### Development
```bash
gcloud builds submit --config cloudbuild-dev.yaml
```

### Production
```bash
gcloud builds submit --config cloudbuild-prod.yaml
```

## 🔒 Security Features

- JWT token-based authentication
- OTP verification for secure login
- Rate limiting on OTP requests
- Input validation and sanitization
- CORS configuration
- Environment-based configuration

## 📊 Database Models

### Core Models
- **User**: User account information
- **System**: Solar system specifications and financial data
- **Company**: Company/organization details
- **Address**: Geographic location data
- **Role/Permission**: Access control system

### Relationships
- Users can have multiple staff roles across companies
- Systems are linked to addresses for geographic mapping
- Companies have multiple user types and roles

## 🧪 Testing

```bash
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🤝 Support

For support and questions, please contact the development team or create an issue in the repository.

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
  - Authentication system
  - Solar calculator
  - System management
  - Financial modeling