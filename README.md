# The Players Journal

## Screenshot

![App Screenshot](https://wajrock.me/projects/the-players-journal/cover.webp)

## Overview
This project is a community-driven platform where users can read articles about their favorite video games, leave comments, and engage with other gamers. Built with React for the front end and a basic PHP API for the back end, the site provides a robust and interactive user experience.

You can visit the live site at: [theplayersjournal.wajrock.me](http://theplayersjournal.wajrock.me)

## Features
- **User Authentication**: Secure login and registration system with password encryption.
- **Data Security**: Implementation of anti-injection measures for backend requests.
- **Immersive Design**: A visually appealing design that aligns with gaming aesthetics.
- **Storage and Caching**: Efficient data management for optimized retrieval and storage.
- **Responsive Images**: Images are adapted for various screen sizes for improved performance.
- **Collaborative System**: Users can share their opinions through a review system.
- **Responsive Design**: The site is fully responsive, adapting seamlessly across smartphones, tablets, and desktops.

## API Structure
The API is structured with the following endpoints:
- **`/article`**: 
  - Retrieve, modify, delete, or add articles by ID.
- **`/articles`**: 
  - Fetch multiple articles with filtering options based on keywords.
- **`/games`**: 
  - Access data related to various video games.
- **`/reviews`**: 
  - Retrieve, publish, or delete reviews for articles.
- **`/images`**: 
  - Manage image uploads, modifications, and retrieval.
- **`/users`**: 
  - Access and manage user information for login and registration.

## Technologies Used
- **Front End**: React
- **Back End**: PHP
- **Database**: MySQL
- **Authentication**: React Context
- **Styles**: SASS

## Getting Started
### Prerequisites
- Node.js
- PHP
- MySQL

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   ```
2. Navigate to the project directory:
   ```bash
   cd your-repo
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the PHP backend by configuring your server and database connection.
5. Import the database schema provided in the `database/` folder.

### Running the Application
- Start the React application:
  ```bash
  npm start
  ```
- Make sure the PHP server is running to handle API requests.


## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any inquiries or feedback, please reach out to [thibaud.wajrock@outlook.com](mailto:thibaud.wajrock@outlook.com).
```