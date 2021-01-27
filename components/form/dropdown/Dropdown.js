import React from 'react';
import styles from './Dropdown.scss'
import FormField from '../form-field/FormField.js';

export default class Dropdown extends FormField{
  constructor(props){
    super(props);

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  render(){
    return (
      <div className={styles.dropdown}>
        <label htmlFor={this.state.field.label}>{this.state.field.label}</label>
        <select name={this.state.field.label} value={this.state.field.value} onChange={this.changeValue}>
          <option>Please select a value</option>
          {
            this.props.options.map((option, index) => (
              <option key={index}>{option}</option>
            ))
          }
        </select>
        {this.props.error && <div className={styles.error}>{this.props.error}</div>}
      </div>
    )
  }

  toggleDropdown(event){
    console.log(event.target.previousSibling)
  }
}
