# ResearchHub

A modern web application for academic research paper discovery and note-taking, built with React, TypeScript, and Vite.

## Features

- 🔍 Smart Search across multiple academic sources:
  - PubMed
  - arXiv
  - bioRxiv
  - medRxiv
  - CrossRef

- 📝 Integrated Note-Taking:
  - Real-time note editing
  - Quick copy from papers
  - Keyboard shortcuts
  - Export notes as text files

- 🎯 Advanced Filtering:
  - Date range filtering
  - Citation-based sorting
  - Source selection
  - Custom search parameters

## Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide Icons
- React Router DOM
- Zustand (State Management)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/forcreator/research-hub.git
cd research-hub
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Build for production:
```bash
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── services/         # API and business logic
├── types/           # TypeScript type definitions
└── App.tsx          # Root component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all the academic APIs that make this project possible
- Built with ❤️ for researchers and academics