import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../Constants';

function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [editingCourseId, setEditingCourseId] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${baseUrl}api/courses/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleCreateCourse = async (event) => {
        event.preventDefault();

        try {
            await axios.post(
                `${baseUrl}api/courses/`,
                { code, name },
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`,
                    },
                }
            );
            fetchCourses(); // Refresh courses after creating new course
            setCode('');
            setName('');
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    const handleUpdateCourse = async (id) => {
        try {
            await axios.put(
                `${baseUrl}api/courses/${id}/`,
                { code, name },
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`,
                    },
                }
            );
            fetchCourses(); // Refresh courses after updating course
            setEditingCourseId(null); // Exit edit mode
        } catch (error) {
            console.error('Error updating course:', error);
        }
    };

    const handleDeleteCourse = async (id) => {
        try {
            await axios.delete(`${baseUrl}api/courses/${id}/`, {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
            });
            fetchCourses(); // Refresh courses after deleting course
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const handleEditCourse = (course) => {
        setEditingCourseId(course.id);
        setCode(course.code);
        setName(course.name);
    };

    const handleCancelEdit = () => {
        setEditingCourseId(null);
        setCode('');
        setName('');
    };

    return (
        <div>
            <h1>Manage Courses</h1>

            {/* Form for creating new course */}
            <form onSubmit={handleCreateCourse}>
                <label>
                    Code:
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
                </label>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <button className="custom-button" type="submit">Create Course</button>
            </form>

            {/* List of courses */}
            {courses.map((course) => (
                <div key={course.id}>
                    {editingCourseId === course.id ? (
                        // Form for updating course
                        <form onSubmit={() => handleUpdateCourse(course.id)}>
                            <label>
                                Code:
                                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
                            </label>
                            <label>
                                Name:
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                            </label>
                            <button className="custom-button" type="submit">Update Course</button>
                            <button className="custom-button" type="button" onClick={handleCancelEdit}>Cancel</button>
                        </form>
                    ) : (
                        // Display course details
                        <div>
                            <h3>ID: {course.id}</h3>
                            <p>Code: {course.code}</p>
                            <p>Name: {course.name}</p>
                            {/* Buttons for edit and delete */}
                            <button className="custom-button" onClick={() => handleEditCourse(course)}>Edit</button>
                            <button className="custom-button" onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default CourseManagement;
