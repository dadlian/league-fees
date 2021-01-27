import React from 'react'

export default class FormField extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      field: props.field
    }

    this.changeValue = this.changeValue.bind(this);
  }

  changeValue(event){
    this.setState({
      field: {
        label: this.state.field.label,
        value: event.target.value
      }
    })

    this.props.onChange({label: this.state.field.label, value: event.target.value});
  }
}
