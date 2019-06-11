import React, { Component } from 'react'
import axios from 'axios'
import { connect } from "react-redux";
import PropTypes from 'prop-types'
import { loadModal } from "../../actions/modalActions";
import classNames from 'classnames'
import ReactPlayer from 'react-player'

class Host extends Component {
  constructor(props) {
    super(props);
    this.videoplayer = React.createRef();
    this.audioplayer = React.createRef();
    this.keepAlive = null;
    this.waitReady = null;
    this.state = {
        videoplaying: false,
        audioplaying: false,
        videomuted : true,
        audiomuted : true,
        socket:"off",
        changeroom:"",
        header: true,
        lyric: false
    };
  }
  componentWillMount() {
    // const roomid = Math.floor((Math.random() * 10000000) + 1).toString()
    const roomid = "9761353"
    this.setState({roomid:roomid})
    // axios.post("/api/karaokes/create",{
    //   roomid: roomid
    // }).then(res=>{
    //   if (res.data.roomid){
    //     console.log("karaoke host created " + res.data.roomid)
    //     this.setState({roomid:res.data.roomid})
    //   }
    // })
    this.waitForOrder(roomid)
  } 
  componentWillUnmount(){
    if (this.keepAlive){
      clearInterval(this.keepAlive)
    }
    if (this.waitReady){
      clearInterval(this.waitReady)
    }
  }
  componentDidMount() {
    this.connection = new WebSocket((process.env.NODE_ENV === "production"? "wss://yousing.herokuapp.com" : "ws://localhost:8080"));
    this.connection.onopen = evt => { 
      this.setState({socket: "on"})
      if (this.state.roomid){
        this.connection.send(JSON.stringify({
          "type":"register",
          "role":"host",
          "roomid":this.state.roomid
        }))
      }
      this.keepAlive = setInterval(()=>{
        this.connection.send("ping")
      },30000)
    };
    this.connection.onmessage = evt => {
      if (evt.data && evt.data!=="pong") {
        const result = JSON.parse(evt.data)
        console.log(result)
        switch (result.type) {
          case "register":
            this.setState({clientID: result.clientID})
            break;
          case "tohost":
            switch (result.command) {
                case "accompany":
                    this.setState({audiomuted:false, videomuted:true})
                    break;
                case "original":
                    this.setState({audiomuted:true, videomuted:false})
                    break;
                case "next":
                    this.next()(null)
                    break;
                case "restart":
                    window.location.reload();
                    // this.videoplayer.current.seekTo(0)
                    // this.audioplayer.current.seekTo(0)
                    break;
                case "showlyric":
                    this.setState({lyric:true})
                    break;
                case "hidelyric":
                    this.setState({lyric:false})
                    break;
                case "showpanel":
                    this.setState({header:true})
                    break;
                case "hidepanel":
                    this.setState({header:false})
                    break;
                default:
                    break;
                }
            break;
          case "push":
            if (this.state.currentroom && this.state.currentroom.current && this.state.currentroom.current.link==="placeholder"){
              this.setState({currentroom:result.data, videoplaying:false, videomuted:false,audioplaying:false, audiomuted:false })
            }else{
              this.setState({currentroom:result.data})
            }
            break;
          default:
            break;
        }
      }
    };
    this.connection.onclose = evt => {
      clearInterval(this.keepAlive)
      this.setState({socket: "off"})
    };
    this.connection.onerror = evt => { 
        this.setState({socket: "error"})
    	console.log("error recieved")
    	console.log(evt)
    };
  }
  waitForOrder = (roomid) => {
      axios.post("/api/karaokes/room",{
        roomid
      }).then(res=>{
        console.log("get order:")
        console.log(res.data)
        this.setState({currentroom : res.data})
      }).catch(err=>{
        console.log(err)
      })
  }
  waitForReady = (e) =>{
    this.waitReady = setInterval(()=>{
      console.log("wait to start audio")
      if (this.state.audioplayerReady){
        console.log("start audio")
        this.setState({videoplaying:true, videomuted:true})
        setTimeout(()=>{
            this.setState({audioplaying:true, audiomuted:false})
            this.audioplayer.current.seekTo(0)
            }, 468 )
        
        //this.reactplayer.current.props.playing = true
        clearInterval(this.waitReady)
      }
    },200)
  }
  play = () => e => {
    this.waitForReady(e)
  }
  next = () => e => {
    console.log("next")
    axios.post("/api/karaokes/next",{
      roomid: this.state.roomid
    }).then(res=>{
        console.log(res.data)
        this.setState({currentroom:{...this.state.currentroom, current: {link:"placeholder"}}, videoplaying:false, videomuted:false,audioplaying:false, audiomuted:false  })
        setTimeout(() => this.setState({ currentroom : res.data, videoplaying:true, videomuted:true }),300)
        setTimeout(() => this.setState({ audioplaying:true, audiomuted:false }),768)
    }).catch(err=>console.log(err))
  }
  playerError = ()=>e =>{
    console.log("playerError")
    console.log(e)
  }
  render() {
    return (
        <div className="karaoke-host">
            {this.state.currentroom &&
            <div className={classNames("header",{"header-show":this.state.header})}>
                <p><b>Socket : </b>{this.state.socket}</p>
                <p><b>clientID : </b>{this.state.clientID}</p>
                <p><b>Sound : </b>{this.state.audiomuted && "audio muted"}{this.state.videomuted && "video muted"}</p>
                <p><b>Current Room : </b>{this.state.currentroom.roomid}</p>
                <p><b>Next Song : </b>{this.state.currentroom.queue.length > 0 ? this.state.currentroom.queue[0].title : "Please order"}</p>
            </div>
            }
            {(this.state.currentroom && this.state.currentroom.current && this.state.currentroom.current.link && this.state.currentroom.current.link!=="placeholder") && 
                <div>
                    <div className={classNames("header",{"header-show":this.state.header})}>
                        <p><b>Socket : </b>{this.state.socket}</p>
                        <p><b>clientID : </b>{this.state.clientID}</p>
                        <p><b>Sound : </b>{this.state.audiomuted && "audio muted"}{this.state.videomuted && "video muted"}</p>
                        <p><b>Current Room : </b>{this.state.currentroom.roomid}</p>
                        <p><b>Next Song : </b>{this.state.currentroom.queue.length > 0 ? this.state.currentroom.queue[0].title : "Please order"}</p>
                    </div>
                    <div className={classNames("lyric",{"lyric-show":this.state.lyric})}>
                        <h5>Lyric Part</h5>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque architecto consequuntur eaque corrupti assumenda fugiat sed? Placeat voluptatum ex, aspernatur hic expedita adipisci dicta cumque velit molestiae corrupti sequi nisi.</p>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque architecto consequuntur eaque corrupti assumenda fugiat sed? Placeat voluptatum ex, aspernatur hic expedita adipisci dicta cumque velit molestiae corrupti sequi nisi.</p>

                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque architecto consequuntur eaque corrupti assumenda fugiat sed? Placeat voluptatum ex, aspernatur hic expedita adipisci dicta cumque velit molestiae corrupti sequi nisi.</p>

                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque architecto consequuntur eaque corrupti assumenda fugiat sed? Placeat voluptatum ex, aspernatur hic expedita adipisci dicta cumque velit molestiae corrupti sequi nisi.</p>

                    </div>
                    <ReactPlayer className="videocontainer" width="99vw" height="99.6vh" url={"https://www.youtube.com/watch?v="+this.state.currentroom.current.link} 
                        playing = {this.state.videoplaying}
                        muted = {this.state.videomuted}
                        onReady = {this.waitForReady.bind(this)}
                        onEnded={this.next()}
                        ref={this.videoplayer}
                    />
                    <ReactPlayer className="audiocontainer"  width="100px" height="100px" url={"/api/karaokes/audio/"+this.state.currentroom.current.link} 
                        playing = {this.state.audioplaying}
                        muted = {this.state.audiomuted}
                        onError = {this.playerError()}
                        onReady = {() => this.setState({audioplayerReady:true})}
                        ref={this.audioplayer}
                    />
                </div>
            }
        </div>
    )
  }
}
Host.propTypes = {
  loadModal: PropTypes.func.isRequired
};
export default connect(
  null,
  {
    loadModal,
  }
)(Host);