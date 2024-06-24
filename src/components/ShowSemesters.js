import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../Constants';

function ShowSemesters(props) {
    const [semesters, setSemesters] = useState([]);
    const [courses, setCourses] = useState([]);
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSemesters();
        fetchCourses();
    }, []);

    const fetchSemesters = async () => {
        setLoading(true);
        try {
            const response = await axios.get(baseUrl + 'api/semesters/', {
                headers: { Authorization: 'Token ' + localStorage.getItem('token') },
            });
            setSemesters(response.data);
        } catch (error) {
            setError('Error fetching semesters');
        }
        setLoading(false);
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get(baseUrl + 'api/courses/', {
                headers: { Authorization: 'Token ' + localStorage.getItem('token') },
            });
            setCourses(response.data);
        } catch (error) {
            setError('Error fetching courses');
        }
    };

    const handleCourseChange = (e) => {
        const { options } = e.target;
        const selected = [];
        for (let i = 0, len = options.length; i < len; i++) {
            if (options[i].selected) {
                selected.push(parseInt(options[i].value, 10));
            }
        }
        setSelectedCourses(selected);
    };

    const createOrUpdateSemester = async () => {
        const data = { year, semester, course_ids: selectedCourses };

        try {
            if (editMode) {
                await axios.put(baseUrl + 'api/semesters/' + editingId + '/', data, {
                    headers: { Authorization: 'Token ' + localStorage.getItem('token') },
                });
                alert('Update success');
            } else {
                const response = await axios.post(baseUrl + 'api/semesters/', data, {
                    headers: { Authorization: 'Token ' + localStorage.getItem('token') },
                });
                setSemesters([...semesters, response.data]);
                alert('Create success');
            }
            fetchSemesters();
            resetForm();
        } catch (error) {
            setError('Error saving semester');
        }
    };

    const resetForm = () => {
        setYear('');
        setSemester('');
        setSelectedCourses([]);
        setEditMode(false);
        setEditingId(null);
    };

    const handleEdit = (semester) => {
        setYear(semester.year);
        setSemester(semester.semester);
        setSelectedCourses(semester.courses.map(course => course.id));
        setEditMode(true);
        setEditingId(semester.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(baseUrl + 'api/semesters/' + id + '/', {
                headers: { Authorization: 'Token ' + localStorage.getItem('token') },
            });
            alert('Delete success');
            setSemesters(semesters.filter(sem => sem.id !== id));
        } catch (error) {
            setError('Error deleting semester');
        }
    };

    return (
        <div>
            <h1>Manage Semesters</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>
                    Year:
                    <br />
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        min="2024"
                        max="2026"
                    />
                </label>
                <br />
                <label>
                    Semester:
                    <br />
                    <input
                        type="number"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        min="1"
                        max="2"
                    />
                </label>
                <br />
                <label>
                    Courses:
                    <br />
                    <select multiple value={selectedCourses} onChange={handleCourseChange}>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.code} {course.name}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <button className="custom-button" onClick={createOrUpdateSemester}>{editMode ? 'Update' : 'Add'}</button>
                {editMode && <button className="custom-button" onClick={resetForm}>Cancel</button>}
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                semesters.map((semester) => (
                    <div key={semester.id}>
                        <h3>ID: {semester.id}</h3>
                        <p>Year: {semester.year}</p>
                        <p>Semester: {semester.semester}</p>
                        <p>Courses: {semester.courses.map(course => `${course.code} ${course.name}`).join(', ')}</p>
                        <button className="custom-button" onClick={() => handleEdit(semester)}>Edit</button>
                        <button className="custom-button" onClick={() => handleDelete(semester.id)}>Delete</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default ShowSemesters;
