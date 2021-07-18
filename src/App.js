
import Home from './pages/home';
import ReactDOM from 'react-dom';
import './App.css';
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';

class App extends React.Component {
  state = {
    loading: true
  };

  componentDidMount() {
    // this simulates an async action, after which the component will render the content
    demoAsyncCall().then(() => this.setState({ loading: false }));
  }
  
  render() {
    const { loading } = this.state;
    
    if(loading) { // if your component doesn't have to wait for an async action, remove this block 
      return (
      <center style={{
        "margin": "0",
        "position": "absolute",
        "top": "50%",
        "left": "50%",
        "-ms-transform": "translate(-50%, -50%)",
        "transform": "translate(-50%, -50%)"
      }}>
        <div class="sk-chase">
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
          </div>
        </center>
      )
    }
    
    return (
      <div><Home/></div>
    ); 
  }
}

function demoAsyncCall() {
  return new Promise((resolve) => setTimeout(() => resolve(), 2500));
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
