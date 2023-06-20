function clickHandler(){
	txt = document.getElementById('textbox_id').value;
	browser.runtime.sendMessage(["from_popup",txt]);
}

browser.runtime.onMessage.addListener(function(mes){
	if(mes[0]=="to_popup"){
		if(mes[1]!==undefined){
			if(mes[1].constructor === Array){
				mes[1]=mes[1].join("__________");
			}
			document.getElementById("answers").innerHTML += mes[1]
		}
	}
})


document.getElementById("answers").innerHTML = "answers - ";

document.querySelector('button').addEventListener('click', clickHandler);