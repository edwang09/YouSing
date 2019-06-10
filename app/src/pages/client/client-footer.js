import React, { Component } from 'react'

class Clientfooter extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div className="footer">
            <div className="icon current" onClick={this.props.tabChange("current")}>
                <i className="fas fa-tv"></i>
                <p>current</p>
            </div>
            <div className="icon control" onClick={this.props.tabChange("control")} >
                <i className="fas fa-sliders-h"></i>
                <p>control</p>
            </div>
      </div>
    )
  }
}
export default Clientfooter