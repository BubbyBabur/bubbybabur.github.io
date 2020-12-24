import React from "react";
import Net from "./utils/Net";
import './css/app.css'

class Front extends React.Component {
    render() {
        return (
            <div>
                <Net />
                <div id="front" className="fullsize">
                    <span id="front-roger-fan">Roger Fan</span>
                </div>
            </div>
        );
    }
}

class Projects extends React.Component {
    render() {
        return (
            <div>
                <div id="Projects" className="fullsize">
                    <h1>Projects</h1>
                    <p>Hello!</p>
                </div>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div> 
                <Front />
                <Projects />
            </div>
        );
    }
}

export default App;
