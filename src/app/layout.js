import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
  title: 'dashboard demo',
  description: 'dashboard demo developed by Crimson Tech',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader color="#009999" initialPosition={0.08} crawlSpeed={200} height={3} crawl={true} showSpinner={false} easing="ease" speed={200} shadow="0 0 10px #009999,0 0 5px #009999"/>
        {children}
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}
