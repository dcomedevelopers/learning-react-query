import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import {
  QueryClientProvider,
} from 'react-query'

import client from './data/client.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
