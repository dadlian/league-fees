import React from 'react';
import styles from './ImageField.scss'
import FormField from '../form-field/FormField.js';

export default class ImageField extends FormField{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className={styles.imageField}>
        <label htmlFor={this.state.field.label}>{this.state.field.label}</label>
        <input name={this.state.field.label} type='file' value={this.state.field.value} onChange={this.changeValue} multiple />
        {this.props.error && <div className={styles.error}>{this.props.error}</div>}
      </div>
    )
  }

  changeValue(event){
    let images = event.target.files;

    if(images){
      let values = [];
      for(let image of images){
        let reader  = new FileReader();
        reader.addEventListener("load", function () {
          values.push(reader.result);
          this.props.onChange({label: this.state.field.label, value: values});
        }.bind(this), false);

        reader.readAsDataURL(image);
      }
    }

    this.setState({
      field: {
        label: this.state.field.label,
        value: event.target.value
      }
    })
  }
}
