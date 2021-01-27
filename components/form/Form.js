import React from 'react'
import styles from './Form.scss'
import TextField from './text-field/TextField.js';
import ImageField from './image-field/ImageField.js';
import TextBox from './text-box/TextBox.js';
import Dropdown from './dropdown/Dropdown.js';
import Button from '../button/Button.js';

export default class Form extends React.Component{
  constructor(props){
    super(props);

    let fields = {}
    let errors = {}
    for(let field of props.fields){
      fields[field.label] = {label: field.label, value: ""}
      errors[field.label] = ""
    }

    this.state = {
      fields: fields,
      errors: errors
    }

    this.updateValues = this.updateValues.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.submit = this.submit.bind(this)
  }

  componentDidMount(){
    let fields = this.state.fields;

    if(this.props.load){
      this.props.load().then(loadValues => {
        for(let field of Object.keys(loadValues)){
          fields[field].value = loadValues[field];
        }

        this.setState({
          fields: fields
        })
      })
    }
  }

  render(){
    return (
      <div className={styles.form} onKeyDown={this.keyPressed}>
        {
          this.props.fields.map((field, index) => (
            <div key={index} className={styles.field+ ' '+(field.type == "textbox"?styles.full:"")+ ' ' + (field.short?styles.short:'')}>
              {field.type == "textfield" &&
                <TextField field={this.state.fields[field.label]}
                            hidden={field.hidden}
                            error={this.state.errors[field.label]}
                            onChange={this.updateValues} />
              }
              {field.type == "image" &&
                <ImageField field={this.state.fields[field.label]}
                            error={this.state.errors[field.label]}
                            onChange={this.updateValues} />
              }
              {field.type == "dropdown" &&
                <Dropdown field={this.state.fields[field.label]}
                            options={field.options}
                            error={this.state.errors[field.label]}
                            onChange={this.updateValues} />
              }
              {field.type == "textbox" &&
                <TextBox field={this.state.fields[field.label]}
                            error={this.state.errors[field.label]}
                            onChange={this.updateValues} />
              }
            </div>
          ))
        }
        <div className={styles.panel}>
          <div className={styles.success}>{this.props.success}</div>
          <div className={styles.error}>{this.props.error}</div>
          <Button text={this.props.loading?this.props.loadText:this.props.action}
              onClick={this.submit} disabled={this.props.loading} />
        </div>
      </div>
    )
  }

  updateValues(field){
    let fields = this.state.fields;
    fields[field.label].value = field.value;

    let errors = this.state.errors;
    errors[field.label] = "";

    this.setState({
      fields: fields,
      errors: errors
    })
  }

  keyPressed(event){
    if(event.target.type !== "textarea" && event.keyCode == 13){
      this.submit();
    }
  }

  submit(){
    if(this.props.loading){
      return;
    }

    let hasErrors = false;
    let errors = this.state.errors;

    for(let field of this.props.fields){
      //Check required values are provided
      if(field.required && !this.state.fields[field.label].value){
        errors[field.label] = "Please enter the "+field.label.toLowerCase()
        hasErrors = true
      }

      //Check field has the right number of character
      if(field.min && this.state.fields[field.label].value.length < field.min){
        errors[field.label] = `The ${field.label.toLowerCase()} must have at least ${field.min} characters`
        hasErrors = true
      }

      if(field.max && this.state.fields[field.label].value.length > field.max){
        errors[field.label] = `The ${field.label.toLowerCase()} must have no more than ${field.max} characters`
        hasErrors = true
      }

      //Check for pattern matches
      if(field.pattern && !(this.state.fields[field.label].value.match(new RegExp(field.pattern)))){
        errors[field.label] = "Please enter a valid "+field.label.toLowerCase()
        hasErrors = true
      }
    }

    this.setState({
      errors: errors
    })

    if(!hasErrors){
      this.props.onSubmit(this.state.fields);
    }
  }
}
