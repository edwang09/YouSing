import React, { Component } from 'react';
import store from './store'
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import ModalContainer from "./components/modal/ModalContainer";


//pages
import Landing from './pages/landing'
import Client from './pages/client/client'
import Host from './pages/host/host'


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <main>
              <div className="main">
                <Route exact path="/" component={Landing} />
                <Route exact path="/client" component={Client} />
                <Route exact path="/host" component={Host} />
              </div>
            </main>
          </div>
          
          <ModalContainer />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
