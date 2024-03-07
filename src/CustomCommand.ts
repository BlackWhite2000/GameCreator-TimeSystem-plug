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
