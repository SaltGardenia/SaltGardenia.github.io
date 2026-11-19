import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { I18nProvider } from '@/i18n'
import App from '@/App'
import '@/styles/main.css'

// BrowserRouter：导航定位只写入 hash（#about 等），不改路径，
// 刷新时仍命中 "/" 路由；若用 HashRouter，hash 会被当成路由路径，
// 刷新后无匹配路由导致白屏卡死
createRoot(document.getElementById('app')!).render(
  <BrowserRouter>
    <I18nProvider>
      <App />
    </I18nProvider>
  </BrowserRouter>,
)
