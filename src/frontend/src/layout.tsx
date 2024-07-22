import React from "react";
import Header from "./components/comps/header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-card">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
