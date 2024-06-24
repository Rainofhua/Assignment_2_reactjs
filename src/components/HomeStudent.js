import React from 'react';
import axios from "axios";


function ViewGrades() {
    window.location.href = "/studentviewgrade";
}
function HomeStudent(props) {
    return (
        <div>
            <h1>Home Student</h1>
            <ul>
                <button className="custom-button" onClick={ViewGrades}>View Grades</button>
            </ul>
        </div>
    );
}

export default HomeStudent;