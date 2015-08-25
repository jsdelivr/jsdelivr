/*
window.onbeforeunload = function(){
	return "You're in Development Mode";
};
*/
function bench(method, args, loop, action){
	if(!bench.index){
		bench.index = 1;
	}else{
		bench.index++;
	}
	console.log('bench action: '+bench.index);
	args = args || [];
	action = action || 3;
	loop = loop || 100000;
	
	var i, label, sum;
	
	while(action--){
		i = loop;
		label = 'bench'+action;
		console.time(label, true);
		while(i--){
			result = method.apply(this, args || []);
		}
		sum+= console.timeEnd(label);
	}
	
	return result;
}

function properties(target){
	var result = []
	  , i
	  ;
	for(i in target)
		result.push(i);
	
	alert(result.join('\n'));
};
