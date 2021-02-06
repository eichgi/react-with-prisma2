import React from 'react';
import Nav from "./nav";

const Layout = ({children}) => {
  return (
    <div className="p-4">
      <Nav/>
      {children}
    </div>
  );
};

export default Layout;