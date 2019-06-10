import React, { Component } from 'react'
import { Link } from "react-router-dom";

class Clientheader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="header">
        <div className="close-box">
            <i className="fas fa-times"></i>
        </div>
        <div className="head">
            <Link to="/" className="brand">
                You Sing
            </Link>
        </div>
        <div className="search-icon" onClick={this.props.opensearchbar()}>
            <i className="fas fa-search"></i>
        </div>
      </div>
    )
  }
}
export default Clientheader