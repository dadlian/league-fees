import React from 'react';
import styles from './TextBox.scss'
import FormField from '../form-field/FormField.js';

export default class TextBox extends FormField{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className={styles.textBox}>
        <label htmlFor={this.state.field.label}>{this.state.field.label}</label>
        <textarea name={this.state.field.label} value={this.state.field.value} onChange={this.changeValue}></textarea>
        {this.props.error && <div className={styles.error}>{this.props.error}</div>}
      </div>
    )
  }
}
