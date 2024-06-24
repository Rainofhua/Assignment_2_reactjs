import React from 'react';

function Home(props) {
    return (
        <div>
            <h1>Home</h1>
            <div>
                <h3>
                    <span style={{color: 'red'}}>Administrator:</span>
                    <span style={{color: 'blue'}}> username: admin</span>,
                    <span style={{color: 'green'}}> password: admin</span>
                </h3>
                <h3>
                    <span style={{color: 'orange'}}>Lecturer:</span>
                    <span style={{color: 'blue'}}> username: Hua</span>,
                    <span style={{color: 'green'}}> password: 1234</span>
                </h3>
                <h3>
                    <span style={{color: 'purple'}}>Student:</span>
                    <span style={{color: 'blue'}}> username: Ren</span>,
                    <span style={{color: 'green'}}> password: 1234</span>
                </h3>
            </div>
        </div>
    );
}

export default Home;