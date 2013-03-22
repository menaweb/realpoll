 var options = [0,0,0]; 
 var chart;
 var elapsed_seconds = 180;
 var timer;
 var correctValue;
 var data;
 var chartData;
 
 var socket = io.connect('http://cryptic-coast-6018.herokuapp.com/');
 google.load('visualization', '1.0', {'packages':['corechart']});

  function drawChart(){      
    chart = new google.visualization.PieChart(document.getElementById('chart_div'));

    data = new google.visualization.DataTable();
    data.addColumn('string', 'Answers');
    data.addColumn('number', 'Slices');
    
    var pref = {'title':'', 'width':500, 'height':300};            

	for(var i in chartData){
		data.addRow([chartData[i], options[i]]);
	}
    
	chart.draw(data, pref);
}

function addValue(item){
	options[item.option-1]++;
    $('tbody').append('<tr><td>'+item.name+'</td><td class="hide">'+item.option+'</td></tr>');
    drawChart();
}




// onload
$(function(){	
socket.on('answerlist', function(data){
	addValue(data);
});  
socket.on('question', function(data){
	console.log(data);
	result = parseInt(data.correct) + 1;
	options = [];
	var total = data.options.length;
	while(total--){ 
		options.push(0);
	}	
	chartData = data.options;
	$("#question").text(data.title);

	for(i in data.options){
		$("#answers").append("<li>" + data.options[i] + "</li>");
	}	
});

    
    timer = setInterval(function() {
		elapsed_seconds = elapsed_seconds - 1;
		if( elapsed_seconds > 0 ){
		
			if( elapsed_seconds < 11 ) $('#countdown').css('color','red');
			$('#countdown').text(elapsed_seconds);
		}else{
			
			clearTimeout( timer );
			socket.emit('timeIsUp');
			$('.hide').removeClass('hide'); 
			$('#countdown').text("Time is up");
			
			$('tbody tr').each(function(){
				
				console.log( $(this).find('td:eq(1)').text() );
				
				if( $(this).find('td:eq(1)').text() == result ){
					$(this).find('td').addClass('correct');
				}else{
					$(this).find('td').addClass('incorrect');
				}
				
			})
			
		}
	}, 1000);
});