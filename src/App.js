import "./App.css";
import MainPage from "./Components/MainPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Transcation from "./DashboardComp/TranscationFile/Transcation";
import PaymentLink from "./DashboardComp/EventListFolder/PaymentLink";
import Home from "./DashboardComp/Home";
import Settlements from "./DashboardComp/SettlementFolder/Settlements";
import MyStores from "./DashboardComp/MyStores";
import Report from "./DashboardComp/ReportFolder/Report";
import Form from "./DashboardComp/Form";
import Home1 from "./DashboardComp/Home1File/Home1";
import DynamicForm from "./DashboardComp/DynamicFormFolder/DynamicForm";
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute component
import ViewRegistationForm from "./DashboardComp/viewUserRegistrationData/ViewRegistationForm";
import DynamicFormPage from "./DashboardComp/UserPage/DynamicFormPage";

function App() {
  return (
    <>
      {/* Login Page */}

      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/Home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            <Route
              path="Home1"
              element={
                <ProtectedRoute>
                  <Home1 />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="payment"
              element={
                <ProtectedRoute>
                  <PaymentLink />
                </ProtectedRoute>
              }
            />
            <Route
              path="trans"
              element={
                <ProtectedRoute>
                  <Transcation />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="report"
              element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="settlements"
              element={
                <ProtectedRoute>
                  <Settlements />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="mystore"
              element={
                <ProtectedRoute>
                  <MyStores />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="details/:eventId"
              element={
                <ProtectedRoute>
                  <Form />
                </ProtectedRoute>
              }
            />
            <Route
              path="DynamicForm/:eventId"
              element={
                <ProtectedRoute>
                  <DynamicForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="viewregistration/:eventId"
              element={<ViewRegistationForm />}
            />
          </Route>
          <Route path="userpage/:eventId" element={<DynamicFormPage />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
