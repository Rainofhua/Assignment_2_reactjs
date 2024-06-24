import React from 'react';


function chooseclassButtonClick() {

    window.location.href = "/lecturergradebook";
}
function HomeLecturer(props) {
    return (
        <div>
            <h1>Home Lecturer</h1>
            <ul>
                <button className="custom-button" onClick={chooseclassButtonClick}>Grade Book</button>
            </ul>
        </div>
    );
}

export default HomeLecturer;