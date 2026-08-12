// Using the automatic JSX runtime; no default React import required
import { Routes, Route, Link } from 'react-router-dom'
import Visuals from './pages/Visuals'
import Home from './pages/Home'
import Admin from './pages/Admin'

export default function App(){
  return (
    <div className="min-h-screen">
      <nav className="p-6 flex items-center justify-between">
        <div className="h-8 text-xl font-semibold">HONESTY VISUALS</div>
        <div className="space-x-4">
          <Link to="/" className="text-sm">Home</Link>
          <Link to="/visuals" className="text-sm">Visuals</Link>
          <Link to="/admin" className="text-sm">Admin</Link>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/visuals" element={<Visuals/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </main>
    </div>
  )
}
