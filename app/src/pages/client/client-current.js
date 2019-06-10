import React, { Component } from 'react'
import { Link } from "react-router-dom";
import classNames from 'classnames'

class Clientcurrent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {currentroom ,clientID, socket}=this.props
    let QueueRender 

    if (currentroom &&  currentroom.queue){
      QueueRender = currentroom.queue.map((item, idx)=>{
        return (
          <div className="itemcard" key={idx} onClick={()=>this.props.loadModal("KARAOKEEDIT_MODAL",{})}>
            <div >
              <img  className="thumbnail" src={item.img} alt={item.title} width={140}/>
            </div>
            <div className="information">{item.title}</div>
        </div>
        )
      })
    }
    return (
      <div className={classNames("current",{"tab-open":this.props.currenttab === "current"})}>
        <div>Current Room : {currentroom.roomid}</div>
        <div>ClientID : {clientID}</div>
        <div>Socket : {socket}</div>
        <div className="playing">
          <h4>Currently Playing: </h4>
            <div className="itemcard">
              <div className="thumbnail">
                <img src={currentroom.current.img} alt={currentroom.current.title}/>
              </div>
              <div className="information">
                <h4>{currentroom.current.title}</h4>
              </div>
          </div>
        </div>
        <div className="queue">
          <h4>Queue: </h4>
          {QueueRender}
        </div>
      </div>
    )
  }
}
export default Clientcurrent