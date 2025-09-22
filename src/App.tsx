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
    <>
    <Home/>
    </>
  )
}
