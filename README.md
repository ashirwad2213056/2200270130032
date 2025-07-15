# React URL Shortener Application

A modern, feature-rich URL shortener built with React, TypeScript, and Material-UI. This application provides comprehensive URL management with analytics, authentication, and a beautiful responsive interface.

![URL Shortener](https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-7+-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)

## ✨ Features

### 🔗 URL Shortening
- **Instant URL Shortening**: Convert long URLs into short, shareable links
- **Custom Shortcodes**: Create personalized shortcodes for branded links (minimum 3 characters)
- **Expiration Dates**: Set automatic expiration for temporary links
- **Bulk URL Support**: Shorten multiple URLs efficiently

### 🔐 Authentication System
- **User Registration & Login**: Secure user accounts with persistent sessions
- **Protected Features**: Advanced features available for authenticated users
- **Session Management**: Automatic login persistence using localStorage

### 📊 Advanced Analytics Dashboard
- **Comprehensive Statistics**: Track total URLs, clicks, and performance metrics
- **Detailed Click Analytics**:
  - **Source Tracking**: Monitor where clicks originate (direct, social media, etc.)
  - **Geographic Data**: Track clicks by country and region
  - **Device Analytics**: Monitor desktop, mobile, and tablet usage
  - **Time-based Analytics**: Track clicks by hour and date patterns
- **Top Performing URLs**: Identify your most successful links
- **Click History**: View detailed chronological click data
- **Individual URL Details**: Expandable detailed view for each shortened URL

### 🎨 User Experience
- **Material-UI Design**: Modern, professional interface with consistent design language
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **QR Code Generation**: Create QR codes for mobile sharing
- **Copy to Clipboard**: One-click copying of shortened URLs
- **Real-time Updates**: Live click tracking and statistics updates

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0 with TypeScript
- **UI Framework**: Material UI (MUI) 7.2.0
- **Routing**: React Router DOM 7.6.3
- **QR Codes**: QRCode library 1.5.4
- **HTTP Client**: Axios 1.10.0
- **Build Tool**: Create React App with React Scripts 5.0.1

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashirwad2213056/2200270130032.git
   cd 2200270130032
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage Guide

### Creating Shortened URLs
1. Enter a valid URL in the input field
2. (Optional) Login to access advanced features:
   - Custom shortcode creation
   - Expiration date setting
3. Click "Shorten URL" to generate the short link
4. Copy the shortened URL using the copy button
5. Generate QR codes for mobile sharing

### Viewing Analytics
1. **Login Required**: Use the login button in the header
2. **Navigate to Analytics**: Click "Analytics" in the navigation
3. **View Statistics**: 
   - Dashboard overview with key metrics
   - Top performing URLs table
   - Detailed analytics by source, country, device, and time
   - Click history trends

### Authentication
- **Demo Mode**: Use any email/password combination for testing
- **Data Persistence**: URLs and analytics stored in browser localStorage
- **Session Management**: Login state persists across browser sessions

## 👨‍💻 Developer

**Ashirwad**
- GitHub: [@ashirwad2213056](https://github.com/ashirwad2213056)
- Student ID: 2200270130032

---

**Built with ❤️ using React and Material UI**

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
