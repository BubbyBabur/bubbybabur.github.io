import React from "react";
import Net from "./utils/Net";
import './css/app.css'
import projectdata from './data/projects.json';
import trinketdata from './data/trinkets.json';

class Front extends React.Component {
    render() {
        return (
            <div>
                <Net />
                <div id="front" className="fullsize">
                    <div id="front-background" style={{
                        WebkitMask: `url(./icons/front-crack-negative-mask.svg) left / auto 100% no-repeat`
                    }} />
                    <span id="front-roger-fan">Roger Fan</span>
                </div>
                <DownIcon />
            </div>
        );
    }
}

function DownIcon(props) {
    return (
        <a href="#Projects"> <img id="down-icon" src="icons/Down-Icon.svg" /></a>
    )
}

class Hamburgalar extends React.Component {
    render() {
        return (
            <img alt="hamburger" id="sandwich" src="icons/sandwich.svg"></img>
        )
    }
}

class SideBar extends React.Component {
    render() {
        return (
            <div id="sidebar" style={{
                transform: this.props.open ? `` : `translate(-100%,0px)`
            }}>
                <img alt="X" src="icons/X.svg" id="SideBarX" onClick={this.props.close} />
                <a href="/">About</a>
                <a href="/">Work</a>
                <a href="/">Links</a>
            </div>
        )
    }
}

class Covering extends React.Component {
    render() {
        return (
            <div className="fullsize velvet" style={{
                opacity: this.props.active ? 0.3 : 0,
                visibility: this.props.active ? "visible" : "hidden"
            }} />
        )
    }
}

class SideBarController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    open() {
        this.setState({
            open: true
        })
        // Disable scrolling: 
        document.body.style.overflow = "hidden";
        document.body.style.height = "100%";
    }

    close() {
        this.setState({
            open: false
        })
        // Ok scroll now
        document.body.style.overflow = "";
        document.body.style.height = "";
    }

    render() {
        if(this.state.open ) {
            return (
                <div>
                    <Covering active={true} />
                    <SideBar open={true} close={() => { this.close() }} />
                    <div onClick={() => { this.close() }}><Hamburgalar /></div>
                </div>
            )
        } else {
            return (
                <div>
                    <Covering active={false} />
                    <SideBar open={false} close={() => { this.close() }} />
                    <div onClick={() => { this.open() }}><Hamburgalar /></div>
                </div>
            )
        }
    }
}

class Link extends React.Component {
    render() {
        return (
            <a href={`${this.props.data.link}`} className="project-link">
                <img 
                    alt={`${this.props.data.linkname}`} 
                    src={`icons/${this.props.data.linkname}.svg`} 
                    className="project-link-img"
                />
            </a>
        )
    }
}

class Project extends React.Component {
    render() {
        return (
            <div className="project">
                <img className="project-image" alt={`${this.props.data.picture}`} src={`images/projects/${this.props.data.picture}`} />
                <div className="project-info">
                    <span className="project-title">{this.props.data.name}</span>
                    <span className="project-desc">{this.props.data.description}</span>
                    <div className="project-links">
                        {this.props.data.links.map(a => <Link data={a} key={a.linkname} />)}
                    </div>
                </div>
            </div>
        )
    }
}

class Projects extends React.Component {
    
    render() {
        return (
            <div>
                <div id="Projects">
                    <h1>Projects</h1>
                    <div id="project-container">
                        {projectdata.map(a => <Project data={a} key={a.name} />) }
                    </div>
                </div>
            </div>
        );
    }
}

function SecondCrack(props) {
    return (
        <div id="second-crack" style={{
            height: `400px`,
            width: `100vw`,
            WebkitMask: `url(./icons/second-crack-negative-mask.svg) left / auto 100% no-repeat`
        }} />
    )
}

function Trinket(props) {

    const data = props.data;
    return (
        <div>
            
        </div>
    )
}

function Trinkets(props) {
    return (
        <div id="Trinkets">
            <h1>Trinkets</h1>
            {trinketdata.map(a => <Trinket data={a} key={a.name} />)}
        </div>
    )
}

// class Footer extends React.Component {

// }

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div id="content"> 
                <Front />
                <Projects />
                <SecondCrack />
                <SideBarController />
                <Trinkets />
            </div>
        );
    }
}

export default App;
