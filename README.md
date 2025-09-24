# ClimateVision 🌍

**AI-Powered Climate Literacy Through Visual Transformation**

ClimateVision is an innovative web application that uses Google's Gemini AI to help users understand climate change impacts through powerful visual transformations. Upload any nature image and see how climate change could affect that environment - from rising sea levels to extreme weather events.

## 🌟 Features

### Core Functionality
- **AI-Powered Image Transformation**: Upload nature photos and apply various climate effects using Google Gemini 2.5 Flash
- **Interactive Effect Selection**: Choose from predefined climate effects or describe custom scenarios
- **Real-time Generation**: Watch as AI transforms your images to show climate impacts
- **Download & Share**: Save generated images and share climate awareness content

### Advanced Features
- **EcoVoice Integration**: AI-powered conversational assistant for climate education
- **Climate Reports**: Access comprehensive environmental reports and data
- **Notification System**: Real-time feedback and status updates
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Climate Effects Available
- Rising sea levels and flooding
- Extreme weather events (hurricanes, storms)
- Drought and desertification
- Deforestation impacts
- Urban heat islands
- Wildfire effects
- And many more custom scenarios

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Google Gemini API key (for AI functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd ClimateVision
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Add your Google Gemini API key to .env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible UI components

### AI & Backend Services
- **Google Gemini AI** - Advanced multimodal AI for image generation
- **Supabase** - Backend as a service for data management
- **React Query** - Server state management and caching

### Additional Libraries
- **React Router** - Client-side routing
- **React Hook Form** - Form state management
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **ElevenLabs ConvAI** - Conversational AI widget

## 📱 Usage

1. **Upload an Image**: Click the upload area and select a nature photo
2. **Choose an Effect**: Select from predefined climate effects or describe a custom scenario
3. **Generate**: Click "Generate Climate Effect" to transform your image
4. **Download & Share**: Save the result and share to raise climate awareness

## 🎯 Use Cases

- **Education**: Teach students about climate change impacts visually
- **Awareness Campaigns**: Create compelling content for environmental advocacy
- **Research Visualization**: Illustrate potential future scenarios
- **Personal Learning**: Understand how climate change might affect familiar places

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── VideoHero.tsx   # Main interaction area
│   ├── ImageUpload.tsx # Image upload component
│   └── EffectSelector.tsx # Climate effect selection
├── pages/              # Page components
├── services/           # API services (Gemini AI)
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
└── lib/                # Utility functions
```

## 🌐 Deployment

### Quick Deploy with Lovable
1. Visit [Lovable Project](https://lovable.dev/projects/f8018315-674c-408e-a494-dcb9c61b5259)
2. Click Share → Publish
3. Your app will be live instantly

### Manual Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## 🤝 Contributing

We welcome contributions to make ClimateVision even better! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powerful image generation capabilities
- The climate science community for inspiration and data
- Open source contributors who made this project possible

---

**Together, we can visualize the future and take action today.** 🌱
