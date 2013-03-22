var sock = io.connect('http://cryptic-coast-6018.herokuapp.com:80/');
console.log(sock);
$(function(){
	$("form").submit(function(e){
		
		var title = $('#question').val();
		var options = $('#questionTextArea').val().split('\n');
		options = options.filter(function(e){return e}); 
		var selected = $('.radio :checked').val();

		var question = {title: title, options: options, correct: selected};
		console.log(question);

		sock.emit('generateQuestion', question);
	});

	$('#questionTextArea').bind('input propertychange', function(){
		var text = $(this).val().split('\n');
		console.log(text);
		var options = $('.control-group')[2]; 
		$('.radio').remove();
		console.log(options);
		for(var i in text){
		if(text[i] === "")
			continue;
		$("#options").append('<label class="radio"><input type="radio" name="option" required="required" value="' + i + '">'
			+ text[i] + '</label>');
		}
	});
});