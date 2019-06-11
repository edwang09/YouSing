import React, { Component } from 'react'
import { Link } from "react-router-dom";
import classNames from 'classnames'

class Clientcontrol extends Component {
    constructor(props) {
      super(props);
    }
    sendsocket = (command) => e =>{
      this.props.sendsocket(JSON.stringify({
        "type":"tohost",
        "command":command,
        "role":"client",
        "roomid":this.props.currentroom.roomid,
        "clientID":this.props.clientID
      }))
    }
  
  render() {
    return (
      <div  className={classNames("control",{"tab-open":this.props.currenttab === "control"},{"control-open":this.props.controlopen})}>
          <div className="button-group">
            <h5><i className="fas fa-microphone-alt"></i>Original / Accompany</h5>
            <hr/>
            <div className="buttons">
                <button onClick = {this.sendsocket("original")}>Original</button>
                <button onClick = {this.sendsocket("accompany")}>Accompany</button>
            </div>
          </div>
          <div className="button-group">
            <h5><i className="fas fa-step-forward"></i>Navigation</h5>
            <hr/>
            <div className="buttons">
                <button onClick = {this.sendsocket("restart")}>Restart</button>
                <button onClick = {this.sendsocket("next")}>Next Song</button>
            </div>
          </div>
          <div className="button-group">
            <h5><i className="far fa-sticky-note"></i>Lyric</h5>
            <hr/>
            <div className="buttons">
                <button onClick = {this.sendsocket("showlyric")}>Show Lyric</button>
                <button onClick = {this.sendsocket("hidelyric")}>Hide Lyric</button>
            </div>
          </div>
          <div className="button-group">
            <h5><i className="far fa-sticky-note"></i>Info Panel</h5>
            <hr/>
            <div className="buttons">
                <button onClick = {this.sendsocket("showpanel")}>Show Panel</button>
                <button onClick = {this.sendsocket("hidepanel")}>Hide Panel</button>
            </div>
          </div>
      </div>
    )
  }
}
export default Clientcontrol