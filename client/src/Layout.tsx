import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Layout = ({ children }: { children: JSX.Element|JSX.Element[]}) => {
  return (
    <>
      <div className="flex justify-between items-start">
        <Navbar />
        <div className="w-4/5 min-h-screen p-4 flex flex-col justify-between">
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;