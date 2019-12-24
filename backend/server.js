const express = require('express');
const app = express();
const axios =require('axios');
const path = require('path');
const cors = require('cors');

const server = app.listen(process.env.PORT || 3000);
const io = require('socket.io').listen(server);

require('dotenv').config();

app.use(express.json());
app.use(cors());
console.log('hello testing');
io.on('connection',(socket)=>{
	console.log('client connected');
	socket.on('click',(req)=>{
		const arr=req.params;
		const responseArr=[];
		console.log('sending data');
		for(let i=0;i<arr.length;i++){
		  axios.get('https://api.stocktwits.com/api/2/streams/symbol/'+arr[i]+'.json').then((response) => {
		  	responseArr.push(response.data.messages);
		  	if(i===arr.length-1){
				socket.emit('gotTweets',responseArr);
		  	}
		  });
		}
	});
});