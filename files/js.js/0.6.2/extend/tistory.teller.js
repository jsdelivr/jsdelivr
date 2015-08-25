/*
 * teller for Tistory
 * @author styliss
 * @license http://creativecommons.org/licenses/by-nc-nd/4.0/
 */
if(!teller)
	var teller = {};

(function(js, undefined){
	var me = Object.merge(teller, {
		subTitle: null
	  , subTitleArrow: ' < '
	  , subTitleDirection: 'left'
	  , navSelector: null
	  , removeCountWrap: null
	  , categorySelector: '#category'
	  , dateForm: null
	  
	  , dateFullFormat: 'y년 n월 j일'
	  , dateFormat: 'y년 n월 j일'
	  , dateNowFormat: 'h시 i분'
	});	
	
	js(setup);
	
	return;
	
	function setup(){
		var url = location.href.parseUrl();
		// add sub title to title of browser
		if(url.pathname.match(/\/\d+/) && me.subTitle){
			document.title = me.subTitleDirection == 'left' ?
				me.subTitle + me.subTitleArrow + document.title :
				document.title + me.subTitleArrow + me.subTitle;
			
			window.scrollTo(0, js('.article')[0].offsetTop);
		}
		
		if(document.forms.search){
			js(document.forms.search).submit(function(){
				var keyword = this.elements[0]
				  , value = keyword.value
					;
				if(!value){
					value.focus();
					return;
				}
				
				location.href = this.action+encodeURIComponent(value);			
				return false;
			});
			if(url.pathname.indexOf('/search/')>-1)
				document.forms.search.elements[0].value = decodeURIComponent(href.split('/search/')[1]);
		}
		
		var icon = js('img[src*="new_ico"]');
		icon && icon.set(function(){
			var parent = this.parentNode;
			parent.className+= 'new';
			parent.removeChild(this);
		});
		
		var contents = 1;
		js('.article .content').set(function(node){
			var links = this.js('a');
			if(links.js){
				this.append('<div.related><h4>삽입 링크<span.colon>:</span></h4><ol/></div>');
				var ul = this.js('.related ol');
				
				for(var i=0, c=links.length, link, href, index; i<c; i++){
					link = links[i];
					href = link.href;
					if(href.indexOf('http')<0)
						continue;
					index = 'link'+(contents)+'-'+(i+1);
					ul.append('<li><a href="'+href+'" name="'+index+'">'+href+'</a>');
					js(link).after('<sup><a href="#'+index+'">'+(i+1)+'</sub>');
				}
			}
			contents++;
		});
		
		if(me.dateForm){
			dateReform();
		}
		
		me.navSelector &&
			navExpand();
			
		me.removeCountWrap &&
			removeCountWrap();
			
		var category = getCategory();
		if(category){
			
		}else{
		}
	}
	
	function dateReform(){
		for(var dates = js('.date')
			  , date
			  , value
			  , i = dates.length
			  ; i--
			  ;){
			date = dates[i];
			value = date.innerHTML.trim();
			date.innerHTML = value.toDate().format(
				value.indexOf(' ') > -1 ?
					me.dateFullFormat :
					value.indexOf('/') > -1 ?
						me.dateFormat :
						me.dateNowFormat
			);
		}
	}
	
	function navExpand(){
		var nav = js(me.navSelector)
		  , navLinks = nav.js('a')
		  ;

		for(var items = js(me.navSelector).js('li')
			  , i = items.length
			  ; i--;){
			items[i].className+= ' nav'+(i+1);
		}
		
		var category = js(me.categorySelector);
		var categoryLinks = category.js('a')
			;
		
		categoryLinks.set(function(){
			for(var i=navLinks.length, target; i--;){
				target = navLinks[i];
				if(target.href == this.href){
					target = js(target);
					cnt = js('.c_cnt', this);
					if(cnt.js){
						cnt.style('root_cnt');
						target.append(cnt);
					}
						
					sub = js('ul', this.parentNode);
					if(sub.length){
						target[0].sub = sub.cloneJs();
						target.parentJs().append(target[0].sub);
					}
					return;
				}
			}
		});
		
		js.use('nav', function(){
			nav.js('.menu > ul').nav();	
		});
	}
	
	function removeCountWrap(){
		var unNumber = /[^\d]/g;
		js('.c_cnt').set(function(){
			var number = this.innerHTML.replace(unNumber, '');
			if(number=='0'){
				this.parentNode.removeChild(this);
			}else{
				this.innerHTML = '<span class="wrap">'+number+'</span>';
				this.style.opacity = 1;
			}
		});
	}
	
	function getCategory(url){		
		url = url || location.href;
		var category = url.parseUrl().pathname.split('/').slice(1, 4);
		return category[0] == 'category' ?
			category.shifted() :
			false;
	}
})(js);