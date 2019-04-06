import React, { Component } from 'react';
import store from './store'
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";


//pages
import Landing from './pages/landing'


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <main>
              <div className="main">
                <Route exact path="/" component={Landing} />
              </div>
            </main>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
