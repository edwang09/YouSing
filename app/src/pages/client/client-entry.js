import React, { Component } from 'react'
import { Link } from "react-router-dom";

class Cliententry extends Component {
    constructor(props) {
        super(props);
    }
  render() {
    return (
      <div className="entry">
        <form >
            <div className="formgroup">
                <label htmlFor="roomid">Room Id</label>
                <input type="text" name="roomid" value={this.props.roomid} onChange={this.props.roomidChange()}/>
            </div>
                <button onClick={this.props.roomidSubmit()}>Submit</button>
        </form>
      </div>
    )
  }
}
export default Cliententry