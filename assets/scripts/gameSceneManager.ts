// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import { globalVariables } from "./utils/GlobalVariables";
import { AppConstants } from "./utils/constants";


@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    BackGround: cc.Node = null;

    @property(cc.Node)
    timerLaber: cc.Node = null;

    @property(cc.Node)
    foundElementStatisticsLabel: cc.Node = null;

    @property(cc.Node)
    maskSuccess: cc.Node = null;

    @property(cc.Node)
    maskFail: cc.Node = null;

    winOrfailFlag: boolean = false;

    passGameTime: number = 0;

    // LIFE-CYCLE CALLBACKS:

    backLevelSelectScene(){
        cc.director.loadScene(AppConstants.LEVEL_SELECT_SCENE)
    }
    

    onLoad () {

        cc.resources.load("coreGameSceneMaterial/image/" + globalVariables.currentLevel + "_BG", cc.SpriteFrame, (err, spriteFrame) => {  
            if (err) {  
                cc.error("加载图片失败: " + err);  
                return;
            }  
            // 使用 spriteFrame  
            this.BackGround.getComponent(cc.Sprite).spriteFrame = spriteFrame as cc.SpriteFrame;
        });


    }

    start () {

        this.schedule(()=>{
            this.updateGameTime()
        },1)

    }

    updateGameTime(){

        // 判断是否游戏完成
        if (globalVariables.currentFoundElement == 5 ) {
            this.maskSuccess.active = true;

            // 游戏执行成功的后续逻辑
            if(!this.winOrfailFlag){

                let index = globalVariables.currentLevel
                
                // 设置关卡打开数组  index会比正常数组下标多1， 相当于执行了加1操作
                globalVariables.passLevelArray[index] = 1;

                console.log(globalVariables.passLevelArray);

                globalVariables.passTimeArray[index-1] = this.passGameTime;
                // 需要在此处提交 游戏完成时间、完成关卡情况

                // wx.updateLevel wx.updateTimeArray

                setTimeout(() => {
                    cc.director.loadScene(AppConstants.LEVEL_SELECT_SCENE)
                }, 3000);
            }

            this.winOrfailFlag = true;
            
        }

        // 1. 增加游戏时间
        this.passGameTime++;

        // 游戏失败函数的执行
        if (this.passGameTime >= 120) {
            this.maskFail.active = true;

            if(!this.winOrfailFlag){
                setTimeout(() => {
                    cc.director.loadScene(AppConstants.LEVEL_SELECT_SCENE)
                }, 3000);
            }

            this.winOrfailFlag = true;
        }

        this.timerLaber.getComponent(cc.Label).string = this.passGameTime + " s";
        // 2. 判断游戏被选中的元素个数
        this.foundElementStatisticsLabel.getComponent(cc.Label).string = "已找到   " + globalVariables.currentFoundElement + "/5";

    }

    protected onDestroy(): void {
        globalVariables.currentFoundElement = 0;
        this.unschedule(()=>{});
    }

    // update (dt) {}
}
