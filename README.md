
# Weight Loss Tracker App

A weight loss tracker application built with React, Supabase, and Tailwind CSS, allowing users to monitor their weight loss journey. The app includes features for user authentication, weight tracking, and graphical representation of weight progress over time.

## Table of Contents
1. [Features](#features)
2. [Folder Structure](#folder-structure)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Environment Variables](#environment-variables)
6. [Running the Application](#running-the-application)
7. [Supabase Setup](#supabase-setup)
8. [Components](#components)
9. [Screenshots](#screenshots)
10. [License](#license)

---

## Features

- **User Authentication:** Register and log in securely.
- **Weight Tracking:** Users can enter daily weight records.
- **Graphical Representation:** View weight progress over time in a line chart.
- **Responsive Design:** Optimized for various screen sizes.

## Folder Structure

```plaintext
react-supabase-auth/
├── dist/                      # Build output
├── node_modules/              # Dependencies
├── public/                    # Static assets
│   ├── diet.svg               # App icon
│   ├── logo.jpeg              # App logo
│   ├── unsplash1.jpg          # Background images
│   └── ...                    # Other static assets
├── src/                       # Source code
│   ├── assets/                # Images and assets
│   ├── components/            # Reusable components
│   │   ├── DatePicker/        # Date picker component
│   │   ├── Input/             # Input component
│   │   ├── LineChart/         # Line chart component for weight graph
│   │   └── Navbar/            # Navigation bar component
│   ├── context/               # Context providers
│   │   └── AuthProvider.jsx   # Authentication context
│   ├── pages/                 # Pages for the application
│   │   ├── AdminRegister.jsx  # Admin registration page
│   │   ├── Dashboard.jsx      # User dashboard with weight tracking
│   │   ├── Home.jsx           # Home page
│   │   ├── Login.jsx          # User login page
│   │   └── ...                # Other pages (Register, Password Reset)
│   ├── supabase/              # Supabase client setup
│   ├── App.jsx                # Root application component
│   ├── index.css              # Global styles
│   └── main.jsx               # Entry point
├── .env.example               # Example environment variables
├── package.json               # Project metadata and dependencies
├── tailwind.config.js         # Tailwind CSS configuration
└── vite.config.js             # Vite configuration
```

## Prerequisites

Before running this application, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or above)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Supabase](https://supabase.io/) account to obtain API credentials

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/react-supabase-auth.git
   cd react-supabase-auth
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Supabase:**
   - Create a project on [Supabase](https://supabase.io/).
   - Copy your API keys and add them to `.env` (see [Environment Variables](#environment-variables)).

## Environment Variables

Create a `.env` file in the root directory of your project and add the following environment variables. Replace `your_supabase_project_url` and `your_supabase_project_key` with your Supabase project's URL and API key.

```plaintext
VITE_SUPABASE_PROJECT_URL=your_supabase_project_url
VITE_SUPABASE_PROJECT_KEY=your_supabase_project_key
```

## Running the Application

To start the application in development mode:

1. **Run the app:**
   ```bash
   npm run dev
   ```

2. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## Supabase Setup

To connect to Supabase, the app uses the `createClient` function from the `@supabase/supabase-js` library. This allows us to interact with the Supabase database for authentication and data storage.

Example Supabase client setup in `src/supabase/client.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const projectURL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const projectKey = import.meta.env.VITE_SUPABASE_PROJECT_KEY;

export const supabase = createClient(projectURL, projectKey);
```

This setup initializes the Supabase client with the project URL and API key, allowing us to perform database operations and handle authentication securely.

## Components

- **AuthProvider**: Handles user authentication context.
- **DatePicker**: Allows users to select dates for weight entries.
- **Input**: Custom input field used across the app.
- **LineChart**: Displays a line chart of weight over time.
- **Navbar**: Top navigation bar with links to different sections.

## Screenshots

- **Login Page**: Secure login for users.
- **Dashboard**: Interface to add weight records and view progress graphically.

## License

This project is licensed under the MIT License.
