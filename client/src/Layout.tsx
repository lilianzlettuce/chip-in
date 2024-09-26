import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Layout = ({ children }: { children: JSX.Element|JSX.Element[]}) => {
  return (
    <>
      <div className="flex justify-between items-start">
        <Navbar />
        <div className="w-4/5 p-4">
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;