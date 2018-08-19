import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import { color } from "../../config/globalStyles";
import { Icon } from 'native-base';

import ModalCenterView from "../ModalCenterView";
import * as iFlyUtil from "../../utils/iFlyUtil";
import { connect } from 'react-redux';
import {
  updateVolume,
  updateSec,
  beginRecord,
  move,
  release,
  didResult
} from "../../ducks/RecordBtnDuck";

const MAX_RECORD_SEC = 60
const DU_MIAO_SEC = 10

const GESTURE_STATE = {
  active: 'active',
  end: 'end',
  cancel: 'cancel'
}

class _RecordSoundModal extends Component {

  getContentView = () => {
    const { sec, gestureState } = this.props
    const shengyumiao = MAX_RECORD_SEC - sec
    if (gestureState === GESTURE_STATE.active) {
      const { source } = this.props
      return (<View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        {shengyumiao <= DU_MIAO_SEC ? <Text style={{ color: 'white', fontSize: 77, fontWeight: 'bold' }}>{shengyumiao}</Text>
          : [<Image key={1} source={require('../../images/ifly/ic_record.png')} />,
          <View key={2} style={{ width: 4 }} />,
          <Image key={3} source={source} />]}
      </View>)
    }

    if (gestureState === GESTURE_STATE.cancel) {
      // console.log('取消....')
      return (<View
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('../../images/ifly/ic_release_to_cancel.png')}
        />
      </View>)
    }
  }

  getTextBGColor = () => {
    const { gestureState } = this.props
    if (gestureState === GESTURE_STATE.cancel) {
      return 'rgb(177, 0, 3)'
    } else {
      return 'transparent'
    }
  }

  getText = () => {
    const { gestureState } = this.props
    if (gestureState === GESTURE_STATE.cancel) {
      return '松开手指，取消录音'
    } else {
      return '手指上滑，取消录音'
    }
  }


  render() {
    return (<ModalCenterView
      isVisible={this.props.modalVisible}>
      <View style={{ flex: 1 }}>
        {this.getContentView()}
        <Text style={{
          color: 'white',
          padding: 4,
          // margin: 4,
          marginBottom: 8,
          fontSize: 12,
          backgroundColor: this.getTextBGColor()
        }}>{this.getText()}</Text>
      </View>

    </ModalCenterView>)
  }

}


const RecordSoundModal = connect((state) => ({
  ...state.recordBtn
}))(_RecordSoundModal)

export {
  RecordSoundModal
}

class _RecordBtn extends Component {
  state = {}

  measure = (fx, fy, width, height, px, py) => {
    this.setState({ ...this.state, btnH: height, btnPx: px, btnPy: py, btnW: width }, () => {
      console.log(this.state)
    })
  }


  componentDidMount() {
    intervalID = setInterval(() => {
      console.log('定时器...')
      if (this.recordBtn) {
        this.recordBtn.measure(this.measure.bind(this))
        clearInterval(intervalID)
      }
    }, 250)
  }



  onRecognizerResult = (e) => {
    if (!e.isLast) {
      return;
    }
    this.setState({ ...this.state, text: e.result })
    console.log('DEBUG 识别结束：' + e.result)
  }

  onRecognizerVolumeChange = (result) => {
    let { volume } = result
    let source = this.props.source1

    volume = parseInt(volume)
    this.props.updateVolume(volume)
    if (volume > 8) {
      source = this.props.source9
    } else if (volume > 7) {
      source = this.props.source8
    } else if (volume > 6) {
      source = this.props.source7
    } else if (volume > 5) {
      source = this.props.source6
    } else if (volume > 4) {
      source = this.props.source5
    } else if (volume > 3) {
      source = this.props.source4
    } else if (volume > 2) {
      source = this.props.source3
    } else if (volume > 1) {
      source = this.props.source2
    } else {
      source = this.props.source1
    }

    this.setState({
      ...this.state,
      source
    })
    // 
  }

  isCanceled = () => {
    return this.props.gestureState === GESTURE_STATE.cancel
  }
  isReleased = () => {
    return this.props.gestureState === GESTURE_STATE.end
  }


  onResponderGrant = () => {

    // 开始录音
    iFlyUtil.start({
      onRecognizerResult: this.onRecognizerResult.bind(this),
      onRecognizerVolumeChange: this.onRecognizerVolumeChange.bind(this),
      onRecognizerError: (result) => {

      }
    })

    this.timer = setInterval(() => {
      const { sec = 0 } = this.props
      if (sec === MAX_RECORD_SEC) {
        clearInterval(this.timer)
        if (!this.isReleased()) {
          this.onResponderRelease()
        }

      } else {
        this.setState({ ...this.state, sec: sec + 1 })
        this.props.updateSec(sec + 1)
      }
    }, 1000)

    // 状态变更 
    this.setState({
      ...this.state,
      err: '',
      gestureState: GESTURE_STATE.active,
      modalVisible: true,
      sec: 1,
      text: ''
    }, () => {
    })

    this.props.beginRecord({
      gestureState: GESTURE_STATE.active,
      modalVisible: true,
      sec: 1,
    })
  }

  isOutSide = ({ locationY, pageX, pageY }) => {
    const { btnPy, btnPx, btnH, btnW } = this.state
    if (pageX >= btnPx && pageX <= (btnPx + btnW)
      && pageY >= btnPy && pageY <= (btnPy + btnH)) {
      // console.log('在内部')
      return false
    } else {
      // console.log('在外部')
      return true
    }
  }

  onResponderMove = ({ nativeEvent }) => {
    if (!this.isOutSide(nativeEvent)) {
      this.setState({
        ...this.state,
        gestureState: GESTURE_STATE.active
      })
      this.props.move({
        gestureState: GESTURE_STATE.active
      })
    } else {
      this.setState({
        ...this.state,
        gestureState: GESTURE_STATE.cancel
      })
      this.props.move({
        gestureState: GESTURE_STATE.cancel
      })
    }
  }

  onResponderRelease = () => {
    console.log('松手了')
    const { didResult } = this.props
    if (this.timer) {
      clearInterval(this.timer)
    }

    iFlyUtil.stop()
    // setTimeout(()=>{
    let isCancel = this.isCanceled()

    this.props.release({
      gestureState: GESTURE_STATE.end,
      modalVisible: false
    })
    this.setState({
      ...this.state,
      gestureState: GESTURE_STATE.end,
      modalVisible: false
    }, () => {
      if (isCancel) {
        return
      }

      setTimeout(() => {
        // this.onClickAction({
        //   followUpContent: this.state.text
        // })
        didResult(this.state.text)
      }, 500)

    })
  }

  render() {
    return (
      <View
        style={{
          width: 60,
          height: 60,
          borderColor: color.themeColor,
          borderWidth: 1,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white'
        }}
        ref={(ref) => this.recordBtn = ref}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={this.onResponderGrant.bind(this)}
        onResponderMove={this.onResponderMove.bind(this)}
        onResponderRelease={this.onResponderRelease.bind(this)}
      >

        <Icon name="md-mic"
          style={{
            color: color.themeColor,
            fontSize: 30,
            backgroundColor: 'transparent',
          }}
        />
      </View>
    )
  }
}


export default connect(null, {
  updateVolume,
  updateSec,
  beginRecord,
  move,
  release,
  didResult
})(_RecordBtn)