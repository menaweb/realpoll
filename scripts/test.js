$(function(){
	var socket = io.connect('http://cryptic-coast-6018.herokuapp.com:80/');
	socket.on('question', function(data){	
		$('#title').text("The poll is closed or not yet opened");
		console.log(data);
		if(data === null){
			$('form').html('<img src="img/lock.png">');
			return;
		}
		
		$('#title').text(data.title);
		for(var i in data.options){
			$('#buttons').append('<div class="control-group"><button type="submit" class="btn input-xxlarge" value="'
					+ i + '">'
					+ data.options[i] 
					+ '</button></div>');
		}
		
		$('button').bind('click', function() {
		var username = $("#username").val();
		if(username === "")
			return;

		var optionSelected = parseInt($(this).attr("value")) + 1;
		var answer = {name: username, option: optionSelected};
		console.log(answer)
		socket.emit('answer', answer);
	     	$('form').html('<img src="img/check.png">'); 
		});
	});
});