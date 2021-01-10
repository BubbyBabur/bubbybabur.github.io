import React from "react";
import Net from "./utils/net";

// LOL css imports
import './css/app.css'
import './css/front.css'
import './css/projects.css'
import './css/trinkets.css'
import './css/menu.css'
import './css/footer.css'

import projectdata from './data/projects.json';
import trinketdata from './data/trinkets.json';

function Front(props) {
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

function DownIcon(props) {
    return (
        <a href="#projects"> <img alt="down" id="down-icon" src="icons/Down-Icon.svg" /></a>
    )
}

function Hamburgalar(props) {
    return (
        <img alt="hamburger" id="sandwich" src="icons/sandwich.svg"></img>
    )
}

function SideBar(props) {
    return (
        <div id="sidebar" style={{
            transform: props.open ? `` : `translate(-100%,0px)`
        }}>
            <img alt="X" src="icons/X.svg" id="SideBarX" onClick={props.close} />
            <a href="/">About</a>
            <a href="/">Work</a>
            <a href="/">Links</a>
        </div>
    )
}

function Covering (props) {
    return (
        <div className="fullsize velvet" style={{
            opacity: props.active ? 0.3 : 0,
            visibility: props.active ? "visible" : "hidden"
        }} />
    )
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

function Link(props){
    return (
        <a target="_blank" rel="noopener noreferrer" href={`${props.data.link}`} className="link">
            <img 
                alt={`${props.data.linkname}`} 
                src={`icons/${props.data.linkname}-${props.light ? `White` : `Black`}.svg`} 
                className="link-img"
            />
        </a>
    )
}

function Project(props) {
    return (
        <div className="project">
            <img className="project-image" alt={`${props.data.picture}`} src={`images/projects/${props.data.picture}`} />
            <div className="project-info">
                <span className="project-title">{props.data.name}</span>
                <span className="project-desc">{props.data.description}</span>
                <div className="project-links">
                    {props.data.links.map(a => <Link data={a} key={a.linkname} />)}
                </div>
            </div>
        </div>
    )

}

function Projects(props) {
    return (
        <div>
            <div id="projects">
                <h1>Projects</h1>
                <div id="project-container">
                    {projectdata.map(a => <Project data={a} key={a.name} />) }
                </div>
            </div>
        </div>
    );
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

    const [ active, setactive ] = React.useState(false)

    console.log(active);

    const data = props.data;
    return (
        <div className="trinket" onClick={() => setactive(!active)}>
            <div className="trinket-label-container">
                <div className="trinket-label">{data.name}</div>
                <div className={"trinket-info" + (active ? ' trinket-info-activated' : '')}>
                    <div className="trinket-title">{data.name}</div>
                    <div className="trinket-description">{data.description}</div>
                    <div className="trinket-links"> 
                        {data.links.map(a => <Link light={true} data={a} key={a.linkname} />)}
                    </div>
                </div>
            </div>
            <img className="trinket-img" alt={data.name} src={`./images/trinkets/${data.picture}`} />
        </div>
    )
}

function Trinkets(props) {
    return (
        <div id="trinkets">
            <h1>Trinkets</h1>
            <div id="trinket-container">
                {trinketdata.map(a => <Trinket data={a} key={a.name} />)}
            </div>
        </div>
    )
}

function FooterIcon(props) {
    return (
        <div className="footer-icon-link">
            <a href={props.link} target="_blank" rel="noopener noreferrer">
                <div className="footer-icon-div">
                    <img alt={props.icon} className="footer-icon-image" src={`./icons/${props.icon}`} />
                </div>
            </a>
        </div>
    )
}

function FooterLink(props) {
    return (
        <div className="footer-link">
            <a href={props.link}>{props.text}</a>
        </div>
    )
}

function Footer(props) {
    return (
        <div id="footer">
            <div id="footer-icons">
                <FooterIcon icon="Mail-White.svg" link="mailto:rogerjoeyfan@gmail.com" />
                <FooterIcon icon="PFP.svg" />
                <FooterIcon icon="Github-White.svg" link="https://github.com/BubbyBabur" />
            </div>
            <div id="footer-links">
                <FooterLink text="Projects" link="#projects" />
                <FooterLink text="Trinkets" link="#trinkets" />
            </div>
            <div id="footer-name">
                Roger Fan
            </div>
            <div id="footer-copyright">
                ©Copyright 2020<br />
                All Rights Reserved
            </div>
        </div>
    )
}

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
                <Footer />
            </div>
        );
    }
}

export default App;
