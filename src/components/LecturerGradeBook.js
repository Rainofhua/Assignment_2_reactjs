import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from "../Constants"; // Assuming baseUrl is defined in Constants

function ClassSelectionForm() {
    const [enrolments, setEnrolments] = useState([]);
    const [editingGrade, setEditingGrade] = useState({});
    const [isEditing, setIsEditing] = useState({});

    useEffect(() => {
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

    const handleGradeChange = (e, enrolmentId) => {
        const newGrade = e.target.value;
        setEditingGrade({
            ...editingGrade,
            [enrolmentId]: newGrade
        });
    };

    const handleEditClick = (enrolmentId, currentGrade) => {
        setEditingGrade({
            ...editingGrade,
            [enrolmentId]: currentGrade
        });
        setIsEditing({
            ...isEditing,
            [enrolmentId]: true
        });
    };

    const handleSaveClick = async (enrolmentId) => {
        const newGrade = editingGrade[enrolmentId];
        try {
            await axios.patch(
                baseUrl + 'api/enrolments/' + enrolmentId + '/',
                { grade: newGrade },
                {
                    headers: { Authorization: 'Token ' + localStorage.getItem('token') },
                }
            );
            setIsEditing({
                ...isEditing,
                [enrolmentId]: false
            });
            fetchEnrolments(); // Refresh enrolments after saving
        } catch (error) {
            console.error('Error saving grade:', error);
            console.log('Response data:', error.response.data); // Log API response data
        }
    };

    const alertMessage = () => {
        enrolments.map(enrolment => {
            alert("Successfully notified " + enrolment.student.email)
        })

    };

    return (
        <div>
            <h1>Grade Book</h1>
            <ul>
                {enrolments.map(enrolment => (
                    <li key={enrolment.id}>
                        <p>Student: {enrolment.student.firstName} {enrolment.student.lastName}</p>
                        {isEditing[enrolment.id] ? (
                            <div>
                                <input
                                    type="text"
                                    value={editingGrade[enrolment.id]}
                                    onChange={(e) => handleGradeChange(e, enrolment.id)}
                                />
                                <button onClick={() => handleSaveClick(enrolment.id)}>Save</button>
                            </div>
                        ) : (
                            <div>
                                <p>Course: {enrolment.Class.course.name} Semester: {enrolment.Class.semester.semester}</p>
                                <p>Grade: {enrolment.grade}</p>
                                <button className="custom-button" onClick={() => handleEditClick(enrolment.id, enrolment.grade)}>Edit</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={alertMessage}>Notify student</button>
        </div>
    );
}

export default ClassSelectionForm;
