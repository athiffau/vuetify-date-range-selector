import {consoleInfo, consoleWarn, consoleError} from './Util/console.js'

export default {
  props: {
    consoleMessage: {
      type: Boolean,
      default: false
    },
    consoleFilter: {
      type: String,
      default: ''
    }
  },
  methods: {
    /**
     * [emitConsoleInfo description]
     * @param  {[type]} msg [description]
     * @return {[type]}     [description]
     */
    emitConsoleInfo (msg) {
      this.$emit('info', msg)
      if (this.consoleMessage) {
        consoleInfo(msg, this)
      }
    },

    /**
     * [emitConsoleWarning description]
     * @param  {[type]} msg [description]
     * @return {[type]}     [description]
     */
    emitConsoleWarning (msg) {
      this.$emit('warning', msg)
      if (this.consoleMessage) {
        consoleWarn(msg, this)
      }
    },

    /**
     * [emitConsoleError description]
     * @param  {[type]} msg [description]
     * @return {[type]}     [description]
     */
    emitConsoleError (msg) {
      this.$emit('error', msg)
      if (this.consoleMessage) {
        consoleError(msg, this)
      }
    }
  }
}
