import React from 'react';
import styles from './TextField.scss'
import FormField from '../form-field/FormField.js';

export default class TextField extends FormField{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className={styles.textField}>
        <label htmlFor={this.state.field.label}>{this.state.field.label}</label>
        <input name={this.state.field.label} type={this.props.hidden?'password':'text'} value={this.state.field.value} onChange={this.changeValue} />
        {this.props.error && <div className={styles.error}>{this.props.error}</div>}
      </div>
    )
  }
}
