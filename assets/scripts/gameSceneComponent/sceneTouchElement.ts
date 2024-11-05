// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import { globalVariables } from "../utils/GlobalVariables";

@ccclass
export default class SceneTouchElement extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    currentLevelElementData = globalVariables.LevelElementData[globalVariables.currentLevel-1];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {


    }

    showTips(){
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            let childrens = this.node.children;
            this._createVedioAd(function (res) {
                if (res.isEnded || res.raw) {
                    console.log("完整观看广告给予提示")
                    childrens.forEach(element => {
                        element.getChildByName("tips").active = true;
                    });
                }
            });
        } else if (cc.sys.platform === cc.sys.BYTEDANCE_GAME){
            let childrens = this.node.children;
            this._createVedioAd(function (res) {
                if (res.isEnded || res.raw) {
                    console.log("完整观看广告给予提示")
                    childrens.forEach(element => {
                        element.getChildByName("tips").active = true;
                    });
                }
            });
        }else {
            let childrens = this.node.children;

            childrens.forEach(element => {
                element.getChildByName("tips").active = true;
            });
        }

    }

    _createVedioAd  (callback){
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            let videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-05a1448459709d5e'
            });
            videoAd.load()
                .then(() => videoAd.show())
                .catch(function (err) {
                    console.log("视频加载失败", err);
                    wx.showModal({
                        title: '提示',
                        content: '视频加载失败',
                        showCancel: false
                    });
                });
            videoAd.onClose(function (res) {
                if (!videoAd) {
                    return;
                }
                if (res.isEnded) {
                    callback(res);
                    videoAd.offClose();
                } else {
                    videoAd.offClose();
                }
            });
            videoAd.onError(function (msg) {
                wx.showToast({
                    title: '错误'
                });
                console.log(msg);
            });
        }else if (cc.sys.platform === cc.sys.BYTEDANCE_GAME){
            let videoAd = tt.createRewardedVideoAd({
                adUnitId: '5j0va3np4jqd4hpf87'
            });
            videoAd.load()
                .then(() => videoAd.show())
                .catch(function (err) {
                    console.log("视频加载失败",err);
                    tt.showModal({
                        title: '提示',
                        content: '视频加载失败',
                        showCancel: false
                    });
                });
            videoAd.onClose(function (res) {
                if(!videoAd){
                    return ;
                }
                if(res.isEnded){
                    callback(res);
                    videoAd.offClose();
                }else{
                    console.log("未播放完关闭")
                    videoAd.offClose();
                }
            });
            videoAd.onError(function(msg){
                tt.showToast({
                    title: '错误'
                });
                console.log(msg);
            });
        }

    }

    start () {
        //this.showTips()
        let children:cc.Node[] = this.node.children;

        console.log(children);
        

        children.forEach((element,index) => {

            console.log(index);

            // 1. 设置节点位置
            element.x = this.currentLevelElementData[index].position[0];
            element.y = this.currentLevelElementData[index].position[1];

            // 2. 加载贴图
            if (!this.currentLevelElementData[index].size) {
                cc.resources.load(this.currentLevelElementData[index].resourcesURL,cc.SpriteFrame, null, (err, spriteFrame) => {
                    console.log(err)
                    element.getComponent(cc.Sprite).spriteFrame = spriteFrame as cc.SpriteFrame;
                });
            }else{
                element.width = this.currentLevelElementData[index].size[0]
                element.height = this.currentLevelElementData[index].size[1]

                // 设置图片透明
                element.getComponent(cc.Sprite).spriteFrame = null;
            }

            console.log("图片加载完成");
            
        });
    }

    // update (dt) {}
}
