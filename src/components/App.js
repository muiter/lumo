import React, { Component } from 'react'
import { Motion, spring, stiffness, damping } from 'react-motion'

import CurrenyInput from './components/CurrenyInput'

const App = React.createClass({

  getInitialState() {
    return {
      USDRate: null,
      EURRate: null,
      USD_total: null,
      EUR_total: null,
      baseCurrency: 'USD',
      showHint: true,
      arrowDeg: {EUR: -45, USD: 135}
    }
  },

  componentWillMount() {
    this._getExchangeRates()
  },

  componentDidMount() {
    let focusedInput = document.getElementsByClassName(this.state.baseCurrency)[0]
    focusedInput.focus()
    focusedInput.classList.add(`${this.state.baseCurrency}-border`, `${this.state.baseCurrency}-color`)

    this._switchArrowDeg()
    window.addEventListener('resize', this._switchArrowDeg)
    setTimeout(() => this.setState({ showHint: false }), 3000)
  },

  _switchArrowDeg() {
    if ( window.innerWidth <= 900 ) {
      this.setState({ arrowDeg: {EUR:45,  USD:225} })
    }
  },

  _getExchangeRates() {
    fetch('http://api.fixer.io/latest?base=USD')
    .then( (response) => response.json() )
    .then( (data) => this.setState({EURRate: data.rates.EUR}))
    .catch( e => console.log("Something went wrong :(") )

    fetch('http://api.fixer.io/latest?base=EUR')
    .then( (response) => response.json() )
    .then( (data) => this.setState({USDRate: data.rates.USD}))
    .catch( e => console.log("Something went wrong :(") )
  },

  _nonFocusedInput(name) {
    return name === 'USD' ? 'EUR' : 'USD'
  },

  _calculateCurrencyOutPut(name, value) {
    let total = ""
    let notFocusedCurrencyAmount = this._nonFocusedInput(name)

    if (value) {
      total = parseInt(value) * this.state[`${notFocusedCurrencyAmount}Rate`]
      total = (Math.round(total*Math.pow(10,2))/Math.pow(10,2)).toFixed(2)
    }

    this.setState({ [`${notFocusedCurrencyAmount}_total`]: total })
  },

  removeNonFocusedClassNames(target, name) {
    target.classList.remove(`${name}-border`, `${name}-color`)
  },

  addNonFocusedClassNames(target, name) {
    target.classList.add(`${name}-border`, `${name}-color`)
  },

  _onChange(e, name) {
    let target = e.target
    let removeClass = this._nonFocusedInput(name)
    let arrow = document.getElementsByClassName('arrow')[0]
    let notFocusedInput = document.getElementsByClassName(removeClass)[0]

    this.setState({ [`${name}_total`]: target.value })
    this._calculateCurrencyOutPut(name, target.value)
    this.setState({ baseCurrency: name })

    this.addNonFocusedClassNames(target, name)
    this.removeNonFocusedClassNames(notFocusedInput, removeClass)

    this.removeNonFocusedClassNames(arrow, `${removeClass}-color`)
    this.addNonFocusedClassNames(arrow, `${removeClass}-color`)
  },

  _baseCurrencyArrow() {
    return (
      <Motion style={{ rotate: spring(this.state.baseCurrency === "USD" ? this.state.arrowDeg.USD : this.state.arrowDeg.EUR) }}>
        { ({rotate}) =>
          <div
          className={`arrow ${this.state.baseCurrency}-color`}
          style={{WebkitTransform:`rotate(${rotate}deg)`, transform: `rotate(${rotate}deg)` }}>
            &#8598;
          </div>
        }
      </Motion>
    )
  },

  _helpfulHint() {
    return (
      <Motion style={{ top: spring(this.state.showHint ? 10 : -60), opacity: spring(this.state.showHint ? 1 : 0) }}>
        { ({top, opacity}) =>
          <div className="hint" style={{top: top, opacity: opacity}}>Try both inputs!</div>
        }
      </Motion>
    )
  },

  render() {
    return (
      <div className="app">
        {this._helpfulHint()}
        <CurrenyInput
          currencyAmount={this.state.USD_total}
          currencyName="USD"
          currencySymbol="&#36;"
          onChange={this._onChange}
        />
        {this._baseCurrencyArrow()}
        <CurrenyInput
          currencyAmount={this.state.EUR_total}
          currencyName="EUR"
          currencySymbol="&euro;"
          onChange={this._onChange}
        />
      </div>
    )
  }
})

module.exports = App
