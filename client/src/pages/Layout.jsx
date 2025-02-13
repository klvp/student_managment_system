import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4 my-10">{children}</main>
    </>
  );
};

export default Layout;
