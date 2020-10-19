import React from "react";
import ReactDOM from "react-dom";
import styles from './home.scss';

class HomePage extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <h1>IT WORKS!!!</h1>
    );
  }
}

ReactDOM.render(
  (
    <HomePage />
  ),
  document.getElementById("root")
)

