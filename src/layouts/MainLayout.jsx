import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <>
      <h1>Header here</h1>
      <Outlet />
      <h1>Footer here</h1>
    </>
  );
};

export default MainLayout;
