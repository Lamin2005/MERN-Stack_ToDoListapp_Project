import Home from "./pages/Home";
import Main from "./layout/Main";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import { UserProvider } from "./context/userContext";
import Forgotpassword from "./pages/ForgotPassword";
import OTP from "./pages/OTP";
import ResetPassword from "./pages/ResetPassword";
import Editpage from "./pages/Editpage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "auth",
          element: <Login />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "forgotpassword",
          element: <Forgotpassword />,
        },
        {
          path: "verify-otp",
          element: <OTP />,
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
        },
        {
          path: "/todolists-edit/:id",
          element: <Editpage/>
        },
      ],
    },
  ]);

  return (
    <>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </>
  );
}

export default App;
