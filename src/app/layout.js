import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'dashboard demo',
  description: 'dashboard demo developed by Crimson Tech',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}
