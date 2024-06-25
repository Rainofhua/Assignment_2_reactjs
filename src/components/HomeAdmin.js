import React from 'react';


function semesterButtonClick(){
    window.location.href = "/semesters";
}
function courseButtonClick(){
    window.location.href = "/courses";
}
function classButtonClick(){
    window.location.href = "/classes";
}
function lecturerButtonClick(){
    window.location.href = "/lecturers";
}
function studentButtonClick(){
    window.location.href = "/students";
}
function studentenrollButtonClick(){
    window.location.href = "/enrolment";
}
function uploadexcelButtonClick(){
    window.location.href = "/uploadexcel";
}
function gradeBookButtonClick(){
    window.location.href = "/gradebook";
}
function semdEmailButtonClick(){
    window.location.href = "/sendemail";
}

function HomeAdmin(props) {
    return (
        <div>
            <h1>Home Admin</h1>
            <ul>
                <button className="custom-button" onClick={semesterButtonClick}>Manage Semesters
                    (create/update/delete/show)
                </button>
                <br/>
                <br/>
                <button className="custom-button" onClick={courseButtonClick}>ManageCourses
                    (create/update/delete/show)
                </button>
                <br/>
                <br/>
                <button className="custom-button" onClick={classButtonClick}>Manage Classes (crate/update/delete/show)
                    can add/change lecturer/student in class
                </button>
                <br/>
                <br/>
                <button className="custom-button" onClick={lecturerButtonClick}>Manage Lecturers
                    (create/update/delete/show)
                </button>
                <br/>
                <br/>
                <button className="custom-button" onClick={studentButtonClick}>Manage Students
                    (create/update/delete/show)
                </button>
                <br/>
                <br/>
                <button className="custom-button" onClick={gradeBookButtonClick}>Gradebook (administrator update
                    grade)
                </button>
                <br/>
                <br/>
                <button className="custom-button" onClick={uploadexcelButtonClick}>Upload Excel</button>
                <br/>
                <br/>
                <button className="custom-button" onClick={semdEmailButtonClick}>Send Email</button>

            </ul>
        </div>
    );
}

export default HomeAdmin;