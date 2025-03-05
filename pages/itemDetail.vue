<template>
	<view id="loading" :style="css_loading">
		<image id="loadingGIF" mode="widthFix" src='/static/loading.gif'></image>
	</view>
	<view>
		<text id="foodName">{{foodName}}</text>
		<text id="foodID">{{foodID}}</text>
		<view id="expirationDay" :style="css_exDayColor">
			<text id="expirationDayText">距离过期：</text>
			<text id="expirationDayInner">{{expirationDay}}天</text>
		</view>
		
		<view id="infoView">
			<text class="infoViewText">添加时间：{{addTime}}</text>
			<text class="infoViewText">生产日期：{{produceTime}}</text>
			<text class="infoViewText">过期时间：{{expirationTime}}</text>
		</view>
		
		<view id="operationView">
			<button id="operationViewEdit" @click="test">编辑</button>
			<button id="operationViewEat" @click="deleteFood(foodID)">核销</button>
		</view>
	</view>
</template>

<script>
	function timestampToDate(timestamp){
		// 创建 Date 对象
		const date = new Date(timestamp);
		// 获取年、月、日
		const year = date.getFullYear(); // 获取年份（xxxx）
		const month = date.getMonth() + 1; // 获取月份（0-11，需要 +1）
		const day = date.getDate(); // 获取日期（1-31）
		return `${year}年${month.toString().padStart(2, '0')}月${day.toString().padStart(2, '0')}日`;
	}
</script>


<script setup>
	import {computed, ref, watch} from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	
	let foodID = ref()
	let foodName = ref()
	let expirationTime = ref()
	let expirationDay = ref()
	let addTime = ref()
	let produceTime = ref()
	let css_loading = ref('display: block')
	let css_exDayColor = ref('background-color: #64dd17')
	
	
	// 在 onLoad 中获取参数
	onLoad((options) => {
	    foodID.value = options.foodID // 获取传递的参数
		
		let data = uni.getStorageSync(`item_${foodID.value}`)
		data = JSON.parse(data)
		
		// 给定时间戳（以毫秒为单位）
		const timestamp = data.produceTime; // 例如：2021-10-01 12:00:00
		
		// 要加的天数
		const daysToAdd = parseInt(data.exDayLimit);
		
		// 创建一个 Date 对象，表示给定时间戳
		const date = new Date(timestamp);
		
		// 加上指定的天数
		date.setDate(date.getDate() + daysToAdd);
		
		// 计算加上天数后的日期
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1
		const day = String(date.getDate()).padStart(2, '0');
		
		// 输出加上天数后的日期
		let exTime = `${year}年${month}月${day}日`
		
		// 计算当前时间
		const now = new Date();
		
		// 计算剩余天数
		const timeDifference = date.getTime() - now.getTime();
		const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
		
		// 输出剩余天数
		let exDay = `${remainingDays}`
		
		
		foodName.value = data.foodName
		expirationTime.value = exTime
		addTime.value = timestampToDate(data.addTime)
		produceTime.value = timestampToDate(data.produceTime)
		
		
		expirationDay.value = exDay
		if(exDay >= 30){
			css_exDayColor.value = 'background-color: #64dd17'
		}else if(exDay >= 15){
			css_exDayColor.value = 'background-color: #ffd600'
		}else{
			css_exDayColor.value = 'background-color: #ff3d00'
		}
		
		

		
		
		
	});
	
	watch(foodID, () => {
		// 在此处获取食物信息，获取完毕取消动画
		css_loading.value = 'display: none'
	})
	
	function test(){
		uni.showToast({
			title: '功能未开发',
			duration: 2000,
			icon:'error'
		});
	}
	
	function deleteFood(_foodID){
		
		let _allID = uni.getStorageSync('_allID')
		_allID = JSON.parse(_allID)
		for (var index = 0; index < _allID.length; index++) {
			if(_allID[index] === _foodID){
				_allID.splice(index, 1)
			}
		}
		uni.setStorageSync('_allID', JSON.stringify(_allID))
		uni.removeStorageSync(`item_${_foodID}`)
		uni.switchTab({
			url: '/pages/index'
		})
	}
	
</script>

<style>
	#loading{
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background-color: aqua;
	}
	
	#loadingGIF{
		width: 100px;
		right: 0;
		left: 0;
		top: 0;
		bottom: 0;
		position: fixed;
		margin: auto;
	}
	
	#foodName{
		font-size: 30px;
		font-weight: 700;
		display: block;
		text-align: center;
		margin: auto;
		margin-top: 10px;
	}
	
	#foodID{
		display: block;
		text-align: center;
		color: #545454;
	}
	
	
	#expirationDay{
		background-color: #dedede;
		display: block;
		right: 20px;
		left: 20px;
		top: 75px;
		height: 42px;
		position: absolute;
		border-radius: 10px;
		text-align: center;
		padding-top: 13px;
	}
	
	#expirationDayText{
		font-size: 12px;
	}
	
	#expirationDayInner{
		font-size: 20px;
	}
	
	#infoView{
		background-color: #dedede;
		display: block;
		right: 20px;
		left: 20px;
		top: 145px;
		padding-bottom: 13px;
		position: absolute;
		border-radius: 10px;
		text-align: center;
		padding-top: 13px;
	}
	
	.infoViewText{
		display: block;
		line-height: 40px;
	}
	
	#operationView{
		display: block;
		position: absolute;
		top: 350px;
		background-color: #545454;
		right: 20px;
		left: 20px;
	}
	
	#operationViewEdit{
		position: absolute;
		width: 100px;
		left: 20px;
		
		background-color: #00e5ff;
	}
	
	#operationViewEat{
		position: absolute;
		width: 100px;
		right: 20px;
		background-color: #ff5252;
	}
	
	
</style>
