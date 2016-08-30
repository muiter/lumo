import React, { Component } from 'react'
import cx from 'classnames'

export default class CurrenyInput extends Component {

  constructor(props) {
    super(props)
    this.state = { disabled: true, guids: "" }
  }

  componentWillReceiveProps() {
    this.setState({ animate: true })
  }

  render() {
    return (
      <div className={ cx("currency-input-container", `${this.props.currencyName}-header`) }>
        <div>{`${this.props.currencySymbol} ${this.props.currencyName}`}</div>
        <input
          type="number"
          min="0.01"
          step="0.01"
          className={ cx("currency-input", this.props.currencyName) }
          value={this.props.currencyAmount}
          onChange={ (event) => this.props.onChange(event, this.props.currencyName) }
        />
      </div>
    )
  }
}

CurrenyInput.propTypes = {
  currencyAmount: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  currencyName: React.PropTypes.string.isRequired,
  currencySymbol: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
}
