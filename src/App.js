import { Layout } from "./Layout";
import { Home } from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useToken from "./services/useToken";
import { Login } from "./component/Login";
import { Profile } from "./pages/Profile";
import { ProfileTutor } from "./pages/ProfileTutor";
import StudentBookingRequest from "./pages/student/StudentBookingRequest";
import PrivateRoute from "./services/PrivateRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ModeratorHome } from "./pages/moderator/ModeratorHome.jsx";
import Features from "./pages/Features";
import StudentRequestsPage from "./pages/student/StudentRequestsPage.jsx";
import { SchedulePage } from "./pages/student/SchedulePage";
import AdminStudentManagement from "./pages/admin/AdminStudentManagement.jsx";
import parseJwt from "./services/parseJwt.js";
import AdminTutorsManagement from "./pages/admin/AdminTutorsManagement.jsx";
import { ModeratorTutorApplicationRequests } from "./pages/moderator/ModeratorTutorApplicationRequests.jsx";
import { ChartPage } from "./component/ChartPage.jsx";
import Test from "./Test.jsx";
import TutorRequestsPage from "./pages/tutor/TutorRequestPage.jsx";
import { ModeratorTutorPost } from "./pages/moderator/ModeratorTutorPost.jsx";
import { PostDetails } from "./pages/tutor/PostDetails";
import { CreatePostPage } from "./pages/tutor/CreatePostPage";
import { PostPage } from "./pages/tutor/PostPage.jsx";
import PendingPost from "./pages/tutor/PendingPost.jsx";
import AdminBookingManagement from "./pages/admin/AdminBookingManagement";
import { AdminProfile } from "./pages/admin/AdminProfile.jsx";
import UpdatePostPage from './pages/tutor/UpdatePostPage';
import { CreditPage } from "./pages/CreditPage";
import AddFeedback from './pages/student/AddFeedback.jsx';
import FeedbackList from './pages/student/FeedbackList.jsx';
import UpdateFeedback from './pages/student/UpdateFeedback.jsx';
import { AdminTransactions } from "./pages/admin/AdminTransactions.jsx";
import ForgotPassword from './pages/ForgotPassword.jsx';

function App() {
  const { token, setToken, removeToken } = useToken();
  const id = token ? parseJwt(token).nameid : null;
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              token={token}
              setToken={setToken}
              removeToken={removeToken}
            />
          }
        >
          <Route
            index
            element={<Home token={token} setToken={setToken} />}
          />
          <Route 
            path="/forgot-password" 
            element={<ForgotPassword />} />
          <Route
            path="/pending-post"
            element={<PendingPost userId={id} />}
          />
          <Route
            path="student/feedback/add"
            element={<AddFeedback userId={id}/>}
          />
          <Route
            path="/feedbackList"
            element={<FeedbackList userId={id}/>}
          />
          
     <Route path="/update-post/:postId" element={<UpdatePostPage userId={id}/>} />
     <Route path="student/feedback/update/:id" element={<UpdateFeedback userId={id}/>} />
          <Route
            path="Profile"
            element={<Profile token={token} setToken={setToken} />}
          />
          <Route path="/newsfeed" element={<PostPage id={id} />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route
            path="/create-post"
            element={<CreatePostPage userId={id} />}
          />
          <Route
            path="ProfileTutor"
            element={
              <ProfileTutor token={token} setToken={setToken} />
            }
          />
          <Route
            path="Credit"
            element={
              <CreditPage userId={id} />
            }
          />
          {/* Student paths */}
          <Route
            path="/student/booking/:id?"
            element={
              <PrivateRoute role={"Student"}>
                <StudentBookingRequest userId={id}/>
              </PrivateRoute>
            }
          />
          <Route
            path="/student/requests"
            element={
              <PrivateRoute role={"Student"}>
                <StudentRequestsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <PrivateRoute roles={["Student", "Tutor"]}>
                <SchedulePage token={token} />
              </PrivateRoute>
            }
          ></Route>
          {/*Tutor paths*/}
          <Route
            path="/admin/subject-level"
            element={
              <PrivateRoute role="Admin">
                <AdminDashboard
                  Element={
                    <Features
                      token={token}
                      setToken={setToken}
                    />
                  }
                  removeToken={removeToken}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/tutor/request"
            element={
              <PrivateRoute role="Tutor">
                <TutorRequestsPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/about"
            element={
              <PrivateRoute role="Tutor">
                <ProfileTutor
                  token={token}
                  setToken={setToken}
                />
              </PrivateRoute>
            }
          ></Route>
          {/*Admin paths*/}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute role="Admin">
                <AdminDashboard
                  Element={<ChartPage />}
                  removeToken={removeToken}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <PrivateRoute role="Admin">
                <AdminDashboard
                  Element={<AdminProfile token={token} id={id} />}
                  removeToken={removeToken}
                />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/admin/students-management"
            element={
              <PrivateRoute role="Admin">
                <AdminDashboard
                  Element={<AdminStudentManagement id={id} />}
                  removeToken={removeToken}
                />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/admin/tutors-management"
            element={
              <PrivateRoute role="Admin">
                <AdminDashboard
                  Element={<AdminTutorsManagement id={id} />}
                  removeToken={removeToken}
                />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/admin/transactions"
            element={
              <PrivateRoute role="Admin">
                <AdminDashboard
                  Element={<AdminTransactions id={id} />}
                  removeToken={removeToken}
                />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/admin/booking"
            element={
              <PrivateRoute role="Admin">
                <AdminDashboard
                  Element={<AdminBookingManagement id={id} showTransfer={true}/>}
                  removeToken={removeToken}
                />
              </PrivateRoute>
            }
          ></Route>
          {/*Moderator paths*/}
          <Route
            path="/manage-credentials"
            element={
              <PrivateRoute role="Moderator">
                <ModeratorHome />
              </PrivateRoute>
            }
          />{" "}
          <Route
            path="/manage-posts"
            element={
              <PrivateRoute role="Moderator">
                <ModeratorTutorPost />
              </PrivateRoute>
            }
          />
          <Route
            path="/tutor application request"
            element={
              <PrivateRoute role="Moderator">
                <ModeratorTutorApplicationRequests />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
