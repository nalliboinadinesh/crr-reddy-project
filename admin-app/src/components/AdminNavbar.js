import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { FiMenu, FiX, FiLogOut, FiHome } from 'react-icons/fi';

export const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Students', path: '/admin/students' },
    { name: 'Branches', path: '/admin/branches' },
    { name: 'Materials', path: '/admin/materials' },
    { name: 'Papers', path: '/admin/question-papers' },
    { name: 'Announcements', path: '/admin/announcements' },
    { name: 'Banner', path: '/admin/banner' }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="fixed w-full top-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white p-1">
              <img 
                src="https://abhi-crr.s3.ap-south-1.amazonaws.com/300060993_467370488735241_2637983149385496727_n.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAR566WG6HEAROKAIP%2F20260125%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20260125T104321Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCmFwLXNvdXRoLTEiSDBGAiEA6RN1tqU44VMj2jZPg3WvpHiYI7C9y1WOxlnRtCJWfP0CIQCr3B8r%2FJdYIB37ddOTk%2BTBSqn59%2BRxKHpES66pWpDM7irbAggkEAAaDDEzMzA3NDEzOTAyMiIMIX36rohArqr78XY7KrgCDTdbcENHeZnqOGQEgKB3M5W4n96KNCdjxTxBaZ8hwpkxZZj6K3fpVv8wWF2t8lwu80NIfiHMgUA9OATaYtPkXw6sbcQ0SL7VPkezIkAWLws5aV2eGoms9g8y7jkQMPFf%2FznLDSL41h1nCKV4snmZcolCxmIQn29OPTdOSkEGGxvJWXTlW%2BPvTP5C2qEIHmKxBLYm91QrYwqycFAJGwekfCc7VegS%2FAj1Va%2BUYh0n4CV9SAmQ42Nqnhx%2BFMhgXAjthWXobSr%2Br3gl3RgViAg4c3y5J%2FXfpN3UhBGxZ4b1jvPKm3MpFRq1o3HczWvgyPFTmIOfQo2LVfBjA0ge6kJgTu9HRwAxbpmmbDca4kjlW3i3H94lvBhS3WrsvKwtUq1n7Diar2TkNd5gaLwL9930gYiQLcdkrHgAMIe41ssGOqwCBkE8sxWfIs7Ntj9g4G9%2FMkjKLWC3%2BqU9UOWsGtEpudGDPN9%2B%2FdGA6MFOqXd539%2FcvN0e88jw7YiwZ3H82%2FsQ9XAfyrTxrhjT4ieWWg6XnzJ31KYVFnKaCVe8T4fajm9j0L10KgMiF45rALxeO6AlOKze2CdB8r%2FuG7tT6VbzqdmaVCh5bg6fDhe5dU22HCXSSYvv1099GNm%2Fk49NP57Ju2rFhO68NYNWx9WQ6hWpH859MUtpZMxYjSSQllpHdF7oMH5kzhsKYbIrFHeRcwIYDZOJNg7E5esf0hrYsPJHoRHClB1ntXASHQexDki9q98JsnNHJznqRqJClqjEVsGGcoT45iBbuqjhydGfx9ydVMVouO6mIPJKhUwmSpx907PMgEiSSJp0Z%2F0Q8cGI&X-Amz-Signature=f7f25d052502727bb7f09115da00874545d15a978e09b2d2c0d30a9010fc81b4&X-Amz-SignedHeaders=host&response-content-disposition=inline" 
                alt="College Logo" 
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">Sir C.R. Reddy Admin</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-blue-200">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <FiLogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700"
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-blue-800 border-t border-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-700"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
