import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "../Modal";
import Axios from "axios";
import { hideModal } from "../../../actions/modalActions";

class Lyricmodal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        lyric: ""
    }
    this.onClose = this.onClose.bind(this);
  }
  componentWillMount() {
      Axios.post('/api/lyric/text',{
            url: this.props.modal.options.link
        }).then(res=>{
            this.setState({
                link:this.props.modal.options.link,
                lyric: res.data.lyric,
                roomid:this.props.modal.options.roomid,
            });
        }).catch(err=>{
            console.log(err)
        })
    
  }
  onClose = () => e => {
    this.props.hideModal();
  };
  pushLyric=()=>e=>{
    Axios.post('/api/karaokes/pushlyric',{
      lyric: this.state.lyric,
      roomid: this.state.roomid
    }).then(res=>{
    }).catch(err=>{
        console.log(err)
    })
  }
  render() {
    return (
      <Modal onClose={this.onClose} title="Order Detail">
        <pre className="login">
          {this.state.lyric && this.state.lyric}
        </pre>
        <hr />
        <div className="actions">
          <button className="button secondary" onClick={this.pushLyric()}>
            Add to screen
          </button>
          <button  className="button" onClick={this.onClose()}>
            Close
          </button>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  modal: state.modal
});

export default connect(
  mapStateToProps,
  { hideModal }
)(Lyricmodal);
