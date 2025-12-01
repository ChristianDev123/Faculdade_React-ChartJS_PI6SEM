import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
  TimeScale,
} from 'chart.js';
import "chartjs-adapter-date-fns";
import Home from "./screens/home";
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route index path="/dashboard" element={<Home/>}/>
      </Routes> 
    </BrowserRouter>
  )
}
