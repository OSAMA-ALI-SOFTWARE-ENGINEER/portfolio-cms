import { Suspense, lazy, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import Education from "./component/resume/Education";
import Skills from "./component/resume/Skills";
import Experience from "./component/resume/Experience";
import Certificates from "./component/resume/Certificates";
import ResumeHome from "./component/resume/ResumeHome";
import PageLoader from "./ui/PageLoader";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserAccount from "./component/user/UserAccount";
import ForgotPassword from "./component/forgotPassword/ForgotPassword";
import RecoverPassword from "./component/forgotPassword/RecoverPassword";
import DetailBlog from "./component/blog/DetailBlog";
import { ModalProvider } from "./context/ModalContext";
import BlogManagement from "./component/dashboard/BlogManagement";
import UserManagement from "./component/dashboard/UserManagement";
import CertificateManagement from "./component/dashboard/CertificateManagement";
import SettingsProfile from "./component/dashboard/SettingsProfile";
import SettingsPassword from "./component/dashboard/SettingsPassword";
import DashboardHome from "./component/dashboard/DashboardHome";
import Header from "./ui/Header";
import Footer from "./pages/Footer";

// Dynamic imports
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Home = lazy(() => import("./pages/Home"));
const Features = lazy(() => import("./pages/Features"));
const Resume = lazy(() => import("./pages/Resume"));
const Blog = lazy(() => import("./pages/Blog"));
const Contacts = lazy(() => import("./pages/Contacts"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
      },
    },
  });

  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();
  const isAuthPages =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/dashboard");
  const close = () => setOpenModal(false);

  return (
    <div className="App">
      <ModalProvider>
        <QueryClientProvider client={queryClient}>
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
          <Toaster
            position="top-right"
            gutter={12}
            containerStyle={{ margin: "8px", fontFamily: "Montserrat" }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: "12px",
                maxWidth: "500px",
                padding: "10px 24px",
                fontWeight: "500",
                background: "white",
                color: "rgb(33, 21, 21)",
              },
            }}
          />
          <AnimatePresence mode="wait">
            {!isAuthPages && <Header key="header" />}
            <Suspense fallback={<PageLoader />}>
              <Routes location={location} key={location.pathname}>
                <Route path="dashboard" element={<Dashboard />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="manage-blogs" element={<BlogManagement />} />
                  <Route path="manage-users" element={<UserManagement />} />
                  <Route path="manage-certificates" element={<CertificateManagement />} />
                  <Route path="settings/profile" element={<SettingsProfile />} />
                  <Route path="settings/password" element={<SettingsPassword />} />
                </Route>
                <Route index element={<Home />} />
                <Route path="features" element={<Features />} />
                <Route path="resume" element={<Resume />}>
                  <Route index element={<ResumeHome />} />
                  <Route path="education" element={<Education />} />
                  <Route path="skills" element={<Skills />} />
                  <Route path="experience" element={<Experience />} />
                  <Route path="certificates" element={<Certificates />} />
                </Route>
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:blogId" element={<DetailBlog />} />

                <Route path="contacts" element={<Contacts />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="me" element={<UserAccount />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="update-password" element={<RecoverPassword />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
          {!isAuthPages && (
            <Footer
              setOpenModal={setOpenModal}
              openModal={openModal}
              onClose={close}
            />
          )}
        </QueryClientProvider>
      </ModalProvider>
    </div>
  );
}
export default App;
// End of App component
