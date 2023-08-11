import React from 'react';
import RegisterPage from './RegisterPage';
export default function Main(props) {
    return (
        <div>
            <h1 className="main-h1">Fun facts about React</h1>
            <div>
                <RegisterPage /> {/* Include the RegisterPage component here */}
            </div>
        </div>
    );
}
