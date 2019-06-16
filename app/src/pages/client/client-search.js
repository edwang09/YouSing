import React, { Component } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios'

class Clientsearch extends Component {
    constructor(props) {
        super(props);
        this.state={
          keywords:""
        }
    }
    keywordsChange = () => e =>{
    this.setState({keywords : e.target.value})
    }
    submitSearch = () => e =>{
        e.preventDefault()
        axios.get("https://www.googleapis.com/youtube/v3/search?key=AIzaSyACXG0BY_of5_4SHtgG8H9bVrHrUVnfX24&type=video&part=snippet&maxResults=25&q="+ this.state.keywords).then(res=>{
        console.log(res.data)  
        this.setState({
            nextPageToken:res.data.nextPageToken,
            prevPageToken :res.data.prevPageToken,
            items: res.data.items,
            lyriclist: null
            })
            console.log(res.data.items)
        }).catch(err=>{
            console.log(err)
        })
    }
    lyricSearch = () => e =>{
      e.preventDefault()
      axios.post("/api/lyric/search", {
        "keywords":this.state.keywords
      }).then(res=>{
      console.log(res.data)  
      this.setState({
          nextPageToken:null,
          prevPageToken :null,
          items: null,
          lyriclist: res.data
          })
      }).catch(err=>{
          console.log(err)
      })
    }
  render() {
      let ItemsRender
      let LyricRender
      if (this.state.items && this.state.items.length > 0){
        ItemsRender = this.state.items.map((item, idx)=>{
          if (item.id && item.id.videoId){
            return (
              <div className="itemcard" 
                  onClick={()=>this.props.loadModal("ORDER_MODAL",{
                  video: {img: item.snippet.thumbnails.medium.url,
                  link: item.id.videoId,
                  title: item.snippet.title},
                  roomid: this.props.currentroom.roomid
                  })} 
                  key={idx}>
                  <div className="information">
                  <h5>{ item.snippet.title }</h5>
                  <p className="info">{ item.snippet.channelTitle }{" | "}{ item.snippet.publishedAt }
                  </p>
                  <p className="description">{ item.snippet.description }</p>
                  </div>
                  <div className="thumbnail">
                  <img src={item.snippet.thumbnails.medium.url} alt={item.snippet.thumbnails.title}/>
                  </div>
              </div>
            )
          }else{
            return
          }
        })
      }
      if (this.state.lyriclist && this.state.lyriclist.length > 0){
        LyricRender = this.state.lyriclist.map((lyric, idx)=>{
          return (
            <div className="lyriccard" 
                onClick={()=>this.props.loadModal("LYRIC_MODAL",{
                  link: lyric.link,
                  roomid: this.props.currentroom.roomid
                })} 
                key={idx}>
                <div className="information">
                <h5>{ lyric.song }</h5>
                <p className="info">{ lyric.singer }{" | "}{ lyric.album }
                </p>
                </div>
                <div className="issuedate">
                  { lyric.date }
                </div>
            </div>
          )
        })
      }
    return (
      <div className="search">
          <div className="search-head">
            <div className="back-icon" onClick={this.props.closesearchbar()}>
                <i className="fas fa-chevron-left"></i>
            </div>
            <form className="searchbar-input" onSubmit={this.submitSearch()}>
                <div className="formgroup">
                    <input type="text" name="keywords" placeholder="Search for artist, song etc." value={this.state.keywords} onChange={this.keywordsChange()}/>
                    <small>Try adding KTV, 伴奏... to keyword</small>
                </div>
            </form>
            
                <button className="search-lyric"  onClick={this.lyricSearch()}>Lyric</button>
                <button className="search-song"  onClick={this.submitSearch()}>Song</button>
          </div>
        <div className="searchresult">
            {(ItemsRender && !LyricRender) && ItemsRender}
            {(!ItemsRender && LyricRender) && LyricRender}
        </div>
      </div>
    )
  }
}
export default Clientsearch