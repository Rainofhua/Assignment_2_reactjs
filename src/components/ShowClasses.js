import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../Constants';

function ShowClasses() {
    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [students, setStudents] = useState([]);
    const [number, setNumber] = useState('');
    const [courseId, setCourseId] = useState('');
    const [semesterId, setSemesterId] = useState('');
    const [lecturerId, setLecturerId] = useState('');
    const [studentIds, setStudentIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingClass, setEditingClass] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [classRes, courseRes, semesterRes, lecturerRes, studentRes] = await Promise.all([
                axios.get(baseUrl + 'api/classes/', { headers: { Authorization: 'Token ' + localStorage.getItem('token') } }),
                axios.get(baseUrl + 'api/courses/', { headers: { Authorization: 'Token ' + localStorage.getItem('token') } }),
                axios.get(baseUrl + 'api/semesters/', { headers: { Authorization: 'Token ' + localStorage.getItem('token') } }),
                axios.get(baseUrl + 'api/lecturers/', { headers: { Authorization: 'Token ' + localStorage.getItem('token') } }),
                axios.get(baseUrl + 'api/students/', { headers: { Authorization: 'Token ' + localStorage.getItem('token') } }),
            ]);

            setClasses(classRes.data);
            setCourses(courseRes.data);
            setSemesters(semesterRes.data);
            setLecturers(lecturerRes.data);
            setStudents(studentRes.data);
        } catch (error) {
            setError('Error fetching data');
        }
        setLoading(false);
    };

    const createOrUpdateClass = async () => {
        const data = {
            number,
            course_id: courseId,
            semester_id: semesterId,
            lecturer_id: lecturerId,
            student_ids: studentIds,
        };

        console.log('Request data:', data); // Log the request data

        try {
            if (editingClass) {
                await axios.put(`${baseUrl}api/classes/${editingClass.id}/`, data, {
                    headers: { Authorization: `Token ${localStorage.getItem('token')}` },
                });
                alert('Update success');
            } else {
                const response = await axios.post(baseUrl + 'api/classes/', data, {
                    headers: { Authorization: `Token ${localStorage.getItem('token')}` },
                });
                setClasses([...classes, response.data]);
                alert('Create success');
            }
            resetForm();
            fetchData();
        } catch (error) {
            console.log('Error response:', error.response); // Log the error response
            setError('Error saving class: ' + (error.response?.data.detail || 'Unknown error'));
        }
    };

    const deleteClass = async (classId) => {
        try {
            await axios.delete(`${baseUrl}api/classes/${classId}/`, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            });
            alert('Delete success');
            fetchData();
        } catch (error) {
            console.log('Error response:', error.response); // Log the error response
            setError('Error deleting class: ' + (error.response?.data.detail || 'Unknown error'));
        }
    };

    const startEditing = (classItem) => {
        setNumber(classItem.number);
        setCourseId(classItem.course.id);
        setSemesterId(classItem.semester.id);
        setLecturerId(classItem.lecturer.id);
        setStudentIds(classItem.students.map(student => student.id));
        setEditingClass(classItem);
    };

    const resetForm = () => {
        setNumber('');
        setCourseId('');
        setSemesterId('');
        setLecturerId('');
        setStudentIds([]);
        setEditingClass(null);
    };

    const handleStudentChange = (e) => {
        const options = e.target.options;
        const selectedStudents = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedStudents.push(options[i].value);
            }
        }
        setStudentIds(selectedStudents);
    };

    return (
        <div>
            <h1>Manage Classes</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>
                    Number:
                    <br />
                    <input
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Course:
                    <br />
                    <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                        <option value="">Select a course</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.name}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Semester:
                    <br />
                    <select value={semesterId} onChange={(e) => setSemesterId(e.target.value)}>
                        <option value="">Select a semester</option>
                        {semesters.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                                Year: {semester.year}, Semester: {semester.semester}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Lecturer:
                    <br />
                    <select value={lecturerId} onChange={(e) => setLecturerId(e.target.value)}>
                        <option value="">Select a lecturer</option>
                        {lecturers.map((lecturer) => (
                            <option key={lecturer.id} value={lecturer.id}>
                                {lecturer.firstName} {lecturer.lastName}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Students:
                    <br />
                    <select multiple value={studentIds} onChange={handleStudentChange}>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.firstName} {student.lastName}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <button className="custom-button" onClick={createOrUpdateClass}>{editingClass ? 'Update' : 'Add'}</button>
                {editingClass && <button className="custom-button" onClick={resetForm}>Cancel Edit</button>}
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                classes.map((classItem) => (
                    <div key={classItem.id}>
                        <h3>ID: {classItem.id}</h3>
                        <p>Number: {classItem.number}</p>
                        <p>Course: {classItem.course.name}</p>
                        <p>Year: {classItem.semester.year}, Semester: {classItem.semester.semester}</p>
                        <p>Lecturer: {classItem.lecturer.firstName} {classItem.lecturer.lastName}</p>
                        <p>Students: {classItem.students.map(student => student.firstName + ' ' + student.lastName).join(', ')}</p>
                        <button className="custom-button" onClick={() => startEditing(classItem)}>Edit</button>
                        <button className="custom-button" onClick={() => deleteClass(classItem.id)}>Delete</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default ShowClasses;
