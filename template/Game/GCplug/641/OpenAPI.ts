module OpenAPI {

    /**
     * CryptoJS
     */
    export class CryptoJS {

        /**
         * AES加密
         * @param {string} data 需要加密的数据
         * @param {string} key 密钥 必须16字符, 不可泄漏
         * @param {string} iv iv 必须16字符, 必须随机生成
         */
        static AES(data: string, key: string, iv: string): any {

            // 密钥
            let secretKey = OpenAPI_CryptoJS.enc.Utf8.parse(key);

            // iv
            let randomIv = OpenAPI_CryptoJS.enc.Utf8.parse(iv);

            // 加密CBC
            let encryptData = OpenAPI_CryptoJS.AES.encrypt(data, secretKey, {
                mode: OpenAPI_CryptoJS.mode.CBC,
                iv: randomIv,
                padding: OpenAPI_CryptoJS.pad.Pkcs7
            });

            return encryptData.toString();
        }

        /**
         * AES解密
         * @param {string} data 加密的数据
         * @param {string} key 密钥 必须16字符, 不可泄漏
         * @param {string} iv iv 必须16字符, 必须随机生成
         */
        static AES_DECRYPT(data: string, key: string, iv: string): any {

            // 密钥
            let secretKey = OpenAPI_CryptoJS.enc.Utf8.parse(key);

            // iv
            let randomIv = OpenAPI_CryptoJS.enc.Utf8.parse(iv);

            // 加密CBC
            let encryptData = OpenAPI_CryptoJS.AES.decrypt(data, secretKey, {
                mode: OpenAPI_CryptoJS.mode.CBC,
                iv: randomIv,
                padding: OpenAPI_CryptoJS.pad.Pkcs7
            });

            return encryptData.toString(OpenAPI_CryptoJS.enc.Utf8)
        }
    }
}
module OpenAPI {

    /**
     * GameCreator相关API
     */
    export class GC {

        /**
         * GC平台相关API
         */
        static Cloud = {

            /**
             * 是否是GC平台
             */
            get isInGCCloud(): boolean {
                return window.location.href.indexOf("gamecreator") != -1;
            },

            /**
             * 游戏ID
             */
            get GameID(): number {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return 0;
                let p = window.location.href.split("releaseProject/").pop().split("/").shift().split("_");
                return parseInt(p[1]);
            },

            /**
             * 游戏名称
             */
            get GameName(): string {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return null;
                let name = document.querySelector('title').innerText;
                let p = document.querySelector('meta[name="keywords"]').getAttribute('content');
                let remove = name + " | ";
                if (p.startsWith(remove)) {
                    p = p.replace(remove, '');
                }
                return p;
            },

            /**
             * 当前版本号
             */
            get GameVersion(): number {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return 0;
                let p = window.location.href.split("releaseProject/").pop().split("/");
                return parseInt(p[1]);
            },

            /**
             * 作者ID
             */
            get AuthorUID(): number {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return 0;
                let p = window.location.href.split("releaseProject/").pop().split("/").shift().split("_");
                return parseInt(p[0]);
            },

            /**
             * 作者名称
             */
            get AuthorName(): string {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return null;
                let p = document.querySelector('title').innerText;
                return p;
            }

        }

        /**
         * 如果是编辑器则弹窗, 如果是发布后则输出
         */
        static isCloudLog(text: any): void {
            if (Config.RELEASE_GAME) {
                trace(text)
            } else {
                alert(text)
            }
        }
    }

}




module OpenAPI {

    /**
     * 通用API
     */
    export class Method {

        /**
         * 当前页面协议
         * @ "http://" : "https://"
         */
        static get Origin(): string {
            return window.location.protocol == "http:" ? "http://" : "https://";
        }

        /**
         * 随机字符串
         * @param {number} len 随机字符串的长度
         */
        static getRandomString(len: number): string {
            let _charStr = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
                min = 0,
                max = _charStr.length - 1,
                _str = '';
            // 不允许为0的情况
            if (len == 0) {
                return;
            }
            // 循环生成字符串
            for (let i = 0, index; i < len; i++) {
                index = (function (randomIndexFunc, i) {
                    return randomIndexFunc(min, max, i, randomIndexFunc);
                })(function (min, max, i, _self) {
                    let indexTemp = Math.floor(Math.random() * (max - min + 1) + min),
                        numStart = _charStr.length - 10;
                    if (i == 0 && indexTemp >= numStart) {
                        indexTemp = _self(min, max, i, _self);
                    }
                    return indexTemp;
                }, i);
                _str += _charStr[index];
            }
            return _str;
        }

        /**
         * 日期转时间戳, 格式 1970/01/01 00:00:00 或 1970-01-01 00:00:00
         * @param {string} date 日期
         */
        static dateToTimestamp(date: string): number {
            return new Date(date.replace(/-/g, '/')).getTime();
        }

        /**
         * 时间戳转日期, 格式 1609459200。 支持获取特定时间 
         * @param {number} data 时间戳。输出格式 1970/01/01 00:00:00
         * @param {string} data_type 【可选】获取时间类型 y、m、d、h、i、s。如 s = 获取时间戳中的秒
         */
        static timestampToDate(data: number, data_type = ""): string {
            let _data = 0;
            if (String(data).length === 13) {
                _data = data;
            } else {
                _data = data * 1000;
            }
            let time = new Date(_data);
            let _time;
            if (data_type === "y") {
                _time = time.getFullYear();
            }
            if (data_type === "m") {
                _time = pad(time.getMonth() + 1, 2);
            }
            if (data_type === "d") {
                _time = pad(time.getDate(), 2);
            }
            if (data_type === "h") {
                _time = pad(time.getHours(), 2);
            }
            if (data_type === "i") {
                _time = pad(time.getMinutes(), 2);
            }
            if (data_type === "s") {
                _time = pad(time.getSeconds(), 2);
            }
            if (data_type === "") {
                _time = `${time.getFullYear()}/${pad(time.getMonth() + 1, 2)}/${pad(time.getDate(), 2)} ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}`;
            }
            function pad(num: number, size: number): string {
                let s = num + "";
                while (s.length < size) s = "0" + s;
                return s;
            }
            return _time;
        }

        /**
         * 判断常量变量类型
         * @param {any} constant 常量
         * @param {number} variable 变量
         * @param {number} index_type 选项类型 0 = 常量 1 = 变量
         * @param {number} variable_type 【默认数值】变量类型 0 = 数值, 1 = 字符串, 2 = 开关(返回 0 = 关闭, 1 = 开启)
         */
        static JudgeTypeConstantVariable(constant: any, variable: number, index_type: number, variable_type = 0): any {
            let variable_value;
            if (index_type == 0) {
                variable_value = constant;
            } else {
                // 数值
                if (variable_type == 0) {
                    variable_value = Game.player.variable.getVariable(variable);
                }

                // 字符串
                if (variable_type == 1) {
                    variable_value = Game.player.variable.getString(variable);
                }

                // 开关
                if (variable_type == 2) {
                    variable_value = Game.player.variable.getSwitch(variable);
                }
            }
            return variable_value;
        }

        /**
         * 光标系统样式名称
         * 'default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize'
         */
        static cursorSystemStyleName: string[] = [
            'default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize'
        ]

        /**
         * 基于cursorSystemStyleName来弹出指定名称
         * @param {string[]} name 弹出指定的名称
         */
        static cursorSystemStyleName_spliceName(name: string[]): string[] {
            let cursorName = [...OpenAPI.Method.cursorSystemStyleName]
            return cursorName.filter(x => name.indexOf(x.toString()) === -1)
        }

        /**
         * 检查当前模板是否是兼容的模板ID。 false = 不兼容, true = 兼容
         * @param {number[]} templateID 兼容的模板ID合集
         */
        static checkTemplateID(templateID: number[]): boolean {
            return templateID.indexOf(Config.templateID) !== -1;
        }

        /**
         * 随机颜色
         */
        static getRandomColor(): string {
            return '#' + (Math.random() * 0xffffff << 0).toString(16);
        }

        /**
          * 更简单的HttpRequest
          * @param {string} url 请求地址 
          * @param {any} json 数据, get写null即可 
          * @param {any} completeText 完成事件 
          * @param {any} errorText 发生错误时事件 
          * @param {any} trigger 触发器
          */
        static sendRequest(url: string, json: any, completeText: any, errorText: any, trigger = null): void {
            var ur = new HttpRequest();
            ur.send(url, JSON.stringify(json), "post", "json", ["Content-Type", "application/json"]);
            if (trigger) {
                trigger.pause = true;
                trigger.offset(1);
            }
            ur.once(EventObject.COMPLETE, this, (content) => {
                completeText(content);
                if (trigger) {
                    CommandPage.executeEvent(trigger);
                }
            });
            ur.once(EventObject.ERROR, this, (content) => {
                errorText(content);
                if (trigger) {
                    CommandPage.executeEvent(trigger);
                }
            });
        }
    }
}
/**
 * 更多API插件
 * @author BlackWhite
 * @see https://www.gamecreator.com.cn/plug/det/641
 * @version 2.1
 */
module OpenAPI {

  /**
   * 插件的系统API
   */
  export class System {

    /**
     * 当前版本号
     */
    static Version = 2.1;

    /**
     * 是否安装本插件
     */
    static Installed = true;
  }

  // 输出
  setTimeout(function () {
    if (typeof Config !== 'undefined' && typeof OpenAPI !== 'undefined') {
      if (!Config.RELEASE_GAME) {
        trace(`OpenAPI v${OpenAPI.System.Version.toFixed(1)} => OK`)
      } else {
        console.log(` %c OpenAPI v${OpenAPI.System.Version.toFixed(1)} %c https://www.gamecreator.com.cn/plug/det/641 `, "color: #fadfa3; background: #333; padding:8px;border-left:1px solid #fadfa3;border-top:1px solid #fadfa3;border-bottom:1px solid #fadfa3;", "color: #fadfa3; background: #333; padding:8px; border:1px solid #fadfa3;");
      }
    }
  }, 1000);
};


module OpenAPI {

    /**
     * 界面模块API
     */
    export class UI {

        /**
         * 界面列表组件数据初始化
         * @param {UIList} list 指定列表
         * @param {any} list_modelGUI 项模型数据,如：ListItem_1
         * @param {number} list_len 列表长度
         * @param {boolean} isFocus 【默认关闭】是否设置焦点
         */
        static listDataInit(list: UIList, list_modelGUI: any, list_len: number, isFocus = false): void {
            let arr = [];
            for (let i = 1; i <= list_len; i++) {
                arr.push(new list_modelGUI());
            }
            list.items = arr;
            if (isFocus) {
                UIList.focus = list
            }
        }
    }
    /**
     * Created by 千叶不冷 on 2021-09-24 15:26:19.
     * 通用悬浮框(提示框)
     */
    export class ShowTips {

        /**
         * 当前提示框界面id
         */
        static tipUIId: number;

        /**
         * 即将显示的界面id
         */
        static onTipId: number

        /**
         * 当前提示框ui
         */
        static tipUI: UIBase;

        /**
         * 构造函数
         */
        constructor() { }

        /**
         * 显示提示框
         * @param tipData 数据
         * @param id 提示框界面id
         */
        static showTips(tipData: any, id: number) {
            this.tipUIId = id;
            if (!this.tipUI || this.tipUI.id != String(id)) {
                this.tipUI = GameUI.show(id);
                this.tipUI.x = stage.mouseX + 15;
                this.tipUI.y = stage.mouseY + 15;
                this.tipUI.mouseEnabled = false;
                for (let data in tipData) {
                    if (this.tipUI[data] && tipData[data]) {
                        for (let d in tipData[data]) {
                            this.tipUI[data][d] = tipData[data][d];
                        }
                    }
                }
            } else {
                this.tipUI.x = stage.mouseX + 15;
                this.tipUI.y = stage.mouseY + 15;
            }
        }

        /**
         * 关闭所有提示
         */
        static colseTip() {
            if (this.tipUIId) GameUI.hide(this.tipUIId);
            this.tipUIId = 0;
        }

        /**
         * 显示提示
         */
        static showTip: any;

        /**
         * 移动提示
         */
        static moveTip: any;

        /**
         * 初始化完成
         */
        static isInit: boolean = false;

        /**
         * 初始化
         */
        static init(id: number) {
            if (this.isInit) return;
            this.isInit = true;
            GameUI.load(id);
            //当鼠标右键时消除提示
            stage.on(EventObject.RIGHT_MOUSE_DOWN, this, this.colseTip);
        }

        /**
         * 注册鼠标悬浮弹出提示框界面事件
         * @param ui 需要注册的界面ui
         * @param tipId 需要显示的界面id
         * @param tipData 数据 如{"name":{text:"千叶不冷","age":{text:"18"}} 当显示提示框时会自动匹配到提示框界面中相同名字的组件并赋值
         * @param delayed [可选 默认为0] 延迟显示
         * @param expandList [可选 默认为false] 展开列表，当ui为列表时会对里面每个item赋予data.tip的值，即tipData = data.tip
         */
        static addTipEvent(ui: UIBase, tipId: number, tipData: any, delayed: number = 0, expandList: boolean = false) {
            this.init(tipId);
            let onItemCreate = (_ui: UIRoot, data: UIListItemData, index: number) => {
                this.addTipEvent(_ui, tipId, data["tip"], delayed, false);
            }
            var addTip = () => {
                ui.off(EventObject.MOUSE_MOVE, this, this.showTip);
                ui.off(EventObject.MOUSE_OUT, this, this.colseTip);
                ui.off(EventObject.MOUSE_MOVE, this, this.moveTip);
                this.showTip = () => {
                    if (this.tipUIId) {
                        GameUI.hide(this.tipUIId);
                        this.tipUIId = 0;
                    }
                    this.onTipId = tipId;
                    setTimeout(() => {
                        if (this.onTipId == tipId) this.showTips(tipData, tipId);
                    }, delayed)
                }
                this.moveTip = () => {
                    if (this.tipUIId == tipId) this.showTips(tipData, tipId);
                }
                //当鼠标移入时显示
                ui.on(EventObject.MOUSE_OVER, this, this.showTip);
                ui.on(EventObject.MOUSE_MOVE, this, this.moveTip);
                //当鼠标移出时消失
                ui.on(EventObject.MOUSE_OUT, this, this.colseTip);
            }
            //判断是否展开列表
            if (ui instanceof UIList && expandList) {
                ui.on(UIList.ITEM_CREATE, this, onItemCreate);
            } else addTip();
        }
    }
}