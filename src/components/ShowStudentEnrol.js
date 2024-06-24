import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../Constants'; // Assuming baseUrl is defined in Constants

function ShowStudentEnrol(props) {
    const [enrolments, setEnrolments] = useState([]);
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [grade, setGrade] = useState('');
    const [enrolTime, setEnrolTime] = useState('');
    const [gradeTime, setGradeTime] = useState('');

    useEffect(() => {
        fetchEnrolments();
        fetchStudents();
        fetchClasses();
    }, []);

    const fetchEnrolments = async () => {
        try {
            const response = await axios.get(baseUrl + 'api/enrolments/', {
                headers: { Authorization: 'Token ' + localStorage.getItem('token') },
            });
            setEnrolments(response.data);
        } catch (error) {
            console.log('Error fetching enrolments:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get(baseUrl + 'api/students/', {
                headers: { Authorization: 'Token ' + localStorage.getItem('token') },
            });
            setStudents(response.data);
        } catch (error) {
            console.log('Error fetching students:', error);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await axios.get(baseUrl + 'api/classes/', {
                headers: { Authorization: 'Token ' + localStorage.getItem('token') },
            });
            setClasses(response.data);
        } catch (error) {
            console.log('Error fetching classes:', error);
        }
    };

    const handleCreateEnrolment = async () => {
        const enrolmentData = {
            student: { id: selectedStudent },
            class_: { id: selectedClass },
            grade,
            enrolTime,
            gradeTime
        };

        try {
            const response = await axios.post(baseUrl + 'api/enrolments/', enrolmentData, {
                headers: { Authorization: 'Token ' + localStorage.getItem('token') },
            });
            alert('Enrolment created successfully');
            setEnrolments([...enrolments, response.data]);
            // Reset form
            setSelectedStudent('');
            setSelectedClass('');
            setGrade('');
            setEnrolTime('');
            setGradeTime('');
        } catch (error) {
            console.log('Error creating enrolment:', error);
            alert('Error creating enrolment. Please check the console for details.');
        }
    };

    return (
        <div>
            <h1>Student Enrol</h1>
            <div>
                <label>
                    Student:
                    <br />
                    <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                        <option value="">Select Student</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>
                                {student.firstName} {student.lastName}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Class:
                    <br />
                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                        <option value="">Select Class</option>
                        {classes.map(class_ => (
                            <option key={class_.id} value={class_.id}>
                                {class_.course.code} - {class_.course.name}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Grade:
                    <br />
                    <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} />
                </label>
                <br />
                <label>
                    Enrol Time:
                    <br />
                    <input type="datetime-local" value={enrolTime} onChange={(e) => setEnrolTime(e.target.value)} />
                </label>
                <br />
                <label>
                    Grade Time:
                    <br />
                    <input type="datetime-local" value={gradeTime} onChange={(e) => setGradeTime(e.target.value)} />
                </label>
                <br />
                <button onClick={handleCreateEnrolment}>Add Enrolment</button>
            </div>
            <ul>
                {enrolments.map(enrolment => (
                    <li key={enrolment.id}>
                        <h3>Enrolment ID: {enrolment.id}</h3>
                        <p>Student: {enrolment.student.firstName} {enrolment.student.lastName}</p>
                        <p>Course: {enrolment.Class.course.code} - {enrolment.Class.course.name}</p>
                        <p>Semester: {enrolment.Class.semester.year} {enrolment.Class.semester.semester}</p>
                        <p>Lecturer: {enrolment.Class.lecturer.firstName} {enrolment.Class.lecturer.lastName}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ShowStudentEnrol;
