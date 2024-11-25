# NexProLink Quick Start

Hi! To quickly start the development environment for NexProLink, follow these steps:

1. **Automated Setup (Recommended)**
```bash
cd C:\Users\AiMaster\Desktop\Home\NexProLink_project\docs\implementation
.\startup.bat
```
This will automatically:
- Install required dependencies
- Set up the project
- Start the development server

2. **Manual Setup**
If you prefer manual setup or encounter issues:
```bash
cd C:\Users\AiMaster\Desktop\Home\NexProLink_project\frontend
npm install
npm run dev
```

3. **Environment Variables**
Ensure `.env.local` exists in the frontend directory with Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

4. **Verify Setup**
- Open http://localhost:3000
- Try signing up/in
- Check Firebase console

For detailed setup instructions or troubleshooting:
- See `STARTUP_GUIDE.md` in this directory
- Check Firebase console for authentication settings
- Verify environment variables

Need help? Just ask and I'll guide you through any specific issues!
