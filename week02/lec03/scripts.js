document.getElementById("trans-urgency").addEventListener("click", function(){
	let urgency = document.getElementById("trans-urgency").value
	let labels = document.querySelectorAll('.urgency-labels span')
	Array.prototype.map.call(labels, function(label) {
		label.className = ""
	})
	document.getElementById("urgency-" + urgency).className += " active"
})