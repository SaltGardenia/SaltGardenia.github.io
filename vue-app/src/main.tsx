import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { I18nProvider } from '@/i18n'
import App from '@/App'
import '@/styles/main.css'

createRoot(document.getElementById('app')!).render(
  <HashRouter>
    <I18nProvider>
      <App />
    </I18nProvider>
  </HashRouter>,
)
