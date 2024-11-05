import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../reducer/Actions";
import { FaBook, FaCog } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import '../css/navbar.css';

const Navbar = ({ logout, isAuthenticated }) => {
    const navigate = useNavigate();
    
    if (!isAuthenticated) {
        return <Navigate to="../login" />;
    }

    const handleCourseClick = (e) => {
        e.preventDefault();
        navigate('../courses');
    };

    const handlesettingClick = (e) => {
        e.preventDefault();
        navigate('../settings');
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-end min-vh-100" style={{ width: '250px', position: 'fixed', left: 0, top: 0 }}>
            <div className="container-fluid flex-column align-items-start w-100 p-3">
                <h4 className="mb-4">Databrix Lab</h4>

                <ul className="navbar-nav flex-column w-100 mb-auto">
                    <li className="nav-item mb-2">
                        <Link 
                            className="nav-link d-flex align-items-center" 
                            to="/courses"
                            onClick={handleCourseClick}
                        >
                            <FaBook className="me-3" />
                            <span>Courses</span>
                        </Link>
                    </li>
                </ul>

                <ul className="navbar-nav w-100">
                    <li className="nav-item mb-3">
                        <Link 
                            className="nav-link d-flex align-items-center"
                            onClick={handlesettingClick}
                        >
                            <FaCog className="me-3" />
                            <span>Settings</span>
                        </Link>
                    </li>
                </ul>
                <button 
                    onClick={logout} 
                    className="nav-link d-flex align-items-center w-100 border-0 bg-transparent"
                >
                    <FiLogOut className="me-3" />
                    <span>Log Out</span>
                </button>
            </div>
        </nav>
    );
};

const mapStateToProps = ( state ) => {
    return {
        isAuthenticated: state.AuthReducer.isAuthenticated
    }
}

export default connect(mapStateToProps, { logout })(Navbar);