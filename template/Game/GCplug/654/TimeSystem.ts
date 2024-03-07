module OpenAPI {

  /**
   * 时间系统
   */
  export class TimeSystemModule {
    /**
     * 当前版本号
     */
    static Version = 1.3

    /**
     * 是否安装本插件
     */
    static Installed = true

    /**
     * OpenAPI要求最低版本
     */
    static OpenAPI_MinVersion = 2.1

    /**
     * 获取服务器时间要求最低版本
     */
    static ServerTimeStamp_MinVersion = 1.4

    /**
     * 数据源
     */
    static TimeSystemModuleData = []

    /**
     * 检查提交与还原数据
     * @param {any} timer 定时器
     * @param {boolean} timerStatus 定时器状态
     * @param {number} timerGetDataType 获取类型
     * @param {number} timerTimeStamp 定时时间戳(自定义)
     * @param {number} timerTimeStampVarID 获取时间戳到变量
     * @param {number} timerStatusID 状态开关
     * @param {number} timerVarID 输出值
     * @param {any} trigger 触发器
     */
    static checkTimeData(timer: any, timerStatus: boolean, timerGetDataType: number, timerTimeStamp: number, timeStampVarID: number, timerStatusID: number, timerVarID: number, trigger: any = null) {
      // 关闭则返回
      if (timerStatus === false)
        return

      // 定时器状态
      timer.timerStatus = timerStatus

      // 获取类型
      timer.timerGetDataType = timerGetDataType

      // 获取本地时间戳
      if (timerGetDataType === 0) {
        timer.timerTimeStamp = Math.floor(Date.now() / 1000)
        checkData()
      }
      // 自定义时间
      if (timerGetDataType === 2) {
        timer.timerTimeStamp = timerTimeStamp
        checkData()
      }
      // 获取服务器时间戳
      if (timerGetDataType === 1) {
        OpenAPI.ServerTimeStamp.requestTimeStamp((timeData: any) => {
          timer.timerTimeStamp = timeData.time
          checkData()
        }, trigger)
      }

      // 封装剩下数据
      function checkData() {
        // 获取时间戳到变量
        if (timeStampVarID) {
          timer.timerTimeStampVarID = timeStampVarID
          Game.player.variable.setVariable(timeStampVarID, timer.timerTimeStamp * 1000)
        }
        // 状态开关
        if (timerStatusID) {
          timer.timerStatusID = timerStatusID
          Game.player.variable.setSwitch(timerStatusID, 1)
        }
        // 输出值
        timer.timerVarID = timerVarID
        // 定时器执行
        timer.timerIntervalIdStart()
      }
    }

    /**
     * 当前定时器编号
     */
    public timerDataID = -1

    /**
     * 定时器状态
     */
    public timerStatus = false

    /**
     * 定时器状态编号
     */
    public timerStatusID = 0

    /**
     * 定时器输出编号
     */
    public timerVarID = 0

    /**
     * 定时器
     */
    public timerIntervalId: any

    /**
     * 定时器时间戳
     */
    public timerTimeStamp = 0

    /**
     * 定时器时间戳输出编号
     */
    public timerTimeStampVarID = 0

    /**
     * 定时器获取数据类型
     */
    public timerGetDataType = 0

    /**
     * 定时器执行
     */
    public timerIntervalIdStart() {
      this.checkTimerTimeStatus()
      this.timerIntervalId = setInterval(() => {
        this.checkTimerTimeStatus()
      }, 300000) // 300000
    }

    /**
          ===========================================
         =================内部实现====================
         ===========================================
     */

    /**
     * 定时器
     */
    private timerIncrementIntervalId: any

    /**
     * 定时器实现
     */
    private checkTimerTimeStatus() {
      if (this.timerStatus) {
        clearInterval(this.timerIncrementIntervalId)
        this.checkTimerTimeStamp()
        Game.player.variable.setString(this.timerVarID, OpenAPI.Method.timestampToDate(this.timerTimeStamp))
        this.timerIncrementIntervalId = setInterval(() => {
          this.checkStatus()
          this.updateTimerData()
          if (!this.timerStatus) {
            clearInterval(this.timerIntervalId)
            clearInterval(this.timerIncrementIntervalId)
          }
          this.timerTimeStamp += 1
          Game.player.variable.setString(this.timerVarID, OpenAPI.Method.timestampToDate(this.timerTimeStamp))
        }, 1000)
      }
      else {
        clearInterval(this.timerIntervalId)
        clearInterval(this.timerIncrementIntervalId)
      }
    }

    /**
     * 刷新时间戳
     */
    private checkTimerTimeStamp() {
      //* * 是否获取服务器信息 */
      if (this.timerGetDataType === 1) {
        OpenAPI.ServerTimeStamp.requestTimeStamp((timeData: any) => {
          this.timerTimeStamp = timeData.time
        })
      }
      if (this.timerGetDataType === 0)
        this.timerTimeStamp = Math.floor(Date.now() / 1000)
    }

    /**
     * 检查各种状态
     */
    private checkStatus() {
      if (this.timerStatusID) {
        if (Game.player.variable.getSwitch(this.timerStatusID))
          this.timerStatus = true
        else
          this.timerStatus = false
      }
      if (this.timerTimeStampVarID)
        Game.player.variable.setVariable(this.timerTimeStampVarID, this.timerTimeStamp * 1000)
    }

    /**
     * 更新实例数据
     */
    private updateTimerData(dataName: any = TimeSystemModule.TimeSystemModuleData) {
      if (this.timerDataID === -1)
        this.timerDataID = dataName.length

      dataName[this.timerDataID] = {
        // 定时器状态
        timerStatus: this.timerStatus,
        // 定时器时间戳输出编号
        timerTimeStampVarID: this.timerTimeStampVarID,
        // 定时器时间戳
        timerTimeStamp: this.timerTimeStamp,
        // 定时器编号
        timerDataID: this.timerDataID,
        // 获取类型
        timerGetDataType: this.timerGetDataType,
        // 定时器状态编号
        timerStatusID: this.timerStatusID,
        // 定时器输出编号
        timerVarID: this.timerVarID,
      }
    }
  }
}
module CommandExecute {
  export function customCommand_15001(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15001): void {
    //* * 是否安装OpenAPI*/
    if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < OpenAPI.TimeSystemModule.OpenAPI_MinVersion) {
      // eslint-disable-next-line no-alert
      alert(`【时间系统】\n请安装前置插件 "OpenAPI" 大于等于 v${OpenAPI.TimeSystemModule.OpenAPI_MinVersion.toFixed(1)} 版本\n如需使用网络功能, 请安装前置插件 "获取服务器时间" 大于等于 v${OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion.toFixed(1)} 版本`)
      return
    }

    const typeData = ['y', 'm', 'd', 'h', 'i', 's']
    let timeStamp

    //* * 是否获取服务器信息 */
    if (p.timeDataTypeList === 1) {
      //* * 是否安装获取服务器时间*/
      if (typeof OpenAPI.ServerTimeStamp == 'undefined' || OpenAPI.ServerTimeStamp.Version < OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion) {
        // eslint-disable-next-line no-alert
        alert(`【时间系统】\n如需使用网络功能, 请安装前置插件 "获取服务器时间" 大于等于 v${OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion.toFixed(1)} 版本`)
        return
      }

      // 获取服务器时间戳
      OpenAPI.ServerTimeStamp.requestTimeStamp((timeData: any) => {
        setTimeStampData(timeData.time)
      }, trigger)
    }

    if (p.timeDataTypeList === 0) {
      timeStamp = Math.floor(Date.now() / 1000)
      setTimeStampData(timeStamp)
    }

    if (p.timeDataTypeList === 2) {
      timeStamp = OpenAPI.Method.JudgeTypeConstantVariable(p.timeStamp, p.timeStampVar, p.timeStampType)
      setTimeStampData(timeStamp / 1000)
    }
    //* *设置时间戳数据 */
    function setTimeStampData(timeStampData: any) {
      let data
      if (!p.setType)
        data = OpenAPI.Method.timestampToDate(timeStampData)
      else
        data = OpenAPI.Method.timestampToDate(timeStampData, typeData[p.setTypeDataList])

      if (!p.setType || p.isDataIndex)
        Game.player.variable.setString(p.setStr, data)

      else
        Game.player.variable.setVariable(p.setNum, Number(data))
    }
  }
  export function customCommand_15002(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15002): void {
    //* * 是否安装OpenAPI*/
    if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < OpenAPI.TimeSystemModule.OpenAPI_MinVersion) {
      // eslint-disable-next-line no-alert
      alert(`【时间系统】\n请安装前置插件 "OpenAPI" 大于等于 v${OpenAPI.TimeSystemModule.OpenAPI_MinVersion.toFixed(1)} 版本\n如需使用网络功能, 请安装前置插件 "获取服务器时间" 大于等于 v${OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion.toFixed(1)} 版本`)
      return
    }

    if (!p.timeStamp) {
      trace('【时间系统】请指定 "输出至" 的变量')
      return
    };
    //* * 是否获取服务器信息 */
    if (p.timeDataTypeList === 1) {
      //* * 是否安装获取服务器时间*/
      if (typeof OpenAPI.ServerTimeStamp == 'undefined' || OpenAPI.ServerTimeStamp.Version < OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion) {
        // eslint-disable-next-line no-alert
        alert(`【时间系统】\n请安装前置插件 "获取服务器时间" 大于等于 v${OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion.toFixed(1)} 版本`)
        return
      }

      // 获取服务器时间戳
      OpenAPI.ServerTimeStamp.requestTimeStamp((timeData: any) => {
        Game.player.variable.setVariable(p.timeStamp, timeData.time * 1000)
      }, trigger)
    }
    if (p.timeDataTypeList === 0)
      Game.player.variable.setVariable(p.timeStamp, Math.floor(Date.now()))

    if (p.timeDataTypeList === 2) {
      let timeData
      const yy = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_y, p.timeNumVar_y, p.timeNumType_y)
      const mm = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_m, p.timeNumVar_m, p.timeNumType_m)
      const dd = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_d, p.timeNumVar_d, p.timeNumType_d)
      const hh = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_h, p.timeNumVar_h, p.timeNumType_h)
      const ii = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_i, p.timeNumVar_i, p.timeNumType_i)
      const ss = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_s, p.timeNumVar_s, p.timeNumType_s)
      if (p.isTimeType)
        timeData = `${yy}/${mm}/${dd} ${hh}:${ii}:${ss}`
      else
        timeData = Game.player.variable.getString(p.timeStr)

      Game.player.variable.setVariable(p.timeStamp, OpenAPI.Method.dateToTimestamp(timeData))
    }
  }
  export function customCommand_15003(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15003): void {
    //* * 是否安装OpenAPI*/
    if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < OpenAPI.TimeSystemModule.OpenAPI_MinVersion) {
      // eslint-disable-next-line no-alert
      alert(`【时间系统】\n请安装前置插件 "OpenAPI" 大于等于 v${OpenAPI.TimeSystemModule.OpenAPI_MinVersion.toFixed(1)} 版本\n如需使用网络功能, 请安装前置插件 "获取服务器时间" 大于等于 v${OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion.toFixed(1)} 版本`)
      return
    }

    if (!p.setTime) {
      trace('【时间系统】请指定 "输出至" 的变量')
      return
    };

    const timer = new OpenAPI.TimeSystemModule()
    let timerTimeStamp

    if (p.timeDataTypeList === 1) {
      //* * 是否安装获取服务器时间*/
      if (typeof OpenAPI.ServerTimeStamp == 'undefined' || OpenAPI.ServerTimeStamp.Version < OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion) {
        // eslint-disable-next-line no-alert
        alert(`【时间系统】\n请安装前置插件 "获取服务器时间" 大于等于 v${OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion.toFixed(1)} 版本`)
        return
      }

      // 无需请求服务器，因为函数内会请求
      //   OpenAPI.ServerTimeStamp.requestTimeStamp((timeData: any) => {
      //     timerTimeStamp = timeData.time
      //     OpenAPI.TimeSystemModule.checkTimeData(timer, true, p.timeDataTypeList, timerTimeStamp, p.setTimeStamp, p.timeGetStatus, p.setTime)
      //   }, trigger)

      // 获取服务器时间戳
      timerTimeStamp = Math.floor(Date.now() / 1000)
      OpenAPI.TimeSystemModule.checkTimeData(timer, true, p.timeDataTypeList, 0, p.setTimeStamp, p.timeGetStatus, p.setTime)
    }

    if (p.timeDataTypeList === 0) {
      timerTimeStamp = Math.floor(Date.now() / 1000)
      OpenAPI.TimeSystemModule.checkTimeData(timer, true, p.timeDataTypeList, timerTimeStamp, p.setTimeStamp, p.timeGetStatus, p.setTime)
    }

    if (p.timeDataTypeList === 2) {
      const yy = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_y, p.timeNumVar_y, p.timeNumType_y)
      const mm = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_m, p.timeNumVar_m, p.timeNumType_m)
      const dd = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_d, p.timeNumVar_d, p.timeNumType_d)
      const hh = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_h, p.timeNumVar_h, p.timeNumType_h)
      const ii = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_i, p.timeNumVar_i, p.timeNumType_i)
      const ss = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_s, p.timeNumVar_s, p.timeNumType_s)
      const timeData = `${yy}/${mm}/${dd} ${hh}:${ii}:${ss}`
      timerTimeStamp = OpenAPI.Method.dateToTimestamp(timeData) / 1000
      OpenAPI.TimeSystemModule.checkTimeData(timer, true, p.timeDataTypeList, timerTimeStamp, p.setTimeStamp, p.timeGetStatus, p.setTime)
    }
  }
}
SinglePlayerGame.regSaveCustomData('OpenAPI_TimeSystemModule_Data', Callback.New(() => {
  return OpenAPI.TimeSystemModule.TimeSystemModuleData
}, null))

EventUtils.addEventListenerFunction(SinglePlayerGame, SinglePlayerGame.EVENT_ON_AFTER_RECOVERY_DATA, (trigger: CommandTrigger) => {
  const data = SinglePlayerGame.getSaveCustomData('OpenAPI_TimeSystemModule_Data')
  for (let i = 0; i < data.length; i++) {
    const timer = new OpenAPI.TimeSystemModule()
    const _data = data[i]
    OpenAPI.TimeSystemModule.checkTimeData(timer, _data.timerStatus, _data.timerGetDataType, _data.timerTimeStamp, _data.timerTimeStampVarID, _data.timerStatusID, _data.timerVarID)
  }
}, null)
