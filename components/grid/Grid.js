import React from "react";
import styles from './Grid.scss';

export default class Grid extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className={styles.grid}>
        {this.props.children}
      </div>
    );
  }
}
