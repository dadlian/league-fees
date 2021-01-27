import React from "react";
import styles from './Header.scss';

export default class Header extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className={styles.header} onClick={()=>{location.href="/"}}>
        <div className={styles.content}>
          <div className={styles.hamburger}>
            <img src='assets/hamburger.png' alt='menu' />
          </div>
          <div className={styles.title}>
            <h1>Pay League Fees</h1>
          </div>
        </div>
      </div>
    );
  }
}
