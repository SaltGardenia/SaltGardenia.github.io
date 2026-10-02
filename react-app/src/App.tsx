import { Routes, Route } from 'react-router-dom'
import HomeView from '@/views/HomeView'

export default function App() {
  return (
    <>
      <div className="bg-aura" aria-hidden="true" />
      <Routes>
        <Route path="/" element={<HomeView />} />
      </Routes>
    </>
  )
}
