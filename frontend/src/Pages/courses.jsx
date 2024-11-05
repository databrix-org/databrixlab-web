import React from 'react';
import '../css/courses.css';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

const courses = ({ isAuthenticated }) => {
    const dummyCourses = [
        {
            id: 1,
            title: "Ringvorlesung - DHBW Stuttgart",
            instructor: "Prof. Dr. Udo Heuser",
            progress: 60,
            thumbnail: "https://via.placeholder.com/300x200",
            description: "Learn the fundamentals of React development"
        },
    ];
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return (
        <div className="courses-container" style={{ marginLeft: '250px', padding: '20px' }}>
            <h2>Courses</h2>
            <div className="courses-grid">
                {dummyCourses.map(course => (
                    <div key={course.id} className="course-card">
                        <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="course-thumbnail"
                        />
                        <div className="course-content">
                            <h2>{course.title}</h2>
                            <p className="instructor">Instructor: {course.instructor}</p>
                            <p className="description">{course.description}</p>
                            <div className="progress-container">
                                <div 
                                    className="progress-bar" 
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                                <span className="progress-text">{course.progress}% Complete</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
const mapStateToProps = ( state ) => {
    return {
        isAuthenticated: state.AuthReducer.isAuthenticated
    }
}

export default connect(mapStateToProps, {})(courses); 