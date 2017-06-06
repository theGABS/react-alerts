import React from 'react'
import './index.scss'

// TODO haven`t correct TS version, check maybe now it be
const ReactCSSTransitionGroup = require('react-addons-css-transition-group')

export enum AlertType {
  INFO,
  SUCCESS,
  ERROR
}

let linkToAlerts: Alerts = null

interface AlertProps {
  text: string,
  type: AlertType,
  id: string,
  hide: boolean,
  style?: any
}

class AlertItem extends React.Component<AlertProps, {}> {
  render () {
    let classNameMap = {
      [AlertType.INFO]: '', // default style
      [AlertType.SUCCESS]: 'alerts_item--success',
      [AlertType.ERROR]: 'alerts_item--error'
    }
    return <div className={'alerts_item ' + classNameMap[this.props.type]} style={this.props.style}>
      {this.props.text}
    </div>
  }
}

const ANIMATION_TIME = 400
export class Alerts extends React.Component<{}, {data: Array<AlertProps>}> {
  state: {data: Array<AlertProps>} = {
    data: []
  }
  componentDidMount () {
    if (linkToAlerts) {
      console.error('YOU SHOULD NOT CREATE TWO INSTANCE OF ALERTS!')
    }
    linkToAlerts = this
  }
  render () {
    return <div className='alerts'>
      <ReactCSSTransitionGroup
        transitionName='alert-animation'
        transitionEnterTimeout={ANIMATION_TIME}
        transitionLeaveTimeout={ANIMATION_TIME}>
        {this.state.data.reverse().map((alert, index) => {
          return <AlertItem {...alert} style={{bottom: 20 + index * 60}} key={alert.id} />
        })}
      </ReactCSSTransitionGroup>
    </div>
  }
}

const DISPLAY_TIME = 3000
const DELAY_TIME = 2000
const DISPLAY_COUNT = 3

class AlertHandler {
  data: Array<AlertProps> = []
  deleteNextItemTime: number = 0

  info (value: string) {
    this.add(value, AlertType.INFO)
  }

  success (value: string) {
    this.add(value, AlertType.SUCCESS)
  }

  error (value: string) {
    this.add(value, AlertType.ERROR)
  }

  add (value: string, type: AlertType) {
    const uid = Math.random() + Date.now().toString()
    this.data.push({
      id: uid,
      text: value,
      type: type,
      hide: false
    })

    // Если перед элементов нет других удаляем через DISPLAY_TIME.
    // Если есть не раньше чем через DELAY_TIME с момента удаления последнего элемента
    let removeAfter = Math.max(DISPLAY_TIME, this.deleteNextItemTime - Date.now())
    this.deleteNextItemTime = Date.now() + removeAfter + DELAY_TIME
    setTimeout(() => {
      this.data.find(alert => alert.id === uid).hide = true
      this.update()
    }, removeAfter)
    this.update()
  }

  update = () => {
    linkToAlerts.setState({data: this.data.filter(item => !item.hide).slice(0, DISPLAY_COUNT)})
  }
}

const Alert = new AlertHandler()

export default Alert