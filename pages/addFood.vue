<template>
	<view>
		<form @submit="formSubmit" @reset="formClear">
			<view class="uni-form-item uni-column">
				<view class="title">产品名称：</view>
				<input class="uni-input" name="foodName" placeholder="西红柿" />
			</view>


			<view class="uni-form-item uni-column">
				<view class="title">生产日期：</view>
				<picker mode="date" :value="date" @change="bindDateChange">
					<view class="uni-input">{{date}}</view>
				</picker>
			</view>
			
			<view class="uni-form-item uni-column">
				<view class="title">保质期（天）：</view>
				<input class="uni-input" name="exDayLimit" type="number" placeholder="30" />
			</view>
			
			<view class="uni-btn-v">
				<button id="uniB1" form-type="submit" :disabled="dis">提交</button>
				<button id="uniB2" type="default" form-type="reset">清空</button>
			</view>
		</form>
	</view>
	<view id="idView">
		<text id="idText">{{newID}}</text>
	</view>
	<canvas
	    :id="canvasId"
	    :canvas-id="canvasId"
		:style="labelCanCSS"
	    style="position: fixed;
				left: 0px;
				bottom: 100px;
				right: 0px;
				margin: auto;
				z-index: 99999;"
	/>
</template>

<script>
	function generateRandomID(allID) {
	    let randomID;
	    do {
	        randomID = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
	    } while (allID.includes(randomID));
	    return randomID;
	}
</script>


<script setup>
	import {ref} from 'vue'
	import {onShow} from '@dcloudio/uni-app'
	
	let date = ref()
	let newID = ref()
	let timestamp = 0
	let dis = ref(false)
	function formSubmit(e) {
		let formdata = e.detail.value
		formdata.date = date.value
		if(formdata.date === undefined || formdata.exDayLimit === '' || formdata.foodName === ''){
			uni.showToast({
				title: '缺少值',
				duration: 1000,
				icon:'error'
			});
			return
		}
		
		let allID = uni.getStorageSync('_allID')
		if(allID === ''){
			uni.setStorageSync('_allID', JSON.stringify([]))
		}
		
		allID = uni.getStorageSync('_allID')
		allID = JSON.parse(allID)
		
		newID.value = generateRandomID(allID)
		
		allID.push(newID.value)
		
		uni.setStorageSync('_allID', JSON.stringify(allID))
		uni.setStorageSync(`item_${newID.value}`, JSON.stringify({
			foodID: newID.value,
			foodName: formdata.foodName,
			produceTime: timestamp,
			exDayLimit: formdata.exDayLimit,
			addTime: (new Date().getTime())
		}))
		printQrcode(newID.value)
	}
	
	function formClear(){
		date.value = ''
	}
	
	function bindDateChange(e){
		date.value = e.detail.value
		const dateStr = e.detail.value;
		const dateObj = new Date(dateStr);
		timestamp = dateObj.getTime();
	}
	
	// 如果是通过插件市场安装的插件，则通本地插件路径导入插件；
	import { LPAPIFactory } from "@/uni_modules/dothan-lpapi-ble/js_sdk/index.js";
	

	let canvasId = ref("lpapi-ble-uni")


	let lpapi = LPAPIFactory.getInstance({
		// 如果需要查看打印相关日志，需要配置 showLog，值为 0 - 4，0表示不显示调试信息，4表示显示所有调试信息
		showLog: 0,         // 【可选】
		// 设置画布ID，第一步中创建的画布ID，全局唯一
		canvasId: canvasId.value, // 【可选】
	});
	
	onShow(()=>{
		// 搜索蓝牙设备
		lpapi.startBleDiscovery({
			// timeout = 0 表示搜索到匹配的打印机后自动停止搜索，不指定表示会一直搜索下去
			timeout: 0,
			deviceFound: (devices) => {
				// 更新打印机列表
				
				lpapi.openPrinter({
					name: devices[0]['name'],
					deviceId: devices[0]['deviceId'],
					success: (resp) => {
						uni.showToast({
							title: '打印机连接',
							duration: 800,
							icon:'success'
						});
					},
					fail: (resp) => {
						uni.showToast({
							title: '打印机失败',
							duration: 1000,
							icon:'error'
						});
					},
				});
			},
		});
	})
	
	
	// 标签宽度，单位毫米
	let labelWidth = ref(30);
	// 标签高度，单位毫米；
	let labelHeight = ref(12);
	let labelCanCSS = ref('') 

	function printQrcode(data) {
		
		data = data.toString()
		dis.value = true
	    // 标签转转方向，值为：0，90，180，270，默认为0，表示不做任何的旋转处理；
	    let orientation = 270;
	    // 二维码大小
	
	    let api = lpapi;
	    // 创建指定大小的打印任务，单位毫米
	    let jobInfo = api.startJob({
	        width: labelWidth.value, // 【必填】标签宽度
	        height: labelHeight.value, // 【必填】标签高度
	        orientation: orientation, // 【可选】旋转方向
	    });
	    // 更新画布大小，单位像素
		labelCanCSS.value = `width: ${labelWidth.value}px, height: ${labelHeight.value}px`
	    // 注意，在uni模式下更新canvas画布大小后，画布大小不会立即生效，需要等待画布尺寸更新之后在进行后续操作才可以；
	    // 100毫秒之后开始绘制标签内容，在uniApp中画布大小不能立即生效，需要等待100毫秒，甚至更长时间才可以绘制
	    setTimeout(() => {
	        api.drawBarcode({
	            text: data,
	            x: 3,
	            y: 2,
	            width: labelWidth.value - 3 * 2,
	            height: labelHeight.value - 3,
				textHeight: 2.5
	        });
	        //
	        api.commitJob({
	            complete: (resp) => {
	                // 执行打印完毕回调函数
	                uni.showToast({
	                	title: '打印结束',
	                	duration: 1000,
	                	icon:'success'
	                });
					dis.value = false
	            },
	        });
	    }, 100);
	}
	
	
	
	
	
	
</script>

<style>
	.uni-form-item .title {
		padding: 20rpx 0;
		margin-left: 10px;
	}
	.uni-input{
		border: 1px solid #000;
		height: 30px;
		margin-left: 10px;
		margin-right: 10px;
		border-radius: 3px;
	}
	
	#idView{
		margin-top: 90px;
	}
	
	#idText{
		display: block;
		text-align: center;
		font-size: 30px;
		font-weight: 600;

	}
	
	.uni-btn-v{
		margin-top: 20px;
	}
	
	#uniB1{
		display: inline-block;
		position: absolute;
		left: 50px;
		width: 100px;
		background-color: #3cb400;
	}
	
	#uniB2{
		display: inline-block;
		position: absolute;
		right: 50px;
		width: 100px;
	}
	
</style>

