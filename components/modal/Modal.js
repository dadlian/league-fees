import React from "react";
import styles from './Modal.scss';

export default class Modal extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    if(this.props.visible){
      return (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.menu} onClick={this.props.close}><img src='assets/close.png' /></div>
            {this.props.children}
          </div>
        </div>
      );
    }else{
      return null;
    }
  }
}
