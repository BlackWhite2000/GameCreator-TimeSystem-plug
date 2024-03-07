module OpenAPI {

    /**
     * 获取服务器时间
     */
    export class ServerTimeStamp {

        /**
         * 当前版本号
         */
        static Version = 1.5;

        /**
         * 是否安装本插件
         */
        static Installed = true;

        /**
         * OpenAPI要求最低版本
         */
        static OpenAPI_MinVersion = 2.1;

        /**
         * 请求服务器时间戳
         */
        static requestTimeStamp(timeData, trigger = null) {
            var ur = new HttpRequest();
            ur.send(WorldData.timeApi_yyvhc, JSON.stringify(null), "get", "json", ["Content-Type", "application/json"]);
            if (trigger) {
                trigger.pause = true;
                trigger.offset(1);
            }
            ur.once(EventObject.COMPLETE, this, (content) => {
                //判断服务器信息
                if (content.type != 0) {
                    trace(content.text)
                }
                timeData(content);
                if (trigger) {
                    CommandPage.executeEvent(trigger);
                }
            });
            ur.once(EventObject.ERROR, this, (content) => {
                trace("【获取服务器时间】请求服务器时间戳错误，请检查api或网络");
                if (trigger) {
                    CommandPage.executeEvent(trigger);
                }

            });
        }
    }
}
module CommandExecute {
    export function customCommand_15004(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15004): void {
        //** 是否安装OpenAPI*/
        if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < OpenAPI.ServerTimeStamp.OpenAPI_MinVersion) {
            alert(`【获取服务器时间】\n本插件于 v1.4 开始需要前置插件 "OpenAPI" 支持\n请安装前置插件 "OpenAPI" 大于等于 v${OpenAPI.ServerTimeStamp.OpenAPI_MinVersion.toFixed(1)} 版本`)
            return;
        }

        //获取服务器时间戳
        OpenAPI.ServerTimeStamp.requestTimeStamp((timeData) => {
            //赋值
            if (p.yy) Game.player.variable.setVariable(p.yyVar, Number(OpenAPI.Method.timestampToDate(timeData.time, 'y')));
            if (p.mm) Game.player.variable.setVariable(p.mmVar, Number(OpenAPI.Method.timestampToDate(timeData.time, 'm')));
            if (p.dd) Game.player.variable.setVariable(p.ddVar, Number(OpenAPI.Method.timestampToDate(timeData.time, 'd')));
            if (p.hh) Game.player.variable.setVariable(p.hhVar, Number(OpenAPI.Method.timestampToDate(timeData.time, 'h')));
            if (p.min) Game.player.variable.setVariable(p.minVar, Number(OpenAPI.Method.timestampToDate(timeData.time, 'i')));
            if (p.ss) Game.player.variable.setVariable(p.ssVar, Number(OpenAPI.Method.timestampToDate(timeData.time, 's')));
            if (p.ret) Game.player.variable.setSwitch(p.retVar, 1);
        }, trigger);
    }
}