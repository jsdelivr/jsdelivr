// fill store names in store_name array
var store_name =  ["flipkart", "ebay", "amazon", "1mg","abof", "dailyobjects", "infibeam", "jabong", "voonik", "lenskart", "myntra", "paytm", "homeshop18", "shopclues", "tatacliq", "ajio", "aplava", "biba", "adidas", "coolwinks", "clovia", "chumbak", "dominos", "droom", "fabellay", "fabfurnish", "koovs", "netmeds", "zivame", "makemytrip"];

$(document).ready(function(){

	console.log('Inrdeals Username : ' +subID);
   checkURL(subID);
});

function checkURL(subID)
{
	$('body').find('a').each(function(){
		var param = "https://inrdeals.com/track?id="+subID+"&url=";
		var $this = $(this);
		var _href = $this.attr('href');
		var number_of_store_items= store_name.length;

		for (store_no = 0; store_no < number_of_store_items; store_no++) {
    		var matched_store = store_name[store_no];
    		if (_href.toLowerCase().indexOf(matched_store) >= 0){
			$this.attr("href", param + encodeURI(_href));
			}
		}
		
	});
}