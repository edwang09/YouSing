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
                lyric: res.data.lyric
            });
        }).catch(err=>{
            console.log(err)
        })
    
  }
  onClose = () => e => {
    this.props.hideModal();
  };
  makeOrder=()=>e=>{
      
    this.props.hideModal();
  }
  render() {
    return (
      <Modal onClose={this.onClose} title="Order Detail">
        <pre className="login">
          {this.state.lyric && this.state.lyric}
        </pre>
        <hr />
        <div className="actions">
          <button className="button secondary" onClick={this.makeOrder()}>
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
