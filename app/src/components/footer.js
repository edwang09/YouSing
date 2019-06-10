import React, { Component } from 'react';
import {Link} from 'react-router-dom'

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <div className="footer-container">
        <div className="about">
        <div className="logo">
          YouSing
        </div>
        <p>
        YouSing is an application created by Jianan Wang who was inspired by OOPS effect on Pop music that turn them into Accompanies.
Jianan is a part-time web developer, please visit his site on www.yoshio.space for more amazing applications.
        </p>
        </div>
        <hr />
        <div className="divide">
        </div>
        <nav className="footnav">
          <ul>
            <li className="navitem">
              <Link to="/">Home</Link>
            </li>

            <li className="navitem">
              <Link to="/">Sitemap</Link>
            </li>
            <li className="navitem">
              <Link to="/">Term and Use</Link>
            </li>
            <li className="navitem">
              <Link to="/">FAQ</Link>
            </li>
            <li className="navitem">
              <Link to="/">Privacy Policy</Link>
            </li>
            <li className="navitem">
              2018 &copy; YouSing
            </li>

          </ul>
        
        
        </nav>
        </div>
      </footer>
    )
  }
}
