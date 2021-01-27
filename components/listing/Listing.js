import React from "react";
import styles from './Listing.scss';
import Button from '../button/Button.js';

export default class Listing extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className={styles.listing}>
        <div className={styles.thumbnail}>
          <img src={this.props.thumbnail} />
          {
            this.props.actionText &&
            <Button text={this.props.actionText} onClick={this.props.action} />
          }
        </div>
        <div className={styles.content}>
          <h2>{this.props.name}</h2>
          {
            Object.keys(this.props.fields).map((field,index) => (
              <div key={field} className={styles.field}>{field}: {this.props.fields[field]}</div>
            ))
          }
        </div>
      </div>
    );
  }
}
