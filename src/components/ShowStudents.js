import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../Constants';

function ShowStudents(props) {
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({
        firstName: '',
        lastName: '',
        email: '',
        DOB: '',
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editingStudentId, setEditingStudentId] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        axios.get(baseUrl + 'api/students/', {
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token')
            }
        })
        .then((response) => {
            setStudents(response.data);
        })
        .catch((error) => {
            console.log('Fetch error:', error);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStudent({
            ...newStudent,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const config = {
            method: editMode ? 'patch' : 'post',
            url: editMode ? baseUrl + 'api/students/' + editingStudentId + '/' : baseUrl + 'api/students/',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            data: editMode
                ? {
                    firstName: newStudent.firstName,
                    lastName: newStudent.lastName,
                    email: newStudent.email,
                    DOB: newStudent.DOB
                  }
                : {
                    firstName: newStudent.firstName,
                    lastName: newStudent.lastName,
                    email: newStudent.email,
                    DOB: newStudent.DOB,
                    user: {
                        username: newStudent.username,
                        password: newStudent.password,
                    }
                }
        };

        axios(config)
            .then(() => {
                if (editMode) {
                    alert('Student updated successfully');
                } else {
                    alert('Student created successfully');
                }
                fetchStudents();  // Refresh the list of students
                setNewStudent({
                    firstName: '',
                    lastName: '',
                    email: '',
                    DOB: '',
                    username: '',
                    password: ''
                });
                setEditMode(false);
                setEditingStudentId(null);
            })
            .catch((error) => {
                setError('Error ' + (editMode ? 'updating' : 'creating') + ' student');
                console.error('Create/update error:', error);
            });
    };

    const handleEdit = (student) => {
        setNewStudent({
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            DOB: student.DOB,
            username: student.user.username,
            password: '', // Password will not be displayed in edit mode
        });
        setEditMode(true);
        setEditingStudentId(student.id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            axios.delete(baseUrl + 'api/students/' + id + '/', {
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem('token')
                }
            })
            .then(() => {
                alert('Student deleted successfully');
                setStudents(students.filter(student => student.id !== id));
            })
            .catch((error) => {
                console.error('Delete error:', error);
            });
        }
    };

    return (
        <div>
            <h1>Manage Students</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input type="text" name="firstName" value={newStudent.firstName} onChange={handleInputChange} required />
                </label>
                <br />
                <label>
                    Last Name:
                    <input type="text" name="lastName" value={newStudent.lastName} onChange={handleInputChange} required />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" value={newStudent.email} onChange={handleInputChange} required />
                </label>
                <br />
                <label>
                    Date of Birth:
                    <input type="date" name="DOB" value={newStudent.DOB} onChange={handleInputChange} required />
                </label>
                <br />
                <label>
                    Username:
                    <input type="text" name="username" value={newStudent.username} onChange={handleInputChange} required readOnly={editMode} />
                </label>
                <br />
                {!editMode && (
                    <label>
                        Password:
                        <input type="password" name="password" value={newStudent.password} onChange={handleInputChange} required />
                    </label>
                )}
                <br />
                <button className="custom-button" type="submit">{editMode ? 'Update' : 'Create'} Student</button>
                {editMode && <button className="custom-button" type="button" onClick={() => { setEditMode(false); setEditingStudentId(null); setNewStudent({ firstName: '', lastName: '', email: '', DOB: '', username: '', password: '' }); }}>Cancel</button>}
            </form>
            {error && <p>{error}</p>}

            {students.map((student) => (
                <div key={student.id}>
                    <h3>ID: {student.id}</h3>
                    <p>Name: {student.firstName} {student.lastName}</p>
                    <p>Email: {student.email}</p>
                    <p>DOB: {student.DOB}</p>
                    <p>Username: {student.user.username}</p>
                    <button className="custom-button" onClick={() => handleEdit(student)}>Edit</button>
                    <button className="custom-button" onClick={() => handleDelete(student.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default ShowStudents;
