import logo from './logo.svg';
import './App.css';
import NavigationBar from "./components/NavigationBar";
import {Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import ShowClasses from "./components/ShowClasses";
import ShowCourses from "./components/ShowCourses";
import ShowLecturers from "./components/ShowLecturers";
import ShowSemesters from "./components/ShowSemesters";
import ShowStudents from "./components/ShowStudents";
import HomeAdmin from "./components/HomeAdmin";
import HomeStudent from "./components/HomeStudent";
import HomeLecturer from "./components/HomeLecturer";
import LecturerChooseClass from "./components/LecturerGradeBook";
import LecturerGradeBook from "./components/LecturerGradeBook";
import ShowStudentEnrol from "./components/ShowStudentEnrol";
import StudentViewGrade from "./components/StudentViewGrade";
import ShowUploadExcel from "./components/ShowUploadExcel";
import ShowGradeBook from "./components/ShowGradeBook";
import ShowSendEmail from "./components/ShowSendEmail";

function App() {
  return (
    <div className="App">
      <NavigationBar />

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route path="/admin" element={<HomeAdmin />} />
            <Route path="/lecturer" element={<HomeLecturer />} />
            <Route path="/student" element={<HomeStudent />} />

            <Route path="/classes" element={<ShowClasses />} />
            <Route path="/courses" element={<ShowCourses />} />
            <Route path="/lecturers" element={<ShowLecturers />} />
            <Route path="/semesters" element={<ShowSemesters />} />
            <Route path="/students" element={<ShowStudents />} />
            <Route path="/enrolment" element={<ShowStudentEnrol />} />
            <Route path="/uploadexcel" element={<ShowUploadExcel />} />
            <Route path="/gradebook" element={<ShowGradeBook />} />
            <Route path="/sendemail" element={<ShowSendEmail />} />

            <Route path="/lecturergradebook" element={<LecturerGradeBook />} />

            <Route path="/studentviewgrade" element={<StudentViewGrade />} />
        </Routes>
    </div>
  );
}

export default App;
