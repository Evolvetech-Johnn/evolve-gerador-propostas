import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { indexRoute } from './routes/index'
import { editorRoute } from './routes/editor.$id'
import { leadsRoute } from './routes/leads'

const routeTree = rootRoute.addChildren([indexRoute, editorRoute, leadsRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
