import React, { Component } from 'react'
import { Link } from "react-router-dom";
import classNames from 'classnames'

export default class HomeNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
          slideOpen: false,
          applicationDropdownOpen: false,
          authDropdownOpen: false
        };
      }
      toggleSlide = () => (e) => {
        console.log(this.state.slideOpen)
        this.setState({slideOpen:!this.state.slideOpen})
      }  
      toggleDropdown = (dropdown) => (e) => {
        if (dropdown==="applications"){
          this.setState({applicationDropdownOpen:!this.state.applicationDropdownOpen})
        }else if (dropdown==="auth"){
          this.setState({authDropdownOpen:!this.state.authDropdownOpen})
        }
      }
    
    
      render() {
        return (
          <nav className="navbar">
              <div className="navbar__toggle" onClick={this.toggleSlide()}>
                    <svg width="30" height="30">
                        <path d="M0,5 30,5" stroke="#ededed" strokeWidth="3"/>
                        <path d="M0,14 30,14" stroke="#ededed" strokeWidth="3"/>
                        <path d="M0,23 30,23" stroke="#ededed" strokeWidth="3"/>
                    </svg>
              </div>
              
              <Link to="/" className="navbar__brand">
                You Sing
              </Link>
              <div className={classNames("navbar__menu",{"sidebar-open":this.state.slideOpen})}>
                <ul className="navbar__nav">
                  <p  className="btn-close" onClick={this.toggleSlide()}>&times;</p>
                  <li className="nav-item">
                    <Link className="nav-link" to="/host">
                      Host Device
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/client">
                      Client Device
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/howtouse">
                      How to Use
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/faq">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
          </nav>
        );
      }
}

