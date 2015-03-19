/**	Point Jarvis
 *	@version : 1.0.0
 *	@author  : Raven Lagrimas | rjlagrimas08@gmail.com
 *	@license : MIT
 *	@link	 : http://ravenjohn.github.io/jarvis
 */

(function(root){

	"use strict";

	var j = root.webkitSpeechRecognition ||
			root.mozSpeechRecognition ||
			root.msSpeechRecognition ||
			root.oSpeechRecognition ||
			root.SpeechRecognition;
	
	if(!j) throw new Error("Speech Recognition is not supported.");
	
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
	};
	
	String.prototype.toRegExp = function() {
		return new RegExp('^' +
							this.replace(/[\-{}\[\]+?.,\\\^$|#]/g, '\\$&')
							.replace(/\s*\((.*?)\)\s*/g, '(?:$1)?')
							.replace(/(\(\?)?:\w+/g, function(match, optional) {
								return optional ? match : '([^\\s]+)';
							})
							.replace(/\*\w+/g, '(.*?)')
							.replace(/(\(\?:[^)]+\))\?/g, '\\s*$1?\\s*')
						+ '$', 'i');
	};
	
	var upgrade = {
		name : "Jarvis",
		cmds : [],
		lang : "en-US",
		debug : !1,
		reqname : !1,
		continuous : !0,
		maxAlternatives : 5,
		learn : function(cmds){
			cmds&&(this.cmds=cmds);
			this.onresult = function(r){
				for(var i=0, n=r.results[r.resultIndex], k=n.length; i < k; i+=1){
					var g = n[i].transcript.trim();
					this.onrecognize&&this.onrecognize(g);
					if(this.debug){
						console.log('recognized : ' + g);
					}
					for(var l=0, m=this.cmds.length; l < m; l+=1){
						var x = ((this.reqname ? this.name+' ' : '('+this.reqname+') ')+this.cmds[l][0]).toRegExp().exec(g);
						if(x){
							this.cmds[l][1].apply(this,x.slice(1));
							if(this.debug){
								console.log('match found');
							}
							break;
						}
					}
					if(l!=m) break;
					this.onnomatch&&this.onnomatch(g);
					if(this.debug){
						console.log('match not found');
					}
				}
			};
		},
		onerror : function(e){
			if(e.error == "network"){
				throw new Error("Jarvis needs the Internet");
			}
			if(e.error == "not-allowed"){
				throw new Error("Jarvis was denied. X(");
			}
			if(e.error == "no-speech"){
				throw new Error("Please refresh. X(");
			}
			throw new Error("Unknown error : " + e.error);
		},
		setLanguage : function(l){
			this.lang = l;
		},
		addCommand : function(c){
			this.cmds.push(c);
		},
		setName : function(n){
			this.name = n;
		},
		setVoiceKey : function(k){
			this.voicerssKey = k;
		},
		speak : function(t){
			if(typeof t !== "string"){
				throw new Error('Jarvis cannot speak other datatype, strings only.');
			}
			if(t.length > 100){
				throw new Error('Sorry but Jarvis is limited to speaking up to 100 characters only.');
			}
			if(!this.voicerssKey){
				throw new Error("Voice Rss Key is missing. You can get it from http://www.voicerss.org/");
			}
			
			var spkr = document.getElementById("_jarvis");
			
			if(!spkr){
				var audio = document.createElement('audio');
				audio.setAttribute('id', '_jarvis');
				audio.setAttribute('autoplay', 'autoplay');
				document.body.appendChild(audio);
				spkr = document.getElementById("_jarvis");
			}
			
			t = t.toLowerCase().replace(/\./g,' ').trim();
			
			// we'll use Google translate for the voice hoping that they won't take it down
			// if you happen to find a TTS API that sounds like jarvis, inform me ASAP
			document.getElementById("_jarvis").src = 'http://api.voicerss.org/?key='+this.voicerssKey+'&language='+this.lang+'&src='+encodeURIComponent(t);
		}
	};

	//expose this object to the world
	root.jarvis = new j();

	//upgrade jarvis
	for(var i in upgrade)
		root.jarvis[i] = upgrade[i];
		
})(this);
