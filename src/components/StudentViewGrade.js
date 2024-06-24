import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../Constants'; // Assuming baseUrl is defined in Constants

function ViewGrades() {
    const [enrolments, setEnrolments] = useState([]);
    const [currentUser, setCurrentUser] = useState({ firstName: '', lastName: '' });

    useEffect(() => {
        const storedFirstName = localStorage.getItem('first_name');
        const storedLastName = localStorage.getItem('last_name');
        if (storedFirstName && storedLastName) {
            setCurrentUser({ firstName: storedFirstName, lastName: storedLastName });
        }
        fetchEnrolments();
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

    return (
        <div>
            <h1>View Grades</h1>
            <ul>
                {enrolments.map(enrolment => (
                    <li key={enrolment.id}>
                        {enrolment.student.firstName === currentUser.firstName && enrolment.student.lastName === currentUser.lastName && (
                        <p>Student: {enrolment.student.firstName} {enrolment.student.lastName}</p>
                        )}
                        {enrolment.student.firstName === currentUser.firstName && enrolment.student.lastName === currentUser.lastName && (
                            <p>Course: {enrolment.Class.course.name} Semester: {enrolment.Class.semester.semester}</p>
                        )}
                        {enrolment.student.firstName === currentUser.firstName && enrolment.student.lastName === currentUser.lastName && (
                            <p>Grade: {enrolment.grade}</p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewGrades;
