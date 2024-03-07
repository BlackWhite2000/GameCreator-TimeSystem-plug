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
