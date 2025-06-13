import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-0 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}