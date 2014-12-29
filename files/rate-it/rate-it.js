	$(document).ready(function() {
		$('div').each(function() {
			if(this.id.match('rate_')){
				$(this).load('../rate-it/rate-it-templatz.php?id='+this.id.replace('rate_','')+'&uid='+document.getElementById('usz7rkal34f').value);
			}
		});
	});
	
	function addRating(div_id,rating,uid){
	 $.ajax({
	   type: "GET",
	   url: "../rate-it/rate-it-templatz.php",
	   data: "id="+div_id+"&rating="+rating+"&uid="+uid,
	   success: function(data){
		 $('#rate_'+div_id).hide().html(data).fadeIn('slow');
	   }
	});
	}
