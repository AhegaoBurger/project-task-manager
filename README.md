# Project Task Manager

## Description

Project Task Manager is a Telegram Web App that allows users to manage tasks and projects directly within Telegram. It provides a seamless integration with Telegram's interface, offering features like task creation, project management, and bot integration for collaborative work.

## Features

- User authentication via Telegram
- Task creation and management
- Project organization
- Bot integration for group chats
- User profile management
- Subscription options (Free/Pro)

## Technologies Used

- Next.js
- React
- TypeScript
- Telegram Bot API
- @twa-dev/sdk for Telegram Web App integration
- Tailwind CSS for styling
- Lucide React for icons

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/project-task-manager.git
   ```

2. Install dependencies:
   ```
   cd project-task-manager
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   TELEGRAM_API_ID=your_api_id
   TELEGRAM_API_HASH=your_api_hash
   TELEGRAM_BOT_TOKEN=your_bot_token
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app`: Next.js app router and API routes
- `/components`: React components
- `/public`: Static files
- `/styles`: Global styles

## Key Components

- `TelegramWebApp.tsx`: Main component for Telegram Web App integration
- `TaskManager.tsx`: Task management interface
- `TaskList.tsx`: List of tasks
- `UserProfile.tsx`: User profile management

## API Routes

- `/api/getChats`: Fetches user's Telegram chats
- `/api/addBotToChat`: Adds the bot to a specified chat

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
