# 🤖 VERUM Chat GPT

Advanced AI Chat Interface - ChatGPT style with PDF upload, Voice TTS, Code execution, and more.

## ✨ Features

- 💬 **ChatGPT-style Interface** - Clean, modern chat UI
- 📄 **PDF Upload & Processing** - Upload and analyze PDF documents
- 🎤 **Voice Input** - Speech-to-text using browser APIs
- 🔊 **Text-to-Speech** - Read responses aloud
- 💻 **Code Highlighting** - Syntax highlighting for code blocks
- 🔄 **Streaming Responses** - Real-time streaming like ChatGPT
- 📱 **Responsive Design** - Works on all devices

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build
npm run build

# Start production server
npm start
```

## 🔑 Environment Variables

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 📦 Deploy to Heroku

```bash
# Create Heroku app
heroku create verum-chat

# Set environment variables
heroku config:set OPENAI_API_KEY=your_key_here -a verum-chat

# Deploy
git push heroku main
```

## 🏗️ Project Structure

```
verum-chat/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # Chat streaming API
│   │   ├── upload-pdf/route.ts  # PDF processing
│   │   └── tts/route.ts         # Text-to-speech
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main chat page
│   └── globals.css              # Global styles
└── package.json
```

## 🎯 Usage

1. **Start Chatting**: Type your message and press Enter
2. **Upload PDF**: Click the paperclip icon to upload PDFs
3. **Voice Input**: Click the microphone icon to speak
4. **Read Aloud**: Click "🔊 Read aloud" on any assistant message
5. **Code Blocks**: Code is automatically highlighted with syntax highlighting

## 🔧 Technologies

- **Next.js 16** - React framework
- **OpenAI API** - GPT-4 for chat
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code highlighting
- **PDF Parse** - PDF text extraction
- **Tailwind CSS** - Styling

## 📝 License

Part of the VERUM Node ecosystem.
