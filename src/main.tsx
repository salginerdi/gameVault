import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GameProvider } from './context/GameContext.tsx'

document.title = "GameVault | Dijital Oyun Dünyası"

const favicon = (document.querySelector('link[rel="icon"]') as HTMLLinkElement) || document.createElement('link')
favicon.rel = 'icon'
favicon.href = 'https://img.icons8.com/fluency/48/lightning-bolt.png'
if (!document.head.contains(favicon)) {
    document.head.appendChild(favicon)
}

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <GameProvider>
                <App />
            </GameProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)