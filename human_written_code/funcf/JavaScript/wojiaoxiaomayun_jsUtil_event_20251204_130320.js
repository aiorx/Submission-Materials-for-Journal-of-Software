```js
trigger:function(options){
	var myObj = {
		type:options.type,
		page:options.page || 'all'
	};
	//debugger;
	if(myObj.page == 'all'){
		for(var key in listener){
			if(listener[key][myObj.type]){
				var ret = listener[key][myObj.type].call(this,options);
				if(options.success){ret?options.success(ret):options.success()}
			}
		}
	}else{
		if(listener.hasOwnProperty(myObj.page)){
			if(listener[myObj.page][myObj.type]){
				var ret = listener[myObj.page][myObj.type].call(this,options);
				if(options.success){ret?options.success(ret):options.success()}							
			}
		}
	}
},
```