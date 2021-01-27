import React from "react";
import styles from './Button.scss';

export default class Button extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className={styles.button} onClick={this.props.onClick}>{this.props.text}</div>
    );
  }
}
