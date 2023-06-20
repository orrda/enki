var tasks = {},
	myID = "0001",
	connections = {},
	errorcount =  0,
	my_answer = [];


function bootstrap () {
	console.log("here");

	browser.runtime.onMessage.addListener(function(mes){
		if(mes[0]=="from_popup"){
			qu={};
			qu.meta={TTL:6};
			qu.question=mes[1];
			fsearch(qu,"me");
			console.log(my_answer);
			setTimeout(function(){
				console.log(my_answer);
				browser.runtime.sendMessage(["to_popup",my_answer]);
				var my_answer=[];
			},1000)
		}
		if(mes[0]=="content"){
			console.log(mes[1]);
			m=mes[1];
			for (var i = m.length - 1; i >= 0; i--) {
				d=m[i];
				dbsave(d[0],d[1]);
			}
		}
	})
	console.log("here1");

	//bootstrap webrtc, and create listners to fsearch function, and 
	var ids=getids();
	var peer = new Peer(myID,{key:"x1bk846lw5c23xr"})
	peer.on('connection', insalize);
	peer.on('open', function() {
		for (var i = ids.length - 1; i >= 0; i--) {
			insalize(peer.connect(ids[i]));
		}
	})
}


function dbsearch(data,dest){
	//search database and return result
	s=data.question;
	localforage.getItem(s,function (err,val) {
		if(dest=="me"){
			browser.runtime.sendMessage(["to_popup",val]);
		} else {
			data.answer= val
			dest.send(data);
		}
	})
}

function fsearch (data,dest) {
	tasks[data.question] = dest;
	data.meta.TTL=data.meta.TTL-1;//     search db and connections and dynamacliy send to dest
	for(i in connections){
		connections[i].send(data);
	}
	dbsearch(data,dest);
}


function insalize(conn){
	console.log('insalizing - '+conn);
	connections[conn.peer]=conn;
	conn.on('data',function(data){
		if (data.meta !== undefined && data.meta.TTL > 2){
			if(data.answer!==undefined){
				q=tasks[data.question];
				if(q="me"){
					browser.runtime.sendMessage(["to_popup",data.answer]);	
				} else {
					q.send(data);
				}
			} else if(data.question!==undefined){
				fsearch(data,conn);
			}
		}
	});
}

function dbsave(key,val){
	localforage.getItem(key,function(err,val1){
		if(val1 == undefined || val1 == null){
			val1=val;
		} else {
			if(val1.constructor === Array){
				val1.push(val);
			}else {
				val1=[val1,val];
			}
		}
		localforage.setItem(key, val1,function(err){errorcount++});
	})
}



function getids(){return ["0000","0002","0003","0004"]}

bootstrap();