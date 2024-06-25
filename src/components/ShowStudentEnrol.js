import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../Constants'; // Assuming baseUrl is defined in Constants

function ShowStudentEnrol(props) {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchClasses();
        fetchStudents();
    }, []);

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

    const handleAddStudentsToClass = async () => {
        const studentData = {
            student_ids: selectedStudents,
            action: 'add',
        };

        try {
            await axios.post(`${baseUrl}api/classes/${selectedClass}/update_students/`, studentData, {
                headers: { Authorization: 'Token ' + localStorage.getItem('token') },
            });
            alert('Students added to class successfully');
            // Reset form
            setSelectedStudents([]);
            setSelectedClass('');
        } catch (error) {
            console.log('Error adding students to class:', error);
            setError('Error adding students to class. Please check the console for details.');
        }
    };

    const handleStudentChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setSelectedStudents(selected);
    };

    return (
        <div>
            <h1>Student Enrol</h1>
            <div>
                <label>
                    Students:
                    <br />
                    <select multiple value={selectedStudents} onChange={handleStudentChange}>
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
                                {class_.number}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <button onClick={handleAddStudentsToClass}>Add Students to Class</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <h2>Enrolments</h2>
            <ul>
                {classes.map(class_ => (
                    class_.students.map(student => (
                        <li key={`${class_.id}-${student.id}`}>
                            <h3>Class Number: {class_.number}</h3>
                            <p>Student: {student.firstName} {student.lastName}</p>
                            <p>Course: {class_.course.code} - {class_.course.name}</p>
                            <p>Semester: {class_.semester.year} {class_.semester.semester}</p>
                            <p>Lecturer: {class_.lecturer.firstName} {class_.lecturer.lastName}</p>
                        </li>
                    ))
                ))}
            </ul>
        </div>
    );
}

export default ShowStudentEnrol;
