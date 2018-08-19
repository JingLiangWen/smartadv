import { handleActions, createAction } from "redux-actions";
// import { State } from "../../node_modules/react-native-image-pan-zoom/src/image-zoom/image-zoom.type";
// import { create } from "handlebars";

export const RECORD_START = 'Record/RECORD_START'
export const RECORD_CANCEL = 'Record/RECORD_CANCEl'
export const RECORD_END = 'Record/RECORD_END'
export const CHANGE_SOUND = 'Record/CHANGE_SOUND'

const source1 = require('../images/ifly/ic_record_ripple_1.png')
const source2 = require('../images/ifly/ic_record_ripple_2.png')
const source3 = require('../images/ifly/ic_record_ripple_3.png')
const source4 = require('../images/ifly/ic_record_ripple_4.png')
const source5 = require('../images/ifly/ic_record_ripple_5.png')
const source6 = require('../images/ifly/ic_record_ripple_6.png')
const source7 = require('../images/ifly/ic_record_ripple_7.png')
const source8 = require('../images/ifly/ic_record_ripple_8.png')
const source9 = require('../images/ifly/ic_record_ripple_9.png')

// type
export const UPDATE_VOLUME = 'Record/UPDATE_VOLUME'
export const UPDATE_SEC = 'Record/UPDATE_SEC'
export const RECORD_BEGIN = 'Record/RECORD_BEGIN'
export const FINGER_MOVE = 'Record/FINGER_MOVE'
export const FINGER_RELEASE = 'Record/FINGER_RELEASE'
export const RESULT = 'Record/RESULT'


const GESTURE_STATE = {
  active: 'active',
  end: 'end',
  cancel: 'cancel'
}

const INIT_STATE = {
  source: source1,
  gestureState: GESTURE_STATE.end, // 手势状态
  sec: 0, // 当前读秒
  modalVisible: false
}

export const reducer = handleActions({
  [RECORD_BEGIN]: (state, { payload }) => ({
    ...state,
    gestureState: payload.gestureState,
    modalVisible: true,
    sec: 1
  }),
  [FINGER_RELEASE]: (state, { payload }) => ({
    ...state,
    gestureState: payload.gestureState,
    modalVisible: false,
    sec: 1
  }),
  [UPDATE_SEC]: (state, action) => ({
    ...state,
    sec: action.payload
  }),
  [FINGER_MOVE]: (state, action) => ({
    ...state,
    gestureState: action.payload.gestureState
  }),
  [UPDATE_VOLUME]: (state, action) => {
    const { volume } = action.payload
    let source = state.source
    if (volume > 8) {
      source = source9
    } else if (volume > 7) {
      source = source8
    } else if (volume > 6) {
      source = source7
    } else if (volume > 5) {
      source = source6
    } else if (volume > 4) {
      source = source5
    } else if (volume > 3) {
      source = source4
    } else if (volume > 2) {
      source = source3
    } else if (volume > 1) {
      source = source2
    } else {
      source = source1
    }
    return {
      ...state,
      source
    }
  }
}, INIT_STATE)

// selector

// creator
export const updateVolume = createAction(UPDATE_VOLUME)
export const updateSec = createAction(UPDATE_SEC)
export const beginRecord = createAction(RECORD_BEGIN)
export const move = createAction(FINGER_MOVE)
export const release = createAction(FINGER_RELEASE)
export const didResult = createAction(RESULT)

