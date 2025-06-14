import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer />
          <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;