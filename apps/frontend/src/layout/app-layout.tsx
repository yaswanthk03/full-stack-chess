import { Outlet } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

const Layout = () => {
  return (
    <div>
      <main className="min-h-screen w-full mr-auto ml-auto px-8 max-w-7xl">
        <Header />
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
