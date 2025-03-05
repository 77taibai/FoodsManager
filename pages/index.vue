<template>
	<view id="top">
		<text id="topText">食品管理</text>
		<text id="topAddText">便捷的管理现存的食品</text>
	</view>
	<button id="scanView" @click="scanFun">扫码</button>
	<view id="mainItemView">
		<view class="mainItem" v-for="i in expirationInfo" :key="i.foodID" @click="removeItem(i.foodID)">
			<text class="mainItemName">{{i.foodName}}</text>
			<text class="mainItemInfo">过期时间：{{i.expirationTime}} （{{i.expirationDay}}）天</text>
		</view>
	</view>
</template>



<script setup>
	import { ref, watch } from 'vue';
	import {onShow} from '@dcloudio/uni-app'
	
	let expirationInfo = ref([])
	
	
	onShow(()=>{
		let allID = uni.getStorageSync('_allID')
		allID = JSON.parse(allID)
		expirationInfo.value = []
		
		for(let i=0;i<=allID.length;i++){
			let data = uni.getStorageSync(`item_${allID[i]}`)
			
			if(data === ''){
				continue
			}
			
			data = JSON.parse(data)
			let foodName = data.foodName
			
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
			
			expirationInfo.value.push({
				foodName: data.foodName,
				expirationTime: exTime,
				expirationDay: exDay,
				foodID: data.foodID
			})
		}
	})
	
	function removeItem(foodID){
		uni.navigateTo({
			url: 'itemDetail?foodID=' + foodID
		});
	}
	
	function scanFun(){
		uni.scanCode({
			onlyFromCamera: true,
			scanType: 'barCode',
			success: (e) => {
				let i = e.result
				removeItem(i)
			}
		})
	}
	
	
</script>

<style scoped>
	
#top {
	padding-left: 25px;
	/* background-color: #424242; */
	padding-top: 10px;
	padding-bottom: 10px;
}

#topText{
	font-size: 30px;
	display: block;
	color: #424242;
}

#topAddText{
	color: darkgray;
	display: block;
}

#mainItemView{
	/* background-color: #8bc29f */
}

.mainItem{
	background-color: #8bc29f;
	padding-left: 10px;
	padding-right: 10px;
	padding-top: 5px;
	padding-bottom: 5px;
	margin: 5px;
	border-radius: 5px;
}

.mainItemName{
	display: block;
	font-size: 25px;
	font-weight: 600;
}

.mainItemInfo{
	display: block;
}

#scanView{
	position: absolute;
	right: 13px;
	top: 18px;
	
}



</style>




