import React, { Component } from 'react'
import axios from 'axios'
import { connect } from "react-redux";
import PropTypes from 'prop-types'
import { loadModal } from "../../actions/modalActions";
import { setKaraoke } from "../../actions/karaokeAction";
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
        headerShow: true,
        lyricShow: true,
        lyric:"No lyric to show"
    };
  }
  componentWillMount() {
    let roomid
    if (localStorage.getItem('roomid') && localStorage.getItem('roomid')!==""){
      roomid = localStorage.getItem('roomid')
      this.props.setKaraoke({roomid:roomid})
      this.setState({roomid:roomid})
      this.waitForOrder(roomid)
    }else{
      roomid = Math.floor((Math.random() * 10000000) + 1).toString()
      axios.post("/api/karaokes/create",{
        roomid: roomid
      }).then(res=>{
        if (res.data.roomid){
          console.log("karaoke host created " + res.data.roomid)
          this.props.setKaraoke({roomid:roomid})
          this.setState({roomid:roomid})
          localStorage.setItem('roomid', roomid);
          this.waitForOrder(roomid)
        }
      })
    }
  } 
  componentWillUnmount(){
    if (this.keepAlive){
      clearInterval(this.keepAlive)
    }
    if (this.waitReady){
      clearInterval(this.waitReady)
    }
  }
  componentDidMount(){
    this.connectSocket()
  }
  destroyRoom = ()=> e =>{
    this.props.setKaraoke({roomid:""})
    localStorage.removeItem('roomid');
    this.history.push("/")
  }
  connectSocket() {
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
                    this.setState({lyricShow:true})
                    break;
                case "hidelyric":
                    this.setState({lyricShow:false})
                    break;
                case "showpanel":
                    this.setState({headerShow:true})
                    break;
                case "hidepanel":
                    this.setState({headerShow:false})
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
          case "lyric":
              console.log(result)
                this.setState({lyric:result.data})
              break;
          default:
            break;
        }
      }
    };
    this.connection.onclose = evt => {
      clearInterval(this.keepAlive)
      this.connectSocket()
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
        this.setState({
          currentroom : res.data,
          videomuted:(res.data.current ? res.data.current.type !== "original" : true),
          audiomuted:(res.data.current ? res.data.current.type !== "accompany" : true)
         })
      }).catch(err=>{
        setTimeout(this.waitForOrder,500)
      })
  }
  waitForReady = (e) =>{
    this.waitReady = setInterval(()=>{
      console.log("wait to start audio")
      if (this.state.audioplayerReady && this.audioplayer.current){
        console.log(this.state.currentroom.current)
        this.setState({videoplaying:true, videomuted:(this.state.currentroom.current ? this.state.currentroom.current.type !== "original" : true) })
        setTimeout(()=>{
            this.setState({audioplaying:true, audiomuted:(this.state.currentroom.current ? this.state.currentroom.current.type !== "accompany" : true)})
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
        this.setState({currentroom:{...this.state.currentroom, current: {link:"placeholder"}}, videoplaying:false, videomuted:true,audioplaying:false, audiomuted:true  })
        setTimeout(() => this.setState({ 
          currentroom : res.data, 
          // videoplaying:true, 
          // videomuted:(res.data.current ? res.data.current.type !== "original" : true) 
        }),300)
        // setTimeout(() => this.setState({ 
          // audioplaying:true, 
          // audiomuted:(res.data.current ? res.data.current.type !== "accompany" : true)
        //  }),768)
    }).catch(err=>console.log(err))
  }
  playerError = ()=>e =>{
    console.log(e)
    this.next()(null)
  }
  render() {
    return (
        <div className="karaoke-host">
            {this.state.currentroom &&
            <div className={classNames("header",{"header-show":this.state.headerShow})}>
                <p><b>Network : </b>{this.state.socket}</p>
                <p><b>Sound : </b>{this.state.audiomuted && "Original"}{this.state.videomuted && "Vocal removed"}</p>
                <p><b>Current Room : </b>{this.state.currentroom.roomid}</p>
                <p><b>Next Song : </b>{this.state.currentroom.queue.length > 0 ? this.state.currentroom.queue[0].title : "Please order"}</p>
                <a href="/" onClick={this.destroyRoom()}>Destroy room</a>
            </div>
            }
            {(this.state.currentroom && this.state.currentroom.current && this.state.currentroom.current.link && this.state.currentroom.current.link!=="placeholder") && 
                <div>
                    <div className={classNames("lyric",{"lyric-show":this.state.lyricShow})}>
                        <pre>{this.state.lyric}</pre>
                    </div>
                    <ReactPlayer className="videocontainer" width="99vw" height="99.6vh" url={"https://www.youtube.com/watch?v="+this.state.currentroom.current.link} 
                        playing = {this.state.videoplaying}
                        muted = {this.state.videomuted}
                        onReady = {this.waitForReady.bind(this)}
                        onEnded={this.next()}
                        ref={this.videoplayer}
                    />
                    <ReactPlayer className="audiocontainer"  width="0" height="0" url={"/api/karaokes/audio/"+this.state.currentroom.current.link} 
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
  loadModal: PropTypes.func.isRequired,
  setKaraoke: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({ karaoke: state.karaoke })
export default connect(
  mapStateToProps,
  {
    loadModal,
    setKaraoke
  }
)(Host);