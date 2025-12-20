# JobApplicator

A modern job application tracker built with React, TypeScript, and Node.js. Search for jobs, track your applications, and manage your job search process all in one place.

🌐 **Live App:** [https://job-applicator.up.railway.app/](https://job-applicator.up.railway.app/)

## Features

- 🔍 **Job Search**: Search for jobs using the JSearch API with filters for salary, remote work, and experience level
- 📝 **Application Tracking**: Track jobs you've applied to with details like application method, interview status, and interest level
- 🎨 **Modern UI**: Clean, responsive design with light/dark theme support
- 📊 **Experience Level Filtering**: Filter jobs by level (Entry, Mid, Senior, Staff, Principal)
- 💾 **Persistent Storage**: MongoDB integration to save your applied jobs

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Styling**: CSS Modules with CSS Custom Properties
- **Deployment**: Railway

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- RapidAPI account with JSearch API access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd JobApplicator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
RAPIDAPI_KEY=your_rapidapi_key_here
MONGODB_URI=mongodb://localhost:27017/jobTracker
PORT=3000
CLIENT_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Start MongoDB (if running locally):
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 mongo
```

5. Start the development server:
```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start Vite dev server for frontend
- `npm run server` - Start Express backend server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
JobApplicator/
├── src/
│   ├── components/      # React components
│   ├── services/        # API client
│   ├── types/           # TypeScript types
│   ├── contexts/        # React contexts (Theme)
│   ├── config/          # Configuration files
│   ├── server/          # Backend code
│   │   ├── config/      # Database config
│   │   └── routes/      # API routes
│   └── models/          # Mongoose models
├── server.ts            # Express server entry point
└── package.json
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RAPIDAPI_KEY` | Your RapidAPI JSearch API key | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `PORT` | Server port (default: 3000) | No |
| `CLIENT_URL` | Frontend URL for CORS | Yes |
| `VITE_API_BASE_URL` | Backend API URL (dev only) | No |

## Deployment

The app is deployed on Railway. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Production URL:** [https://job-applicator.up.railway.app/](https://job-applicator.up.railway.app/)

## Getting Your RapidAPI Key

1. Go to [rapidapi.com](https://rapidapi.com) and sign up/login
2. Search for "JSearch" API
3. Subscribe to a plan (free tier available)
4. Copy your API key from the dashboard
5. Add it to your `.env` file as `RAPIDAPI_KEY`

## Known Issues

- **API Pagination**: The JSearch API returns all results regardless of pagination parameters. The app manually paginates results on the server side.
- **Experience Level Detection**: Job levels are inferred from job titles using keyword matching. Some jobs may be misclassified.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
