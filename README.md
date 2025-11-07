# Precis
 Precis is a URL shortener made with Node.js, Express, MongoDB, and React.

https://precis-urls.vercel.app/

## Features
- Instant URL shortening - Convert long URLs into compact, shareable links
- Monitor how many times your shortened links are accessed
- Animated starfield background with smooth transitions
- No sign-up required, just paste and shorten  

<br>**Motivation**<br>
In a world of lengthy, complex URLs, Precis provides a simple solution for creating clean, memorable short links. Perfect for sharing on social media, messaging apps, or anywhere character count matters.

**Technology**<br>
Frontend made with React and TailwindCSS. Backend is Node.js serverless functions accessing a MongoDB database. Hosted by Vercel<br>

## How it Works
1. User enters a URL into the input field
2. Backend generates a unique 6-character code
3. URL and shortcode are stored in MongoDB
4. User receives shortened link: `precis.app/abcdef`
5. When visited, the shortcode redirects to original URL and increments click counter

**Installation and Setup**
```bash
# Clone repository
git clone https://github.com/kobebayliss/Precis.git
cd Precis

# Install dependencies
npm install

# Set up environment variables
# Create .env file
# MONGODB_URI=your_mongodb_connection_string

# Run development server
npm run dev
```

## Legal and Contact
This project is open-source and stores user-submitted URLs in a database for redirection purposes. No personal data is ever collected beyond the URLs shortened and basic click analytics.
<br><br>kobebayliss1@gmail.com
