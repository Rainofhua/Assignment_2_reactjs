import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../Constants';

function ShowLecturers(props) {
    const [lecturers, setLecturers] = useState([]);
    const [newLecturer, setNewLecturer] = useState({
        firstName: '',
        lastName: '',
        email: '',
        DOB: '',
        user: {
            username: '',
            password: ''
        }
    });
    const [editingLecturer, setEditingLecturer] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLecturers();
    }, []);

    const fetchLecturers = async () => {
        try {
            const response = await axios.get(baseUrl + 'api/lecturers/', {
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem('token')
                }
            });
            setLecturers(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const handleInputChange = (e, isEditing = false) => {
        const { name, value } = e.target;
        if (isEditing) {
            if (name === 'username' || name === 'password') return; // Prevent updating username and password
            setEditingLecturer({
                ...editingLecturer,
                [name]: value
            });
        } else {
            setNewLecturer({
                ...newLecturer,
                [name]: value,
                user: name === 'username' || name === 'password'
                    ? { ...newLecturer.user, [name]: value }
                    : newLecturer.user
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(baseUrl + 'api/lecturers/', newLecturer, {
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem('token')
                }
            });
            setNewLecturer({
                firstName: '',
                lastName: '',
                email: '',
                DOB: '',
                user: {
                    username: '',
                    password: ''
                }
            });
            fetchLecturers();
        } catch (error) {
            setError('Error creating lecturer');
            console.error('Create error:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { id, user, ...updatedLecturerData } = editingLecturer; // Exclude user data
            await axios.patch(`${baseUrl}api/lecturers/${id}/`, updatedLecturerData, {
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem('token')
                }
            });
            setEditingLecturer(null);
            fetchLecturers();
        } catch (error) {
            setError('Error updating lecturer');
            console.error('Update error:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseUrl}api/lecturers/${id}/`, {
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem('token')
                }
            });
            fetchLecturers();
        } catch (error) {
            setError('Error deleting lecturer');
            console.error('Delete error:', error);
        }
    };

    const handleEditClick = (lecturer) => {
        setEditingLecturer(lecturer);
    };

    const handleCancelEdit = () => {
        setEditingLecturer(null);
    };

    return (
        <div>
            <h1>Manage Lecturers</h1>
            {editingLecturer ? (
                <form onSubmit={handleUpdate}>
                    <label>
                        First Name:
                        <input type="text" name="firstName" value={editingLecturer.firstName} onChange={(e) => handleInputChange(e, true)} required />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="lastName" value={editingLecturer.lastName} onChange={(e) => handleInputChange(e, true)} required />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={editingLecturer.email} onChange={(e) => handleInputChange(e, true)} />
                    </label>
                    <label>
                        Date of Birth:
                        <input type="date" name="DOB" value={editingLecturer.DOB} onChange={(e) => handleInputChange(e, true)} required />
                    </label>
                    <label>
                        Username:
                        <input type="text" name="username" value={editingLecturer.user.username} readOnly />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" value={editingLecturer.user.password} readOnly />
                    </label>
                    <button className="custom-button" type="submit">Update Lecturer</button>
                    <button className="custom-button" type="button" onClick={handleCancelEdit}>Cancel</button>
                </form>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>
                        First Name:
                        <input type="text" name="firstName" value={newLecturer.firstName} onChange={handleInputChange} required />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="lastName" value={newLecturer.lastName} onChange={handleInputChange} required />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" value={newLecturer.email} onChange={handleInputChange} />
                    </label>
                    <label>
                        Date of Birth:
                        <input type="date" name="DOB" value={newLecturer.DOB} onChange={handleInputChange} required />
                    </label>
                    <label>
                        Username:
                        <input type="text" name="username" value={newLecturer.user.username} onChange={handleInputChange} required />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" value={newLecturer.user.password} onChange={handleInputChange} required />
                    </label>
                    <button className="custom-button" type="submit">Create Lecturer</button>
                </form>
            )}
            {error && <p>{error}</p>}

            {lecturers.map((lecturer) => (
                <div key={lecturer.id}>
                    <h3>ID: {lecturer.id}</h3>
                    <p>Name: {lecturer.firstName} {lecturer.lastName}</p>
                    <p>Email: {lecturer.email}</p>
                    <p>DOB: {lecturer.DOB}</p>
                    <p>Username: {lecturer.user.username}</p>
                    <button className="custom-button" onClick={() => handleEditClick(lecturer)}>Edit</button>
                    <button className="custom-button" onClick={() => handleDelete(lecturer.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default ShowLecturers;
