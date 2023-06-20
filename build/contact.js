function walkTheDOM(node, list) {
    putin(node,list);
    node = node.firstChild;
    while (node) {
        walkTheDOM(node, list);
        node = node.nextSibling;
    }
}
function putin(node,list) {
	if (node.nodeType == 3){
		if(/\S/.test(node.nodeValue)){
			list.push([node.nodeValue,dom]);
		}
	}
}

var list = [],
	dom = window.location.href;

walkTheDOM(document.documentElement,list);
browser.runtime.sendMessage(["content",list]);
console.log(list);