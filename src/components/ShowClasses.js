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
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleStudentChange = (e) => {
        const { options } = e.target;
        const selected = [];
        for (let i = 0, len = options.length; i < len; i++) {
            if (options[i].selected) {
                selected.push(parseInt(options[i].value, 10));
            }
        }
        setSelectedStudents(selected);
    };

    const createOrUpdateClass = async () => {
        const data = {
            number,
            course: { id: courseId },
            semester: { id: semesterId },
            lecturer: { id: lecturerId },
            students: selectedStudents.map(id => ({ id })),
        };

        try {
            if (editMode) {
                await axios.put(`${baseUrl}api/classes/${editingId}/`, data, {
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
            fetchData();
            resetForm();
        } catch (error) {
            setError('Error saving class: ' + (error.response?.data.detail || 'Unknown error'));
        }
    };

    const resetForm = () => {
        setNumber('');
        setCourseId('');
        setSemesterId('');
        setLecturerId('');
        setSelectedStudents([]);
        setEditMode(false);
        setEditingId(null);
    };

    const handleEdit = (classItem) => {
        setNumber(classItem.number);
        setCourseId(classItem.course.id);
        setSemesterId(classItem.semester.id);
        setLecturerId(classItem.lecturer.id);
        setSelectedStudents(classItem.students.map(student => student.id));
        setEditMode(true);
        setEditingId(classItem.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseUrl}api/classes/${id}/`, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            });
            alert('Delete success');
            setClasses(classes.filter(cls => cls.id !== id));
        } catch (error) {
            setError('Error deleting class');
        }
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
                    <select multiple value={selectedStudents} onChange={handleStudentChange}>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.firstName} {student.lastName}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <button onClick={createOrUpdateClass}>{editMode ? 'Update' : 'Add'}</button>
                {editMode && <button onClick={resetForm}>Cancel</button>}
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                classes.map((classItem) => (
                    <div key={classItem.id}>
                        <h3>ID: {classItem.id}</h3>
                        <p>Number: {classItem.number}</p>
                        <p>Course: {classItem.course.name}</p>
                        <p>Semester: Year: {classItem.semester.year}, Semester: {classItem.semester.semester}</p>
                        <p>Lecturer: {classItem.lecturer.first_name} {classItem.lecturer.last_name}</p>
                        <p>Students: {classItem.students.map(student => student.first_name + ' ' + student.last_name).join(', ')}</p>
                        <button onClick={() => handleEdit(classItem)}>Edit</button>
                        <button onClick={() => handleDelete(classItem.id)}>Delete</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default ShowClasses;
