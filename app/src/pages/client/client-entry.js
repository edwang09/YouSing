import React, { Component } from 'react'
import { Link } from "react-router-dom";

class Cliententry extends Component {
    constructor(props) {
        super(props);
    }
  render() {
    return (
      <div className="entry">
        <div className="entry-head">
        <i className="fas fa-unlock-alt"></i>
        <span> Karaoke Panel</span>
        </div>
        <form onSubmit={this.props.roomidSubmit()}>
            <div className="formgroup">
                <label htmlFor="roomid"><b>Room key</b></label>
                <input type="text" name="roomid" placeholder="enter your roomid to join karaoke room" value={this.props.roomid} onChange={this.props.roomidChange()}/>
                <p href="/" className="instruction">Where do I find Room Key?</p>
            </div>
            <div className="buttons">
            <button onClick={this.props.roomidSubmit()}>Submit</button>
                {
                  (localStorage.getItem('roomid') && localStorage.getItem('roomid')!=="") &&
                  <button onClick={this.props.roomidSubmit(localStorage.getItem('roomid'))}>Go to last room</button>
                }
            </div>
        </form>
      </div>
    )
  }
}
export default Cliententry