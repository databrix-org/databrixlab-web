import React from "react";
import { connect } from "react-redux";
import { refresh } from "../reducer/Actions";
import { useNavigate } from "react-router-dom";

const Home = ({ refresh }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/settings');
    };

    return (
        <div className="p-5 mb-4 bg-light rounded-3">
            <div className="container-fluid py-5">
                <h1 className="display-5 fw-bold">Welcome in mywebsite.co.id</h1>
                <p className="col-md-8 fs-4">Using a series of utilities, you can create this jumbotron, just like the one in previous versions of Bootstrap. Check out the examples below for how you can remix and restyle it to your liking.</p>
                <button className="btn btn-primary btn-lg" type="button" onClick={handleClick}>settings</button>
            </div>
        </div>
    )
}

export default connect(null, { refresh })(Home);