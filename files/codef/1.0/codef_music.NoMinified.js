/*------------------------------------------------------------------------------
Copyright (c) 2011 Antoine Santo Aka NoNameNo

This File is part of the CODEF project.

More info : http://codef.santo.fr
Demo gallery http://www.wab.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
------------------------------------------------------------------------------*/
var CODEF_AUDIO_CONTEXT=null;
var CODEF_AUDIO_NODE=null;
function music(type){
window.AudioContext = window.AudioContext||window.webkitAudioContext||window.mozAudioContext ||window.oAudioContext ||window.msAudioContext;
if(typeof(AudioContext) != 'undefined'){
        switch(type){
                case "YM":      CODEF_AUDIO_CONTEXT = new AudioContext(); // Atari YM Format !!! ;) /////webkitAudioContext();
                                CODEF_AUDIO_NODE = CODEF_AUDIO_CONTEXT.createScriptProcessor(8192);
				this.loader=new Object();
				this.loader["player"] = new YmProcessor();
				this.stereo_value=false;
                                break;
		default :	this.stereo_value=false;
				break;

        }
}       
        if(type=="YM"){
                
                this.LoadAndRun=function(zic){
		  var __self = this;
		  if(typeof(AudioContext) != 'undefined'){
                        var fetch = new XMLHttpRequest();
                        fetch.open('GET', zic);
                        fetch.overrideMimeType("text/plain; charset=x-user-defined");
                        fetch.onreadystatechange = function() {
                                if(this.readyState == 4 && this.status == 200) {
                                        var t = this.responseText || "" ;
                                        var ff = [];
                                        var mx = t.length;
                                        var scc= String.fromCharCode;
                                        for (var z = 0; z < mx; z++) {
                                                ff[z] = scc(t.charCodeAt(z) & 255);
                                        }
                                        var binString = new dataType();
                                        binString.data = ff.join("");
                                        YmConst_PLAYER_FREQ = CODEF_AUDIO_CONTEXT.sampleRate;
					__self.loader.player.stereo=__self.stereo_value;

                                        __self.loader.player.load(binString);
                                }
                        }
                        fetch.send();
		  }
                }
        }
        else{
                this.LoadAndRun=function(zic){
		  var __self = this;
	          this.loader= window.neoart.FileLoader;

		  if(typeof(AudioContext) != 'undefined'){
                        var fetch = new XMLHttpRequest();
                        fetch.open('GET', zic);
                        fetch.overrideMimeType("text/plain; charset=x-user-defined");
                        fetch.responseType = "arraybuffer";
                        fetch.onreadystatechange = function() {
                                if(this.readyState == 4 && this.status == 200) {
					__self.loader.player=null;
					__self.loader.load(this.response);
					__self.loader.player.reset();

					__self.loader.player.stereo=__self.stereo_value;
                                        __self.loader.player.play();
                                }
                        }
                        fetch.send();
		  }
                }
        }

        this.stereo=function(stat){
                this.stereo_value=stat;
        }
        
        return this;
        
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// YM replay routine
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
//
// YmConst.js
//
////////////////////////////////////////////////////////////////////
        var YmConst_BUFFER_SIZE = 8192;
        var YmConst_PLAYER_FREQ = 48000;
        var YmConst_DRUM_PREC = 15;

        var YmConst_AMSTRAD_FREQ = 1000000;
        var YmConst_ATARI_FREQ = 2000000;
        var YmConst_SPECTRUM_FREQ = 1773400;

        var YmConst_INTERLEAVED = 1;
        var YmConst_DRUM_SIGNED = 2;
        var YmConst_DRUM_4BITS = 4;
        var YmConst_TIME_CONTROL = 8;
        var YmConst_LOOP_MODE  = 16;

        var YmConst_MFP_PREDIV = [0, 4, 10, 16, 50, 64, 100, 200];

        var YmConst_MONO = [
      0.00063071586250394, 0.00163782667521185, 0.00269580167037975, 0.00383515935748365,
      0.00590024516535946, 0.00787377544480728, 0.01174962614825892, 0.01602221747489853,
      0.02299061047191789, 0.03141371908729311, 0.04648986276843572, 0.06340728985463016,
      0.09491256447035126, 0.13414919481999166, 0.21586759036022013, 0.33333333333333333
     ];

        var YmConst_STEREO = [
      0.00094607379375591, 0.00245674001281777, 0.00404370250556963, 0.00575273903622547,
      0.00885036774803918, 0.01181066316721091, 0.01762443922238838, 0.02403332621234779,
      0.03448591570787683, 0.04712057863093966, 0.06973479415265358, 0.09511093478194525,
      0.14236884670552690, 0.20122379222998749, 0.32380138554033021, 0.50000000000000000
    ];

        var YmConst_ENVELOPES = [
      15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
      15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
      15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,
       0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
      15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,
      15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,
       0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,
       0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,
       0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,
      15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,
       0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
      15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,
       0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    
////////////////////////////////////////////////////////////////////
//
// YmSong.js
//
////////////////////////////////////////////////////////////////////
function YmSong(stream){
        this.title;
        this.author;
        this.comment;

        this.attribs;
        this.clock;
        this.digidrums;
        this.drums;
        this.frames=new Array();
        this.frameSize;
        this.length;
        this.rate;
        this.restart;
        this.supported = true;

        this.data = new dataType();
        this.data.data=stream;
        
        
        this.init=function(){
                this.decode();
                if (this.attribs & YmConst_INTERLEAVED) this.deinterleave();

                for (i = 0; i < this.length; ++i) {
                        this.frames[i]=this.data.readBytes(0, this.frameSize);
                }

        }
        
        this.decode=function(){
                var digidrum;
                var i;
                var id= this.data.readMultiByte(4,"txt");
                
                switch (id) {
                        case "YM2!":
                        case "YM3!":
                        case "YM3b":
                                this.frameSize = 14;
                                this.length = (this.data.data.length - 4) / this.frameSize;
                                this.clock = YmConst_ATARI_FREQ;
                                this.rate = 50;
                                this.restart = (id != "YM3b") ? 0 : this.data.readByte();
                                this.attribs = YmConst_INTERLEAVED | YmConst_TIME_CONTROL;
                                break;

                        case "YM4!":
                                this.supported = false;
                                break;
                                
                        case "YM5!":
                        case "YM6!":
                                id = this.data.readMultiByte(8, "txt");
                                if (id != "LeOnArD!") {
                                        this.supported = false;
                                        return;
                                }

                                this.length  = this.data.readInt();
                                this.attribs = this.data.readInt();
                                this.drums   = this.data.readShort();
                                this.clock   = this.data.readInt();
                                this.rate    = this.data.readShort();
                                this.restart = this.data.readInt();
                                this.data.readShort();

                                if (this.drums) {
                                        this.digidrums = new Array();

                                        for (i = 0; i < this.drums; ++i) {
                                                this.digidrum = new Digidrum(this.data.readInt());

                                                if (this.digidrum.size != 0) {
                                                        this.digidrum.wave.data = this.data.readBytes(0, this.digidrum.size);
                                                        this.digidrum.convert(this.attribs);
                                                        this.digidrums[i] = this.digidrum;
                                                }
                                        }
                                        this.attribs &= (~YmConst_DRUM_4BITS);
                                }

                                this.title = this.data.readString();
                                this.author = this.data.readString();
                                this.comment = this.data.readString();

                                this.frameSize = 16;
                                this.attribs = YmConst_INTERLEAVED | YmConst_TIME_CONTROL;
                                break;

                        case "MIX1":
                                supported = false;
                                break;

                        case "YMT1":
                        case "YMT2":
                                supported = false;
                                break;

                        default:
                                supported = false;
                                break;
                }

        }
        
        this.deinterleave=function(){
                var i;
                var j;
                var s=0;
                
                var p=new Array();
                var r=new Array();

                for (i = 0; i < this.frameSize; ++i) p[i] = this.data.pos + (this.length * i);

                for (i = 0; i < this.length; ++i) {
                        for (j = 0; j < this.frameSize; ++j) r[j + s] = this.data.data[i + p[j]];
                        s += this.frameSize;
                }

                this.data.data="";
                this.data.data = r;
                this.data.pos=0;
                this.attribs &= (~YmConst_INTERLEAVED);
        }
        
        this.init();
        
}

////////////////////////////////////////////////////////////////////
//
// YmProcessor.js
//
////////////////////////////////////////////////////////////////////
function YmProcessor(){
        this.counter;

        this.sound;
        this.soundChannel;
        this.soundChannelPos;
        this.song;
        this.loop=1;
        this.stereo=0;

        this.audioFreq;
        this.clock;
        this.registers=new Array();
        this.volumeEnv;

        this.buffer;
        this.bufferSize;
        this.voiceA=new YmChannel(this);;
        this.voiceB=new YmChannel(this);;
        this.voiceC=new YmChannel(this);;

        this.samplesTick;
        this.samplesLeft;
        this.frame;

        this.envData;
        this.envPhase;
        this.envPos;
        this.envShape;
        this.envStep;

        this.noiseOutput;
        this.noisePos;
        this.noiseStep;
        this.rng;

        this.syncBuzzer;
        this.syncBuzzerPhase;
        this.syncBuzzerStep;
	__self=this;
        


        this.init=function(){
                var i;

                this.bufferSize = YmConst_BUFFER_SIZE;
                this.buffer = new Array();

                for (i = 0; i < this.bufferSize; ++i) this.buffer[i] = new Sample();

                this.envData = YmConst_ENVELOPES;
        }
        
        this.load=function(stream){
                var monLHa = new LHa();
                this.song = new YmSong(monLHa.unpack(stream));

                this.audioFreq = YmConst_PLAYER_FREQ;
                this.clock = this.song.clock;
                this.samplesTick = this.audioFreq / this.song.rate;

                CODEF_AUDIO_NODE.onaudioprocess = function (event) {
                        __self.mixer(event);
                }

                
                return this.song.supported;
        }
        
        this.mixer=function(e){
                var b=0;
                var i=0;
                var mixed=0;
                var mixPos=0;
                var sample;
                var size=0;
                var toMix=0;
                var value=0;

                while (mixed < this.bufferSize) {
                        if (this.samplesLeft == 0) {
                                if (this.frame >= this.song.length) {
                                        if (this.loop) {
                                                this.frame = this.song.restart;
                                        } else {
                                                this.stop();
                                                return;
                                        }
                                }

                                this.syncBuzzerStop();
                                
                                for(i=0;i<this.song.frameSize;i++){
                                        this.registers[i]=this.song.frames[this.frame][i].charCodeAt(0);
                                }
                                this.frame++;
                                //this.registers = this.song.frames[this.frame++];
                                this.updateEffects(1, 6, 14);
                                this.updateEffects(3, 8, 15);

                                this.writeRegisters();
                                this.samplesLeft = this.samplesTick;
                        }

                        toMix = this.samplesLeft;
                        if ((mixed + toMix) > this.bufferSize)
                                toMix = this.bufferSize - mixed;
                        size = mixPos + toMix;

                        for (i = mixPos; i < size; ++i) {
                                sample = this.buffer[i];

                                if (this.noisePos & 65536) {
                                        b = (this.rng & 1) ^ ((this.rng >> 2) & 1);
                                        this.rng = (this.rng >> 1) | (b << 16);
                                        this.noiseOutput ^= (b ? 0 : 65535);
                                        this.noisePos &= 65535;
                                }

                                this.volumeEnv = this.envData[Math.floor((this.envShape << 6) + (this.envPhase << 5) + (this.envPos >> 26))];

                                this.voiceA.computeVolume();
                                this.voiceB.computeVolume();
                                this.voiceC.computeVolume();

                                b = this.voiceA.enabled() & (this.noiseOutput | this.voiceA.mixNoise);
                                var toto = this.voiceA.getvolume();
                                sample.voiceA = (b) ? this.voiceA.getvolume() : -1;
                                b = this.voiceB.enabled() & (this.noiseOutput | this.voiceB.mixNoise);
                                sample.voiceB = (b) ? this.voiceB.getvolume() : -1;
                                b = this.voiceC.enabled() & (this.noiseOutput | this.voiceC.mixNoise);
                                sample.voiceC = (b) ? this.voiceC.getvolume() : -1;

                                this.voiceA.next();
                                this.voiceB.next();
                                this.voiceC.next();

                                this.noisePos += this.noiseStep;
                                this.envPos += this.envStep;
                                if (this.envPos > 2147483647)
                                        this.envPos -= 2147483647;
                                if (this.envPhase == 0 && this.envPos < this.envStep) 
                                        envPhase = 1;

                                if (this.syncBuzzer) {
                                        this.syncBuzzerPhase += this.syncBuzzerStep;

                                                if (this.syncBuzzerPhase & 1073741824) {
                                                        this.envPos = 0;
                                                        this.envPhase = 0;
                                                        this.syncBuzzerPhase &= 0x3fffffff;
                                                }
                                }
                        }

                        mixed += toMix;
                        mixPos = size;
                        this.samplesLeft -= toMix;
                }
                
                var l = e.outputBuffer.getChannelData(0);
                var r = e.outputBuffer.getChannelData(1);

                if (this.stereo) {
                        for (i = 0; i < this.bufferSize; ++i) {
                                sample = this.buffer[i];
                                l[i]=sample.left();
                                r[i]=sample.right();
                        }
                } else {
                        
                        for (i = 0; i < this.bufferSize; ++i) {
                                value = this.buffer[i].mono();
                                l[i]=value;
                                r[i]=value;
                        }
                }
                
        }
        
        this.writeRegisters=function(){
                var p;

                this.registers[0] &= 255;
                this.registers[1] &= 15;
                this.voiceA.computeTone(this.registers[1], this.registers[0]);

                this.registers[2] &= 255;
                this.registers[3] &= 15;
                this.voiceB.computeTone(this.registers[3], this.registers[2]);

                this.registers[4] &= 255;
                this.registers[5] &= 15;
                this.voiceC.computeTone(this.registers[5], this.registers[4]);

                this.registers[6] &= 31;

                if (this.registers[6] < 3) {
                        this.noisePos = 0;
                        this.noiseOutput = 65535;
                        this.noiseStep = 0;
                } else {
                        p = this.clock / ((this.registers[6] << 3) * this.audioFreq);
                        this.noiseStep = Math.floor(p * 32768);
                }

                this.registers[7] &= 255;

                this.voiceA.mixTone = (this.registers[7] & 1) ? 65535 : 0;
                this.voiceB.mixTone = (this.registers[7] & 2) ? 65535 : 0;
                this.voiceC.mixTone = (this.registers[7] & 4) ? 65535 : 0;

                this.voiceA.mixNoise = (this.registers[7] &  8) ? 65535 : 0;
                this.voiceB.mixNoise = (this.registers[7] & 16) ? 65535 : 0;
                this.voiceC.mixNoise = (this.registers[7] & 32) ? 65535 : 0;

                this.registers[8] &= 31;
                this.voiceA.setvolume(this.registers[8]);
                this.registers[9] &= 31;
                this.voiceB.setvolume(this.registers[9]);
                this.registers[10] &= 31;
                this.voiceC.setvolume(this.registers[10]);

                this.registers[11] &= 255;
                this.registers[12] &= 255;
                p = (this.registers[12] << 8) | this.registers[11];

                if (p < 3) {
                        this.envStep = 0;
                } else {
                        p = this.clock / ((p << 8) * this.audioFreq);
                        this.envStep = Math.floor(p * 1073741824);
                }

                if (this.registers[13] == 255) {
                        this.registers[13] = 0;
                } else {
                        this.registers[13] &= 15;
                        this.envPhase = 0;
                        this.envPos = 0;
                        this.envShape = this.registers[13];
                }
        }
        
        this.updateEffects=function(code, preDiv, count){
                var index=0;
                var tmpFreq=0;
                var voice=0;
                
                

                code   = this.registers[code] & 0xf0;
                preDiv = (this.registers[preDiv] >> 5) & 7;
                count  = this.registers[count];

                if (code & 0x30) {
                        voice = ((code & 0x30) >> 4) - 1;

                        switch (code & 0xc0) {
                                case 0x00:
                                case 0x80:
                                        break;
                                case 0x40:
                                        index = this.registers[voice + 8] & 31;

                                        if ((index >= 0) && (index < this.song.drums)) {
                                                preDiv = YmConst_MFP_PREDIV[preDiv] * count;
                                                if (preDiv > 0) {
                                                        tmpFreq = 2457600 / preDiv;

                                                        if (voice == 0) {
                                                                this.voiceA.drum = this.song.digidrums[index];
                                                                this.voiceA.drumStart(tmpFreq);
                                                        } else if (voice == 1) {
                                                                this.voiceB.drum = this.song.digidrums[index];
                                                                this.voiceB.drumStart(tmpFreq);
                                                        } else if (voice == 2) {
                                                                this.voiceC.drum = this.song.digidrums[index];
                                                                this.voiceC.drumStart(tmpFreq);
                                                        }
                                                }
                                        }
                                        break;
                                case 0xc0:
                                        break;
                        }
                }
        }

        
        this.syncBuzzerStart=function(timerFreq, shapeEnv){
                this.envShape = this.shapeEnv & 15;
                this.syncBuzzerStep = (this.timerFreq * 1073741824) / this.audioFreq;;
                this.syncBuzzerPhase = 0;
                this.syncBuzzer = true;
        }
    
        this.syncBuzzerStop=function(){
                this.syncBuzzer = false;
                this.syncBuzzerPhase = 0;
                this.syncBuzzerStep = 0;
        }
        
        this.stop=function(){
                
                        this.reset();
                        return true;
        }
        
        this.reset=function(){
                var i;

                this.voiceA = new YmChannel(this);
                this.voiceB = new YmChannel(this);
                this.voiceC = new YmChannel(this);
                this.samplesLeft = 0;
                this.frame = 0;

                this.registers = new Array();
                for (i = 0; i < 16; ++i) 
                        this.registers[i]=0;
                this.registers[7] = 255;

                this.writeRegisters();
                this.volumeEnv = 0;

                this.noiseOutput = 65535;
                this.noisePos = 0;
                this.noiseStep = 0;
                this.rng = 1;

                this.envPhase = 0;
                this.envPos = 0;
                this.envShape = 0;
                this.envStep = 0;

                this.syncBuzzerStop();
        }
        
        this.init();
        this.reset();
        
        CODEF_AUDIO_NODE.connect(CODEF_AUDIO_CONTEXT.destination);


        
}
////////////////////////////////////////////////////////////////////
//
// Sample.js
//
////////////////////////////////////////////////////////////////////
function Sample(){
        this.voiceA = -1;
        this.voiceB = -1;
        this.voiceC = -1;



        this.mono=function(){
                var v = YmConst_MONO;
                var vol = 0.0;

                if (this.voiceA > -1) vol += v[this.voiceA];
                if (this.voiceB > -1) vol += v[this.voiceB];
                if (this.voiceC > -1) vol += v[this.voiceC];
                return vol;
        }

        this.left=function(){
                var v = YmConst_STEREO;
                var vol = 0.0;

                if (this.voiceA > -1) vol += v[this.voiceA];
                if (this.voiceB > -1) vol += v[this.voiceB];
                return vol;
        }

        this.right=function(){
                var v = YmConst_STEREO;
                var vol = 0.0;

                if (this.voiceB > -1) vol += v[this.voiceB];
                if (this.voiceC > -1) vol += v[this.voiceC];
                return vol;
        }
}
////////////////////////////////////////////////////////////////////
//
// YmChannel.js
//
////////////////////////////////////////////////////////////////////
function YmChannel(processor){
        this.mixNoise=0;
        this.mixTone=0;
        this.mode=0;
        this.position=0;
        this.step=0;

        this.digidrum=0;
        this.drum=0;
        this.drumPos=0;
        this.drumStep=0;

        this.processor = processor;
        this.vol=0;

        this.enabled=function(){
                return (this.position >> 30) | this.mixTone;
        }

        this.getvolume=function(){
                return (this.mode) ? this.processor.volumeEnv : this.vol;
        }

        this.setvolume=function(value){
                if(value & 16) 
                        this.mode=true
                else 
                        this.mode=false;
                this.vol = value;
        }

        this.next=function(){
                this.position += this.step;
                if (this.position > 2147483647) this.position -= 2147483647;
        }

        this.computeTone=function(high, low){
                var p = (high << 8) | low;

                if (p < 5) {
                        this.position = 1073741824;
                        this.step = 0;
                } else {
                        p = this.processor.clock / ((p << 3) * this.processor.audioFreq);
                        this.step = Math.floor(p * 1073741824);
                }
        }

        this.computeVolume=function(){
                var pos;

                if (this.digidrum) {
                        pos = this.drumPos >> YmConst_DRUM_PREC;
                        this.vol = this.drum.data[pos] / 16;//6;
                        this.mixNoise = 65535;
                        this.mixTone  = 65535;

                        this.drumPos += this.drumStep;
                        pos = this.drumPos >> YmConst_DRUM_PREC;
                        if (pos >= this.drum.size) 
                                this.digidrum = false;
                }
        }

        this.drumStart=function(drumFreq){
                this.digidrum = true;
                this.drumPos = 0;
                this.drumStep = (this.drumFreq << 15) / this.processor.audioFreq;
        }

        this.drumStop=function(){
                this.digidrum = false;
        }
        
}
////////////////////////////////////////////////////////////////////
//
// Digidrum.js
//
////////////////////////////////////////////////////////////////////
function Digidrum(size){
        this.data;
        this.repeatLen;
        this.size;
        this.wave=null;

        this.size = size;

        this.wave = new dataType();

        this.convert=function(attribs){
                var b;
                var i;
                this.data = new Array;

                if (attribs & YmConst_DRUM_4BITS) {
                        for (i = 0; i < this.size; ++i) {
                                b = (this.wave.readByte() & 15) >> 7;
                                this.data[i] = YmConst_MONO[b];
                        }
                } else {
                        for (i = 0; i < this.size; ++i) {
                                this.data[i] = this.wave.readByte();// / 255;
                        }
                }
                this.wave = null;
        }

}

function dataType(){
        this.data;
        this.pos=0;
        this.endian="BIG";
        
        
        this.readBytes = function(offset, nb){
                var tmp="";
                for(var i=0;i<nb;i++){
                        tmp+=this.data[offset+this.pos++];
                }
                return tmp;
        }
        
        this.readMultiByte = function(nb, type){
                if(type=="txt"){
                        var tmp="";
                        for(var i=0; i<nb; i++){
                                tmp+=this.data[this.pos++]
                        }
                        return tmp;
                }
        }
        
        this.readInt = function(){
                var tmp1 = parseInt(this.data[this.pos+0].charCodeAt(0).toString(16),16);
                var tmp2 = parseInt(this.data[this.pos+1].charCodeAt(0).toString(16),16);
                var tmp3 = parseInt(this.data[this.pos+2].charCodeAt(0).toString(16),16);
                var tmp4 = parseInt(this.data[this.pos+3].charCodeAt(0).toString(16),16);
                if(this.endian=="BIG")
                        var tmp = (tmp1<<24)|(tmp2<<16)|(tmp3<<8)|tmp4;
                else
                        var tmp = (tmp4<<24)|(tmp3<<16)|(tmp2<<8)|tmp1;
                this.pos+=4;
                return tmp;
        }
        
        this.readShort = function(){
                var tmp1 = parseInt(this.data[this.pos+0].charCodeAt(0).toString(16),16);
                var tmp2 = parseInt(this.data[this.pos+1].charCodeAt(0).toString(16),16);
                var tmp = (tmp1<<8)|tmp2;
                this.pos+=2;
                return tmp;
        }
        this.readByte = function(){
                var tmp =  parseInt(this.data[this.pos].charCodeAt(0).toString(16),16)
                this.pos+=1;
                return tmp;
        }
        this.readString = function(){
                var tmp="";
                while(1){
                        if(this.data[this.pos++].charCodeAt(0) !=0)
                                tmp+=this.data[this.pos-1];
                        else
                                return tmp;
                }
        }

        this.substr= function(start, nb){
                return this.data.substr(start,nb);
        }
        
        this.bytesAvailable=function(){
                return this.length-this.pos;
        }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// LHA depack routine
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function LHa() {
        this.data;

        this.source;
        this.buffer;
        this.output;
        this.srcSize;
        this.dstSize;
        this.srcPos;
        this.dstPos;

        this.c_Table;
        this.p_Table;
        this.c_Len;
        this.p_Len;
        this.l_Tree;
        this.r_Tree;

        this.bitBuffer;
        this.bitCount;
        this.subBuffer;
        this.blockSize;
        this.fillBufferSize;
        this.fillIndex;
        this.decodei;
        this.decodej;


        this.data = "";
        this.buffer = new Array();
        this.output = new Array();

        this.c_Table = new Array();
        this.p_Table = new Array();
        this.c_Len = new Array();
        this.p_Len = new Array();
        this.l_Tree = new Array();
        this.r_Tree = new Array();


        this.unpack=function(source){
                this.header = new LHaHeader(source);
                if (this.header.size == 0 || this.header.method != "-lh5-" || this.header.level != 0) return source.data;

                this.source = source;
                this.srcSize = this.header.packed;
                this.srcPos = this.source.pos;
                this.dstSize = this.header.original;

                this.fillBufferSize = 0;
                this.bitBuffer = 0;
                this.bitCount = 0;
                this.subBuffer = 0;
                this.fillBuffer(16);
                this.blockSize = 0;
                this.decodej = 0;

                var l = this.dstSize;
                var n;
                var np;

                while (l != 0) {
                        n = l > 8192 ? 8192 : l;
                        this.decode(n);
                        np = n > this.dstSize ? this.dstSize : n;

                        if (np > 0) {
                                this.output.pos = 0;
                                for(var yop=0;yop<np;yop++){
                                        this.data+=String.fromCharCode(this.output[yop]);
                                }
                                this.dstPos += np;
                                this.dstSize -= np;
                        }

                        l -= n;
                }
      
                this.buffer="";
                this.output=new Array;
                return this.data;
        }

        this.decode=function(count){
                var c;
                var r=0;

                while (--this.decodej >= 0) {
                        this.output[r] = this.output[this.decodei];
                        this.decodei = ++this.decodei & 8191;
                        if (++r == count) return;
                }

                for (;;) {
                        c = this.decode_c();

                        if (c <= 255) {
                                this.output[r] = c;
                                if (++r == count) return;
                        } 
                        else {
                                this.decodej = c - 253;
                                this.decodei = (r - this.decode_p() - 1) & 8191;

                                while (--this.decodej >= 0) {
                                        this.output[r] = this.output[this.decodei];
                                        this.decodei = ++this.decodei & 8191;
                                        if (++r == count) return;
                                }
                        }
                }
        }

        this.decode_c=function(){
                var j;
                var mask=0;

                if (this.blockSize == 0) {
                        this.blockSize = this.getBits(16);
                        this.read_p(19, 5, 3);
                        this.read_c();
                        this.read_p(14, 4, -1);
                }

                this.blockSize--;
                j = this.c_Table[this.bitBuffer >> 4];

                if (j >= 510) {
                        mask = 1 << 3;

                        do {
                                j = (this.bitBuffer & mask) ? this.r_Tree[j] : this.l_Tree[j];
                                mask >>= 1;
                        } while (j >= 510);
                }

                this.fillBuffer(this.c_Len[j]);
                return j & 0xffff;
        }
    


        this.decode_p=function(){
                var j = this.p_Table[this.bitBuffer >> 8];
                var mask=0;

                if (j >= 14) {
                        mask = 1 << 7;

                        do {
                                j = (this.bitBuffer & mask) ? this.r_Tree[j] : this.l_Tree[j];
                                mask >>= 1;
                        } while (j >= 14);
                }

                this.fillBuffer(this.p_Len[j]);
                if (j != 0) j = (1 << (j - 1)) + this.getBits(j - 1);
                        return j & 0xffff;
        }

        this.read_c=function(){
                var c;
                var i=0;
                var mask=0
                var n = this.getBits(9);

                if (n == 0) {
                        c = this.getBits(9);
                        for (i = 0; i < 510; ++i) this.c_Len[i] = 0;
                        for (i = 0; i < 4096; ++i) this.c_Table[i] = c;
                } else {
                        while (i < n) {
                                c = this.p_Table[this.bitBuffer >> 8];

                                if (c >= 19) {
                                        mask = 1 << 7;
                                        do {
                                                c = (this.bitBuffer & mask) ? this.r_Tree[c] : this.l_Tree[c];
                                        mask >>= 1;
                                        } while (c >= 19);
                                }       

                                this.fillBuffer(this.p_Len[c]);

                                if (c <= 2) {
                                        if (c == 0)
                                                c = 1;
                                        else if (c == 1)
                                                c = this.getBits(4) + 3;
                                        else
                                                c = this.getBits(9) + 20;

                                        while (--c >= 0) this.c_Len[i++] = 0;
                                } else {
                                this.c_Len[i++] = c - 2;
                                }
                        }

                        while (i < 510) this.c_Len[i++] = 0;
                        this.makeTable(510, this.c_Len, 12, this.c_Table);
                }
        }

        this.read_p=function(nn, nbit, iSpecial){
                var c;
                var i=0;
                var mask=0;
                var n = this.getBits(nbit);

                if (n == 0) {
                        c = this.getBits(nbit);
                        for (i = 0; i < nn; ++i) this.p_Len[i] = 0;
                        for (i = 0; i < 256; ++i) this.p_Table[i] = c;
                } else {
                        while (i < n) {
                                c = this.bitBuffer >> 13;

                                if (c == 7) {
                                        mask = 1 << 12;

                                        while (mask & this.bitBuffer) {
                                                mask >>= 1;
                                                c++;
                                        }
                                }

                                this.fillBuffer(c < 7 ? 3 : c - 3);
                                this.p_Len[i++] = c;

                                if (i == iSpecial) {
                                        c = this.getBits(2);
                                        while (--c >= 0) this.p_Len[i++] = 0;
                                }
                        }

                        while (i < nn) this.p_Len[i++] = 0;
                        this.makeTable(nn, this.p_Len, 8, this.p_Table);
                }
        }

        this.getBits=function(n){
                var r = this.bitBuffer >> (16 - n);
                this.fillBuffer(n);
                return r & 0xffff;
        }

        this.fillBuffer=function(n){
                var np;

                this.bitBuffer = (this.bitBuffer << n) & 0xffff;

                while (n > this.bitCount) {
                        this.bitBuffer |= this.subBuffer << (n -= this.bitCount);
                        this.bitBuffer &= 0xffff;

                        if (this.fillBufferSize == 0) {
                                this.fillIndex = 0;
                                np = this.srcSize > 4064 ? 4064 : this.srcSize;

                                if (np > 0) {
                                        this.source.pos = this.srcPos;
                                        this.buffer=this.source.readBytes(0, np);
                                        this.srcPos += np;
                                        this.srcSize -= np;
                                }

                                this.fillBufferSize = np;
                        }

                        if (this.fillBufferSize > 0) {
                                this.fillBufferSize--;
                                this.subBuffer = this.buffer[this.fillIndex++].charCodeAt(0);
                        } else {
                                this.subBuffer = 0;
                        }

                        this.bitCount = 8;
                }

                this.bitBuffer |= this.subBuffer >> (this.bitCount -= n);
                this.bitBuffer &= 0xffff;
        }

        this.makeTable=function(nchar, bitlen, tablebits, table){
                var a = nchar;
                var h;
                var i;
                var j;
                var k;
                var l; 
                var n;
                var p;
                var t;
                var r;
                var c = new Array();
                var w = new Array();
                var s = new Array();
                var mask = 1 << (15 - tablebits);
                for (i = 0; i < nchar; ++i)
                        c[i]=0;

                for (i = 0; i < nchar; ++i) c[bitlen[i]]++;

                s[1] = 0;
                for (i = 1; i < 17; ++i) s[i + 1] = (s[i] + (c[i] << (16 - i))) & 0xffff;

                if (s[17] != 0) return false;
                j = 16 - tablebits;

                for (i = 1; i <= tablebits; ++i) {
                        s[i] >>= j;
                        w[i] = 1 << (tablebits - i);
                }

                while (i < 17) w[i] = 1 << (16 - i++);
                i = s[tablebits + 1] >> j;

                if (i != 0) {
                        k = 1 << tablebits;
                        while (i != k) table[i++] = 0;
                }

                for (h = 0; h < nchar; ++h) {
                        if ((l = bitlen[h]) == 0) continue;
                        n = s[l] + w[l];

                        if (l <= tablebits) {
                                for (i = s[l]; i < n; ++i) table[i] = h;
                        } else {
                                i = l - tablebits;
                                k = s[l];
                                p = k >> j;
                                t = table;

                                while (i != 0) {
                                        if (t[p] == 0) {
                                                this.l_Tree[a] = 0;
                                                this.r_Tree[a] = 0;
                                                t[p] = a++;
                                        }

                                        r = (k & mask) ? this.r_Tree : this.l_Tree;
                                        k <<= 1;
                                        i--;
                                }

                                r[t[p]] = h;
                        }
                        s[l] = n;
                }

                return true;
        }
    
}


function LHaHeader(source) {
        this.size;
        this.checksum;
        this.method;
        this.packed;
        this.original;
        this.timeStamp;
        this.attribute;
        this.level;
        this.nameLength;
        this.name;

        source.endian = "LITTLE";
        source.pos = 0;

        this.size = source.readByte();
        this.checksum = source.readByte();
        this.method = source.readMultiByte(5, "txt");
        this.packed = source.readInt();
        this.original = source.readInt();
        this.timeStamp = source.readInt();
        this.attribute = source.readByte();
        this.level = source.readByte();
        this.nameLength = source.readByte();
        this.name = source.readMultiByte(this.nameLength, "txt");

        source.readShort();
}





(function() {
  "use strict";
  window.neoart = Object.create(null);

  function ByteArray(stream, endian) {
    var o = Object.create(null, {
      endian : { value:1,    writable:true },
      length : { value:0,    writable:true },
      index  : { value:0,    writable:true },
      buffer : { value:null, writable:true },
      view   : { value:null, writable:true },

      bytesAvailable: {
        get: function() {
          return this.length - this.index;
      }},
      position: {
        get: function() { return this.index; },
        set: function(value) {
          if (value < 0) value = 0;
            else if (value > this.length) value = this.length;

          this.index = value;
      }},

      clear: {
        value: function() {
          this.buffer = new ArrayBuffer();
          this.view   = null;
          this.index  = this.length = 0;
      }},
      readAt: {
        value: function(index) {
          return this.view.getUint8(index);
      }},
      readByte: {
        value: function() {
          return this.view.getInt8(this.index++);
      }},
      readShort: {
        value: function() {
          var r = this.view.getInt16(this.index, this.endian);
          this.index += 2;
          return r;
      }},
      readInt: {
        value: function() {
          var r = this.view.getInt32(this.index, this.endian);
          this.index += 4;
          return r;
      }},
      readUbyte: {
        value: function() {
          return this.view.getUint8(this.index++);
      }},
      readUshort: {
        value: function() {
          var r = this.view.getUint16(this.index, this.endian);
          this.index += 2;
          return r;
      }},
      readUint: {
        value: function() {
          var r = this.view.getUint32(this.index, this.endian);
          this.index += 4;
          return r;
      }},
      readBytes: {
        value: function(buffer, offset, len) {
          var dst = buffer.view, i = this.index, src = this.view;
          if ((len += i) > this.length) len = this.length;

          for (; i < len; ++i)
            dst.setUint8(offset++, src.getUint8(i));

          this.index = i;
      }},
      readString: {
        value: function(len) {
          var i = this.index, src = this.view, text = "";
          if ((len += i) > this.length) len = this.length;

          for (; i < len; ++i)
            text += String.fromCharCode(src.getUint8(i));

          this.index = len;
          return text;
      }},
      writeAt: {
        value: function(index, value) {
          this.view.setUint8(index, value);
      }},
      writeByte: {
        value: function(value) {
          this.view.setInt8(this.index++, value);
      }},
      writeShort: {
        value: function(value) {
          this.view.setInt16(this.index, value);
          this.index += 2;
      }},
      writeInt: {
        value: function(value) {
          this.view.setInt32(this.index, value);
          this.index += 4;
      }}
    });

    o.buffer = stream;
    o.view   = new DataView(stream);
    o.length = stream.byteLength;

    return Object.seal(o);
  }

  function Sample() {
    return Object.create(null, {
      l    : { value:0.0,  writable:true },
      r    : { value:0.0,  writable:true },
      next : { value:null, writable:true }
    });
  }
  function CoreMixer() {
    return Object.create(null, {
      player      : { value:null, writable:true },
      channels    : { value:[],   writable:true },
      buffer      : { value:[],   writable:true },
      samplesTick : { value:0,    writable:true },
      samplesLeft : { value:0,    writable:true },
      remains     : { value:0,    writable:true },
      completed   : { value:0,    writable:true },

      bufferSize: {
        get: function() { return this.buffer.length; },
        set: function(value) {
          var i, len = this.buffer.length || 0;
          if (value == len || value < 512) return;
          this.buffer.length = value;

          if (value > len) {
            this.buffer[len] = Sample();

            for (i = ++len; i < value; ++i)
              this.buffer[i] = this.buffer[i - 1].next = Sample();
          }
      }},
      complete: {
        get: function() { return this.completed; },
        set: function(value) {
          this.completed = value ^ this.player.loopSong;
      }},

      reset: {
        value: function() {
          var chan = this.channels[0], sample = this.buffer[0];
          this.samplesLeft = 0;
          this.remains     = 0;
          this.completed   = 0;

          while (chan) {
            chan.initialize();
            chan = chan.next;
          }

          while (sample) {
            sample.l = sample.r = 0.0;
            sample = sample.next;
          }
      }},
      restore: {
        configurable:true,
        value: function() {}}
    });
  }
  function CorePlayer() {
    var o = Object.create(null, {
      context    : { value:null, writable:true },
      node       : { value:null, writable:true },
      analyse    : { value:0,    writable:true },
      endian     : { value:0,    writable:true },
      sampleRate : { value:0,    writable:true },
      playSong   : { value:0,    writable:true },
      lastSong   : { value:0,    writable:true },
      version    : { value:0,    writable:true },
      title      : { value:"",   writable:true },
      channels   : { value:0,    writable:true },
      loopSong   : { value:1,    writable:true },
      speed      : { value:0,    writable:true },
      tempo      : { value:0,    writable:true },
      mixer      : { value:null, writable:true },
      tick       : { value:0,    writable:true },
      paused     : { value:0,    writable:true },
      callback   : { value:null, writable:true },

      quality: {
        configurable:true,
        set: function(value) {
          this.callback = (value) ? this.mixer.accurate.bind(this.mixer) : this.mixer.fast.bind(this.mixer);
      }},

      toggle: {
        value: function(index) {
          this.mixer.channels[index].mute ^= 1;
      }},
      setup: {
        configurable:true,
        value: function() {}},
      load: {
        value: function(stream) {
          this.version  = 0;
          this.playSong = 0;
          this.lastSong = 0;

          this.mixer.restore();
          if (!stream.view) stream = ByteArray(stream);
          stream.position = 0;

          if (stream.readUint() == 67324752) {
            if (window.neoart.Unzip) {
              var zip = ZipFile(stream);
              stream = zip.uncompress(zip.entries[0]);
            } else {
              throw "Unzip support is not available.";
            }
          }

          stream.endian = this.endian;
          stream.position = 0;
          this.loader(stream);

          if (this.version) this.setup();
          return this.version;
      }},
      play: {
        value: function() {
          var e, node;
          if (!this.version) return;

          if (this.paused) {
            this.paused = 0;
          } else {
            this.initialize();
            this.node = this.context.createScriptProcessor(this.mixer.bufferSize);
            this.node.onaudioprocess = this.callback;
          }

          if (this.analyse && window.neoart.Flectrum) {
            node = window.neoart.analyserNode = this.context.createAnalyser();
            this.node.connect(node);
            node.connect(this.context.destination);
          } else {
            this.node.connect(this.context.destination);
          }

          e = document.createEvent("Event");
          e.initEvent("flodPlay", true, false);
          document.dispatchEvent(e);
      }},
      pause: {
        value: function() {
          if (this.node) {
            this.node.disconnect();
            this.paused = 1;

            var e = document.createEvent("Event");
            e.initEvent("flodPause", true, false);
            document.dispatchEvent(e);
          }
      }},
      stop: {
        value: function() {
          if (this.node) {
            this.node.disconnect();
            this.node.onaudioprocess = this.node = null;
            this.paused = 0;
            if (this.restore) this.restore();

            var e = document.createEvent("Event");
            e.initEvent("flodStop", true, false);
            document.dispatchEvent(e);
          }
      }},
      reset: {
        value: function() {
          this.tick = 0;
          this.mixer.initialize();
          this.mixer.samplesTick = ((this.sampleRate * 2.5) / this.tempo) >> 0;
      }}
    });

    if (!window.neoart.audioContext)
      window.neoart.audioContext = new AudioContext();

    o.context = window.neoart.audioContext;
    o.sampleRate = o.context.sampleRate;
    return o;
  }

  function ZipFile(stream) {
    if (!stream) return null;

    var ERROR1  = "The archive is either in unknown format or damaged.",
        ERROR2  = "Unexpected end of archive.",
        ERROR3  = "Encrypted archive not supported.",
        ERROR4  = "Compression method not supported.",
        ERROR5  = "Invalid block type.",
        ERROR6  = "Available inflate data did not terminate.",
        ERROR7  = "Invalid literal/length or distance code.",
        ERROR8  = "Distance is too far back.",
        ERROR9  = "Stored block length did not match one's complement.",
        ERROR10 = "Too many length or distance codes.",
        ERROR11 = "Code lengths codes incomplete.",
        ERROR12 = "Repeat lengths with no first length.",
        ERROR13 = "Repeat more than specified lengths.",
        ERROR14 = "Invalid literal/length code lengths.",
        ERROR15 = "Invalid distance code lengths.",

        LENG  = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],
        LEXT  = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],
        DIST  = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],
        DEXT  = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],
        ORDER = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];

    function Huffman(len) {
      var o = Object.create(null, {
        count  : { value:null, writable:true },
        symbol : { value:null, writable:true }
      });

      o.count  = new Uint16Array(len);
      o.symbol = new Uint16Array(len);
      return Object.seal(o);
    }

    function Inflater() {
      var o = Object.create(null, {
        output   : { value:null, writable:true },
        inpbuf   : { value:null, writable:true },
        inpcnt   : { value:0,    writable:true },
        outcnt   : { value:0,    writable:true },
        bitbuf   : { value:0,    writable:true },
        bitcnt   : { value:0,    writable:true },
        flencode : { value:null, writable:true },
        fdiscode : { value:null, writable:true },
        dlencode : { value:null, writable:true },
        ddiscode : { value:null, writable:true },

        input: {
          set: function(args) {
            this.inpbuf = args[0];
            this.inpbuf.endian = args[2];
            this.inpbuf.position = 0;
            this.inpcnt = 0;

            this.output = ByteArray(new ArrayBuffer(args[1]));
            this.output.endian = args[2];
            this.output.position = 0;
            this.outcnt = 0;
        }},

        inflate: {
          value: function() {
            var err, last, type;

            do {
              last = this.bits(1);
              type = this.bits(2);

              err = type == 0 ? this.stored() :
                    type == 1 ? this.codes(this.flencode, this.fdiscode) :
                    type == 2 ? this.dynamic() : 1;

              if (err) throw ERROR5;
            } while (!last);
        }},
        initialize: {
          value: function() {
            var len = new Uint8Array(288), sym = 0;
            this.flencode = Huffman(288);
            this.fdiscode = Huffman(30);

            for (; sym < 144; ++sym) len[sym] = 8;
            for (; sym < 256; ++sym) len[sym] = 9;
            for (; sym < 280; ++sym) len[sym] = 7;
            for (; sym < 288; ++sym) len[sym] = 8;
            this.construct(this.fdiscode, len, 288);

            for (sym = 0; sym < 30; ++sym) len[sym] = 5;
            this.construct(this.fdiscode, len, 30);

            this.dlencode = Huffman(286);
            this.ddiscode = Huffman(30);
        }},
        construct: {
          value: function(huff, arr, n) {
            var len = 0, left = 1, off = new Uint16Array(16), sym = 0;

            for (; len < 16; ++len) huff.count[len] = 0;
            for (; sym <  n; ++sym) huff.count[arr[sym]]++;
            if (huff.count[0] == n) return 0;

            for (len = 1; len < 16; ++len) {
              left <<= 1;
              left -= huff.count[len];
              if (left < 0) return left;
            }

            for (len = 1; len < 15; ++len)
              off[len + 1] = off[len] + huff.count[len];

            for (sym = 0; sym < n; ++sym)
              if (arr[sym] != 0) huff.symbol[off[arr[sym]]++] = sym;

            return left;
        }},
        bits: {
          value: function(need) {
            var buf = this.bitbuf, inplen = this.inpbuf.length;

            while (this.bitcnt < need) {
              if (this.inpcnt == inplen) throw ERROR6;
              buf |= this.inpbuf.readAt(this.inpcnt++) << this.bitcnt;
              this.bitcnt += 8;
            }

            this.bitbuf = buf >> need;
            this.bitcnt -= need;
            return buf & ((1 << need) - 1);
        }},
        codes: {
          value: function(lencode, discode) {
            var dis, len, pos, sym;

            do {
              sym = this.decode(lencode);
              if (sym < 0) return sym;

              if (sym < 256) {
                this.output.writeAt(this.outcnt++, sym);
              } else if (sym > 256) {
                sym -= 257;
                if (sym >= 29) throw ERRRO7;
                len = LENG[sym] + this.bits(LEXT[sym]);

                sym = this.decode(discode);
                if (sym < 0) return sym;
                dis = DIST[sym] + this.bits(DEXT[sym]);
                if (dis > this.outcnt) throw ERROR8;

                pos = this.outcnt - dis;
                while (len--) this.output.writeAt(this.outcnt++, this.output.readAt(pos++));
              }
            } while (sym != 256);

            return 0;
        }},
        decode: {
          value: function(huff) {
            var buf = this.bitbuf, code = 0, count, first = 0, index = 0, inplen = this.inpbuf.length, left = this.bitcnt, len = 1;

            while (1) {
              while (left--) {
                code |= buf & 1;
                buf >>= 1;
                count = huff.count[len];

                if (code < (first + count)) {
                  this.bitbuf = buf;
                  this.bitcnt = (this.bitcnt - len) & 7;
                  return huff.symbol[index + (code - first)];
                }

                index += count;
                first += count;
                first <<= 1;
                code  <<= 1;
                ++len;
              }

              left = 16 - len;
              if (!left) break;
              if (this.inpcnt == inplen) throw ERROR6;
              buf = this.inpbuf.readAt(this.inpcnt++);
              if (left > 8) left = 8;
            }

            return -9;
        }},
        stored: {
          value: function() {
            var inplen = this.inpbuf.length, len;
            this.bitbuf = this.bitcnt = 0;

            if ((this.inpcnt + 4) > inplen) throw ERROR6;
            len  = this.inpbuf.readAt(this.inpcnt++);
            len |= this.inpbuf.readAt(this.inpcnt++) << 8;

            if (this.inpbuf.readAt(this.inpcnt++) != ( ~len & 0xff) ||
                this.inpbuf.readAt(this.inpcnt++) != ((~len >> 8) & 0xff)) throw ERROR9;

            if ((this.inpcnt + len) > inplen) throw ERROR6;
            while (len--) this.output.writeAt(this.outcnt++, this.inpbuf.readAt(this.inpcnt++));
            return 0;
        }},
        dynamic: {
          value: function() {
            var arr = new Uint8Array(316), err, index = 0, len, nlen = this.bits(5) + 257, ndis = this.bits(5) + 1, ncode = this.bits(4) + 4, max = nlen + ndis, sym;

            if (nlen > 286 || ndis > 30) throw ERROR10;
            for (; index < ncode; ++index) arr[ORDER[index]] = this.bits(3);
            for (; index < 19; ++index) arr[ORDER[index]] = 0;

            err = this.construct(this.dlencode, arr, 19);
            if (err) throw ERROR11;
            index = 0;

            while (index < max) {
              sym = this.decode(this.dlencode);

              if (sym < 16) {
                arr[index++] = sym;
              } else {
                len = 0;

                if (sym == 16) {
                  if (index == 0) throw ERROR12;
                  len = arr[index - 1];
                  sym = 3 + this.bits(2);
                } else if (sym == 17) {
                  sym = 3 + this.bits(3);
                } else {
                  sym = 11 + this.bits(7);
                }

                if ((index + sym) > max) throw ERROR13;
                while (sym--) arr[index++] = len;
              }
            }

            err = this.construct(this.dlencode, arr, nlen);
            if (err < 0 || (err > 0 && nlen - this.dlencode.count[0] != 1)) throw ERROR14;

            err = this.construct(this.ddiscode, arr.subarray(nlen), ndis);
            if (err < 0 || (err > 0 && ndis - this.ddiscode.count[0] != 1)) throw ERROR15;

            return this.codes(this.dlencode, this.ddiscode);
        }}
      });

      o.initialize();
      return Object.seal(o);
    }

    function ZipEntry() {
      return Object.create(null, {
        name       : { value:"",   writable:true },
        extra      : { value:null, writable:true },
        version    : { value:0,    writable:true },
        flag       : { value:0,    writable:true },
        method     : { value:0,    writable:true },
        time       : { value:0,    writable:true },
        crc        : { value:0,    writable:true },
        compressed : { value:0,    writable:true },
        size       : { value:0,    writable:true },
        offset     : { value:0,    writable:true },

        date: {
          get: function() {
            return new Date(
              ((this.time >> 25) & 0x7f) + 1980,
              ((this.time >> 21) & 0x0f) - 1,
               (this.time >> 16) & 0x1f,
               (this.time >> 11) & 0x1f,
               (this.time >>  5) & 0x3f,
               (this.time & 0x1f) << 1
            );
        }},
        isDirectory: {
          get: function() {
            return (this.name.charAt(this.name.length - 1) == "/");
        }}
      });
    }

    var o = Object.create(null, {
      endian  : { value:1,    writable:true },
      entries : { value:null, writable:true },
      stream  : { value:null, writable:true },

      uncompress: {
        value: function(entry) {
          var src = this.stream, buffer, found = false, i, inflater, item, len, size;
          if (!entry) return null;

          if (typeof entry == "string") {
            len = this.entries.length;

            for (i = 0; i < len; ++i) {
              item = this.entries[i];

              if (item.name == entry) {
                entry = item;
                found = true;
                break;
              }
            }

            if (!found) return null;
          }

          src.position = entry.offset + 28;
          size = src.readUshort();
          src.position += (entry.name.length + size);

          if (entry.compressed) {
            buffer = ByteArray(new ArrayBuffer(entry.compressed), this.endian);
            src.readBytes(buffer, 0, entry.compressed);

            switch (entry.method) {
              case 0:
                return buffer;
                break;
              case 8:
                inflater = Inflater();
                inflater.input = [buffer, entry.size, this.endian];
                inflater.inflate();
                return inflater.output;
                break;
              default:
                throw ERROR4;
                break;
            }
          }
      }},
      parseCentral: {
        value: function() {
          var src = this.stream, entry, hdr = ByteArray(new ArrayBuffer(46), this.endian), i, len = this.entries.length, size;

          for (i = 0; i < len; ++i) {
            src.readBytes(hdr, 0, 46);
            hdr.position = 0;
            if (hdr.readUint() != 0x02014b50) throw ERROR2;
            hdr.position += 24;

            size = hdr.readUshort();
            if (!size) throw ERROR2;
            entry = ZipEntry();
            entry.name = src.readString(size);

            size = hdr.readUshort();
            if (size) {
              entry.extra = ByteArray(new ArrayBuffer(size), this.endian);
              src.readBytes(entry.extra, 0, size);
            }

            src.position += hdr.readUshort();
            hdr.position = 6;
            entry.version = hdr.readUshort();

            entry.flag = hdr.readUshort();
            if ((entry.flag & 1) == 1) throw ERROR3;

            entry.method     = hdr.readUshort();
            entry.time       = hdr.readUint();
            entry.crc        = hdr.readUint();
            entry.compressed = hdr.readUint();
            entry.size       = hdr.readUint();

            hdr.position = 42;
            entry.offset = hdr.readUint();
            Object.freeze(entry);
            this.entries[i] = entry;
          }
      }},
      parseEnd: {
        value: function() {
          var src = this.stream, i = src.length - 22, l = i - 65536;
          if (l < 0) l = 0;

          do {
            if (src.readAt(i) != 0x50) continue;
            src.position = i;
            if (src.readUint() == 0x06054b50) break;
          } while (--i > l);

          if (i == l) throw ERROR1;

          src.position = i + 10;
          this.entries = [];
          this.entries.length = src.readUshort();

          src.position = i + 16;
          src.position = src.readUint();
          this.parseCentral();
      }}
    });

    if (!stream.view) stream = ByteArray(stream);
    stream.endian = 1;
    stream.position = 0;

    o.stream = stream;
    o.parseEnd();
    return Object.seal(o);
  }

  window.neoart.Unzip = 1.0;


  function AmigaChannel(idx) {
    var o = Object.create(null, {
      next    : { value:null, writable:true },
      mute    : { value:0,    writable:true },
      panning : { value:0.0,  writable:true },
      delay   : { value:0,    writable:true },
      pointer : { value:0,    writable:true },
      length  : { value:0,    writable:true },
      audena  : { value:0,    writable:true },
      audcnt  : { value:0,    writable:true },
      audloc  : { value:0,    writable:true },
      audper  : { value:0,    writable:true },
      audvol  : { value:0,    writable:true },
      timer   : { value:0.0,  writable:true },
      level   : { value:0.0,  writable:true },
      ldata   : { value:0.0,  writable:true },
      rdata   : { value:0.0,  writable:true },

      enabled: {
        get: function() { return this.audena; },
        set: function(value) {
          if (value == this.audena) return;

          this.audena = value;
          this.audloc = this.pointer;
          this.audcnt = this.pointer + this.length;

          this.timer = 1.0;
          if (value) this.delay += 2;
      }},
      period: {
        set: function(value) {
          if (value < 0) value = 0;
            else if (value > 65535) value = 65535;

          this.audper = value;
      }},
      volume: {
        set: function(value) {
          if (value < 0) value = 0;
            else if (value > 64) value = 64;

          this.audvol = value;
      }},

      resetData: {
        value: function() {
          this.ldata = 0.0;
          this.rdata = 0.0;
      }},
      initialize: {
        value: function() {
          this.audena = 0;
          this.audcnt = 0;
          this.audloc = 0;
          this.audper = 50;
          this.audvol = 0;

          this.timer = 0.0;
          this.ldata = 0.0;
          this.rdata = 0.0;

          this.delay   = 0;
          this.pointer = 0;
          this.length  = 0;
      }}
    });

    o.panning = o.level = ((++idx & 2) == 0) ? -1.0 : 1.0;
    return Object.seal(o);
  }
  function AmigaFilter() {
    return Object.create(null, {
      active : { value: 0,  writable:true },
      forced : { value:-1,  writable:true },
      l0     : { value:0.0, writable:true },
      l1     : { value:0.0, writable:true },
      l2     : { value:0.0, writable:true },
      l3     : { value:0.0, writable:true },
      l4     : { value:0.0, writable:true },
      r0     : { value:0.0, writable:true },
      r1     : { value:0.0, writable:true },
      r2     : { value:0.0, writable:true },
      r3     : { value:0.0, writable:true },
      r4     : { value:0.0, writable:true },

      initialize: {
        value: function() {
          this.l0 = this.l1 = this.l2 = this.l3 = this.l4 = 0.0;
          this.r0 = this.r1 = this.r2 = this.r3 = this.r4 = 0.0;
      }},
      process: {
        value: function(model, sample) {
          var FL = 0.5213345843532200, P0 = 0.4860348337215757, P1 = 0.9314955486749749, d = 1.0 - P0;

          if (model == 0) {
            this.l0 = P0 * sample.l + d * this.l0;
            this.r0 = P0 * sample.r + d * this.r0;
            d = 1.0 - P1;
            sample.l = this.l1 = P1 * this.l0 + d * this.l1;
            sample.r = this.r1 = P1 * this.r0 + d * this.r1;
          }

          if ((this.active | this.forced) > 0) {
            d = 1.0 - FL;
            this.l2 = FL * sample.l + d * this.l2;
            this.r2 = FL * sample.r + d * this.r2;
            this.l3 = FL * this.l2 + d * this.l3;
            this.r3 = FL * this.r2 + d * this.r3;
            sample.l = this.l4 = FL * this.l3 + d * this.l4;
            sample.r = this.r4 = FL * this.r3 + d * this.r4;
          }

          if (sample.l > 1.0) sample.l = 1.0;
            else if (sample.l < -1.0) sample.l = -1.0;

          if (sample.r > 1.0) sample.r = 1.0;
            else if (sample.r < -1.0) sample.r = -1.0;
      }}
    });
  }
  function AmigaRow() {
    return Object.create(null, {
      note   : { value:0, writable:true },
      sample : { value:0, writable:true },
      effect : { value:0, writable:true },
      param  : { value:0, writable:true }
    });
  }
  function AmigaSample() {
    return Object.create(null, {
      name    : { value:"", writable:true },
      length  : { value:0,  writable:true },
      loop    : { value:0,  writable:true },
      repeat  : { value:0,  writable:true },
      volume  : { value:0,  writable:true },
      pointer : { value:0,  writable:true },
      loopPtr : { value:0,  writable:true }
    });
  }
  function AmigaStep() {
    return Object.create(null, {
      pattern   : { value:0, writable:true },
      transpose : { value:0, writable:true }
    });
  }
  function Amiga() {
    var o = CoreMixer();

    Object.defineProperties(o, {
      filter  : { value:null, writable:true },
      model   : { value:1,    writable:true },
      memory  : { value:[],   writable:true },
      loopPtr : { value:0,    writable:true },
      loopLen : { value:4,    writable:true },
      clock   : { value:0.0,  writable:true },
      master  : { value:0.0,  writable:true },
      ready   : { value:0,    writable:true },

      volume: {
        set: function(value) {
          if (value > 0) {
            if (value > 64) value = 64;
            this.master = (value / 64) * 0.00390625;
          } else {
            this.master = 0.0;
          }
      }},

      initialize: {
        value: function() {
          var i = this.memory.length, len = i + this.loopLen;
          this.reset();
          this.filter.initialize();

          if (!this.ready) {
            this.ready = 1;
            this.loopPtr = i;
            for (; i < len; ++i) this.memory[i] = 0.0;
          }
      }},
      restore: {
        value: function() {
          this.ready = 0;
          this.memory.length = 0;
      }},
      store: {
        value: function(stream, len, pointer) {
          var add, i, pos = stream.position, start = this.memory.length, total;
          if (pointer) stream.position = pointer;
          total = stream.position + len;

          if (total >= stream.length) {
            add = total - stream.length;
            len = stream.length - stream.position;
          }

          for (i = start, len += start; i < len; ++i)
            this.memory[i] = stream.readByte();

          for (len += add; i < len; ++i)
            this.memory[i] = 0.0;

          if (pointer) stream.position = pos;
          return start;
      }},
      fast: {
        value: function(e) {
          var chan, i, ldata, rdata, local = this.memory, lvol, mixed = 0, mixLen, mixPos = 0, rdata, rvol, sample, size = this.bufferSize, speed, toMix, value;

          if (this.completed) {
            if (!this.remains) {
              this.player.stop();
              return;
            }
            size = this.remains;
          }

          while (mixed < size) {
            if (!this.samplesLeft) {
              this.player.process();
              this.samplesLeft = this.samplesTick;

              if (this.completed) {
                size = mixed + this.samplesTick;

                if (size > this.bufferSize) {
                  this.remains = size - this.bufferSize;
                  size = this.bufferSize;
                }
              }
            }

            toMix = this.samplesLeft;
            if ((mixed + toMix) >= size) toMix = size - mixed;
            mixLen = mixPos + toMix;
            chan = this.channels[0];

            while (chan) {
              sample = this.buffer[mixPos];

              if (chan.audena && chan.audper > 60) {
                speed = chan.audper / this.clock;
                value = chan.audvol * this.master;
                lvol = value * (1 - chan.level);
                rvol = value * (1 + chan.level);

                for (i = mixPos; i < mixLen; ++i) {
                  if (chan.delay) {
                    chan.delay--;
                  } else if (--chan.timer < 1.0) {
                    if (!chan.mute) {
                      value = local[chan.audloc] * 0.0078125;
                      chan.ldata = value * lvol;
                      chan.rdata = value * rvol;
                    }

                    chan.audloc++;
                    chan.timer += speed;

                    if (chan.audloc >= chan.audcnt) {
                      chan.audloc = chan.pointer;
                      chan.audcnt = chan.pointer + chan.length;
                    }
                  }

                  sample.l += chan.ldata;
                  sample.r += chan.rdata;
                  sample = sample.next;
                }
              } else {
                for (i = mixPos; i < mixLen; ++i) {
                  sample.l += chan.ldata;
                  sample.r += chan.rdata;
                  sample = sample.next;
                }
              }
              chan = chan.next;
            }

            mixPos = mixLen;
            mixed += toMix;
            this.samplesLeft -= toMix;
          }

          value = this.model;
          local = this.filter;

          sample = this.buffer[0];
          ldata = e.outputBuffer.getChannelData(0);
          rdata = e.outputBuffer.getChannelData(1);

          for (i = 0; i < size; ++i) {
            local.process(value, sample);

            ldata[i] = sample.l;
            rdata[i] = sample.r;

            sample.l = sample.r = 0.0;
            sample = sample.next;
          }
      }}
    });

    o.channels[0] = AmigaChannel(0);
    o.channels[0].next = o.channels[1] = AmigaChannel(1);
    o.channels[1].next = o.channels[2] = AmigaChannel(2);
    o.channels[2].next = o.channels[3] = AmigaChannel(3);

    o.bufferSize = 8192;
    o.filter = AmigaFilter();
    o.master = 0.00390625;
    return Object.seal(o);
  }
  function AmigaPlayer(mixer) {
    var o = CorePlayer();

    Object.defineProperties(o, {
      quality: {
        set: function(value) {
          this.callback = this.mixer.fast.bind(this.mixer);
      }},
      stereo: {
        set: function(value) {
          var chan = this.mixer.channels[0];

          if (value < 0.0) value = 0.0;
            else if (value > 1.0) value = 1.0;

          while (chan) {
            chan.level = value * chan.panning;
            chan = chan.next;
          }
      }},
      volume: {
        set: function(value) {
          if (value < 0.0) value = 0.0;
            else if (value > 1.0) value = 1.0;

          this.mixer.master = value * 0.00390625;
      }},

      frequency: {
        value: function(value) {
          if (value) {
            this.mixer.clock = 3579545 / this.sampleRate;
            this.mixer.samplesTick = 735;
          } else {
            this.mixer.clock = 3546895 / this.sampleRate;
            this.mixer.samplesTick = 882;
          }
      }}
    });

    o.mixer = mixer || Amiga();
    o.mixer.player = o;
    o.frequency(0);

    o.channels = 4;
    o.endian   = 0;
    o.quality  = 0;
    o.speed    = 6;
    o.tempo    = 125;
    return o;
  }


  function SBChannel() {
    return Object.create(null, {
      next:        { value:null, writable:true },
      mute:        { value:0,    writable:true },
      enabled:     { value:0,    writable:true },
      sample:      { value:null, writable:true },
      length:      { value:0,    writable:true },
      index:       { value:0,    writable:true },
      pointer:     { value:0,    writable:true },
      delta:       { value:0,    writable:true },
      fraction:    { value:0.0,  writable:true },
      speed:       { value:0.0,  writable:true },
      dir:         { value:0,    writable:true },
      oldSample:   { value:null, writable:true },
      oldLength:   { value:0,    writable:true },
      oldPointer:  { value:0,    writable:true },
      oldFraction: { value:0.0,  writable:true },
      oldSpeed:    { value:0.0,  writable:true },
      oldDir:      { value:0,    writable:true },
      volume:      { value:0.0,  writable:true },
      lvol:        { value:0.0,  writable:true },
      rvol:        { value:0.0,  writable:true },
      panning:     { value:128,  writable:true },
      lpan:        { value:0.5,  writable:true },
      rpan:        { value:0.5,  writable:true },
      ldata:       { value:0.0,  writable:true },
      rdata:       { value:0.0,  writable:true },
      mixCounter:  { value:0,    writable:true },
      lmixRampU:   { value:0.0,  writable:true },
      lmixDeltaU:  { value:0.0,  writable:true },
      rmixRampU:   { value:0.0,  writable:true },
      rmixDeltaU:  { value:0.0,  writable:true },
      lmixRampD:   { value:0.0,  writable:true },
      lmixDeltaD:  { value:0.0,  writable:true },
      rmixRampD:   { value:0.0,  writable:true },
      rmixDeltaD:  { value:0.0,  writable:true },
      volCounter:  { value:0,    writable:true },
      lvolDelta:   { value:0.0,  writable:true },
      rvolDelta:   { value:0.0,  writable:true },
      panCounter:  { value:0,    writable:true },
      lpanDelta:   { value:0.0,  writable:true },
      rpanDelta:   { value:0.0,  writable:true },

      initialize: {
        value: function() {
          this.enabled     = 0;
          this.sample      = null;
          this.length      = 0;
          this.index       = 0;
          this.pointer     = 0;
          this.delta       = 0;
          this.fraction    = 0.0;
          this.speed       = 0.0;
          this.dir         = 0;
          this.oldSample   = null;
          this.oldLength   = 0;
          this.oldPointer  = 0;
          this.oldFraction = 0.0;
          this.oldSpeed    = 0.0;
          this.oldDir      = 0;
          this.volume      = 0.0;
          this.lvol        = 0.0;
          this.rvol        = 0.0;
          this.panning     = 128
          this.lpan        = 0.5;
          this.rpan        = 0.5;
          this.ldata       = 0.0;
          this.rdata       = 0.0;
          this.mixCounter  = 0;
          this.lmixRampU   = 0.0;
          this.lmixDeltaU  = 0.0;
          this.rmixRampU   = 0.0;
          this.rmixDeltaU  = 0.0;
          this.lmixRampD   = 0.0;
          this.lmixDeltaD  = 0.0;
          this.rmixRampD   = 0.0;
          this.rmixDeltaD  = 0.0;
          this.volCounter  = 0;
          this.lvolDelta   = 0.0;
          this.rvolDelta   = 0.0;
          this.panCounter  = 0;
          this.lpanDelta   = 0.0;
          this.rpanDelta   = 0.0;
      }}
    });
  }
  function SBSample() {
    return Object.create(null, {
      name:      { value:"", writable:true },
      bits:      { value:8,  writable:true },
      volume:    { value:0,  writable:true },
      length:    { value:0,  writable:true },
      data:      { value:[], writable:true },
      loopMode:  { value:0,  writable:true },
      loopStart: { value:0,  writable:true },
      loopLen:   { value:0,  writable:true },

      store: {
        value: function(stream) {
          var delta = 0, i, len = this.length, pos, sample, total, value;
          if (!this.loopLen) this.loopMode = 0;
          pos = stream.position;

          if (this.loopMode) {
            len = this.loopStart + this.loopLen;
            this.data = new Float32Array(len + 1);
          } else {
            this.data = new Float32Array(this.length + 1);
          }

          if (this.bits == 8) {
            total = pos + len;

            if (total > stream.length)
              len = stream.length - pos;

            for (i = 0; i < len; i++) {
              value = stream.readByte() + delta;

              if (value < -128) value += 256;
                else if (value > 127) value -= 256;

              this.data[i] = value * 0.0078125;
              delta = value;
            }
          } else {
            total = pos + (len << 1);

            if (total > stream.length)
              len = (stream.length - pos) >> 1;

            for (i = 0; i < len; i++) {
              value = stream.readShort() + delta;

              if (value < -32768) value += 65536;
                else if (value > 32767) value -= 65536;

              this.data[i] = value * 0.00003051758;
              delta = value;
            }
          }

          total = pos + length;

          if (!this.loopMode) {
            this.data[this.length] = 0.0;
          } else {
            this.length = this.loopStart + this.loopLen;

            if (this.loopMode == 1) {
              this.data[len] = this.data[this.loopStart];
            } else {
              this.data[len] = this.data[len - 1];
            }
          }

          if (len != this.length) {
            sample = this.data[len - 1];
            for (i = len; i < this.length; i++) this.data[i] = sample;
          }

          if (total < stream.length) stream.position = total;
            else stream.position = stream.length - 1;
      }}
    });
  }
  function Soundblaster() {
    var o = CoreMixer();

    Object.defineProperties(o, {
      setup: {
        value: function(len) {
          var i = 1;
          this.channels.length = len;
          this.channels[0] = SBChannel();

          for (; i < len; ++i)
            this.channels[i] = this.channels[i - 1].next = SBChannel();
      }},
      initialize: {
        value: function() {
          this.reset();
      }},
      fast: {
        value: function(e) {
          var chan, d, ldata, i, mixed = 0, mixLen, mixPos = 0, rdata, s, sample, size = this.bufferSize, toMix, value;

          if (this.completed) {
            if (!this.remains) {
              this.player.stop();
              return;
            }
            size = this.remains;
          }

          while (mixed < size) {
            if (!this.samplesLeft) {
              this.player.process();
              this.player.fast();
              this.samplesLeft = this.samplesTick;

              if (this.completed) {
                size = mixed + this.samplesTick;

                if (size > this.bufferSize) {
                  this.remains = size - this.bufferSize;
                  size = this.bufferSize;
                }
              }
            }

            toMix = this.samplesLeft;
            if ((mixed + toMix) >= size) toMix = size - mixed;
            mixLen = mixPos + toMix;
            chan = this.channels[0];

            while (chan) {
              if (!chan.enabled) {
                chan = chan.next;
                continue;
              }

              s = chan.sample;
              d = s.data;
              sample = this.buffer[mixPos];

              for (i = mixPos; i < mixLen; ++i) {
                if (chan.index != chan.pointer) {
                  if (chan.index >= chan.length) {
                    if (!s.loopMode) {
                      chan.enabled = 0;
                      break;
                    } else {
                      chan.pointer = s.loopStart + (chan.index - chan.length);
                      chan.length  = s.length;

                      if (s.loopMode == 2) {
                        if (!chan.dir) {
                          chan.dir = s.length + s.loopStart - 1;
                        } else {
                          chan.dir = 0;
                        }
                      }
                    }
                  } else chan.pointer = chan.index;

                  if (!chan.mute) {
                    if (!chan.dir) value = d[chan.pointer];
                      else value = d[chan.dir - chan.pointer];

                    chan.ldata = value * chan.lvol;
                    chan.rdata = value * chan.rvol;
                  } else {
                    chan.ldata = 0.0;
                    chan.rdata = 0.0;
                  }
                }
                chan.index = chan.pointer + chan.delta;

                if ((chan.fraction += chan.speed) >= 1.0) {
                  chan.index++;
                  chan.fraction--;
                }
                sample.l += chan.ldata;
                sample.r += chan.rdata;
                sample = sample.next;
              }
              chan = chan.next;
            }

            mixPos = mixLen;
            mixed += toMix;
            this.samplesLeft -= toMix;
          }

          sample = this.buffer[0];
          ldata = e.outputBuffer.getChannelData(0);
          rdata = e.outputBuffer.getChannelData(1);

          for (i = 0; i < size; ++i) {
            if (sample.l > 1.0) sample.l = 1.0;
              else if (sample.l < -1.0) sample.l = -1.0;

            if (sample.r > 1.0) sample.r = 1.0;
              else if (sample.r < -1.0) sample.r = -1.0;

            ldata[i] = sample.l;
            rdata[i] = sample.r;

            sample.l = sample.r = 0.0;
            sample = sample.next;
          }
      }},
      accurate: {
        value: function(e) {
          var chan, d1, d2, ldata, delta, i, mixed = 0, mixLen, mixPos = 0, mixValue, rdata, s1, s2, sample, size = this.bufferSize, toMix, value;

          if (this.completed) {
            if (!this.remains) {
              this.player.stop();
              return;
            }
            size = this.remains;
          }

          while (mixed < size) {
            if (!this.samplesLeft) {
              this.player.process();
              this.player.accurate();
              this.samplesLeft = this.samplesTick;

              if (this.completed) {
                size = mixed + this.samplesTick;

                if (size > this.bufferSize) {
                  this.remains = size - this.bufferSize;
                  size = this.bufferSize;
                }
              }
            }

            toMix = this.samplesLeft;
            if ((mixed + toMix) >= size) toMix = size - mixed;
            mixLen = mixPos + toMix;
            chan = this.channels[0];

            while (chan) {
              if (!chan.enabled) {
                chan = chan.next;
                continue;
              }

              s1 = chan.sample;
              d1 = s1.data;
              s2 = chan.oldSample;
              if (s2) d2 = s2.data;

              sample = this.buffer[mixPos];

              for (i = mixPos; i < mixLen; ++i) {
                value = chan.mute ? 0.0 : d1[chan.pointer];
                value += (d1[chan.pointer + chan.dir] - value) * chan.fraction;

                if ((chan.fraction += chan.speed) >= 1.0) {
                  delta = chan.fraction >> 0;
                  chan.fraction -= delta;

                  if (chan.dir > 0) {
                    chan.pointer += delta;

                    if (chan.pointer > chan.length) {
                      chan.fraction += chan.pointer - chan.length;
                      chan.pointer = chan.length;
                    }
                  } else {
                    chan.pointer -= delta;

                    if (chan.pointer < chan.length) {
                      chan.fraction += chan.length - chan.pointer;
                      chan.pointer = chan.length;
                    }
                  }
                }

                if (!chan.mixCounter) {
                  sample.l += value * chan.lvol;
                  sample.r += value * chan.rvol;

                  if (chan.volCounter) {
                    chan.lvol += chan.lvolDelta;
                    chan.rvol += chan.rvolDelta;
                    chan.volCounter--;
                  } else if (chan.panCounter) {
                    chan.lpan += chan.lpanDelta;
                    chan.rpan += chan.rpanDelta;
                    chan.panCounter--;

                    chan.lvol = chan.volume * chan.lpan;
                    chan.rvol = chan.volume * chan.rpan;
                  }
                } else {
                  if (s2) {
                    mixValue = chan.mute ? 0.0 : d2[chan.oldPointer];
                    mixValue += (d2[chan.oldPointer + chan.oldDir] - mixValue) * chan.oldFraction;

                    if ((chan.oldFraction += chan.oldSpeed) > 1) {
                      delta = chan.oldFraction >> 0;
                      chan.oldFraction -= delta;

                      if (chan.oldDir > 0) {
                        chan.oldPointer += delta;

                        if (chan.oldPointer > chan.oldLength) {
                          chan.oldFraction += chan.oldPointer - chan.oldLength;
                          chan.oldPointer = chan.oldLength;
                        }
                      } else {
                        chan.oldPointer -= delta;

                        if (chan.oldPointer < chan.oldLength) {
                          chan.oldFraction += chan.oldLength - chan.oldPointer;
                          chan.oldPointer = chan.oldLength;
                        }
                      }
                    }
                    sample.l += (value * chan.lmixRampU) + (mixValue * chan.lmixRampD);
                    sample.r += (value * chan.rmixRampU) + (mixValue * chan.rmixRampD);

                    chan.lmixRampD -= chan.lmixDeltaD;
                    chan.rmixRampD -= chan.rmixDeltaD;
                  } else {
                    sample.l += (value * chan.lmixRampU);
                    sample.r += (value * chan.rmixRampU);
                  }

                  chan.lmixRampU += chan.lmixDeltaU;
                  chan.rmixRampU += chan.rmixDeltaU;
                  chan.mixCounter--;

                  if (chan.oldPointer == chan.oldLength) {
                    if (!s2.loopMode) {
                      s2 = null;
                      chan.oldPointer = 0;
                    } else if (s2.loopMode == 1) {
                      chan.oldPointer = s2.loopStart;
                      chan.oldLength  = s2.length;
                    } else {
                      if (chan.oldDir > 0) {
                        chan.oldPointer = s2.length - 1;
                        chan.oldLength  = s2.loopStart;
                        chan.oldDir     = -1;
                      } else {
                        chan.oldFraction -= 1;
                        chan.oldPointer   = s2.loopStart;
                        chan.oldLength    = s2.length;
                        chan.oldDir       = 1;
                      }
                    }
                  }
                }

                if (chan.pointer == chan.length) {
                  if (!s1.loopMode) {
                    chan.enabled = 0;
                    break;
                  } else if (s1.loopMode == 1) {
                    chan.pointer = s1.loopStart;
                    chan.length  = s1.length;
                  } else {
                    if (chan.dir > 0) {
                      chan.pointer = s1.length - 1;
                      chan.length  = s1.loopStart;
                      chan.dir     = -1;
                    } else {
                      chan.fraction -= 1;
                      chan.pointer   = s1.loopStart;
                      chan.length    = s1.length;
                      chan.dir       = 1;
                    }
                  }
                }
                sample = sample.next;
              }
              chan = chan.next;
            }

            mixPos = mixLen;
            mixed += toMix;
            this.samplesLeft -= toMix;
          }

          sample = this.buffer[0];
          ldata = e.outputBuffer.getChannelData(0);
          rdata = e.outputBuffer.getChannelData(1);

          for (i = 0; i < size; ++i) {
            if (sample.l > 1.0) sample.l = 1.0;
              else if (sample.l < -1.0) sample.l = -1.0;

            if (sample.r > 1.0) sample.r = 1.0;
              else if (sample.r < -1.0) sample.r = -1.0;

            ldata[i] = sample.l;
            rdata[i] = sample.r;

            sample.l = sample.r = 0.0;
            sample = sample.next;
          }
      }}
    });

    o.bufferSize = 8192;
    return Object.seal(o);
  }
  function SBPlayer(mixer) {
    var o = CorePlayer();

    Object.defineProperties(o, {
      track   : { value:null, writable:true },
      length  : { value:0,    writable:true },
      restart : { value:0,    writable:true },
      timer   : { value:0,    writable:true },
      master  : { value:0,    writable:true },

      volume: {
        set: function(value) {
          if (value < 0.0) value = 0.0;
            else if (value > 1.0) value = 1.0;

          this.master = value * 64;
      }},

      setup: {
        configurable:false,
        value: function() {
          this.mixer.setup(this.channels);
      }}
    });

    o.mixer = mixer || Soundblaster();
    o.mixer.player = o;

    o.endian  = 1;
    o.quality = 1;
    return o;
  }


  (function() {
    function FileLoader() {
      var o = Object.create(null, {
        player : { value:null, writable:true },
        index  : { value:0,    writable:true },
        amiga  : { value:null, writable:true },
        mixer  : { value:null, writable:true },

        tracker: {
          get: function() {
            return (this.player) ? TRACKERS[this.index + this.player.version] : TRACKERS[0];
        }},

        load: {
          value: function(stream) {
            var archive, id, value;
            if (!stream.view) stream = ByteArray(stream);
            stream.endian = 1;
            stream.position = 0;

            if (stream.readUint() == 67324752) {
              if (window.neoart.Unzip) {
                archive = ZipFile(stream);
                stream = archive.uncompress(archive.entries[0]);
              } else {
                throw "Unzip support is not available.";
              }
            }

            if (!stream) return null;

            if (this.player && this.player.id != "STPlayer") {
              this.player.load(stream);
              if (this.player.version) return player;
            }

            if (stream.length > 336) {
              stream.position = 38;
              id = stream.readString(20);

              if (id == "FastTracker v2.00   " ||
                  id == "FastTracker v 2.00  " ||
                  id == "Sk@le Tracker"        ||
                  id == "MadTracker 2.0"       ||
                  id == "MilkyTracker        " ||
                  id == "DigiBooster Pro 2.18" ||
                  id.indexOf("OpenMPT") != -1) {

                this.player = window.neoart.F2Player(this.mixer);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = FASTTRACKER;
                  return this.player;
                }
              }
            }

            stream.endian = 0;

            if (stream.length > 2105) {
              stream.position = 1080;
              id = stream.readString(4);

              if (id == "M.K." || id == "FLT4") {
                this.player = window.neoart.MKPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = NOISETRACKER;
                  return this.player;
                }
              } else if (id == "FEST") {
                this.player = window.neoart.HMPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = HISMASTER;
                  return this.player;
                }
              }
            }

            if (stream.length > 2105) {
              stream.position = 1080;
              id = stream.readString(4);

              if (id == "M.K." || id == "M!K!") {
                this.player = window.neoart.PTPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = PROTRACKER;
                  return this.player;
                }
              }
            }

            if (stream.length > 1685) {
              stream.position = 60;
              id = stream.readString(4);

              if (id != "SONG") {
                stream.position = 124;
                id = stream.readString(4);
              }

              if (id == "SONG" || id == "SO31") {
                this.player = window.neoart.FXPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = SOUNDFX;
                  return this.player;
                }
              }
            }

            if (stream.length > 4) {
              stream.position = 0;
              id = stream.readString(4);

              if (id == "ALL ") {
                this.player = window.neoart.D1Player(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = DELTAMUSIC;
                  return this.player;
                }
              }
            }

            if (stream.length > 3018) {
              stream.position = 3014;
              id = stream.readString(4);

              if (id == ".FNL") {
                this.player = window.neoart.D2Player(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = DELTAMUSIC;
                  return this.player;
                }
              }
            }

            if (stream.length > 30) {
              stream.position = 26;
              id = stream.readString(3);

              if (id == "BPS" || id == "V.2" || id == "V.3") {
                this.player = window.neoart.BPPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = BPSOUNDMON;
                  return this.player;
                }
              }
            }

            if (stream.length > 4) {
              stream.position = 0;
              id = stream.readString(4);

              if (id == "SMOD" || id == "FC14") {
                this.player = window.neoart.FCPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = FUTURECOMP;
                  return this.player;
                }
              }
            }

            if (stream.length > 10) {
              stream.position = 0;
              id = stream.readString(9);

              if (id == " MUGICIAN") {
                this.player = window.neoart.DMPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = DIGITALMUG;
                  return this.player;
                }
              }
            }

            if (stream.length > 86) {
              stream.position = 58;
              id = stream.readString(28);

              if (id == "SIDMON II - THE MIDI VERSION") {
                this.player = window.neoart.S2Player(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = SIDMON;
                  return this.player;
                }
              }
            }

            if (stream.length > 2830) {
              stream.position = 0;
              value = stream.readUshort();

              if (value == 0x4efa) {
                this.player = window.neoart.FEPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = FREDED;
                  return this.player;
                }
              }
            }

            if (stream.length > 5220) {
              this.player = window.neoart.S1Player(this.amiga);
              this.player.load(stream);

              if (this.player.version) {
                this.index = SIDMON;
                return this.player;
              }
            }

            stream.position = 0;
            value = stream.readUshort();
            stream.position = 0;
            id = stream.readString(4);

            if (id == "COSO" || value == 0x6000 || value == 0x6002 || value == 0x600e || value == 0x6016) {
              this.player = window.neoart.JHPlayer(this.amiga);
              this.player.load(stream);

              if (this.player.version) {
                this.index = HIPPEL;
                return this.player;
              }
            }

            stream.position = 0;
            value = stream.readUshort();

            this.player = window.neoart.DWPlayer(this.amiga);
            this.player.load(stream);

            if (this.player.version) {
              this.index = WHITTAKER;
              return this.player;
            }

            stream.position = 0;
            value = stream.readUshort();

            if (value == 0x6000) {
              this.player = window.neoart.RHPlayer(this.amiga);
              this.player.load(stream);

              if (this.player.version) {
                this.index = HUBBARD;
                return this.player;
              }
            }

            if (stream.length > 1625) {
              this.player = window.neoart.STPlayer(this.amiga);
              this.player.load(stream);

              if (this.player.version) {
                this.index = SOUNDTRACKER;
                return this.player;
              }
            }

            stream.clear();
            this.index = 0;
            return this.player = null;
        }}
      });

      o.amiga = Amiga();
      return Object.seal(o);
    }

    var SOUNDTRACKER = 0,
        NOISETRACKER = 4,
        PROTRACKER   = 9,
        HISMASTER    = 12,
        SOUNDFX      = 13,
        BPSOUNDMON   = 17,
        DELTAMUSIC   = 20,
        DIGITALMUG   = 22,
        FUTURECOMP   = 24,
        SIDMON       = 26,
        WHITTAKER    = 28,
        FREDED       = 29,
        HIPPEL       = 30,
        HUBBARD      = 32,
        FASTTRACKER  = 33,

        TRACKERS = [
          "Unknown Format",
          "Ultimate SoundTracker",
          "D.O.C. SoundTracker 9",
          "Master SoundTracker",
          "D.O.C. SoundTracker 2.0/2.2",
          "SoundTracker 2.3",
          "SoundTracker 2.4",
          "NoiseTracker 1.0",
          "NoiseTracker 1.1",
          "NoiseTracker 2.0",
          "ProTracker 1.0",
          "ProTracker 1.1/2.1",
          "ProTracker 1.2/2.0",
          "His Master's NoiseTracker",
          "SoundFX 1.0/1.7",
          "SoundFX 1.8",
          "SoundFX 1.945",
          "SoundFX 1.994/2.0",
          "BP SoundMon V1",
          "BP SoundMon V2",
          "BP SoundMon V3",
          "Delta Music 1.0",
          "Delta Music 2.0",
          "Digital Mugician",
          "Digital Mugician 7 Voices",
          "Future Composer 1.0/1.3",
          "Future Composer 1.4",
          "SidMon 1.0",
          "SidMon 2.0",
          "David Whittaker",
          "FredEd",
          "Jochen Hippel",
          "Jochen Hippel COSO",
          "Rob Hubbard",
          "FastTracker II",
          "Sk@leTracker",
          "MadTracker 2.0",
          "MilkyTracker",
          "DigiBooster Pro 2.18",
          "OpenMPT"];

    window.neoart.FileLoader = FileLoader();
  })();


  (function() {
    function BPVoice(idx) {
      return Object.create(null, {
        index        : { value:idx,  writable:true },
        next         : { value:null, writable:true },
        channel      : { value:null, writable:true },
        enabled      : { value:0,    writable:true },
        restart      : { value:0,    writable:true },
        note         : { value:0,    writable:true },
        period       : { value:0,    writable:true },
        sample       : { value:0,    writable:true },
        samplePtr    : { value:0,    writable:true },
        sampleLen    : { value:0,    writable:true },
        synth        : { value:0,    writable:true },
        synthPtr     : { value:0,    writable:true },
        arpeggio     : { value:0,    writable:true },
        autoArpeggio : { value:0,    writable:true },
        autoSlide    : { value:0,    writable:true },
        vibrato      : { value:0,    writable:true },
        volume       : { value:0,    writable:true },
        volumeDef    : { value:0,    writable:true },
        adsrControl  : { value:0,    writable:true },
        adsrPtr      : { value:0,    writable:true },
        adsrCtr      : { value:0,    writable:true },
        lfoControl   : { value:0,    writable:true },
        lfoPtr       : { value:0,    writable:true },
        lfoCtr       : { value:0,    writable:true },
        egControl    : { value:0,    writable:true },
        egPtr        : { value:0,    writable:true },
        egCtr        : { value:0,    writable:true },
        egValue      : { value:0,    writable:true },
        fxControl    : { value:0,    writable:true },
        fxCtr        : { value:0,    writable:true },
        modControl   : { value:0,    writable:true },
        modPtr       : { value:0,    writable:true },
        modCtr       : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel      =  null,
            this.enabled      =  0;
            this.restart      =  0;
            this.note         =  0;
            this.period       =  0;
            this.sample       =  0;
            this.samplePtr    =  0;
            this.sampleLen    =  2;
            this.synth        =  0;
            this.synthPtr     = -1;
            this.arpeggio     =  0;
            this.autoArpeggio =  0;
            this.autoSlide    =  0;
            this.vibrato      =  0;
            this.volume       =  0;
            this.volumeDef    =  0;
            this.adsrControl  =  0;
            this.adsrPtr      =  0;
            this.adsrCtr      =  0;
            this.lfoControl   =  0;
            this.lfoPtr       =  0;
            this.lfoCtr       =  0;
            this.egControl    =  0;
            this.egPtr        =  0;
            this.egCtr        =  0;
            this.egValue      =  0;
            this.fxControl    =  0;
            this.fxCtr        =  0;
            this.modControl   =  0;
            this.modPtr       =  0;
            this.modCtr       =  0;
        }}
      });
    }
    function BPSample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        synth       : { value:0, writable:true },
        table       : { value:0, writable:true },
        adsrControl : { value:0, writable:true },
        adsrTable   : { value:0, writable:true },
        adsrLen     : { value:0, writable:true },
        adsrSpeed   : { value:0, writable:true },
        lfoControl  : { value:0, writable:true },
        lfoTable    : { value:0, writable:true },
        lfoDepth    : { value:0, writable:true },
        lfoLen      : { value:0, writable:true },
        lfoDelay    : { value:0, writable:true },
        lfoSpeed    : { value:0, writable:true },
        egControl   : { value:0, writable:true },
        egTable     : { value:0, writable:true },
        egLen       : { value:0, writable:true },
        egDelay     : { value:0, writable:true },
        egSpeed     : { value:0, writable:true },
        fxControl   : { value:0, writable:true },
        fxDelay     : { value:0, writable:true },
        fxSpeed     : { value:0, writable:true },
        modControl  : { value:0, writable:true },
        modTable    : { value:0, writable:true },
        modLen      : { value:0, writable:true },
        modDelay    : { value:0, writable:true },
        modSpeed    : { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function BPStep() {
      var o = AmigaStep();

      Object.defineProperties(o, {
        soundTranspose: { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function BPPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id          : { value:"BPPlayer" },
        tracks      : { value:[],   writable:true },
        patterns    : { value:[],   writable:true },
        samples     : { value:[],   writable:true },
        length      : { value:0,    writable:true },
        buffer      : { value:null, writable:true },
        voices      : { value:[],   writable:true },
        trackPos    : { value:0,    writable:true },
        patternPos  : { value:0,    writable:true },
        nextPos     : { value:0,    writable:true },
        jumpFlag    : { value:0,    writable:true },
        repeatCtr   : { value:0,    writable:true },
        arpeggioCtr : { value:0,    writable:true },
        vibratoPos  : { value:0,    writable:true },

        initialize: {
          value: function() {
            var i, len, pos, voice = this.voices[0];
            this.reset();

            this.speed       = 6;
            this.tick        = 1;
            this.trackPos    = 0;
            this.patternPos  = 0;
            this.nextPos     = 0;
            this.jumpFlag    = 0;
            this.repeatCtr   = 0;
            this.arpeggioCtr = 1;
            this.vibratoPos  = 0;

            for (i = 0; i < 128; ++i) this.buffer[i] = 0;

            while (voice) {
              voice.initialize();
              voice.channel   = this.mixer.channels[voice.index];
              voice.samplePtr = this.mixer.loopPtr;
              voice = voice.next;
            }
        }},
        restore: {
          value: function() {
            var i, len, pos, voice = this.voices[0];

            while (voice) {
              if (voice.synthPtr > -1) {
                pos = voice.index << 5;
                len = voice.synthPtr + 32;

                for (i = voice.synthPtr; i < len; ++i)
                  this.mixer.memory[i] = this.buffer[pos++];
              }

              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var higher = 0, i = 0, id, len, row, sample, step, tables;
            this.title = stream.readString(26);

            id = stream.readString(4);
            if (id == "BPSM") {
              this.version = BPSOUNDMON_V1;
            } else {
              id = id.substr(0, 3);
              if (id == "V.2") this.version = BPSOUNDMON_V2;
                else if (id == "V.3") this.version = BPSOUNDMON_V3;
                  else return;

              stream.position = 29;
              tables = stream.readUbyte();
            }

            this.length = stream.readUshort();

            for (; ++i < 16;) {
              sample = BPSample();

              if (stream.readUbyte() == 0xff) {
                sample.synth   = 1;
                sample.table   = stream.readUbyte();
                sample.pointer = sample.table << 6;
                sample.length  = stream.readUshort() << 1;

                sample.adsrControl = stream.readUbyte();
                sample.adsrTable   = stream.readUbyte() << 6;
                sample.adsrLen     = stream.readUshort();
                sample.adsrSpeed   = stream.readUbyte();
                sample.lfoControl  = stream.readUbyte();
                sample.lfoTable    = stream.readUbyte() << 6;
                sample.lfoDepth    = stream.readUbyte();
                sample.lfoLen      = stream.readUshort();

                if (this.version < BPSOUNDMON_V3) {
                  stream.readByte();
                  sample.lfoDelay  = stream.readUbyte();
                  sample.lfoSpeed  = stream.readUbyte();
                  sample.egControl = stream.readUbyte();
                  sample.egTable   = stream.readUbyte() << 6;
                  stream.readByte();
                  sample.egLen     = stream.readUshort();
                  stream.readByte();
                  sample.egDelay   = stream.readUbyte();
                  sample.egSpeed   = stream.readUbyte();
                  sample.fxSpeed   = 1;
                  sample.modSpeed  = 1;
                  sample.volume    = stream.readUbyte();
                  stream.position += 6;
                } else {
                  sample.lfoDelay   = stream.readUbyte();
                  sample.lfoSpeed   = stream.readUbyte();
                  sample.egControl  = stream.readUbyte();
                  sample.egTable    = stream.readUbyte() << 6;
                  sample.egLen      = stream.readUshort();
                  sample.egDelay    = stream.readUbyte();
                  sample.egSpeed    = stream.readUbyte();
                  sample.fxControl  = stream.readUbyte();
                  sample.fxSpeed    = stream.readUbyte();
                  sample.fxDelay    = stream.readUbyte();
                  sample.modControl = stream.readUbyte();
                  sample.modTable   = stream.readUbyte() << 6;
                  sample.modSpeed   = stream.readUbyte();
                  sample.modDelay   = stream.readUbyte();
                  sample.volume     = stream.readUbyte();
                  sample.modLen     = stream.readUshort();
                }
              } else {
                stream.position--;
                sample.synth  = 0;
                sample.name   = stream.readString(24);
                sample.length = stream.readUshort() << 1;

                if (sample.length) {
                  sample.loop   = stream.readUshort();
                  sample.repeat = stream.readUshort() << 1;
                  sample.volume = stream.readUshort();

                  if ((sample.loop + sample.repeat) >= sample.length)
                    sample.repeat = sample.length - sample.loop;
                } else {
                  sample.pointer--;
                  sample.repeat = 2;
                  stream.position += 6;
                }
              }
              this.samples[i] = sample;
            }

            len = this.length << 2;
            this.tracks.length = len;

            for (i = 0; i < len; ++i) {
              step = BPStep();
              step.pattern = stream.readUshort();
              step.soundTranspose = stream.readByte();
              step.transpose = stream.readByte();
              if (step.pattern > higher) higher = step.pattern;
              this.tracks[i] = step;
            }

            len = higher << 4;
            this.patterns.length = len;

            for (i = 0; i < len; ++i) {
              row = AmigaRow();
              row.note   = stream.readByte();
              row.sample = stream.readUbyte();
              row.effect = row.sample & 0x0f;
              row.sample = (row.sample & 0xf0) >> 4;
              row.param  = stream.readByte();
              this.patterns[i] = row;
            }

            this.mixer.store(stream, tables << 6);

            for (i = 0; ++i < 16;) {
              sample = this.samples[i];
              if (sample.synth || !sample.length) continue;
              sample.pointer = this.mixer.store(stream, sample.length);
              sample.loopPtr = sample.pointer + sample.loop;
            }
        }},
        process: {
          value: function() {
            var chan, data, dst, instr, len, memory = this.mixer.memory, note, option, row, sample, src, step, voice = this.voices[0];
            this.arpeggioCtr = --this.arpeggioCtr & 3;
            this.vibratoPos  = ++this.vibratoPos  & 7;

            while (voice) {
              chan = voice.channel;
              voice.period += voice.autoSlide;

              if (voice.vibrato) chan.period = voice.period + ((VIBRATO[this.vibratoPos] / voice.vibrato) >> 0);
                else chan.period = voice.period;

              chan.pointer = voice.samplePtr;
              chan.length  = voice.sampleLen;

              if (voice.arpeggio || voice.autoArpeggio) {
                note = voice.note;

                if (!this.arpeggioCtr)
                  note += ((voice.arpeggio & 0xf0) >> 4) + ((voice.autoArpeggio & 0xf0) >> 4);
                else if (this.arpeggioCtr == 1)
                  note += (voice.arpeggio & 0x0f) + (voice.autoArpeggio & 0x0f);

                chan.period = voice.period = PERIODS[note + 35];
                voice.restart = 0;
              }

              if (!voice.synth || voice.sample < 0) {
                voice = voice.next;
                continue;
              }
              sample = this.samples[voice.sample];

              if (voice.adsrControl) {
                if (--voice.adsrCtr == 0) {
                  voice.adsrCtr = sample.adsrSpeed;
                  data = (128 + memory[sample.adsrTable + voice.adsrPtr]) >> 2;
                  chan.volume = (data * voice.volume) >> 6;

                  if (++voice.adsrPtr == sample.adsrLen) {
                    voice.adsrPtr = 0;
                    if (voice.adsrControl == 1) voice.adsrControl = 0;
                  }
                }
              }

              if (voice.lfoControl) {
                if (--voice.lfoCtr == 0) {
                  voice.lfoCtr = sample.lfoSpeed;
                  data = memory[sample.lfoTable + voice.lfoPtr];
                  if (sample.lfoDepth) data = (data / sample.lfoDepth) >> 0;
                  chan.period = voice.period + data;

                  if (++voice.lfoPtr == sample.lfoLen) {
                    voice.lfoPtr = 0;
                    if (voice.lfoControl == 1) voice.lfoControl = 0;
                  }
                }
              }

              if (voice.synthPtr < 0) {
                voice = voice.next;
                continue;
              }

              if (voice.egControl) {
                if (--voice.egCtr == 0) {
                  voice.egCtr = sample.egSpeed;
                  data = voice.egValue;
                  voice.egValue = (128 + memory[sample.egTable + voice.egPtr]) >> 3;

                  if (voice.egValue != data) {
                    src = (voice.index << 5) + data;
                    dst = voice.synthPtr + data;

                    if (voice.egValue < data) {
                      data -= voice.egValue;
                      len = dst - data;
                      for (; dst > len;) memory[--dst] = this.buffer[--src];
                    } else {
                      data = voice.egValue - data;
                      len = dst + data;
                      for (; dst < len;) memory[dst++] = ~this.buffer[src++] + 1
                    }
                  }

                  if (++voice.egPtr == sample.egLen) {
                    voice.egPtr = 0;
                    if (voice.egControl == 1) voice.egControl = 0;
                  }
                }
              }

              switch (voice.fxControl) {
                case 0:
                  break;
                case 1:   //averaging
                  if (--voice.fxCtr == 0) {
                    voice.fxCtr = sample.fxSpeed;
                    dst = voice.synthPtr;
                    len = voice.synthPtr + 32;
                    data = dst > 0 ? memory[dst - 1] : 0;

                    for (; dst < len;) {
                      data = (data + memory[dst + 1]) >> 1;
                      memory[dst++] = data;
                    }
                  }
                  break;
                case 2:   //inversion
                  src = (voice.index << 5) + 31;
                  len = voice.synthPtr + 32;
                  data = sample.fxSpeed;

                  for (dst = voice.synthPtr; dst < len; ++dst) {
                    if (this.buffer[src] < memory[dst]) {
                      memory[dst] -= data;
                    } else if (this.buffer[src] > memory[dst]) {
                      memory[dst] += data;
                    }
                    src--;
                  }
                  break;
                case 3:   //backward inversion
                case 5:   //backward transform
                  src = voice.index << 5;
                  len = voice.synthPtr + 32;
                  data = sample.fxSpeed;

                  for (dst = voice.synthPtr; dst < len; ++dst) {
                    if (this.buffer[src] < memory[dst]) {
                      memory[dst] -= data;
                    } else if (this.buffer[src] > memory[dst]) {
                      memory[dst] += data;
                    }
                    src++;
                  }
                  break;
                case 4:   //transform
                  src = voice.synthPtr + 64;
                  len = voice.synthPtr + 32;
                  data = sample.fxSpeed;

                  for (dst = voice.synthPtr; dst < len; ++dst) {
                    if (memory[src] < memory[dst]) {
                      memory[dst] -= data;
                    } else if (memory[src] > memory[dst]) {
                      memory[dst] += data;
                    }
                    src++;
                  }
                  break;
                case 6:   //wave change
                  if (--voice.fxCtr == 0) {
                    voice.fxControl = 0;
                    voice.fxCtr = 1;
                    src = voice.synthPtr + 64;
                    len = voice.synthPtr + 32;
                    for (dst = voice.synthPtr; dst < len; ++dst) memory[dst] = memory[src++];
                  }
                  break;
              }

              if (voice.modControl) {
                if (--voice.modCtr == 0) {
                  voice.modCtr = sample.modSpeed;
                  memory[voice.synthPtr + 32] = memory[sample.modTable + voice.modPtr];

                  if (++voice.modPtr == sample.modLen) {
                    voice.modPtr = 0;
                    if (voice.modControl == 1) voice.modControl = 0;
                  }
                }
              }
              voice = voice.next;
            }

            if (--this.tick == 0) {
              this.tick = this.speed;
              voice = this.voices[0];

              while (voice) {
                chan = voice.channel;
                voice.enabled = 0;

                step   = this.tracks[(this.trackPos << 2) + voice.index];
                row    = this.patterns[this.patternPos + ((step.pattern - 1) << 4)];
                note   = row.note;
                option = row.effect;
                data   = row.param;

                if (note) {
                  voice.autoArpeggio = voice.autoSlide = voice.vibrato = 0;
                  if (option != 10 || (data & 0xf0) == 0) note += step.transpose;
                  voice.note = note;
                  voice.period = PERIODS[note + 35];

                  if (option < 13) voice.restart = voice.volumeDef = 1;
                    else voice.restart = 0;

                  instr = row.sample;
                  if (instr == 0) instr = voice.sample;
                  if (option != 10 || (data & 0x0f) == 0) instr += step.soundTranspose;

                  if (option < 13 && (!voice.synth || (voice.sample != instr))) {
                    voice.sample = instr;
                    voice.enabled = 1;
                  }
                }

                switch (option) {
                  case 0:   //arpeggio once
                    voice.arpeggio = data;
                    break;
                  case 1:   //set volume
                    voice.volume = data;
                    voice.volumeDef = 0;

                    if (this.version < BPSOUNDMON_V3 || !voice.synth)
                      chan.volume = voice.volume;
                    break;
                  case 2:   //set speed
                    this.tick = this.speed = data;
                    break;
                  case 3:   //set filter
                    this.mixer.filter.active = data;
                    break;
                  case 4:   //portamento up
                    voice.period -= data;
                    voice.arpeggio = 0;
                    break;
                  case 5:   //portamento down
                    voice.period += data;
                    voice.arpeggio = 0;
                    break;
                  case 6:   //set vibrato
                    if (this.version == BPSOUNDMON_V3) voice.vibrato = data;
                      else this.repeatCtr = data;
                    break;
                  case 7:   //step jump
                    if (this.version == BPSOUNDMON_V3) {
                      this.nextPos = data;
                      this.jumpFlag = 1;
                    } else if (this.repeatCtr == 0) {
                      this.trackPos = data;
                    }
                    break;
                  case 8:   //set auto slide
                    voice.autoSlide = data;
                    break;
                  case 9:   //set auto arpeggio
                    voice.autoArpeggio = data;
                    if (this.version == BPSOUNDMON_V3) {
                      voice.adsrPtr = 0;
                      if (voice.adsrControl == 0) voice.adsrControl = 1;
                    }
                    break;
                  case 11:  //change effect
                    voice.fxControl = data;
                    break;
                  case 13:  //change inversion
                    voice.autoArpeggio = data;
                    voice.fxControl ^= 1;
                    voice.adsrPtr = 0;
                    if (voice.adsrControl == 0) voice.adsrControl = 1;
                    break;
                  case 14:  //no eg reset
                    voice.autoArpeggio = data;
                    voice.adsrPtr = 0;
                    if (voice.adsrControl == 0) voice.adsrControl = 1;
                    break;
                  case 15:  //no eg and no adsr reset
                    voice.autoArpeggio = data;
                    break;
                }
                voice = voice.next;
              }

              if (this.jumpFlag) {
                this.trackPos   = this.nextPos;
                this.patternPos = this.jumpFlag = 0;
              } else if (++this.patternPos == 16) {
                this.patternPos = 0;

                if (++this.trackPos == this.length) {
                  this.trackPos = 0;
                  this.mixer.complete = 1;
                }
              }
              voice = this.voices[0];

              while (voice) {
                chan = voice.channel;
                if (voice.enabled) chan.enabled = voice.enabled = 0;
                if (voice.restart == 0) {
                  voice = voice.next;
                  continue;
                }

                if (voice.synthPtr > -1) {
                  src = voice.index << 5;
                  len = voice.synthPtr + 32;
                  for (dst = voice.synthPtr; dst < len; ++dst) memory[dst] = this.buffer[src++];
                  voice.synthPtr = -1;
                }
                voice = voice.next;
              }
              voice = this.voices[0];

              while (voice) {
                if (voice.restart == 0 || voice.sample < 0) {
                  voice = voice.next;
                  continue;
                }
                chan = voice.channel;

                chan.period = voice.period;
                voice.restart = 0;
                sample = this.samples[voice.sample];

                if (sample.synth) {
                  voice.synth   = 1;
                  voice.egValue = 0;
                  voice.adsrPtr = voice.lfoPtr = voice.egPtr = voice.modPtr = 0;

                  voice.adsrCtr = 1;
                  voice.lfoCtr  = sample.lfoDelay + 1;
                  voice.egCtr   = sample.egDelay  + 1;
                  voice.fxCtr   = sample.fxDelay  + 1;
                  voice.modCtr  = sample.modDelay + 1;

                  voice.adsrControl = sample.adsrControl;
                  voice.lfoControl  = sample.lfoControl;
                  voice.egControl   = sample.egControl;
                  voice.fxControl   = sample.fxControl;
                  voice.modControl  = sample.modControl;

                  chan.pointer = voice.samplePtr = sample.pointer;
                  chan.length  = voice.sampleLen = sample.length;

                  if (voice.adsrControl) {
                    data = (128 + memory[sample.adsrTable]) >> 2;

                    if (voice.volumeDef) {
                      voice.volume = sample.volume;
                      voice.volumeDef = 0;
                    }

                    chan.volume = (data * voice.volume) >> 6;
                  } else {
                    chan.volume = voice.volumeDef ? sample.volume : voice.volume;
                  }

                  if (voice.egControl || voice.fxControl || voice.modControl) {
                    voice.synthPtr = sample.pointer;
                    dst = voice.index << 5;
                    len = voice.synthPtr + 32;
                    for (src = voice.synthPtr; src < len; ++src) this.buffer[dst++] = memory[src];
                  }
                } else {
                  voice.synth = voice.lfoControl = 0;

                  if (sample.pointer < 0) {
                    voice.samplePtr = this.mixer.loopPtr;
                    voice.sampleLen = 2;
                  } else {
                    chan.pointer = sample.pointer;
                    chan.volume  = voice.volumeDef ? sample.volume : voice.volume;

                    if (sample.repeat != 2) {
                      voice.samplePtr = sample.loopPtr;
                      chan.length = voice.sampleLen = sample.repeat;
                    } else {
                      voice.samplePtr = this.mixer.loopPtr;
                      voice.sampleLen = 2;
                      chan.length = sample.length;
                    }
                  }
                }
                chan.enabled = voice.enabled = 1;
                voice = voice.next;
              }
            }
        }}
      });

      o.voices[0] = BPVoice(0);
      o.voices[0].next = o.voices[1] = BPVoice(1);
      o.voices[1].next = o.voices[2] = BPVoice(2);
      o.voices[2].next = o.voices[3] = BPVoice(3);

      o.buffer = new Int8Array(128);
      return Object.seal(o);
    }

    var BPSOUNDMON_V1 = 1,
        BPSOUNDMON_V2 = 2,
        BPSOUNDMON_V3 = 3,

        PERIODS = [
          6848,6464,6080,5760,5440,5120,4832,4576,4320,4064,3840,3616,
          3424,3232,3040,2880,2720,2560,2416,2288,2160,2032,1920,1808,
          1712,1616,1520,1440,1360,1280,1208,1144,1080,1016, 960, 904,
           856, 808, 760, 720, 680, 640, 604, 572, 540, 508, 480, 452,
           428, 404, 380, 360, 340, 320, 302, 286, 270, 254, 240, 226,
           214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120, 113,
           107, 101,  95,  90,  85,  80,  76,  72,  68,  64,  60,  57],

        VIBRATO = [0,64,128,64,0,-64,-128,-64];

    window.neoart.BPPlayer = BPPlayer;
  })();


  (function() {
    function D1Voice(idx) {
      return Object.create(null, {
        index         : { value:idx,  writable:true },
        next          : { value:null, writable:true },
        channel        : { value:null, writable:true },
        sample        : { value:null, writable:true },
        trackPos      : { value:0,    writable:true },
        patternPos    : { value:0,    writable:true },
        status        : { value:0,    writable:true },
        speed         : { value:0,    writable:true },
        step          : { value:null, writable:true },
        row           : { value:null, writable:true },
        note          : { value:0,    writable:true },
        period        : { value:0,    writable:true },
        arpeggioPos   : { value:0,    writable:true },
        pitchBend     : { value:0,    writable:true },
        tableCtr      : { value:0,    writable:true },
        tablePos      : { value:0,    writable:true },
        vibratoCtr    : { value:0,    writable:true },
        vibratoDir    : { value:0,    writable:true },
        vibratoPos    : { value:0,    writable:true },
        vibratoPeriod : { value:0,    writable:true },
        volume        : { value:0,    writable:true },
        attackCtr     : { value:0,    writable:true },
        decayCtr      : { value:0,    writable:true },
        releaseCtr    : { value:0,    writable:true },
        sustain       : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.sample        = null;
            this.trackPos      = 0;
            this.patternPos    = 0;
            this.status        = 0;
            this.speed         = 1;
            this.step          = null;
            this.row           = null;
            this.note          = 0;
            this.period        = 0;
            this.arpeggioPos   = 0;
            this.pitchBend     = 0;
            this.tableCtr      = 0;
            this.tablePos      = 0;
            this.vibratoCtr    = 0;
            this.vibratoDir    = 0;
            this.vibratoPos    = 0;
            this.vibratoPeriod = 0;
            this.volume        = 0;
            this.attackCtr     = 0;
            this.decayCtr      = 0;
            this.releaseCtr    = 0;
            this.sustain       = 1;
        }}
      });
    }
    function D1Sample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        synth        : { value:0,    writable:true },
        attackStep   : { value:0,    writable:true },
        attackDelay  : { value:0,    writable:true },
        decayStep    : { value:0,    writable:true },
        decayDelay   : { value:0,    writable:true },
        releaseStep  : { value:0,    writable:true },
        releaseDelay : { value:0,    writable:true },
        sustain      : { value:0,    writable:true },
        arpeggio     : { value:null, writable:true },
        pitchBend    : { value:0,    writable:true },
        portamento   : { value:0,    writable:true },
        table        : { value:null, writable:true },
        tableDelay   : { value:0,    writable:true },
        vibratoWait  : { value:0,    writable:true },
        vibratoStep  : { value:0,    writable:true },
        vibratoLen   : { value:0,    writable:true }
      });

      o.arpeggio = new Int8Array(8);
      o.table    = new Int8Array(48);
      return Object.seal(o);
    }
    function D1Player(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id         : { value:"D1Player" },
        pointers   : { value:null, writable:true },
        tracks     : { value:[],   writable:true },
        patterns   : { value:[],   writable:true },
        samples    : { value:[],   writable:true },
        voices     : { value:[],   writable:true },

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();

            this.speed = 6;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[20];
              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var data, i = 0, id, index, j = 0, len, position, row, sample, step, value;
            id = stream.readString(4);
            if (id != "ALL ") return;

            position = 104;
            data = new Uint32Array(25);
            for (; i < 25; ++i) data[i] = stream.readUint();

            this.pointers = new Uint32Array(4);
            for (i = 1; i < 4; ++i)
              this.pointers[i] = this.pointers[j] + (data[j++] >> 1) - 1;

            len = this.pointers[3] + (data[3] >> 1) - 1;
            this.tracks.length = len;
            index = position + data[1] - 2;
            stream.position = position;
            j = 1;

            for (i = 0; i < len; ++i) {
              step  = AmigaStep();
              value = stream.readUshort();

              if (value == 0xffff || stream.position == index) {
                step.pattern   = -1;
                step.transpose = stream.readUshort();
                index += data[j++];
              } else {
                stream.position--;
                step.pattern   = ((value >> 2) & 0x3fc0) >> 2;
                step.transpose = stream.readByte();
              }
              this.tracks[i] = step;
            }

            len = data[4] >> 2;
            this.patterns.length = len;

            for (i = 0; i < len; ++i) {
              row = AmigaRow();
              row.sample = stream.readUbyte();
              row.note   = stream.readUbyte();
              row.effect = stream.readUbyte() & 31;
              row.param  = stream.readUbyte();
              this.patterns[i] = row;
            }

            index = 5;

            for (i = 0; i < 20; ++i) {
              this.samples[i] = null;

              if (data[index] != 0) {
                sample = D1Sample();
                sample.attackStep   = stream.readUbyte();
                sample.attackDelay  = stream.readUbyte();
                sample.decayStep    = stream.readUbyte();
                sample.decayDelay   = stream.readUbyte();
                sample.sustain      = stream.readUshort();
                sample.releaseStep  = stream.readUbyte();
                sample.releaseDelay = stream.readUbyte();
                sample.volume       = stream.readUbyte();
                sample.vibratoWait  = stream.readUbyte();
                sample.vibratoStep  = stream.readUbyte();
                sample.vibratoLen   = stream.readUbyte();
                sample.pitchBend    = stream.readByte();
                sample.portamento   = stream.readUbyte();
                sample.synth        = stream.readUbyte();
                sample.tableDelay   = stream.readUbyte();

                for (j = 0; j < 8; ++j)
                  sample.arpeggio[j] = stream.readByte();

                sample.length = stream.readUshort();
                sample.loop   = stream.readUshort();
                sample.repeat = stream.readUshort() << 1;
                sample.synth  = sample.synth ? 0 : 1;

                if (sample.synth) {
                  for (j = 0; j < 48; ++j)
                    sample.table[j] = stream.readByte();

                  len = data[index] - 78;
                } else {
                  len = sample.length;
                }

                sample.pointer = this.mixer.store(stream, len);
                sample.loopPtr = sample.pointer + sample.loop;
                this.samples[i] = sample;
              }
              index++;
            }

            sample = D1Sample();
            sample.pointer = sample.loopPtr = this.mixer.memory.length;
            sample.length  = sample.repeat  = 2;
            this.samples[20] = sample;
            this.version = 1;
        }},
        process: {
          value: function() {
            var adsr, chan, loop, row, sample, value, voice = this.voices[0];

            while (voice) {
              chan = voice.channel;

              if (--voice.speed == 0) {
                voice.speed = this.speed;

                if (voice.patternPos == 0) {
                  voice.step = this.tracks[this.pointers[voice.index] + voice.trackPos];

                  if (voice.step.pattern < 0) {
                    voice.trackPos = voice.step.transpose;
                    voice.step = this.tracks[this.pointers[voice.index] + voice.trackPos];
                  }
                  voice.trackPos++;
                }

                row = this.patterns[voice.step.pattern + voice.patternPos];
                if (row.effect) voice.row = row;

                if (row.note) {
                  chan.enabled = 0;
                  voice.row = row;
                  voice.note = row.note + voice.step.transpose;
                  voice.arpeggioPos = voice.pitchBend = voice.status = 0;

                  sample = voice.sample = this.samples[row.sample];
                  if (!sample.synth) chan.pointer = sample.pointer;
                  chan.length = sample.length;

                  voice.tableCtr   = voice.tablePos = 0;
                  voice.vibratoCtr = sample.vibratoWait;
                  voice.vibratoPos = sample.vibratoLen;
                  voice.vibratoDir = sample.vibratoLen << 1;
                  voice.volume     = voice.attackCtr = voice.decayCtr = voice.releaseCtr = 0;
                  voice.sustain    = sample.sustain;
                }
                if (++voice.patternPos == 16) voice.patternPos = 0;
              }
              sample = voice.sample;

              if (sample.synth) {
                if (voice.tableCtr == 0) {
                  voice.tableCtr = sample.tableDelay;

                  do {
                    loop = 1;
                    if (voice.tablePos >= 48) voice.tablePos = 0;
                    value = sample.table[voice.tablePos];
                    voice.tablePos++;

                    if (value >= 0) {
                      chan.pointer = sample.pointer + (value << 5);
                      loop = 0;
                    } else if (value != -1) {
                      sample.tableDelay = value & 127;
                    } else {
                      voice.tablePos = sample.table[voice.tablePos];
                    }
                  } while (loop);
                } else
                  voice.tableCtr--;
              }

              if (sample.portamento) {
                value = PERIODS[voice.note] + voice.pitchBend;

                if (voice.period != 0) {
                  if (voice.period < value) {
                    voice.period += sample.portamento;
                    if (voice.period > value) voice.period = value;
                  } else {
                    voice.period -= sample.portamento;
                    if (voice.period < value) voice.period = value;
                  }
                } else
                  voice.period = value;
              }

              if (voice.vibratoCtr == 0) {
                voice.vibratoPeriod = voice.vibratoPos * sample.vibratoStep;

                if ((voice.status & 1) == 0) {
                  voice.vibratoPos++;
                  if (voice.vibratoPos == voice.vibratoDir) voice.status ^= 1;
                } else {
                  voice.vibratoPos--;
                  if (voice.vibratoPos == 0) voice.status ^= 1;
                }
              } else {
                voice.vibratoCtr--;
              }

              if (sample.pitchBend < 0) voice.pitchBend += sample.pitchBend;
                else voice.pitchBend -= sample.pitchBend;

              if (voice.row) {
                row = voice.row;

                switch (row.effect) {
                  case 0:
                    break;
                  case 1:
                    value = row.param & 15;
                    if (value) this.speed = value;
                    break;
                  case 2:
                    voice.pitchBend -= row.param;
                    break;
                  case 3:
                    voice.pitchBend += row.param;
                    break;
                  case 4:
                    this.mixer.filter.active = row.param;
                    break;
                  case 5:
                    sample.vibratoWait = row.param;
                    break;
                  case 6:
                    sample.vibratoStep = row.param;
                  case 7:
                    sample.vibratoLen = row.param;
                    break;
                  case 8:
                    sample.pitchBend = row.param;
                    break;
                  case 9:
                    sample.portamento = row.param;
                    break;
                  case 10:
                    value = row.param;
                    if (value > 64) value = 64;
                    sample.volume = 64;
                    break;
                  case 11:
                    sample.arpeggio[0] = row.param;
                    break;
                  case 12:
                    sample.arpeggio[1] = row.param;
                    break;
                  case 13:
                    sample.arpeggio[2] = row.param;
                    break;
                  case 14:
                    sample.arpeggio[3] = row.param;
                    break;
                  case 15:
                    sample.arpeggio[4] = row.param;
                    break;
                  case 16:
                    sample.arpeggio[5] = row.param;
                    break;
                  case 17:
                    sample.arpeggio[6] = row.param;
                    break;
                  case 18:
                    sample.arpeggio[7] = row.param;
                    break;
                  case 19:
                    sample.arpeggio[0] = sample.arpeggio[4] = row.param;
                    break;
                  case 20:
                    sample.arpeggio[1] = sample.arpeggio[5] = row.param;
                    break;
                  case 21:
                    sample.arpeggio[2] = sample.arpeggio[6] = row.param;
                    break;
                  case 22:
                    sample.arpeggio[3] = sample.arpeggio[7] = row.param;
                    break;
                  case 23:
                    value = row.param;
                    if (value > 64) value = 64;
                    sample.attackStep = value;
                    break;
                  case 24:
                    sample.attackDelay = row.param;
                    break;
                  case 25:
                    value = row.param;
                    if (value > 64) value = 64;
                    sample.decayStep = value;
                    break;
                  case 26:
                    sample.decayDelay = row.param;
                    break;
                  case 27:
                    sample.sustain = row.param & (sample.sustain & 255);
                    break;
                  case 28:
                    sample.sustain = (sample.sustain & 65280) + row.param;
                    break;
                  case 29:
                    value = row.param;
                    if (value > 64) value = 64;
                    sample.releaseStep = value;
                    break;
                  case 30:
                    sample.releaseDelay = row.param;
                    break;
                }
              }

              if (sample.portamento)
                value = voice.period;
              else {
                value = PERIODS[voice.note + sample.arpeggio[voice.arpeggioPos]];
                voice.arpeggioPos = ++voice.arpeggioPos & 7;
                value -= (sample.vibratoLen * sample.vibratoStep);
                value += voice.pitchBend;
                voice.period = 0;
              }

              chan.period = value + voice.vibratoPeriod;
              adsr  = voice.status & 14;
              value = voice.volume;

              if (adsr == 0) {
                if (voice.attackCtr == 0) {
                  voice.attackCtr = sample.attackDelay;
                  value += sample.attackStep;

                  if (value >= 64) {
                    adsr |= 2;
                    voice.status |= 2;
                    value = 64;
                  }
                } else {
                  voice.attackCtr--;
                }
              }

              if (adsr == 2) {
                if (voice.decayCtr == 0) {
                  voice.decayCtr = sample.decayDelay;
                  value -= sample.decayStep;

                  if (value <= sample.volume) {
                    adsr |= 6;
                    voice.status |= 6;
                    value = sample.volume;
                  }
                } else {
                  voice.decayCtr--;
                }
              }

              if (adsr == 6) {
                if (voice.sustain == 0) {
                  adsr |= 14;
                  voice.status |= 14;
                } else {
                  voice.sustain--;
                }
              }

              if (adsr == 14) {
                if (voice.releaseCtr == 0) {
                  voice.releaseCtr = sample.releaseDelay;
                  value -= sample.releaseStep;

                  if (value < 0) {
                    voice.status &= 9;
                    value = 0;
                  }
                } else {
                  voice.releaseCtr--;
                }
              }

              chan.volume  = voice.volume = value;
              chan.enabled = 1;

              if (!sample.synth) {
                if (sample.loop) {
                  chan.pointer = sample.loopPtr;
                  chan.length  = sample.repeat;
                } else {
                  chan.pointer = this.mixer.loopPtr;
                  chan.length  = 2;
                }
              }
              voice = voice.next;
            }
        }}
      });

      o.voices[0] = D1Voice(0);
      o.voices[0].next = o.voices[1] = D1Voice(1);
      o.voices[1].next = o.voices[2] = D1Voice(2);
      o.voices[2].next = o.voices[3] = D1Voice(3);

      return Object.seal(o);
    }

    var PERIODS = [
             0,6848,6464,6096,5760,5424,5120,4832,4560,4304,4064,3840,
          3616,3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,1920,
          1808,1712,1616,1524,1440,1356,1280,1208,1140,1076, 960, 904,
           856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 452,
           428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240, 226,
           214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120, 113,
           113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113];

    window.neoart.D1Player = D1Player;
  })();


  (function() {
    function D2Voice(idx) {
      return Object.create(null, {
        index          : { value:idx,  writable:true },
        next           : { value:null, writable:true },
        channel        : { value:null, writable:true },
        sample         : { value:null, writable:true },
        trackPtr       : { value:0,    writable:true },
        trackPos       : { value:0,    writable:true },
        trackLen       : { value:0,    writable:true },
        patternPos     : { value:0,    writable:true },
        restart        : { value:0,    writable:true },
        step           : { value:null, writable:true },
        row            : { value:null, writable:true },
        note           : { value:0,    writable:true },
        period         : { value:0,    writable:true },
        finalPeriod    : { value:0,    writable:true },
        arpeggioPtr    : { value:0,    writable:true },
        arpeggioPos    : { value:0,    writable:true },
        pitchBend      : { value:0,    writable:true },
        portamento     : { value:0,    writable:true },
        tableCtr       : { value:0,    writable:true },
        tablePos       : { value:0,    writable:true },
        vibratoCtr     : { value:0,    writable:true },
        vibratoDir     : { value:0,    writable:true },
        vibratoPos     : { value:0,    writable:true },
        vibratoPeriod  : { value:0,    writable:true },
        vibratoSustain : { value:0,    writable:true },
        volume         : { value:0,    writable:true },
        volumeMax      : { value:0,    writable:true },
        volumePos      : { value:0,    writable:true },
        volumeSustain  : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.sample         = null;
            this.trackPtr       = 0;
            this.trackPos       = 0;
            this.trackLen       = 0;
            this.patternPos     = 0;
            this.restart        = 0;
            this.step           = null;
            this.row            = null;
            this.note           = 0;
            this.period         = 0;
            this.finalPeriod    = 0;
            this.arpeggioPtr    = 0;
            this.arpeggioPos    = 0;
            this.pitchBend      = 0;
            this.portamento     = 0;
            this.tableCtr       = 0;
            this.tablePos       = 0;
            this.vibratoCtr     = 0;
            this.vibratoDir     = 0;
            this.vibratoPos     = 0;
            this.vibratoPeriod  = 0;
            this.vibratoSustain = 0;
            this.volume         = 0;
            this.volumeMax      = 63;
            this.volumePos      = 0;
            this.volumeSustain  = 0;
        }}
      });
    }
    function D2Sample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        index     : { value:0,    writable:true },
        pitchBend : { value:0,    writable:true },
        synth     : { value:0,    writable:true },
        table     : { value:null, writable:true },
        vibratos  : { value:null, writable:true },
        volumes   : { value:null, writable:true }
      });

      o.table    = new Uint8Array(48);
      o.vibratos = new Uint8Array(15);
      o.volumes  = new Uint8Array(15);
      return Object.seal(o);
    }
    function D2Player(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id         : { value:"D2Player" },
        tracks     : { value:[],   writable:true },
        patterns   : { value:[],   writable:true },
        samples    : { value:[],   writable:true },
        data       : { value:null, writable:true },
        arpeggios  : { value:null, writable:true },
        voices     : { value:[],   writable:true },
        noise      : { value:0,    writable:true },

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();

            this.speed = 5;
            this.tick  = 1;
            this.noise = 0;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[this.samples.length - 1];

              voice.trackPtr = this.data[voice.index];
              voice.restart  = this.data[voice.index + 4];
              voice.trackLen = this.data[voice.index + 8];

              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var i = 0, id, j, len = 0, offsets, position, row, sample, step, value;
            stream.position = 3014;
            id = stream.readString(4);
            if (id != ".FNL") return;

            stream.position = 4042;
            this.data = new Uint16Array(12);

            for (; i < 4; ++i) {
              this.data[i + 4] = stream.readUshort() >> 1;
              value = stream.readUshort() >> 1;
              this.data[i + 8] = value;
              len += value;
            }

            value = len;
            for (i = 3; i > 0; --i) this.data[i] = (value -= this.data[i + 8]);
            this.tracks.length = len;

            for (i = 0; i < len; ++i) {
              step = AmigaStep();
              step.pattern   = stream.readUbyte() << 4;
              step.transpose = stream.readByte();
              this.tracks[i] = step;
            }

            len = stream.readUint() >> 2;
            this.patterns.length = len;

            for (i = 0; i < len; ++i) {
              row = AmigaRow();
              row.note   = stream.readUbyte();
              row.sample = stream.readUbyte();
              row.effect = stream.readUbyte() - 1;
              row.param  = stream.readUbyte();
              this.patterns[i] = row;
            }

            stream.position += 254;
            value = stream.readUshort();
            position = stream.position;
            stream.position -= 256;

            len = 1;
            offsets = new Uint16Array(128);

            for (i = 0; i < 128; ++i) {
              j = stream.readUshort();
              if (j != value) offsets[len++] = j;
            }

            this.samples.length = len;

            for (i = 0; i < len; ++i) {
              stream.position = position + offsets[i];
              sample = D2Sample();
              sample.length = stream.readUshort() << 1;
              sample.loop   = stream.readUshort();
              sample.repeat = stream.readUshort() << 1;

              for (j = 0; j < 15; ++j)
                sample.volumes[j] = stream.readUbyte();
              for (j = 0; j < 15; ++j)
                sample.vibratos[j] = stream.readUbyte();

              sample.pitchBend = stream.readUshort();
              sample.synth     = stream.readByte();
              sample.index     = stream.readUbyte();

              for (j = 0; j < 48; ++j)
                sample.table[j] = stream.readUbyte();

              this.samples[i] = sample;
            }

            len = stream.readUint();
            this.mixer.store(stream, len);

            stream.position += 64;
            for (i = 0; i < 8; ++i)
              offsets[i] = stream.readUint();

            len = this.samples.length;
            position = stream.position;

            for (i = 0; i < len; ++i) {
              sample = this.samples[i];
              if (sample.synth >= 0) continue;
              stream.position = position + offsets[sample.index];
              sample.pointer  = this.mixer.store(stream, sample.length);
              sample.loopPtr  = sample.pointer + sample.loop;
            }

            stream.position = 3018;
            for (i = 0; i < 1024; ++i)
              this.arpeggios[i] = stream.readByte();

            sample = D2Sample();
            sample.pointer = sample.loopPtr = this.mixer.memory.length;
            sample.length  = sample.repeat  = 2;

            this.samples[len] = sample;

            len = this.patterns.length;
            j = this.samples.length - 1;

            for (i = 0; i < len; ++i) {
              row = this.patterns[i];
              if (row.sample > j) row.sample = 0;
            }

            this.version = 2;
        }},
        process: {
          value: function() {
            var chan, i = 0, level, row, sample, value, voice = this.voices[0];

            for (; i < 64;) {
              this.noise = (this.noise << 7) | (this.noise >>> 25);
              this.noise += 0x6eca756d;
              this.noise ^= 0x9e59a92b;

              value = (this.noise >>> 24) & 255;
              if (value > 127) value |= -256;
              this.mixer.memory[i++] = value;

              value = (this.noise >>> 16) & 255;
              if (value > 127) value |= -256;
              this.mixer.memory[i++] = value;

              value = (this.noise >>> 8) & 255;
              if (value > 127) value |= -256;
              this.mixer.memory[i++] = value;

              value = this.noise & 255;
              if (value > 127) value |= -256;
              this.mixer.memory[i++] = value;
            }

            if (--this.tick < 0) this.tick = this.speed;

            while (voice) {
              if (voice.trackLen < 1) {
                voice = voice.next;
                continue;
              }

              chan = voice.channel;
              sample = voice.sample;

              if (sample.synth) {
                chan.pointer = sample.loopPtr;
                chan.length  = sample.repeat;
              }

              if (this.tick == 0) {
                if (voice.patternPos == 0) {
                  voice.step = this.tracks[voice.trackPtr + voice.trackPos];

                  if (++voice.trackPos == voice.trackLen)
                    voice.trackPos = voice.restart;
                }
                row = voice.row = this.patterns[voice.step.pattern + voice.patternPos];

                if (row.note) {
                  chan.enabled = 0;
                  voice.note = row.note;
                  voice.period = PERIODS[row.note + voice.step.transpose];

                  sample = voice.sample = this.samples[row.sample];

                  if (sample.synth < 0) {
                    chan.pointer = sample.pointer;
                    chan.length  = sample.length;
                  }

                  voice.arpeggioPos    = 0;
                  voice.tableCtr       = 0;
                  voice.tablePos       = 0;
                  voice.vibratoCtr     = sample.vibratos[1];
                  voice.vibratoPos     = 0;
                  voice.vibratoDir     = 0;
                  voice.vibratoPeriod  = 0;
                  voice.vibratoSustain = sample.vibratos[2];
                  voice.volume         = 0;
                  voice.volumePos      = 0;
                  voice.volumeSustain  = 0;
                }

                switch (row.effect) {
                  case -1:
                    break;
                  case 0:
                    this.speed = row.param & 15;
                    break;
                  case 1:
                    this.mixer.filter.active = row.param;
                    break;
                  case 2:
                    voice.pitchBend = ~(row.param & 255) + 1;
                    break;
                  case 3:
                    voice.pitchBend = row.param & 255;
                    break;
                  case 4:
                    voice.portamento = row.param;
                    break;
                  case 5:
                    voice.volumeMax = row.param & 63;
                    break;
                  case 6:
                    this.mixer.volume = row.param;
                    break;
                  case 7:
                    voice.arpeggioPtr = (row.param & 63) << 4;
                    break;
                }
                voice.patternPos = ++voice.patternPos & 15;
              }
              sample = voice.sample;

              if (sample.synth >= 0) {
                if (voice.tableCtr) {
                  voice.tableCtr--;
                } else {
                  voice.tableCtr = sample.index;
                  value = sample.table[voice.tablePos];

                  if (value == 0xff) {
                    value = sample.table[++voice.tablePos];
                    if (value != 0xff) {
                      voice.tablePos = value;
                      value = sample.table[voice.tablePos];
                    }
                  }

                  if (value != 0xff) {
                    chan.pointer = value << 8;
                    chan.length  = sample.length;
                    if (++voice.tablePos > 47) voice.tablePos = 0;
                  }
                }
              }
              value = sample.vibratos[voice.vibratoPos];

              if (voice.vibratoDir) voice.vibratoPeriod -= value;
                else voice.vibratoPeriod += value;

              if (--voice.vibratoCtr == 0) {
                voice.vibratoCtr = sample.vibratos[voice.vibratoPos + 1];
                voice.vibratoDir = ~voice.vibratoDir;
              }

              if (voice.vibratoSustain) {
                voice.vibratoSustain--;
              } else {
                voice.vibratoPos += 3;
                if (voice.vibratoPos == 15) voice.vibratoPos = 12;
                voice.vibratoSustain = sample.vibratos[voice.vibratoPos + 2];
              }

              if (voice.volumeSustain) {
                voice.volumeSustain--;
              } else {
                value = sample.volumes[voice.volumePos];
                level = sample.volumes[voice.volumePos + 1];

                if (level < voice.volume) {
                  voice.volume -= value;
                  if (voice.volume < level) {
                    voice.volume = level;
                    voice.volumePos += 3;
                    voice.volumeSustain = sample.volumes[voice.volumePos - 1];
                  }
                } else {
                  voice.volume += value;
                  if (voice.volume > level) {
                    voice.volume = level;
                    voice.volumePos += 3;
                    if (voice.volumePos == 15) voice.volumePos = 12;
                    voice.volumeSustain = sample.volumes[voice.volumePos - 1];
                  }
                }
              }

              if (voice.portamento) {
                if (voice.period < voice.finalPeriod) {
                  voice.finalPeriod -= voice.portamento;
                  if (voice.finalPeriod < voice.period) voice.finalPeriod = voice.period;
                } else {
                  voice.finalPeriod += voice.portamento;
                  if (voice.finalPeriod > voice.period) voice.finalPeriod = voice.period;
                }
              }
              value = this.arpeggios[voice.arpeggioPtr + voice.arpeggioPos];

              if (value == -128) {
                voice.arpeggioPos = 0;
                value = this.arpeggios[voice.arpeggioPtr]
              }
              voice.arpeggioPos = ++voice.arpeggioPos & 15;

              if (voice.portamento == 0) {
                value = voice.note + voice.step.transpose + value;
                if (value < 0) value = 0;
                voice.finalPeriod = PERIODS[value];
              }

              voice.vibratoPeriod -= (sample.pitchBend - voice.pitchBend);
              chan.period = voice.finalPeriod + voice.vibratoPeriod;

              value = (voice.volume >> 2) & 63;
              if (value > voice.volumeMax) value = voice.volumeMax;
              chan.volume  = value;
              chan.enabled = 1;

              voice = voice.next;
            }
        }}
      });

      o.voices[0] = D2Voice(0);
      o.voices[0].next = o.voices[1] = D2Voice(1);
      o.voices[1].next = o.voices[2] = D2Voice(2);
      o.voices[2].next = o.voices[3] = D2Voice(3);

      o.arpeggios = new Int8Array(1024);
      return Object.seal(o);
    }

    var PERIODS = [
             0,6848,6464,6096,5760,5424,5120,4832,4560,4304,4064,3840,
          3616,3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,1920,
          1808,1712,1616,1524,1440,1356,1280,1208,1140,1076,1016, 960,
           904, 856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480,
           452, 428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240,
           226, 214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120,
           113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113,
           113];

    window.neoart.D2Player = D2Player;
  })();


  (function() {
    function DMVoice() {
      return Object.create(null, {
        channel      : { value:null, writable:true },
        sample       : { value:null, writable:true },
        step         : { value:null, writable:true },
        note         : { value:0,    writable:true },
        period       : { value:0,    writable:true },
        val1         : { value:0,    writable:true },
        val2         : { value:0,    writable:true },
        finalPeriod  : { value:0,    writable:true },
        arpeggioStep : { value:0,    writable:true },
        effectCtr    : { value:0,    writable:true },
        pitch        : { value:0,    writable:true },
        pitchCtr     : { value:0,    writable:true },
        pitchStep    : { value:0,    writable:true },
        portamento   : { value:0,    writable:true },
        volume       : { value:0,    writable:true },
        volumeCtr    : { value:0,    writable:true },
        volumeStep   : { value:0,    writable:true },
        mixMute      : { value:0,    writable:true },
        mixPtr       : { value:0,    writable:true },
        mixEnd       : { value:0,    writable:true },
        mixSpeed     : { value:0,    writable:true },
        mixStep      : { value:0,    writable:true },
        mixVolume    : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.sample       = null;
            this.step         = null;
            this.note         = 0;
            this.period       = 0;
            this.val1         = 0;
            this.val2         = 0;
            this.finalPeriod  = 0;
            this.arpeggioStep = 0;
            this.effectCtr    = 0;
            this.pitch        = 0;
            this.pitchCtr     = 0;
            this.pitchStep    = 0;
            this.portamento   = 0;
            this.volume       = 0;
            this.volumeCtr    = 0;
            this.volumeStep   = 0;
            this.mixMute      = 1;
            this.mixPtr       = 0;
            this.mixEnd       = 0;
            this.mixSpeed     = 0;
            this.mixStep      = 0;
            this.mixVolume    = 0;
        }}
      });
    }
    function DMSample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        wave        : { value:0, writable:true },
        waveLen     : { value:0, writable:true },
        finetune    : { value:0, writable:true },
        arpeggio    : { value:0, writable:true },
        pitch       : { value:0, writable:true },
        pitchDelay  : { value:0, writable:true },
        pitchLoop   : { value:0, writable:true },
        pitchSpeed  : { value:0, writable:true },
        effect      : { value:0, writable:true },
        effectDone  : { value:0, writable:true },
        effectStep  : { value:0, writable:true },
        effectSpeed : { value:0, writable:true },
        source1     : { value:0, writable:true },
        source2     : { value:0, writable:true },
        volumeLoop  : { value:0, writable:true },
        volumeSpeed : { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function DMSong() {
      return Object.create(null, {
        title    : { value:"", writable:true },
        speed    : { value:0,  writable:true },
        length   : { value:0,  writable:true },
        loop     : { value:0,  writable:true },
        loopStep : { value:0,  writable:true },
        tracks   : { value:[], writable:true }
      });
    }
    function DMPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id          : { value:"DMPlayer" },
        songs       : { value:[],   writable:true },
        patterns    : { value:[],   writable:true },
        samples     : { value:[],   writable:true },
        voices      : { value:[],   writable:true },
        buffer1     : { value:0,    writable:true },
        buffer2     : { value:0,    writable:true },
        song1       : { value:0,    writable:true },
        song2       : { value:0,    writable:true },
        trackPos    : { value:0,    writable:true },
        patternPos  : { value:0,    writable:true },
        patternLen  : { value:0,    writable:true },
        patternEnd  : { value:0,    writable:true },
        stepEnd     : { value:0,    writable:true },
        numChannels : { value:0,    writable:true },
        arpeggios   : { value:null, writable:true },
        averages    : { value:null, writable:true },
        volumes     : { value:null, writable:true },
        mixChannel  : { value:null, writable:true },
        mixPeriod   : { value:0,    writable:true },

        initialize: {
          value: function() {
            var chan, i = 0, len, voice;
            this.reset();

            if (this.playSong > 7) this.playSong = 0;

            this.song1  = this.songs[this.playSong];
            this.speed  = this.song1.speed & 0x0f;
            this.speed |= this.speed << 4;
            this.tick  = this.song1.speed;

            this.trackPos    = 0;
            this.patternPos  = 0;
            this.patternLen  = 64;
            this.patternEnd  = 1;
            this.stepEnd     = 1;
            this.numChannels = 4;

            for (; i < 7; ++i) {
              voice = this.voices[i];
              voice.initialize();
              voice.sample  = this.samples[0];

              if (i < 4) {
                chan = this.mixer.channels[i];
                chan.enabled = 0;
                chan.pointer = this.mixer.loopPtr;
                chan.length  = 2;
                chan.period  = 124;
                chan.volume  = 0;

                voice.channel = chan;
              }
            }

            if (this.version == DIGITALMUG_V2) {
              if ((this.playSong & 1) != 0) this.playSong--;
              this.song2 = this.songs[this.playSong + 1];

              this.mixChannel  = AmigaChannel(7);
              this.numChannels = 7;

              chan = this.mixer.channels[3];
              chan.mute    = 0;
              chan.pointer = this.buffer1;
              chan.length  = 350;
              chan.period  = this.mixPeriod;
              chan.volume  = 64;

              len = this.buffer1 + 700;
              for (i = this.buffer1; i < len; ++i) this.mixer.memory[i] = 0;
            }
        }},
        loader: {
          value: function(stream) {
            var data, i = 0, id, index, instr, j, len, position, row, sample, song, step;
            id = stream.readString(24);

            if (id == " MUGICIAN/SOFTEYES 1990 ") this.version = DIGITALMUG_V1;
              else if (id == " MUGICIAN2/SOFTEYES 1990") this.version = DIGITALMUG_V2;
                else return;

            stream.position = 28;
            index = new Uint32Array(8);
            for (; i < 8; ++i) index[i] = stream.readUint();

            stream.position = 76;

            for (i = 0; i < 8; ++i) {
              song = DMSong();
              song.loop     = stream.readUbyte();
              song.loopStep = stream.readUbyte() << 2;
              song.speed    = stream.readUbyte();
              song.length   = stream.readUbyte() << 2;
              song.title    = stream.readString(12);
              this.songs[i] = song;
            }

            stream.position = 204;
            this.lastSong = this.songs.length - 1;

            for (i = 0; i < 8; ++i) {
              song = this.songs[i];
              len  = index[i] << 2;

              for (j = 0; j < len; ++j) {
                step = AmigaStep();
                step.pattern   = stream.readUbyte() << 6;
                step.transpose = stream.readByte();
                song.tracks[j] = step;
              }
            }

            position = stream.position;
            stream.position = 60;
            len = stream.readUint();
            this.samples.length = ++len;
            stream.position = position;

            for (i = 1; i < len; ++i) {
              sample = DMSample();
              sample.wave        = stream.readUbyte();
              sample.waveLen     = stream.readUbyte() << 1;
              sample.volume      = stream.readUbyte();
              sample.volumeSpeed = stream.readUbyte();
              sample.arpeggio    = stream.readUbyte();
              sample.pitch       = stream.readUbyte();
              sample.effectStep  = stream.readUbyte();
              sample.pitchDelay  = stream.readUbyte();
              sample.finetune    = stream.readUbyte() << 6;
              sample.pitchLoop   = stream.readUbyte();
              sample.pitchSpeed  = stream.readUbyte();
              sample.effect      = stream.readUbyte();
              sample.source1     = stream.readUbyte();
              sample.source2     = stream.readUbyte();
              sample.effectSpeed = stream.readUbyte();
              sample.volumeLoop  = stream.readUbyte();
              this.samples[i] = sample;
            }
            this.samples[0] = this.samples[1];

            position = stream.position;
            stream.position = 64;
            len = stream.readUint() << 7;
            stream.position = position;
            this.mixer.store(stream, len);

            position = stream.position;
            stream.position = 68;
            instr = stream.readUint();

            stream.position = 26;
            len = stream.readUshort() << 6;
            this.patterns.length = len;
            stream.position = position + (instr << 5);

            if (instr) instr = position;

            for (i = 0; i < len; ++i) {
              row = AmigaRow();
              row.note   = stream.readUbyte();
              row.sample = stream.readUbyte() & 63;
              row.effect  = stream.readUbyte();
              row.param  = stream.readByte();
              this.patterns[i] = row;
            }

            position = stream.position;
            stream.position = 72;

            if (instr) {
              len = stream.readUint();
              stream.position = position;
              data = this.mixer.store(stream, len);
              position = stream.position;

              this.mixer.memory.length += 350;
              this.buffer1 = this.mixer.memory.length;
              this.mixer.memory.length += 350;
              this.buffer2 = this.mixer.memory.length;
              this.mixer.memory.length += 350;
              this.mixer.loopLen = 8;

              len = this.samples.length;

              for (i = 1; i < len; ++i) {
                sample = this.samples[i];
                if (sample.wave < 32) continue;
                stream.position = instr + ((sample.wave - 32) << 5);

                sample.pointer = stream.readUint();
                sample.length  = stream.readUint() - sample.pointer;
                sample.loop    = stream.readUint();
                sample.name    = stream.readString(12);

                if (sample.loop) {
                  sample.loop  -= sample.pointer;
                  sample.repeat = sample.length - sample.loop;
                  if ((sample.repeat & 1) != 0) sample.repeat--;
                } else {
                  sample.loopPtr = this.mixer.memory.length;
                  sample.repeat  = 8;
                }

                if ((sample.pointer & 1) != 0) sample.pointer--;
                if ((sample.length  & 1) != 0) sample.length--;

                sample.pointer += data;
                if (!sample.loopPtr) sample.loopPtr = sample.pointer + sample.loop;
              }
            } else {
              position += stream.readUint();
            }
            stream.position = 24;

            if (stream.readUshort() == 1) {
              stream.position = position;
              len = stream.length - stream.position;
              if (len > 256) len = 256;
              for (i = 0; i < len; ++i) this.arpeggios[i] = stream.readUbyte();
            }
        }},
        process: {
          value: function() {
            var chan, dst, i = 0, idx, j, len, memory = this.mixer.memory, r, row, src1, src2, sample, value, voice;

            for (; i < this.numChannels; ++i) {
              voice = this.voices[i];
              sample = voice.sample;

              if (i < 3 || this.numChannels == 4) {
                chan = voice.channel;
                if (this.stepEnd) voice.step = this.song1.tracks[this.trackPos + i];

                if (sample.wave > 31) {
                  chan.pointer = sample.loopPtr;
                  chan.length  = sample.repeat;
                }
              } else {
                chan = this.mixChannel;
                if (this.stepEnd) voice.step = this.song2.tracks[this.trackPos + (i - 3)];
              }

              if (this.patternEnd) {
                row = this.patterns[voice.step.pattern + this.patternPos];

                if (row.note) {
                  if (row.effect != 74) {
                    voice.note = row.note;
                    if (row.sample) sample = voice.sample = this.samples[row.sample];
                  }
                  voice.val1 = row.effect < 64 ? 1 : row.effect - 62;
                  voice.val2 = row.param;
                  idx = voice.step.transpose + sample.finetune;

                  if (voice.val1 != 12) {
                    voice.pitch = row.effect;

                    if (voice.val1 == 1) {
                      idx += voice.pitch;
                      if (idx < 0) voice.period = 0;
                        else voice.period = PERIODS[idx];
                    }
                  } else {
                    voice.pitch = row.note;
                    idx += voice.pitch;

                    if (idx < 0) voice.period = 0;
                      else voice.period = PERIODS[idx];
                  }

                  if (voice.val1 == 11) sample.arpeggio = voice.val2 & 7;

                  if (voice.val1 != 12) {
                    if (sample.wave > 31) {
                      chan.pointer  = sample.pointer;
                      chan.length   = sample.length;
                      chan.enabled  = 0;
                      voice.mixPtr  = sample.pointer;
                      voice.mixEnd  = sample.pointer + sample.length;
                      voice.mixMute = 0;
                    } else {
                      dst = sample.wave << 7;
                      chan.pointer = dst;
                      chan.length  = sample.waveLen;
                      if (voice.val1 != 10) chan.enabled = 0;

                      if (this.numChannels == 4) {
                        if (sample.effect != 0 && voice.val1 != 2 && voice.val1 != 4) {
                          len  = dst + 128;
                          src1 = sample.source1 << 7;
                          for (j = dst; j < len; ++j) memory[j] = memory[src1++];

                          sample.effectStep = 0;
                          voice.effectCtr = sample.effectSpeed;
                        }
                      }
                    }
                  }

                  if (voice.val1 != 3 && voice.val1 != 4 && voice.val1 != 12) {
                    voice.volumeCtr  = 1;
                    voice.volumeStep = 0;
                  }

                  voice.arpeggioStep = 0;
                  voice.pitchCtr     = sample.pitchDelay;
                  voice.pitchStep    = 0;
                  voice.portamento   = 0;
                }
              }

              switch (voice.val1) {
                case 0:
                  break;
                case 5:   //pattern length
                  value = voice.val2;
                  if (value > 0 && value < 65) this.patternLen = value;
                  break;
                case 6:   //song speed
                  value  = voice.val2 & 15;
                  value |= value << 4;
                  if (voice.val2 == 0 || voice.val2 > 15) break;
                  this.speed = value;
                  break;
                case 7:   //led filter on
                  this.mixer.filter.active = 1;
                  break;
                case 8:   //led filter off
                  this.mixer.filter.active = 0;
                  break;
                case 13:  //shuffle
                  voice.val1 = 0;
                  value = voice.val2 & 0x0f;
                  if (value == 0) break;
                  value = voice.val2 & 0xf0;
                  if (value == 0) break;
                  this.speed = voice.val2;
                  break;
              }
            }

            for (i = 0; i < this.numChannels; ++i) {
              voice = this.voices[i];
              sample = voice.sample;

              if (this.numChannels == 4) {
                chan = voice.channel;

                if (sample.wave < 32 && sample.effect && !sample.effectDone) {
                  sample.effectDone = 1;

                  if (voice.effectCtr) {
                    voice.effectCtr--;
                  } else {
                    voice.effectCtr = sample.effectSpeed;
                    dst = sample.wave << 7;

                    switch (sample.effect) {
                      case 1:   //filter
                        for (j = 0; j < 127; ++j) {
                          value  = memory[dst];
                          value += memory[dst + 1];
                          memory[dst++] = value >> 1;
                        }
                        break;
                      case 2:   //mixing
                        src1 = sample.source1 << 7;
                        src2 = sample.source2 << 7;
                        idx  = sample.effectStep;
                        len  = sample.waveLen;
                        sample.effectStep = ++sample.effectStep & 127;

                        for (j = 0; j < len; ++j) {
                          value  = memory[src1++];
                          value += memory[src2 + idx];
                          memory[dst++] = value >> 1;
                          idx = ++idx & 127;
                        }
                        break;
                      case 3:   //scr left
                        value = memory[dst];
                        for (j = 0; j < 127; ++j) memory[dst] = memory[++dst];
                        memory[dst] = value;
                        break;
                      case 4:   //scr right
                        dst += 127;
                        value = memory[dst];
                        for (j = 0; j < 127; ++j) memory[dst] = memory[--dst];
                        memory[dst] = value;
                        break;
                      case 5:   //upsample
                        idx = value = dst;
                        for (j = 0; j < 64; ++j) {
                          memory[idx++] = memory[dst++];
                          dst++;
                        }
                        idx = dst = value;
                        idx += 64;
                        for (j = 0; j < 64; ++j) memory[idx++] = memory[dst++];
                        break;
                      case 6:   //downsample
                        src1 = dst + 64;
                        dst += 128;
                        for (j = 0; j < 64; ++j) {
                          memory[--dst] = memory[--src1];
                          memory[--dst] = memory[src1];
                        }
                        break;
                      case 7:   //negate
                        dst += sample.effectStep;
                        memory[dst] = ~memory[dst] + 1;
                        if (++sample.effectStep >= sample.waveLen) sample.effectStep = 0;
                        break;
                      case 8:   //madmix 1
                        sample.effectStep = ++sample.effectStep & 127;
                        src2 = (sample.source2 << 7) + sample.effectStep;
                        idx  = memory[src2];
                        len  = sample.waveLen;
                        value = 3;

                        for (j = 0; j < len; ++j) {
                          src1 = memory[dst] + value;
                          if (src1 < -128) src1 += 256;
                            else if (src1 > 127) src1 -= 256;

                          memory[dst++] = src1;
                          value += idx;

                          if (value < -128) value += 256;
                            else if (value > 127) value -= 256;
                        }
                        break;
                      case 9:   //addition
                        src2 = sample.source2 << 7;
                        len  = sample.waveLen;

                        for (j = 0; j < len; ++j) {
                          value  = memory[src2++];
                          value += memory[dst];
                          if (value > 127) value -= 256;
                          memory[dst++] = value;
                        }
                        break;
                      case 10:  //filter 2
                        for (j = 0; j < 126; ++j) {
                          value  = memory[dst++] * 3;
                          value += memory[dst + 1];
                          memory[dst] = value >> 2;
                        }
                        break;
                      case 11:  //morphing
                        src1 = sample.source1 << 7;
                        src2 = sample.source2 << 7;
                        len  = sample.waveLen;

                        sample.effectStep = ++sample.effectStep & 127;
                        value = sample.effectStep;
                        if (value >= 64) value = 127 - value;
                        idx = (value ^ 255) & 63;

                        for (j = 0; j < len; ++j) {
                          r  = memory[src1++] * value;
                          r += memory[src2++] * idx;
                          memory[dst++] = r >> 6;
                        }
                        break;
                      case 12:  //morph f
                        src1 = sample.source1 << 7;
                        src2 = sample.source2 << 7;
                        len  = sample.waveLen;

                        sample.effectStep = ++sample.effectStep & 31;
                        value = sample.effectStep;
                        if (value >= 16) value = 31 - value;
                        idx = (value ^ 255) & 15;

                        for (j = 0; j < len; ++j) {
                          r  = memory[src1++] * value;
                          r += memory[src2++] * idx;
                          memory[dst++] = r >> 4;
                        }
                        break;
                      case 13:  //filter 3
                        for (j = 0; j < 126; ++j) {
                          value  = memory[dst++];
                          value += memory[dst + 1];
                          memory[dst] = value >> 1;
                        }
                        break;
                      case 14:  //polygate
                        idx = dst + sample.effectStep;
                        memory[idx] = ~memory[idx] + 1;
                        idx = (sample.effectStep + sample.source2) & (sample.waveLen - 1);
                        idx += dst;
                        memory[idx] = ~memory[idx] + 1;
                        if (++sample.effectStep >= sample.waveLen) sample.effectStep = 0;
                        break;
                      case 15:  //colgate
                        idx = dst;
                        for (j = 0; j < 127; ++j) {
                          value  = memory[dst];
                          value += memory[dst + 1];
                          memory[dst++] = value >> 1;
                        }
                        dst = idx;
                        sample.effectStep++;

                        if (sample.effectStep == sample.source2) {
                          sample.effectStep = 0;
                          idx = value = dst;

                          for (j = 0; j < 64; ++j) {
                            memory[idx++] = memory[dst++];
                            dst++;
                          }
                          idx = dst = value;
                          idx += 64;
                          for (j = 0; j < 64; ++j) memory[idx++] = memory[dst++];
                        }
                        break;
                    }
                  }
                }
              } else {
                chan = (i < 3) ? voice.channel : this.mixChannel;
              }

              if (voice.volumeCtr) {
                voice.volumeCtr--;

                if (voice.volumeCtr == 0) {
                  voice.volumeCtr  = sample.volumeSpeed;
                  voice.volumeStep = ++voice.volumeStep & 127;

                  if (voice.volumeStep || sample.volumeLoop) {
                    idx = voice.volumeStep + (sample.volume << 7);
                    value = ~(memory[idx] + 129) + 1;

                    voice.volume = (value & 255) >> 2;
                    chan.volume  = voice.volume;
                  } else {
                    voice.volumeCtr = 0;
                  }
                }
              }
              value = voice.note;

              if (sample.arpeggio) {
                idx = voice.arpeggioStep + (sample.arpeggio << 5);
                value += this.arpeggios[idx];
                voice.arpeggioStep = ++voice.arpeggioStep & 31;
              }

              idx = value + voice.step.transpose + sample.finetune;
              voice.finalPeriod = PERIODS[idx];
              dst = voice.finalPeriod;

              if (voice.val1 == 1 || voice.val1 == 12) {
                value = ~voice.val2 + 1;
                voice.portamento += value;
                voice.finalPeriod += voice.portamento;

                if (voice.val2) {
                  if ((value < 0 && voice.finalPeriod <= voice.period) || (value >= 0 && voice.finalPeriod >= voice.period)) {
                    voice.portamento = voice.period - dst;
                    voice.val2 = 0;
                  }
                }
              }

              if (sample.pitch) {
                if (voice.pitchCtr) {
                  voice.pitchCtr--;
                } else {
                  idx = voice.pitchStep;
                  voice.pitchStep = ++voice.pitchStep & 127;
                  if (voice.pitchStep == 0) voice.pitchStep = sample.pitchLoop;

                  idx += sample.pitch << 7;
                  value = memory[idx];
                  voice.finalPeriod += (~value + 1);
                }
              }
              chan.period = voice.finalPeriod;
            }

            if (this.numChannels > 4) {
              src1 = this.buffer1;
              this.buffer1 = this.buffer2;
              this.buffer2 = src1;

              chan = this.mixer.channels[3];
              chan.pointer = src1;

              for (i = 3; i < 7; ++i) {
                voice = this.voices[i];
                voice.mixStep = 0;

                if (voice.finalPeriod < 125) {
                  voice.mixMute  = 1;
                  voice.mixSpeed = 0;
                } else {
                  j = ((voice.finalPeriod << 8) / this.mixPeriod) & 65535;
                  src2 = ((256 / j) & 255) << 8;
                  dst  = ((256 % j) << 8) & 16777215;
                  voice.mixSpeed = (src2 | ((dst / j) & 255)) << 8;
                }

                if (voice.mixMute) voice.mixVolume = 0;
                  else voice.mixVolume = voice.volume << 8;
              }

              for (i = 0; i < 350; ++i) {
                dst = 0;

                for (j = 3; j < 7; ++j) {
                  voice = this.voices[j];
                  src2 = (memory[voice.mixPtr + (voice.mixStep >> 16)] & 255) + voice.mixVolume;
                  dst += this.volumes[src2];
                  voice.mixStep += voice.mixSpeed;
                }

                memory[src1++] = this.averages[dst];
              }
              chan.length = 350;
              chan.period = this.mixPeriod;
              chan.volume = 64;
            }

            if (--this.tick == 0) {
              this.tick = this.speed & 15;
              this.speed = (this.speed & 240) >> 4;
              this.speed |= (this.tick << 4);
              this.patternEnd = 1;
              this.patternPos++;

              if (this.patternPos == 64 || this.patternPos == this.patternLen) {
                this.patternPos = 0;
                this.stepEnd    = 1;
                this.trackPos  += 4;

                if (this.trackPos == this.song1.length) {
                  this.trackPos = this.song1.loopStep;
                  this.mixer.complete = 1;
                }
              }
            } else {
              this.patternEnd = 0;
              this.stepEnd = 0;
            }

            for (i = 0; i < this.numChannels; ++i) {
              voice = this.voices[i];
              voice.mixPtr += voice.mixStep >> 16;

              sample = voice.sample;
              sample.effectDone = 0;

              if (voice.mixPtr >= voice.mixEnd) {
                if (sample.loop) {
                  voice.mixPtr -= sample.repeat;
                } else {
                  voice.mixPtr  = 0;
                  voice.mixMute = 1;
                }
              }

              if (i < 4) {
                chan = voice.channel;
                chan.enabled = 1;
              }
            }
        }},
        tables: {
          value: function() {
            var i = 0, idx, j, pos = 0, step = 0, v1, v2, vol = 128;

            this.averages = new Int32Array(1024);
            this.volumes  = new Int32Array(16384);
            this.mixPeriod = 203;

            for (; i < 1024; ++i) {
              if (vol > 127) vol -= 256;
              this.averages[i] = vol;
              if (i > 383 && i < 639) vol = ++vol & 255;
            }

            for (i = 0; i < 64; ++i) {
              v1 = -128;
              v2 =  128;

              for (j = 0; j < 256; ++j) {
                vol = ((v1 * step) / 63) + 128;
                idx = pos + v2;
                this.volumes[idx] = vol & 255;

                if (i != 0 && i != 63 && v2 >= 128) --this.volumes[idx];
                v1++;
                v2 = ++v2 & 255;
              }
              pos += 256;
              step++;
            }
        }}
      });

      o.voices[0] = DMVoice();
      o.voices[1] = DMVoice();
      o.voices[2] = DMVoice();
      o.voices[3] = DMVoice();
      o.voices[4] = DMVoice();
      o.voices[5] = DMVoice();
      o.voices[6] = DMVoice();

      o.arpeggios = new Uint8Array(256);
      o.tables();
      return Object.seal(o);
    }

    var DIGITALMUG_V1 = 1,
        DIGITALMUG_V2 = 2,

        PERIODS = [
          3220,3040,2869,2708,2556,2412,2277,2149,2029,1915,1807,1706,
          1610,1520,1434,1354,1278,1206,1139,1075,1014, 957, 904, 853,
           805, 760, 717, 677, 639, 603, 569, 537, 507, 479, 452, 426,
           403, 380, 359, 338, 319, 302, 285, 269, 254, 239, 226, 213,
           201, 190, 179, 169, 160, 151, 142, 134, 127,
          4842,4571,4314,4072,3843,3628,3424,3232,3051,2879,2718,2565,
          2421,2285,2157,2036,1922,1814,1712,1616,1525,1440,1359,1283,
          1211,1143,1079,1018, 961, 907, 856, 808, 763, 720, 679, 641,
           605, 571, 539, 509, 480, 453, 428, 404, 381, 360, 340, 321,
           303, 286, 270, 254, 240, 227, 214, 202, 191, 180, 170, 160,
           151, 143, 135, 127,
          4860,4587,4330,4087,3857,3641,3437,3244,3062,2890,2728,2574,
          2430,2294,2165,2043,1929,1820,1718,1622,1531,1445,1364,1287,
          1215,1147,1082,1022, 964, 910, 859, 811, 765, 722, 682, 644,
           607, 573, 541, 511, 482, 455, 430, 405, 383, 361, 341, 322,
           304, 287, 271, 255, 241, 228, 215, 203, 191, 181, 170, 161,
           152, 143, 135, 128,
          4878,4604,4345,4102,3871,3654,3449,3255,3073,2900,2737,2584,
          2439,2302,2173,2051,1936,1827,1724,1628,1536,1450,1369,1292,
          1219,1151,1086,1025, 968, 914, 862, 814, 768, 725, 684, 646,
           610, 575, 543, 513, 484, 457, 431, 407, 384, 363, 342, 323,
           305, 288, 272, 256, 242, 228, 216, 203, 192, 181, 171, 161,
           152, 144, 136, 128,
          4895,4620,4361,4116,3885,3667,3461,3267,3084,2911,2747,2593,
          2448,2310,2181,2058,1943,1834,1731,1634,1542,1455,1374,1297,
          1224,1155,1090,1029, 971, 917, 865, 817, 771, 728, 687, 648,
           612, 578, 545, 515, 486, 458, 433, 408, 385, 364, 343, 324,
           306, 289, 273, 257, 243, 229, 216, 204, 193, 182, 172, 162,
           153, 144, 136, 129,
          4913,4637,4377,4131,3899,3681,3474,3279,3095,2921,2757,2603,
          2456,2319,2188,2066,1950,1840,1737,1639,1547,1461,1379,1301,
          1228,1159,1094,1033, 975, 920, 868, 820, 774, 730, 689, 651,
           614, 580, 547, 516, 487, 460, 434, 410, 387, 365, 345, 325,
           307, 290, 274, 258, 244, 230, 217, 205, 193, 183, 172, 163,
           154, 145, 137, 129,
          4931,4654,4393,4146,3913,3694,3486,3291,3106,2932,2767,2612,
          2465,2327,2196,2073,1957,1847,1743,1645,1553,1466,1384,1306,
          1233,1163,1098,1037, 978, 923, 872, 823, 777, 733, 692, 653,
           616, 582, 549, 518, 489, 462, 436, 411, 388, 366, 346, 326,
           308, 291, 275, 259, 245, 231, 218, 206, 194, 183, 173, 163,
           154, 145, 137, 130,
          4948,4671,4409,4161,3928,3707,3499,3303,3117,2942,2777,2621,
          2474,2335,2204,2081,1964,1854,1750,1651,1559,1471,1389,1311,
          1237,1168,1102,1040, 982, 927, 875, 826, 779, 736, 694, 655,
           619, 584, 551, 520, 491, 463, 437, 413, 390, 368, 347, 328,
           309, 292, 276, 260, 245, 232, 219, 206, 195, 184, 174, 164,
           155, 146, 138, 130,
          4966,4688,4425,4176,3942,3721,3512,3315,3129,2953,2787,2631,
          2483,2344,2212,2088,1971,1860,1756,1657,1564,1477,1394,1315,
          1242,1172,1106,1044, 985, 930, 878, 829, 782, 738, 697, 658,
           621, 586, 553, 522, 493, 465, 439, 414, 391, 369, 348, 329,
           310, 293, 277, 261, 246, 233, 219, 207, 196, 185, 174, 164,
           155, 146, 138, 131,
          4984,4705,4441,4191,3956,3734,3524,3327,3140,2964,2797,2640,
          2492,2352,2220,2096,1978,1867,1762,1663,1570,1482,1399,1320,
          1246,1176,1110,1048, 989, 934, 881, 832, 785, 741, 699, 660,
           623, 588, 555, 524, 495, 467, 441, 416, 392, 370, 350, 330,
           312, 294, 278, 262, 247, 233, 220, 208, 196, 185, 175, 165,
           156, 147, 139, 131,
          5002,4722,4457,4206,3970,3748,3537,3339,3151,2974,2807,2650,
          2501,2361,2228,2103,1985,1874,1769,1669,1576,1487,1404,1325,
          1251,1180,1114,1052, 993, 937, 884, 835, 788, 744, 702, 662,
           625, 590, 557, 526, 496, 468, 442, 417, 394, 372, 351, 331,
           313, 295, 279, 263, 248, 234, 221, 209, 197, 186, 175, 166,
           156, 148, 139, 131,
          5020,4739,4473,4222,3985,3761,3550,3351,3163,2985,2818,2659,
          2510,2369,2236,2111,1992,1881,1775,1675,1581,1493,1409,1330,
          1255,1185,1118,1055, 996, 940, 887, 838, 791, 746, 704, 665,
           628, 592, 559, 528, 498, 470, 444, 419, 395, 373, 352, 332,
           314, 296, 280, 264, 249, 235, 222, 209, 198, 187, 176, 166,
           157, 148, 140, 132,
          5039,4756,4489,4237,3999,3775,3563,3363,3174,2996,2828,2669,
          2519,2378,2244,2118,2000,1887,1781,1681,1587,1498,1414,1335,
          1260,1189,1122,1059,1000, 944, 891, 841, 794, 749, 707, 667,
           630, 594, 561, 530, 500, 472, 445, 420, 397, 374, 353, 334,
           315, 297, 281, 265, 250, 236, 223, 210, 198, 187, 177, 167,
           157, 149, 140, 132,
          5057,4773,4505,4252,4014,3788,3576,3375,3186,3007,2838,2679,
          2528,2387,2253,2126,2007,1894,1788,1688,1593,1503,1419,1339,
          1264,1193,1126,1063,1003, 947, 894, 844, 796, 752, 710, 670,
           632, 597, 563, 532, 502, 474, 447, 422, 398, 376, 355, 335,
           316, 298, 282, 266, 251, 237, 223, 211, 199, 188, 177, 167,
           158, 149, 141, 133,
          5075,4790,4521,4268,4028,3802,3589,3387,3197,3018,2848,2688,
          2538,2395,2261,2134,2014,1901,1794,1694,1599,1509,1424,1344,
          1269,1198,1130,1067,1007, 951, 897, 847, 799, 754, 712, 672,
           634, 599, 565, 533, 504, 475, 449, 423, 400, 377, 356, 336,
           317, 299, 283, 267, 252, 238, 224, 212, 200, 189, 178, 168,
           159, 150, 141, 133,
          5093,4808,4538,4283,4043,3816,3602,3399,3209,3029,2859,2698,
          2547,2404,2269,2142,2021,1908,1801,1700,1604,1514,1429,1349,
          1273,1202,1134,1071,1011, 954, 900, 850, 802, 757, 715, 675,
           637, 601, 567, 535, 505, 477, 450, 425, 401, 379, 357, 337,
           318, 300, 284, 268, 253, 238, 225, 212, 201, 189, 179, 169,
           159, 150, 142, 134];

    window.neoart.DMPlayer = DMPlayer;
  })();


  (function() {
    function DWVoice(idx, bit) {
      return Object.create(null, {
        index         : { value:idx,  writable:true },
        bitFlag       : { value:bit,  writable:true },
        next          : { value:null, writable:true },
        channel       : { value:null, writable:true },
        sample        : { value:null, writable:true },
        trackPtr      : { value:0,    writable:true },
        trackPos      : { value:0,    writable:true },
        patternPos    : { value:0,    writable:true },
        frqseqPtr     : { value:0,    writable:true },
        frqseqPos     : { value:0,    writable:true },
        volseqPtr     : { value:0,    writable:true },
        volseqPos     : { value:0,    writable:true },
        volseqSpeed   : { value:0,    writable:true },
        volseqCounter : { value:0,    writable:true },
        halve         : { value:0,    writable:true },
        speed         : { value:0,    writable:true },
        tick          : { value:0,    writable:true },
        busy          : { value:0,    writable:true },
        flags         : { value:0,    writable:true },
        note          : { value:0,    writable:true },
        period        : { value:0,    writable:true },
        transpose     : { value:0,    writable:true },
        portaDelay    : { value:0,    writable:true },
        portaDelta    : { value:0,    writable:true },
        portaSpeed    : { value:0,    writable:true },
        vibrato       : { value:0,    writable:true },
        vibratoDelta  : { value:0,    writable:true },
        vibratoSpeed  : { value:0,    writable:true },
        vibratoDepth  : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel       = null;
            this.sample        = null;
            this.trackPtr      = 0;
            this.trackPos      = 0;
            this.patternPos    = 0;
            this.frqseqPtr     = 0;
            this.frqseqPos     = 0;
            this.volseqPtr     = 0;
            this.volseqPos     = 0;
            this.volseqSpeed   = 0;
            this.volseqCounter = 0;
            this.halve         = 0;
            this.speed         = 0;
            this.tick          = 1;
            this.busy          = -1;
            this.flags         = 0;
            this.note          = 0;
            this.period        = 0;
            this.transpose     = 0;
            this.portaDelay    = 0;
            this.portaDelta    = 0;
            this.portaSpeed    = 0;
            this.vibrato       = 0;
            this.vibratoDelta  = 0;
            this.vibratoSpeed  = 0;
            this.vibratoDepth  = 0;
        }}
      });
    }
    function DWSample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        relative : { value:0,  writable:true },
        finetune : { value:0,  writable:true }
      });

      return Object.seal(o);
    }
    function DWSong() {
      return Object.create(null, {
        speed  : { value:0,    writable:true },
        delay  : { value:0,    writable:true },
        tracks : { value:null, writable:true }
      });
    }
    function DWPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id            : { value:"DWPlayer" },
        songs         : { value:[],   writable:true },
        samples       : { value:[],   writable:true },
        stream        : { value:null, writable:true },
        song          : { value:null, writable:true },
        songvol       : { value:0,    writable:true },
        master        : { value:0,    writable:true },
        periods       : { value:0,    writable:true },
        frqseqs       : { value:0,    writable:true },
        volseqs       : { value:0,    writable:true },
        transpose     : { value:0,    writable:true },
        slower        : { value:0,    writable:true },
        slowerCounter : { value:0,    writable:true },
        delaySpeed    : { value:0,    writable:true },
        delayCounter  : { value:0,    writable:true },
        fadeSpeed     : { value:0,    writable:true },
        fadeCounter   : { value:0,    writable:true },
        wave          : { value:null, writable:true },
        waveCenter    : { value:0,    writable:true },
        waveLo        : { value:0,    writable:true },
        waveHi        : { value:0,    writable:true },
        waveDir       : { value:0,    writable:true },
        waveLen       : { value:0,    writable:true },
        wavePos       : { value:0,    writable:true },
        waveRateNeg   : { value:0,    writable:true },
        waveRatePos   : { value:0,    writable:true },
        voices        : { value:[],   writable:true },
        active        : { value:0,    writable:true },
        complete      : { value:0,    writable:true },
        variant       : { value:0,    writable:true },
        base          : { value:0,    writable:true },
        com2          : { value:0,    writable:true },
        com3          : { value:0,    writable:true },
        com4          : { value:0,    writable:true },
        readMix       : { value:"",   writable:true },
        readLen       : { value:0,    writable:true },

        initialize: {
          value: function() {
            var i, len, voice = this.voices[this.active];
            this.reset();

            this.song    = this.songs[this.playSong];
            this.songvol = this.master;
            this.speed   = this.song.speed;

            this.transpose     = 0;
            this.slowerCounter = 6;
            this.delaySpeed    = this.song.delay;
            this.delayCounter  = 0;
            this.fadeSpeed     = 0;
            this.fadeCounter   = 0;

            if (this.wave) {
              this.waveDir = 0;
              this.wavePos = this.wave.pointer + this.waveCenter;
              i = this.wave.pointer;

              len = this.wavePos;
              for (; i < len; ++i) this.mixer.memory[i] = this.waveRateNeg;

              len += this.waveCenter;
              for (; i < len; ++i) this.mixer.memory[i] = this.waveRatePos;
            }

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[0];
              this.complete += voice.bitFlag;

              voice.trackPtr = this.song.tracks[voice.index];
              voice.trackPos = this.readLen;
              this.stream.position = voice.trackPtr;
              voice.patternPos = this.base + this.stream[this.readMix]();

              if (this.frqseqs) {
                this.stream.position = this.frqseqs;
                voice.frqseqPtr = this.base + this.stream.readUshort();
                voice.frqseqPos = voice.frqseqPtr;
              }

              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var flag, headers, i, index, info, lower, pos, sample, size = 10, song, total, value;

            this.master  = 64;
            this.readMix = "readUshort";
            this.readLen = 2;
            this.variant = 0;

            if (stream.readUshort() == 0x48e7) {                                      //movem.l
              stream.position = 4;
              if (stream.readUshort() != 0x6100) return;                              //bsr.w

              stream.position += stream.readUshort();
              this.variant = 30;
            } else {
              stream.position = 0;
            }

            while (value != 0x4e75) {                                                 //rts
              value = stream.readUshort();

              switch (value) {
                case 0x47fa:                                                          //lea x,a3
                  this.base = stream.position + stream.readShort();
                  break;
                case 0x6100:                                                          //bsr.w
                  stream.position += 2;
                  info = stream.position;

                  if (stream.readUshort() == 0x6100)                                  //bsr.w
                    info = stream.position + stream.readUshort();
                  break;
                case 0xc0fc:                                                          //mulu.w #x,d0
                  size = stream.readUshort();

                  if (size == 18) {
                    this.readMix = "readUint";
                    this.readLen = 4;
                  } else {
                    this.variant = 10;
                  }

                  if (stream.readUshort() == 0x41fa)
                    headers = stream.position + stream.readUshort();

                  if (stream.readUshort() == 0x1230) flag = 1;
                  break;
                case 0x1230:                                                          //move.b (a0,d0.w),d1
                  stream.position -= 6;

                  if (stream.readUshort() == 0x41fa) {
                    headers = stream.position + stream.readUshort();
                    flag = 1;
                  }

                  stream.position += 4;
                  break;
                case 0xbe7c:                                                          //cmp.w #x,d7
                  this.channels = stream.readUshort();
                  stream.position += 2;

                  if (stream.readUshort() == 0x377c)
                    this.master = stream.readUshort();
                  break;
              }

              if (stream.bytesAvailable < 20) return;
            }

            index = stream.position;
            this.songs = [];
            lower = 0x7fffffff;
            total = 0;
            stream.position = headers;

            while (1) {
              song = DWSong();
              song.tracks = new Uint32Array(this.channels);

              if (flag) {
                song.speed = stream.readUbyte();
                song.delay = stream.readUbyte();
              } else {
                song.speed = stream.readUshort();
              }

              if (song.speed > 255) break;

              for (i = 0; i < this.channels; ++i) {
                value = this.base + stream[this.readMix]();
                if (value < lower) lower = value;
                song.tracks[i] = value;
              }

              this.songs[total++] = song;
              if ((lower - stream.position) < size) break;
            }

            if (!total) return;
            this.lastSong = this.songs.length - 1;

            stream.position = info;
            if (stream.readUshort() != 0x4a2b) return;                         //tst.b x(a3)
            headers = size = 0;
            this.wave = null;

            while (value != 0x4e75) {                                                 //rts
              value = stream.readUshort();

              switch (value) {
                case 0x4bfa:
                  if (headers) break;
                  info = stream.position + stream.readShort();
                  stream.position++;
                  total = stream.readUbyte();

                  stream.position -= 10;
                  value = stream.readUshort();
                  pos = stream.position;

                  if (value == 0x41fa || value == 0x207a) {                           //lea x,a0 | movea.l x,a0
                    headers = stream.position + stream.readUshort();
                  } else if (value == 0xd0fc) {                                       //adda.w #x,a0
                    headers = (64 + stream.readUshort());
                    stream.position -= 18;
                    headers += (stream.position + stream.readUshort());
                  }

                  stream.position = pos;
                  break;
                case 0x84c3:                                                          //divu.w d3,d2
                  if (size) break;
                  stream.position += 4;
                  value = stream.readUshort();

                  if (value == 0xdafc) {                                              //adda.w #x,a5
                    size = stream.readUshort();
                  } else if (value == 0xdbfc) {                                       //adda.l #x,a5
                    size = stream.readUint();
                  }

                  if (size == 12 && this.variant < 30) this.variant = 20;

                  pos = stream.position;
                  this.samples = [];
                  this.samples.length = ++total;
                  stream.position = headers;

                  for (i = 0; i < total; ++i) {
                    sample = DWSample();
                    sample.length   = stream.readUint();
                    sample.relative = parseInt(3579545 / stream.readUshort());
                    sample.pointer  = this.mixer.store(stream, sample.length);

                    value = stream.position;
                    stream.position = info + (i * size) + 4;
                    sample.loopPtr = stream.readInt();

                    if (this.variant == 0) {
                      stream.position += 6;
                      sample.volume = stream.readUshort();
                    } else if (this.variant == 10) {
                      stream.position += 4;
                      sample.volume = stream.readUshort();
                      sample.finetune = stream.readByte();
                    }

                    stream.position = value;
                    this.samples[i] = sample;
                  }

                  this.mixer.loopLen = 64;
                  stream.length = headers;
                  stream.position = pos;
                  break;
                case 0x207a:                                                          //movea.l x,a0
                  value = stream.position + stream.readShort();

                  if (stream.readUshort() != 0x323c) {                                //move.w #x,d1
                    stream.position -= 2;
                    break;
                  }

                  this.wave = this.samples[parseInt((value - info) / size)];
                  this.waveCenter = (stream.readUshort() + 1) << 1;

                  stream.position += 2;
                  this.waveRateNeg = stream.readByte();
                  stream.position += 12;
                  this.waveRatePos = stream.readByte();
                  break;
                case 0x046b:                                                          //subi.w #x,x(a3)
                case 0x066b:                                                          //addi.w #x,x(a3)
                  total = stream.readUshort();
                  sample = this.samples[parseInt((stream.readUshort() - info) / size)];

                  if (value == 0x066b) {
                    sample.relative += total;
                  } else {
                    sample.relative -= total;
                  }
                  break;
              }
            }

            if (!this.samples.length) return;
            stream.position = index;

            this.periods = 0;
            this.frqseqs = 0;
            this.volseqs = 0;
            this.slower  = 0;

            this.com2 = 0xb0;
            this.com3 = 0xa0;
            this.com4 = 0x90;

            while (stream.bytesAvailable > 16) {
              value = stream.readUshort();

              switch (value) {
                case 0x47fa:                                                          //lea x,a3
                  stream.position += 2;
                  if (stream.readUshort() != 0x4a2b) break;                           //tst.b x(a3)

                  pos = stream.position;
                  stream.position += 4;
                  value = stream.readUshort();

                  if (value == 0x103a) {                                              //move.b x,d0
                    stream.position += 4;

                    if (stream.readUshort() == 0xc0fc) {                              //mulu.w #x,d0
                      value = stream.readUshort();
                      total = this.songs.length;
                      for (i = 0; i < total; ++i) this.songs[i].delay *= value;
                      stream.position += 6;
                    }
                  } else if (value == 0x532b) {                                       //subq.b #x,x(a3)
                    stream.position -= 8;
                  }

                  value = stream.readUshort();

                  if (value == 0x4a2b) {                                              //tst.b x(a3)
                    stream.position = this.base + stream.readUshort();
                    this.slower = stream.readByte();
                  }

                  stream.position = pos;
                  break;
                case 0x0c6b:                                                          //cmpi.w #x,x(a3)
                  stream.position -= 6;
                  value = stream.readUshort();

                  if (value == 0x546b || value == 0x526b) {                           //addq.w #2,x(a3) | addq.w #1,x(a3)
                    stream.position += 4;
                    this.waveHi = this.wave.pointer + stream.readUshort();
                  } else if (value == 0x556b || value == 0x536b) {                    //subq.w #2,x(a3) | subq.w #1,x(a3)
                    stream.position += 4;
                    this.waveLo = this.wave.pointer + stream.readUshort();
                  }

                  this.waveLen = (value < 0x546b) ? 1 : 2;
                  break;
                case 0x7e00:                                                          //moveq #0,d7
                case 0x7e01:                                                          //moveq #1,d7
                case 0x7e02:                                                          //moveq #2,d7
                case 0x7e03:                                                          //moveq #3,d7
                  this.active = value & 0xf;
                  total = this.channels - 1;

                  if (this.active) {
                    this.voices[0].next = null;
                    for (i = total; i > 0;) this.voices[i].next = this.voices[--i];
                  } else {
                    this.voices[total].next = null;
                    for (i = 0; i < total;) this.voices[i].next = this.voices[++i];
                  }
                  break;
                case 0x0c68:                                                          //cmpi.w #x,x(a0)
                  stream.position += 22;
                  if (stream.readUshort() == 0x0c11) this.variant = 40;
                  break;
                case 0x322d:                                                          //move.w x(a5),d1
                  pos = stream.position;
                  value = stream.readUshort();

                  if (value == 0x000a || value == 0x000c) {                           //10 | 12
                    stream.position -= 8;

                    if (stream.readUshort() == 0x45fa)                                //lea x,a2
                      this.periods = stream.position + stream.readUshort();
                  }

                  stream.position = pos + 2;
                  break;
                case 0x0400:                                                          //subi.b #x,d0
                case 0x0440:                                                          //subi.w #x,d0
                case 0x0600:                                                          //addi.b #x,d0
                  value = stream.readUshort();

                  if (value == 0x00c0 || value == 0x0040) {                           //192 | 64
                    this.com2 = 0xc0;
                    this.com3 = 0xb0;
                    this.com4 = 0xa0;
                  } else if (value == this.com3) {
                    stream.position += 2;

                    if (stream.readUshort() == 0x45fa) {                              //lea x,a2
                      this.volseqs = stream.position + stream.readUshort();
                      if (this.variant < 40) this.variant = 30;
                    }
                  } else if (value == this.com4) {
                    stream.position += 2;

                    if (stream.readUshort() == 0x45fa)                                //lea x,a2
                      this.frqseqs = stream.position + stream.readUshort();
                  }
                  break;
                case 0x4ef3:                                                          //jmp (a3,a2.w)
                  stream.position += 2;
                case 0x4ed2:                                                          //jmp a2
                  lower = stream.position;
                  stream.position -= 10;
                  stream.position += stream.readUshort();
                  pos = stream.position;                                              //jump table address

                  stream.position = pos + 2;                                          //effect -126
                  stream.position = this.base + stream.readUshort() + 10;
                  if (stream.readUshort() == 0x4a14) this.variant = 41;               //tst.b (a4)

                  stream.position = pos + 16;                                         //effect -120
                  value = this.base + stream.readUshort();

                  if (value > lower && value < pos) {
                    stream.position = value;
                    value = stream.readUshort();

                    if (value == 0x50e8) {                                            //st x(a0)
                      this.variant = 21;
                    } else if (value == 0x1759) {                                     //move.b (a1)+,x(a3)
                      this.variant = 11;
                    }
                  }

                  stream.position = pos + 20;                                         //effect -118
                  value = this.base + stream.readUshort();

                  if (value > lower && value < pos) {
                    stream.position = value + 2;
                    if (stream.readUshort() != 0x4880) this.variant = 31;             //ext.w d0
                  }

                  stream.position = pos + 26;                                         //effect -115
                  value = stream.readUshort();
                  if (value > lower && value < pos) this.variant = 32;

                  if (this.frqseqs) stream.position = stream.length;
                  break;
              }
            }

            if (!this.periods) return;
            this.com2 -= 256;
            this.com3 -= 256;
            this.com4 -= 256;

            this.stream = stream;
            this.version = 1;
        }},
        process: {
          value: function() {
            var chan, loop, pos, sample, value, voice = this.voices[this.active], volume;

            if (this.slower) {
              if (--this.slowerCounter == 0) {
                this.slowerCounter = 6;
                return;
              }
            }

            if ((this.delayCounter += this.delaySpeed) > 255) {
              this.delayCounter -= 256;
              return;
            }

            if (this.fadeSpeed) {
              if (--this.fadeCounter == 0) {
                this.fadeCounter = this.fadeSpeed;
                this.songvol--;
              }

              if (!this.songvol) {
                if (!this.loopSong) {
                  this.mixer.complete = 1;
                  return;
                } else {
                  this.initialize();
                }
              }
            }

            if (this.wave) {
              if (this.waveDir) {
                this.mixer.memory[this.wavePos++] = this.waveRatePos;
                if (this.waveLen > 1) this.mixer.memory[this.wavePos++] = this.waveRatePos;
                if ((this.wavePos -= (this.waveLen << 1)) == this.waveLo) this.waveDir = 0;
              } else {
                this.mixer.memory[this.wavePos++] = this.waveRateNeg;
                if (this.waveLen > 1) this.mixer.memory[this.wavePos++] = this.waveRateNeg;
                if (this.wavePos == this.waveHi) this.waveDir = 1;
              }
            }

            while (voice) {
              chan = voice.channel;
              this.stream.position = voice.patternPos;
              sample = voice.sample;

              if (!voice.busy) {
                voice.busy = 1;

                if (sample.loopPtr < 0) {
                  chan.pointer = this.mixer.loopPtr;
                  chan.length  = this.mixer.loopLen;
                } else {
                  chan.pointer = sample.pointer + sample.loopPtr;
                  chan.length  = sample.length  - sample.loopPtr;
                }
              }

              if (--voice.tick == 0) {
                voice.flags = 0;
                loop = 1;

                while (loop > 0) {
                  value = this.stream.readByte();

                  if (value < 0) {
                    if (value >= -32) {
                      voice.speed = this.speed * (value + 33);
                    } else if (value >= this.com2) {
                      value -= this.com2;
                      voice.sample = sample = this.samples[value];
                    } else if (value >= this.com3) {
                      pos = this.stream.position;

                      this.stream.position = this.volseqs + ((value - this.com3) << 1);
                      this.stream.position = this.base + this.stream.readUshort();
                      voice.volseqPtr = this.stream.position;

                      this.stream.position--;
                      voice.volseqSpeed = this.stream.readUbyte();

                      this.stream.position = pos;
                    } else if (value >= this.com4) {
                      pos = this.stream.position;

                      this.stream.position = this.frqseqs + ((value - this.com4) << 1);
                      voice.frqseqPtr = this.base + this.stream.readUshort();
                      voice.frqseqPos = voice.frqseqPtr;

                      this.stream.position = pos;
                    } else {
                      switch (value) {
                        case -128:
                          this.stream.position = voice.trackPtr + voice.trackPos;
                          value = this.stream[this.readMix]();

                          if (value) {
                            this.stream.position = this.base + value;
                            voice.trackPos += this.readLen;
                          } else {
                            this.stream.position = voice.trackPtr;
                            this.stream.position = this.base + this.stream[this.readMix]();
                            voice.trackPos = this.readLen;

                            if (!this.loopSong) {
                              this.complete &= ~(voice.bitFlag);
                              if (!this.complete) this.mixer.complete = 1;
                            }
                          }
                          break;
                        case -127:
                          if (this.variant > 0) voice.portaDelta = 0;
                          voice.portaSpeed = this.stream.readByte();
                          voice.portaDelay = this.stream.readUbyte();
                          voice.flags |= 2;
                          break;
                        case -126:
                          voice.tick = voice.speed;
                          voice.patternPos = this.stream.position;

                          if (this.variant == 41) {
                            voice.busy = 1;
                            chan.enabled = 0;
                          } else {
                            chan.pointer = this.mixer.loopPtr;
                            chan.length  = this.mixer.loopLen;
                          }

                          loop = 0;
                          break;
                        case -125:
                          if (this.variant > 0) {
                            voice.tick = voice.speed;
                            voice.patternPos = this.stream.position;
                            chan.enabled = 1;
                            loop = 0;
                          }
                          break;
                        case -124:
                          this.mixer.complete = 1;
                          break;
                        case -123:
                          if (this.variant > 0) this.transpose = this.stream.readByte();
                          break;
                        case -122:
                          voice.vibrato = -1;
                          voice.vibratoSpeed = this.stream.readUbyte();
                          voice.vibratoDepth = this.stream.readUbyte();
                          voice.vibratoDelta = 0;
                          break;
                        case -121:
                          voice.vibrato = 0;
                          break;
                        case -120:
                          if (this.variant == 21) {
                            voice.halve = 1;
                          } else if (this.variant == 11) {
                            this.fadeSpeed = this.stream.readUbyte();
                          } else {
                            voice.transpose = this.stream.readByte();
                          }
                          break;
                        case -119:
                          if (this.variant == 21) {
                            voice.halve = 0;
                          } else {
                            voice.trackPtr = this.base + this.stream.readUshort();
                            voice.trackPos = 0;
                          }
                          break;
                        case -118:
                          if (this.variant == 31) {
                            this.delaySpeed = this.stream.readUbyte();
                          } else {
                            this.speed = this.stream.readUbyte();
                          }
                          break;
                        case -117:
                          this.fadeSpeed = this.stream.readUbyte();
                          this.fadeCounter = this.fadeSpeed;
                          break;
                        case -116:
                          value = this.stream.readUbyte();
                          if (this.variant != 32) this.songvol = value;
                          break;
                      }
                    }
                  } else {
                    voice.patternPos = this.stream.position;
                    voice.note = (value += sample.finetune);
                    voice.tick = voice.speed;
                    voice.busy = 0;

                    if (this.variant >= 20) {
                      value = (value + this.transpose + voice.transpose) & 0xff;
                      this.stream.position = voice.volseqPtr;
                      volume = this.stream.readUbyte();

                      voice.volseqPos = this.stream.position;
                      voice.volseqCounter = voice.volseqSpeed;

                      if (voice.halve) volume >>= 1;
                      volume = (volume * this.songvol) >> 6;
                    } else {
                      volume = sample.volume;
                    }

                    chan.pointer = sample.pointer;
                    chan.length  = sample.length;
                    chan.volume  = volume;

                    this.stream.position = this.periods + (value << 1);
                    value = (this.stream.readUshort() * sample.relative) >> 10;
                    if (this.variant < 10) voice.portaDelta = value;

                    chan.period  = value;
                    chan.enabled = 1;
                    loop = 0;
                  }
                }
              } else if (voice.tick == 1) {
                if (this.variant < 30) {
                  chan.enabled = 0;
                } else {
                  value = this.stream.readUbyte();

                  if (value != 131) {
                    if (this.variant < 40 || value < 224 || (this.stream.readUbyte() != 131))
                      chan.enabled = 0;
                  }
                }
              } else if (this.variant == 0) {
                if (voice.flags & 2) {
                  if (voice.portaDelay) {
                    voice.portaDelay--;
                  } else {
                    voice.portaDelta -= voice.portaSpeed;
                    chan.period = voice.portaDelta;
                  }
                }
              } else {
                this.stream.position = voice.frqseqPos;
                value = this.stream.readByte();

                if (value < 0) {
                  value &= 0x7f;
                  this.stream.position = voice.frqseqPtr;
                }

                voice.frqseqPos = this.stream.position;

                value = (value + voice.note + this.transpose + voice.transpose) & 0xff;
                this.stream.position = this.periods + (value << 1);
                value = (this.stream.readUshort() * sample.relative) >> 10;

                if (voice.flags & 2) {
                  if (voice.portaDelay) {
                    voice.portaDelay--;
                  } else {
                    voice.portaDelta += voice.portaSpeed;
                    value -= voice.portaDelta;
                  }
                }

                if (voice.vibrato) {
                  if (voice.vibrato > 0) {
                    voice.vibratoDelta -= voice.vibratoSpeed;
                    if (!voice.vibratoDelta) voice.vibrato ^= 0x80000000;
                  } else {
                    voice.vibratoDelta += voice.vibratoSpeed;
                    if (voice.vibratoDelta == voice.vibratoDepth) voice.vibrato ^= 0x80000000;
                  }

                  if (!voice.vibratoDelta) voice.vibrato ^= 1;

                  if (voice.vibrato & 1) {
                    value += voice.vibratoDelta;
                  } else {
                    value -= voice.vibratoDelta;
                  }
                }

                chan.period = value;

                if (this.variant >= 20) {
                  if (--voice.volseqCounter < 0) {
                    this.stream.position = voice.volseqPos;
                    volume = this.stream.readByte();

                    if (volume >= 0) voice.volseqPos = this.stream.position;
                    voice.volseqCounter = voice.volseqSpeed;
                    volume &= 0x7f;

                    if (voice.halve) volume >>= 1;
                    chan.volume = (volume * this.songvol) >> 6;
                  }
                }
              }

              voice = voice.next;
            }
        }}
      });

      o.voices[0] = DWVoice(0,1);
      o.voices[1] = DWVoice(1,2);
      o.voices[2] = DWVoice(2,4);
      o.voices[3] = DWVoice(3,8);

      return Object.seal(o);
    }

    window.neoart.DWPlayer = DWPlayer;
  })();


  (function() {
    function FCVoice(idx) {
      return Object.create(null, {
        index          : { value:idx,  writable:true },
        next           : { value:null, writable:true },
        channel        : { value:null, writable:true },
        sample         : { value:null, writable:true },
        enabled        : { value:0,    writable:true },
        pattern        : { value:0,    writable:true },
        soundTranspose : { value:0,    writable:true },
        transpose      : { value:0,    writable:true },
        patStep        : { value:0,    writable:true },
        frqStep        : { value:0,    writable:true },
        frqPos         : { value:0,    writable:true },
        frqSustain     : { value:0,    writable:true },
        frqTranspose   : { value:0,    writable:true },
        volStep        : { value:0,    writable:true },
        volPos         : { value:0,    writable:true },
        volCtr         : { value:0,    writable:true },
        volSpeed       : { value:0,    writable:true },
        volSustain     : { value:0,    writable:true },
        note           : { value:0,    writable:true },
        pitch          : { value:0,    writable:true },
        volume         : { value:0,    writable:true },
        pitchBendFlag  : { value:0,    writable:true },
        pitchBendSpeed : { value:0,    writable:true },
        pitchBendTime  : { value:0,    writable:true },
        portamentoFlag : { value:0,    writable:true },
        portamento     : { value:0,    writable:true },
        volBendFlag    : { value:0,    writable:true },
        volBendSpeed   : { value:0,    writable:true },
        volBendTime    : { value:0,    writable:true },
        vibratoFlag    : { value:0,    writable:true },
        vibratoSpeed   : { value:0,    writable:true },
        vibratoDepth   : { value:0,    writable:true },
        vibratoDelay   : { value:0,    writable:true },
        vibrato        : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.sample         = null;
            this.enabled        = 0;
            this.pattern        = 0;
            this.soundTranspose = 0;
            this.transpose      = 0;
            this.patStep        = 0;
            this.frqStep        = 0;
            this.frqPos         = 0;
            this.frqSustain     = 0;
            this.frqTranspose   = 0;
            this.volStep        = 0;
            this.volPos         = 0;
            this.volCtr         = 1;
            this.volSpeed       = 1;
            this.volSustain     = 0;
            this.note           = 0;
            this.pitch          = 0;
            this.volume         = 0;
            this.pitchBendFlag  = 0;
            this.pitchBendSpeed = 0;
            this.pitchBendTime  = 0;
            this.portamentoFlag = 0;
            this.portamento     = 0;
            this.volBendFlag    = 0;
            this.volBendSpeed   = 0;
            this.volBendTime    = 0;
            this.vibratoFlag    = 0;
            this.vibratoSpeed   = 0;
            this.vibratoDepth   = 0;
            this.vibratoDelay   = 0;
            this.vibrato        = 0;
        }},
        volumeBend: {
          value: function() {
            this.volBendFlag ^= 1;

            if (this.volBendFlag) {
              this.volBendTime--;
              this.volume += this.volBendSpeed;
              if (this.volume < 0 || this.volume > 64) this.volBendTime = 0;
            }
        }}
      });
    }
    function FCPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id      : { value:"FCPlayer" },
        seqs    : { value:null, writable:true },
        pats    : { value:null, writable:true },
        vols    : { value:null, writable:true },
        frqs    : { value:null, writable:true },
        length  : { value:0,    writable:true },
        samples : { value:[],   writable:true },
        voices  : { value:[],   writable:true },

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();

            this.seqs.position = 0;
            this.pats.position = 0;
            this.vols.position = 0;
            this.frqs.position = 0;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];

              voice.pattern = this.seqs.readUbyte() << 6;
              voice.transpose = this.seqs.readByte();
              voice.soundTranspose = this.seqs.readByte();

              voice = voice.next;
            }

            this.speed = this.seqs.readUbyte();
            if (!this.speed) this.speed = 3;
            this.tick = this.speed;
        }},
        loader: {
          value: function(stream) {
            var i, id, j, len, offset, position, sample, size, temp, total;
            id = stream.readString(4);

            if (id == "SMOD") this.version = FUTURECOMP_10;
              else if (id == "FC14") this.version = FUTURECOMP_14;
                else return;

            stream.position = 4;
            this.length = stream.readUint();
            stream.position = this.version == FUTURECOMP_10 ? 100 : 180;
            this.seqs = ByteArray(new ArrayBuffer(this.length));
            stream.readBytes(this.seqs, 0, this.length);
            this.length = (this.length / 13) >> 0;

            stream.position = 12;
            len = stream.readUint();
            stream.position = 8;
            stream.position = stream.readUint();
            this.pats = ByteArray(new ArrayBuffer(len + 1));
            stream.readBytes(this.pats, 0, len);

            stream.position = 20;
            len = stream.readUint();
            stream.position = 16;
            stream.position = stream.readUint();
            this.frqs = ByteArray(new ArrayBuffer(len + 9));
            this.frqs.writeInt(0x01000000);
            this.frqs.writeInt(0x000000e1);
            stream.readBytes(this.frqs, 8, len);

            this.frqs.position = this.frqs.length - 1;
            this.frqs.writeByte(0xe1);
            this.frqs.position = 0;

            stream.position = 28;
            len = stream.readUint();
            stream.position = 24;
            stream.position = stream.readUint();
            this.vols = ByteArray(new ArrayBuffer(len + 8));
            this.vols.writeInt(0x01000000);
            this.vols.writeInt(0x000000e1);
            stream.readBytes(this.vols, 8, len);

            stream.position = 32;
            size = stream.readUint();
            stream.position = 40;

            if (this.version == FUTURECOMP_10) {
              this.samples.length = 57,
              offset = 0;
            } else {
              this.samples.length = 200;
              offset = 2;
            }

            for (i = 0; i < 10; ++i) {
              len = stream.readUshort() << 1;

              if (len > 0) {
                position = stream.position;
                stream.position = size;
                id = stream.readString(4);

                if (id == "SSMP") {
                  temp = len;

                  for (j = 0; j < 10; ++j) {
                    stream.readInt();
                    len = stream.readUshort() << 1;

                    if (len > 0) {
                      sample = AmigaSample();
                      sample.length = len + 2;
                      sample.loop   = stream.readUshort();
                      sample.repeat = stream.readUshort() << 1;

                      if ((sample.loop + sample.repeat) > sample.length)
                        sample.repeat = sample.length - sample.loop;

                      if ((size + sample.length) > stream.length)
                        sample.length = stream.length - size;

                      sample.pointer = this.mixer.store(stream, sample.length, size + total);
                      sample.loopPtr = sample.pointer + sample.loop;
                      this.samples[100 + (i * 10) + j] = sample;
                      total += sample.length;
                      stream.position += 6;
                    } else {
                      stream.position += 10;
                    }
                  }

                  size += (temp + 2);
                  stream.position = position + 4;
                } else {
                  stream.position = position;
                  sample = AmigaSample();
                  sample.length = len + offset;
                  sample.loop   = stream.readUshort();
                  sample.repeat = stream.readUshort() << 1;

                  if ((sample.loop + sample.repeat) > sample.length)
                    sample.repeat = sample.length - sample.loop;

                  if ((size + sample.length) > stream.length)
                    sample.length = stream.length - size;

                  sample.pointer = this.mixer.store(stream, sample.length, size);
                  sample.loopPtr = sample.pointer + sample.loop;
                  this.samples[i] = sample;
                  size += sample.length;
                }
              } else {
                stream.position += 4;
              }
            }

            if (this.version == FUTURECOMP_10) {
              offset = 0; temp = 47;

              for (i = 10; i < 57; ++i) {
                sample = AmigaSample();
                sample.length  = WAVES[offset++] << 1;
                sample.loop    = 0;
                sample.repeat  = sample.length;

                position = this.mixer.memory.length;
                sample.pointer = position;
                sample.loopPtr = position;
                this.samples[i] = sample;

                len = position + sample.length;

                for (j = position; j < len; ++j)
                  this.mixer.memory[j] = WAVES[temp++];
              }
            } else {
              stream.position = 36;
              size = stream.readUint();
              stream.position = 100;

              for (i = 10; i < 90; ++i) {
                len = stream.readUbyte() << 1;
                if (len < 2) continue;

                sample = AmigaSample();
                sample.length = len;
                sample.loop   = 0;
                sample.repeat = sample.length;

                if ((size + sample.length) > stream.length)
                  sample.length = stream.length - size;

                sample.pointer = this.mixer.store(stream, sample.length, size);
                sample.loopPtr = sample.pointer;
                this.samples[i] = sample;
                size += sample.length;
              }
            }

            this.length *= 13;
        }},
        process: {
          value: function() {
            var base, chan, delta, i, info, loopEffect, loopSustain, period, sample, temp, voice = this.voices[0];

            if (--this.tick == 0) {
              base = this.seqs.position;

              while (voice) {
                chan = voice.channel;

                this.pats.position = voice.pattern + voice.patStep;
                temp = this.pats.readUbyte();

                if (voice.patStep >= 64 || temp == 0x49) {
                  if (this.seqs.position == this.length) {
                    this.seqs.position  = 0;
                    this.mixer.complete = 1;
                  }

                  voice.patStep = 0;
                  voice.pattern = this.seqs.readUbyte() << 6;
                  voice.transpose = this.seqs.readByte();
                  voice.soundTranspose = this.seqs.readByte();

                  this.pats.position = voice.pattern;
                  temp = this.pats.readUbyte();
                }
                info = this.pats.readUbyte();
                this.frqs.position = 0;
                this.vols.position = 0;

                if (temp != 0) {
                  voice.note = temp & 0x7f;
                  voice.pitch = 0;
                  voice.portamento = 0;
                  voice.enabled = chan.enabled = 0;

                  temp = 8 + (((info & 0x3f) + voice.soundTranspose) << 6);
                  if (temp >= 0 && temp < this.vols.length) this.vols.position = temp;
 
                  voice.volStep = 0;
                  voice.volSpeed = voice.volCtr = this.vols.readUbyte();
                  voice.volSustain = 0;

                  voice.frqPos = 8 + (this.vols.readUbyte() << 6);
                  voice.frqStep = 0;
                  voice.frqSustain = 0;

                  voice.vibratoFlag  = 0;
                  voice.vibratoSpeed = this.vols.readUbyte();
                  voice.vibratoDepth = voice.vibrato = this.vols.readUbyte();
                  voice.vibratoDelay = this.vols.readUbyte();
                  voice.volPos = this.vols.position;
                }

                if (info & 0x40) {
                  voice.portamento = 0;
                } else if (info & 0x80) {
                  voice.portamento = this.pats[this.pats.position + 1];
                  if (this.version == FUTURECOMP_10) voice.portamento <<= 1;
                }
                voice.patStep += 2;
                voice = voice.next;
              }

              if (this.seqs.position != base) {
                temp = this.seqs.readUbyte();
                if (temp) this.speed = temp;
              }
              this.tick = this.speed;
            }
            voice = this.voices[0];

            while (voice) {
              chan = voice.channel;

              do {
                loopSustain = 0;

                if (voice.frqSustain) {
                  voice.frqSustain--;
                  break;
                }
                this.frqs.position = voice.frqPos + voice.frqStep;

                do {
                  loopEffect = 0;
                  if (!this.frqs.bytesAvailable) break;
                  info = this.frqs.readUbyte();
                  if (info == 0xe1) break;

                  if (info == 0xe0) {
                    voice.frqStep = this.frqs.readUbyte() & 0x3f;
                    this.frqs.position = voice.frqPos + voice.frqStep;
                    info = this.frqs.readUbyte();
                  }

                  switch (info) {
                    case 0xe2:  //set wave
                      chan.enabled  = 0;
                      voice.enabled = 1
                      voice.volCtr  = 1;
                      voice.volStep = 0;
                    case 0xe4:  //change wave:
                      sample = this.samples[this.frqs.readUbyte()];
                      if (sample) {
                        chan.pointer = sample.pointer;
                        chan.length  = sample.length;
                      } else {
                        voice.enabled = 0;
                      }
                      voice.sample = sample;
                      voice.frqStep += 2;
                      break;
                    case 0xe9:  //set pack
                      temp = 100 + (this.frqs.readUbyte() * 10);
                      sample = this.samples[temp + this.frqs.readUbyte()];

                      if (sample) {
                        chan.enabled = 0;
                        chan.pointer = sample.pointer;
                        chan.length  = sample.length;
                        voice.enabled = 1;
                      }

                      voice.sample = sample;
                      voice.volCtr = 1;
                      voice.volStep = 0;
                      voice.frqStep += 3;
                      break;
                    case 0xe7:  //new sequence
                      loopEffect = 1;
                      voice.frqPos = 8 + (this.frqs.readUbyte() << 6);
                      if (voice.frqPos >= this.frqs.length) voice.frqPos = 0;
                      voice.frqStep = 0;
                      this.frqs.position = voice.frqPos;
                      break;
                    case 0xea:  //pitch bend
                      voice.pitchBendSpeed = this.frqs.readByte();
                      voice.pitchBendTime  = this.frqs.readUbyte();
                      voice.frqStep += 3;
                      break;
                    case 0xe8:  //sustain
                      loopSustain = 1;
                      voice.frqSustain = this.frqs.readUbyte();
                      voice.frqStep += 2;
                      break;
                    case 0xe3:  //new vibrato
                      voice.vibratoSpeed = this.frqs.readUbyte();
                      voice.vibratoDepth = this.frqs.readUbyte();
                      voice.frqStep += 3;
                      break;
                  }

                  if (!loopSustain && !loopEffect) {
                    this.frqs.position = voice.frqPos + voice.frqStep;
                    voice.frqTranspose = this.frqs.readByte();
                    voice.frqStep++;
                  }
                } while (loopEffect);
              } while (loopSustain);

              if (voice.volSustain) {
                voice.volSustain--;
              } else {
                if (voice.volBendTime) {
                  voice.volumeBend();
                } else {
                  if (--voice.volCtr == 0) {
                    voice.volCtr = voice.volSpeed;

                    do {
                      loopEffect = 0;
                      this.vols.position = voice.volPos + voice.volStep;
                      if (!this.vols.bytesAvailable) break;
                      info = this.vols.readUbyte();
                      if (info == 0xe1) break;

                      switch (info) {
                        case 0xea: //volume slide
                          voice.volBendSpeed = this.vols.readByte();
                          voice.volBendTime  = this.vols.readUbyte();
                          voice.volStep += 3;
                          voice.volumeBend();
                          break;
                        case 0xe8: //volume sustain
                          voice.volSustain = this.vols.readUbyte();
                          voice.volStep += 2;
                          break;
                        case 0xe0: //volume loop
                          loopEffect = 1;
                          temp = this.vols.readUbyte() & 0x3f;
                          voice.volStep = temp - 5;
                          break;
                        default:
                          voice.volume = info;
                          voice.volStep++;
                          break;
                      }
                    } while (loopEffect);
                  }
                }
              }
              info = voice.frqTranspose;
              if (info >= 0) info += (voice.note + voice.transpose);
              info &= 0x7f;
              period = PERIODS[info];

              if (voice.vibratoDelay) {
                voice.vibratoDelay--;
              } else {
                temp = voice.vibrato;

                if (voice.vibratoFlag) {
                  delta = voice.vibratoDepth << 1;
                  temp += voice.vibratoSpeed;

                  if (temp > delta) {
                    temp = delta;
                    voice.vibratoFlag = 0;
                  }
                } else {
                  temp -= voice.vibratoSpeed;

                  if (temp < 0) {
                    temp = 0;
                    voice.vibratoFlag = 1;
                  }
                }
                voice.vibrato = temp;
                temp -= voice.vibratoDepth;
                base = (info << 1) + 160;

                while (base < 256) {
                  temp <<= 1;
                  base += 24;
                }
                period += temp;
              }
              voice.portamentoFlag ^= 1;

              if (voice.portamentoFlag && voice.portamento) {
                if (voice.portamento > 0x1f)
                  voice.pitch += voice.portamento & 0x1f;
                else
                  voice.pitch -= voice.portamento;
              }
              voice.pitchBendFlag ^= 1;

              if (voice.pitchBendFlag && voice.pitchBendTime) {
                voice.pitchBendTime--;
                voice.pitch -= voice.pitchBendSpeed;
              }
              period += voice.pitch;

              if (period < 113) period = 113;
                else if (period > 3424) period = 3424;

              chan.period = period;
              chan.volume = voice.volume;

              if (voice.sample) {
                sample = voice.sample;
                chan.enabled = voice.enabled;
                chan.pointer = sample.loopPtr;
                chan.length  = sample.repeat;
              }
              voice = voice.next;
            }
        }}
      });

      o.voices[0] = FCVoice(0);
      o.voices[0].next = o.voices[1] = FCVoice(1);
      o.voices[1].next = o.voices[2] = FCVoice(2);
      o.voices[2].next = o.voices[3] = FCVoice(3);

      return Object.seal(o);
    }

    var FUTURECOMP_10 = 1,
        FUTURECOMP_14 = 2,

        PERIODS = [
          1712,1616,1524,1440,1356,1280,1208,1140,1076,1016, 960, 906,
           856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 453,
           428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240, 226,
           214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120, 113,
           113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113,
          3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,1920,1812,
          1712,1616,1524,1440,1356,1280,1208,1140,1076,1016, 960, 906,
           856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 453,
           428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240, 226,
           214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120, 113,
           113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113, 113],

        WAVES = [
            16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,
            16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,  16,
             8,   8,   8,   8,   8,   8,   8,   8,  16,   8,  16,  16,   8,   8,  24, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56,  63,
            55,  47,  39,  31,  23,  15,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
            55,  47,  39,  31,  23,  15,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72,  47,  39,  31,  23,  15,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80,  39,  31,  23,  15,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88,  31,  23,  15,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,  23,  15,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,  15,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,   7,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,  -1,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,-128,   7,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,-128,-120,  15,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,-128,-120,-112,  23,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,-128,-120,-112,-104,  31,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,-128,-120,-112,-104, -96,  39,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,-128,-120,-112,-104, -96, -88,  47,  55, -64,
           -64, -48, -40, -32, -24, -16,  -8,   0,  -8, -16, -24, -32, -40, -48, -56, -64,
           -72, -80, -88, -96,-104,-112,-120,-128,-120,-112,-104, -96, -88, -80,  55,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127, 127,
           127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
           127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127,-127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127,-127,-127, 127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127, 127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127, 127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127, 127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127, 127, 127, 127, 127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,
          -127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127,-127, 127, 127, 127,-128,
          -128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,
          -128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128, 127, 127,-128,
          -128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,
          -128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128,-128, 127,-128,
          -128,-128,-128,-128,-128,-128,-128, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128,-128,-128,-128,-128,-128, 127, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128,-128,-128,-128,-128, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128,-128,-128,-128, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128,-128,-128, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128,-128, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127,-128,
          -128,-112,-104, -96, -88, -80, -72, -64, -56, -48, -40, -32, -24, -16,  -8,   0,
             8,  16,  24,  32,  40,  48,  56,  64,  72,  80,  88,  96, 104, 112, 127,-128,
          -128, -96, -80, -64, -48, -32, -16,   0,  16,  32,  48,  64,  80,  96, 112,  69,
            69, 121, 125, 122, 119, 112, 102,  97,  88,  83,  77,  44,  32,  24,  18,   4,
           -37, -45, -51, -58, -68, -75, -82, -88, -93, -99,-103,-109,-114,-117,-118,  69,
            69, 121, 125, 122, 119, 112, 102,  91,  75,  67,  55,  44,  32,  24,  18,   4,
            -8, -24, -37, -49, -58, -66, -80, -88, -92, -98,-102,-107,-108,-115,-125,   0,
             0,  64,  96, 127,  96,  64,  32,   0, -32, -64, -96,-128, -96, -64, -32,   0,
             0,  64,  96, 127,  96,  64,  32,   0, -32, -64, -96,-128, -96, -64, -32,-128,
          -128,-112,-104, -96, -88, -80, -72, -64, -56, -48, -40, -32, -24, -16,  -8,   0,
             8,  16,  24,  32,  40,  48,  56,  64,  72,  80,  88,  96, 104, 112, 127,-128,
          -128, -96, -80, -64, -48, -32, -16,   0,  16,  32,  48,  64,  80,  96, 112];

    window.neoart.FCPlayer = FCPlayer;
  })();


  (function() {
    function FEVoice(idx, bit) {
      return Object.create(null, {
        index         : { value:idx,  writable:true },
        bitFlag       : { value:bit,  writable:true },
        next          : { value:null, writable:true },
        channel       : { value:null, writable:true },
        sample        : { value:null, writable:true },
        trackPos      : { value:0,    writable:true },
        patternPos    : { value:0,    writable:true },
        tick          : { value:0,    writable:true },
        busy          : { value:0,    writable:true },
        synth         : { value:0,    writable:true },
        note          : { value:0,    writable:true },
        period        : { value:0,    writable:true },
        volume        : { value:0,    writable:true },
        envelopePos   : { value:0,    writable:true },
        sustainTime   : { value:0,    writable:true },
        arpeggioPos   : { value:0,    writable:true },
        arpeggioSpeed : { value:0,    writable:true },
        portamento    : { value:0,    writable:true },
        portaCounter  : { value:0,    writable:true },
        portaDelay    : { value:0,    writable:true },
        portaFlag     : { value:0,    writable:true },
        portaLimit    : { value:0,    writable:true },
        portaNote     : { value:0,    writable:true },
        portaPeriod   : { value:0,    writable:true },
        portaSpeed    : { value:0,    writable:true },
        vibrato       : { value:0,    writable:true },
        vibratoDelay  : { value:0,    writable:true },
        vibratoDepth  : { value:0,    writable:true },
        vibratoFlag   : { value:0,    writable:true },
        vibratoSpeed  : { value:0,    writable:true },
        pulseCounter  : { value:0,    writable:true },
        pulseDelay    : { value:0,    writable:true },
        pulseDir      : { value:0,    writable:true },
        pulsePos      : { value:0,    writable:true },
        pulseSpeed    : { value:0,    writable:true },
        blendCounter  : { value:0,    writable:true },
        blendDelay    : { value:0,    writable:true },
        blendDir      : { value:0,    writable:true },
        blendPos      : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel       = null;
            this.sample        = null;
            this.trackPos      = 0;
            this.patternPos    = 0;
            this.tick          = 1;
            this.busy          = 1;
            this.note          = 0;
            this.period        = 0;
            this.volume        = 0;
            this.envelopePos   = 0;
            this.sustainTime   = 0;
            this.arpeggioPos   = 0;
            this.arpeggioSpeed = 0;
            this.portamento    = 0;
            this.portaCounter  = 0;
            this.portaDelay    = 0;
            this.portaFlag     = 0;
            this.portaLimit    = 0;
            this.portaNote     = 0;
            this.portaPeriod   = 0;
            this.portaSpeed    = 0;
            this.vibrato       = 0;
            this.vibratoDelay  = 0;
            this.vibratoDepth  = 0;
            this.vibratoFlag   = 0;
            this.vibratoSpeed  = 0;
            this.pulseCounter  = 0;
            this.pulseDelay    = 0;
            this.pulseDir      = 0;
            this.pulsePos      = 0;
            this.pulseSpeed    = 0;
            this.blendCounter  = 0;
            this.blendDelay    = 0;
            this.blendDir      = 0;
            this.blendPos      = 0;
        }}
      });
    }
    function FESample() {
      return Object.create(null, {
        pointer       : { value:0,    writable:true },
        loopPtr       : { value:0,    writable:true },
        length        : { value:0,    writable:true },
        relative      : { value:0,    writable:true },
        type          : { value:0,    writable:true },
        synchro       : { value:0,    writable:true },
        envelopeVol   : { value:0,    writable:true },
        attackSpeed   : { value:0,    writable:true },
        attackVol     : { value:0,    writable:true },
        decaySpeed    : { value:0,    writable:true },
        decayVol      : { value:0,    writable:true },
        sustainTime   : { value:0,    writable:true },
        releaseSpeed  : { value:0,    writable:true },
        releaseVol    : { value:0,    writable:true },
        arpeggio      : { value:null, writable:true },
        arpeggioLimit : { value:0,    writable:true },
        arpeggioSpeed : { value:0,    writable:true },
        vibratoDelay  : { value:0,    writable:true },
        vibratoDepth  : { value:0,    writable:true },
        vibratoSpeed  : { value:0,    writable:true },
        pulseCounter  : { value:0,    writable:true },
        pulseDelay    : { value:0,    writable:true },
        pulsePosL     : { value:0,    writable:true },
        pulsePosH     : { value:0,    writable:true },
        pulseSpeed    : { value:0,    writable:true },
        pulseRateNeg  : { value:0,    writable:true },
        pulseRatePos  : { value:0,    writable:true },
        blendCounter  : { value:0,    writable:true },
        blendDelay    : { value:0,    writable:true },
        blendRate     : { value:0,    writable:true }
      });
    }
    function FESong() {
      return Object.create(null, {
        speed  : { value:0,  writable:true },
        length : { value:0,  writable:true },
        tracks : { value:[], writable:true }
      });
    }
    function FEPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id       : { value:"FEPlayer" },
        songs    : { value:[],   writable:true },
        samples  : { value:[],   writable:true },
        patterns : { value:null, writable:true },
        song     : { value:null, writable:true },
        voices   : { value:[],   writable:true },
        complete : { value:0,    writable:true },
        sampFlag : { value:0,    writable:true },

        initialize: {
          value: function() {
            var i, len, voice = this.voices[3];
            this.reset();

            this.song  = this.songs[this.playSong];
            this.speed = this.song.speed;

            this.complete = 15;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.patternPos = this.song.tracks[voice.index][0];

              i = voice.synth;
              len = i + 64;
              for (; i < len; ++i) this.mixer.memory[i] = 0;

              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var basePtr, dataPtr, i, j, len, pos, ptr, sample, size, song, tracksLen, value;

            while (stream.position < 16) {
              value = stream.readUshort();
              stream.position += 2;
              if (value != 0x4efa) return;                                            //jmp
            }

            while (stream.position < 1024) {
              value = stream.readUshort();

              if (value == 0x123a) {                                                  //move.b $x,d1
                stream.position += 2;
                value = stream.readUshort();

                if (value == 0xb001) {                                                //cmp.b d1,d0
                  stream.position -= 4;
                  dataPtr = (stream.position + stream.readUshort()) - 0x895;
                }
              } else if (value == 0x214a) {                                           //move.l a2,(a0)
                stream.position += 2;
                value = stream.readUshort();

                if (value == 0x47fa) {                                                //lea $x,a3
                  basePtr = stream.position + stream.readShort();
                  this.version = 1;
                  break;
                }
              }
            }

            if (!this.version) return;

            stream.position = dataPtr + 0x8a2;
            pos = stream.readUint();
            stream.position = basePtr + pos;
            this.samples = [];
            pos = 0x7fffffff;

            while (pos > stream.position) {
              value = stream.readUint();

              if (value) {
                if ((value < stream.position) || (value >= stream.length)) {
                  stream.position -= 4;
                  break;
                }

                if (value < pos) pos = basePtr + value;
              }

              sample = FESample();
              sample.pointer  = value;
              sample.loopPtr  = stream.readShort();
              sample.length   = stream.readUshort() << 1;
              sample.relative = stream.readUshort();

              sample.vibratoDelay = stream.readUbyte();
              stream.position++;
              sample.vibratoSpeed = stream.readUbyte();
              sample.vibratoDepth = stream.readUbyte();
              sample.envelopeVol  = stream.readUbyte();
              sample.attackSpeed  = stream.readUbyte();
              sample.attackVol    = stream.readUbyte();
              sample.decaySpeed   = stream.readUbyte();
              sample.decayVol     = stream.readUbyte();
              sample.sustainTime  = stream.readUbyte();
              sample.releaseSpeed = stream.readUbyte();
              sample.releaseVol   = stream.readUbyte();

              sample.arpeggio = new Int8Array(16);
              for (i = 0; i < 16; ++i) sample.arpeggio[i] = stream.readByte();

              sample.arpeggioSpeed = stream.readUbyte();
              sample.type          = stream.readByte();
              sample.pulseRateNeg  = stream.readByte();
              sample.pulseRatePos  = stream.readUbyte();
              sample.pulseSpeed    = stream.readUbyte();
              sample.pulsePosL     = stream.readUbyte();
              sample.pulsePosH     = stream.readUbyte();
              sample.pulseDelay    = stream.readUbyte();
              sample.synchro       = stream.readUbyte();
              sample.blendRate     = stream.readUbyte();
              sample.blendDelay    = stream.readUbyte();
              sample.pulseCounter  = stream.readUbyte();
              sample.blendCounter  = stream.readUbyte();
              sample.arpeggioLimit = stream.readUbyte();

              stream.position += 12;
              this.samples.push(sample);
              if (!stream.bytesAvailable) break;
            }

            if (pos != 0x7fffffff) {
              this.mixer.store(stream, stream.length - pos);
              len = this.samples.length;

              for (i = 0; i < len; ++i) {
                sample = this.samples[i];
                if (sample.pointer) sample.pointer -= (basePtr + pos);
              }
            }

            pos = this.mixer.memory.length;
            this.mixer.memory.length += 256;
            this.mixer.loopLen = 100;

            for (i = 0; i < 4; ++i) {
              this.voices[i].synth = pos;
              pos += 64;
            }

            stream.position = dataPtr + 0x8a2;
            len = stream.readUint();
            pos = stream.readUint();
            stream.position = basePtr + pos;
            this.patterns = ByteArray(new ArrayBuffer((len - pos)));
            stream.readBytes(this.patterns, 0, (len - pos));
            pos += basePtr;

            stream.position = dataPtr + 0x895;
            this.lastSong = len = stream.readUbyte();

            this.songs = [];
            this.songs.length = ++len;
            basePtr = dataPtr + 0xb0e;
            tracksLen = pos - basePtr;
            pos = 0;

            for (i = 0; i < len; ++i) {
              song = FESong();
              song.tracks = [];

              for (j = 0; j < 4; ++j) {
                stream.position = basePtr + pos;
                value = stream.readUshort();

                if (j == 3 && (i == (len - 1))) size = tracksLen;
                  else size = stream.readUshort();

                size = (size - value) >> 1;
                if (size > song.length) song.length = size;

                song.tracks[j] = new Uint32Array(size);
                stream.position = basePtr + value;

                for (ptr = 0; ptr < size; ++ptr)
                  song.tracks[j][ptr] = stream.readUshort();

                pos += 2;
              }

              stream.position = dataPtr + 0x897 + i;
              song.speed = stream.readUbyte();
              this.songs[i] = song;
            }

            stream.clear();
            stream = null;
        }},
        process: {
          value: function() {
            var chan, i, j, len, loop, pos, sample, value, voice = this.voices[3];

            while (voice) {
              chan = voice.channel;
              loop = 0;

              do {
                this.patterns.position = voice.patternPos;
                sample = voice.sample;
                this.sampFlag = 0;

                if (!voice.busy) {
                  voice.busy = 1;

                  if (sample.loopPtr == 0) {
                    chan.pointer = this.mixer.loopPtr;
                    chan.length  = this.mixer.loopLen;
                  } else if (sample.loopPtr > 0) {
                    chan.pointer = (sample.type) ? voice.synth : sample.pointer + sample.loopPtr;
                    chan.length  = sample.length - sample.loopPtr;
                  }
                }

                if (--voice.tick == 0) {
                  loop = 2;

                  while (loop > 1) {
                    value = this.patterns.readByte();

                    if (value < 0) {
                      switch (value) {
                        case -125:
                          voice.sample = sample = this.samples[this.patterns.readUbyte()];
                          this.sampFlag = 1;
                          voice.patternPos = this.patterns.position;
                          break;
                        case -126:
                          this.speed = this.patterns.readUbyte();
                          voice.patternPos = this.patterns.position;
                          break;
                        case -127:
                          value = (sample) ? sample.relative : 428;
                          voice.portaSpeed = this.patterns.readUbyte() * this.speed;
                          voice.portaNote  = this.patterns.readUbyte();
                          voice.portaLimit = (PERIODS[voice.portaNote] * value) >> 10;
                          voice.portamento = 0;
                          voice.portaDelay = this.patterns.readUbyte() * this.speed;
                          voice.portaFlag  = 1;
                          voice.patternPos = this.patterns.position;
                          break;
                        case -124:
                          chan.enabled = 0;
                          voice.tick = this.speed;
                          voice.busy = 1;
                          voice.patternPos = this.patterns.position;
                          loop = 0;
                          break;
                        case -128:
                          voice.trackPos++;

                          while (1) {
                            value = this.song.tracks[voice.index][voice.trackPos];

                            if (value == 65535) {
                              this.mixer.complete = 1;
                            } else if (value > 32767) {
                              voice.trackPos = (value ^ 32768) >> 1;

                              if (!this.loopSong) {
                                this.complete &= ~(voice.bitFlag);
                                if (!this.complete) this.mixer.complete = 1;
                              }
                            } else {
                              voice.patternPos = value;
                              voice.tick = 1;
                              loop = 1;
                              break;
                            }
                          }
                          break;
                        default:
                          voice.tick = this.speed * -value;
                          voice.patternPos = this.patterns.position;
                          loop = 0;
                          break;
                      }
                    } else {
                      loop = 0;
                      voice.patternPos = this.patterns.position;

                      voice.note = value;
                      voice.arpeggioPos =  0;
                      voice.vibratoFlag = -1;
                      voice.vibrato     =  0;

                      voice.arpeggioSpeed = sample.arpeggioSpeed;
                      voice.vibratoDelay  = sample.vibratoDelay;
                      voice.vibratoSpeed  = sample.vibratoSpeed;
                      voice.vibratoDepth  = sample.vibratoDepth;

                      if (sample.type == 1) {
                        if (this.sampFlag || (sample.synchro & 2)) {
                          voice.pulseCounter = sample.pulseCounter;
                          voice.pulseDelay = sample.pulseDelay;
                          voice.pulseDir = 0;
                          voice.pulsePos = sample.pulsePosL;
                          voice.pulseSpeed = sample.pulseSpeed;

                          i = voice.synth;
                          len = i + sample.pulsePosL;
                          for (; i < len; ++i) this.mixer.memory[i] = sample.pulseRateNeg;
                          len += (sample.length - sample.pulsePosL);
                          for (; i < len; ++i) this.mixer.memory[i] = sample.pulseRatePos;
                        }

                        chan.pointer = voice.synth;
                      } else if (sample.type == 2) {
                        voice.blendCounter = sample.blendCounter;
                        voice.blendDelay = sample.blendDelay;
                        voice.blendDir = 0;
                        voice.blendPos = 1;

                        i = sample.pointer;
                        j = voice.synth;
                        len = i + 31;
                        for (; i < len; ++i) this.mixer.memory[j++] = this.mixer.memory[i];

                        chan.pointer = voice.synth;
                      } else {
                        chan.pointer = sample.pointer;
                      }

                      voice.tick = this.speed;
                      voice.busy = 0;
                      voice.period = (PERIODS[voice.note] * sample.relative) >> 10;

                      voice.volume = 0;
                      voice.envelopePos = 0;
                      voice.sustainTime = sample.sustainTime;

                      chan.length  = sample.length;
                      chan.period  = voice.period;
                      chan.volume  = 0;
                      chan.enabled = 1;

                      if (voice.portaFlag) {
                        if (!voice.portamento) {
                          voice.portamento   = voice.period;
                          voice.portaCounter = 1;
                          voice.portaPeriod  = voice.portaLimit - voice.period;
                        }
                      }
                    }
                  }
                } else if (voice.tick == 1) {
                  value = (this.patterns.readAt(voice.patternPos) - 160) & 255;
                  if (value > 127) chan.enabled = 0;
                }
              } while (loop > 0);

              if (!chan.enabled) {
                voice = voice.next;
                continue;
              }

              value = voice.note + sample.arpeggio[voice.arpeggioPos];

              if (--voice.arpeggioSpeed == 0) {
                voice.arpeggioSpeed = sample.arpeggioSpeed;

                if (++voice.arpeggioPos == sample.arpeggioLimit)
                  voice.arpeggioPos = 0;
              }

              voice.period = (PERIODS[value] * sample.relative) >> 10;

              if (voice.portaFlag) {
                if (voice.portaDelay) {
                  voice.portaDelay--;
                } else {
                  voice.period += ((voice.portaCounter * voice.portaPeriod) / voice.portaSpeed);

                  if (++voice.portaCounter > voice.portaSpeed) {
                    voice.note = voice.portaNote;
                    voice.portaFlag = 0;
                  }
                }
              }

              if (voice.vibratoDelay) {
                voice.vibratoDelay--;
              } else {
                if (voice.vibratoFlag) {
                  if (voice.vibratoFlag < 0) {
                    voice.vibrato += voice.vibratoSpeed;

                    if (voice.vibrato == voice.vibratoDepth)
                      voice.vibratoFlag ^= 0x80000000;
                  } else {
                    voice.vibrato -= voice.vibratoSpeed;

                    if (voice.vibrato == 0)
                      voice.vibratoFlag ^= 0x80000000;
                  }

                  if (voice.vibrato == 0) voice.vibratoFlag ^= 1;

                  if (voice.vibratoFlag & 1) {
                    voice.period += voice.vibrato;
                  } else {
                    voice.period -= voice.vibrato;
                  }
                }
              }

              chan.period = voice.period;

              switch (voice.envelopePos) {
                case 4: break;
                case 0:
                  voice.volume += sample.attackSpeed;

                  if (voice.volume >= sample.attackVol) {
                    voice.volume = sample.attackVol;
                    voice.envelopePos = 1;
                  }
                  break;
                case 1:
                  voice.volume -= sample.decaySpeed;

                  if (voice.volume <= sample.decayVol) {
                    voice.volume = sample.decayVol;
                    voice.envelopePos = 2;
                  }
                  break;
                case 2:
                  if (voice.sustainTime) {
                    voice.sustainTime--;
                  } else {
                    voice.envelopePos = 3;
                  }
                  break;
                case 3:
                  voice.volume -= sample.releaseSpeed;

                  if (voice.volume <= sample.releaseVol) {
                    voice.volume = sample.releaseVol;
                    voice.envelopePos = 4;
                  }
                  break;
              }

              value = sample.envelopeVol << 12;
              value >>= 8;
              value >>= 4;
              value *= voice.volume;
              value >>= 8;
              value >>= 1;
              chan.volume = value;

              if (sample.type == 1) {
                if (voice.pulseDelay) {
                  voice.pulseDelay--;
                } else {
                  if (voice.pulseSpeed) {
                    voice.pulseSpeed--;
                  } else {
                    if (voice.pulseCounter || !(sample.synchro & 1)) {
                      voice.pulseSpeed = sample.pulseSpeed;

                      if (voice.pulseDir & 4) {
                        while (1) {
                          if (voice.pulsePos >= sample.pulsePosL) {
                            loop = 1;
                            break;
                          }

                          voice.pulseDir &= -5;
                          voice.pulsePos++;
                          voice.pulseCounter--;

                          if (voice.pulsePos <= sample.pulsePosH) {
                            loop = 2;
                            break;
                          }

                          voice.pulseDir |= 4;
                          voice.pulsePos--;
                          voice.pulseCounter--;
                        }
                      } else {
                        while (1) {
                          if (voice.pulsePos <= sample.pulsePosH) {
                            loop = 2;
                            break;
                          }

                          voice.pulseDir |= 4;
                          voice.pulsePos--;
                          voice.pulseCounter--;

                          if (voice.pulsePos >= sample.pulsePosL) {
                            loop = 1;
                            break;
                          }

                          voice.pulseDir &= -5;
                          voice.pulsePos++;
                          voice.pulseCounter++;
                        }
                      }

                      pos = voice.synth + voice.pulsePos;

                      if (loop == 1) {
                        this.mixer.memory[pos] = sample.pulseRatePos;
                        voice.pulsePos--;
                      } else {
                        this.mixer.memory[pos] = sample.pulseRateNeg;
                        voice.pulsePos++;
                      }
                    }
                  }
                }
              } else if (sample.type == 2) {
                if (voice.blendDelay) {
                  voice.blendDelay--;
                } else {
                  if (voice.blendCounter || !(sample.synchro & 4)) {
                    if (voice.blendDir) {
                      if (voice.blendPos != 1) {
                        voice.blendPos--;
                      } else {
                        voice.blendDir ^= 1;
                        voice.blendCounter--;
                      }
                    } else {
                      if (voice.blendPos != (sample.blendRate << 1)) {
                        voice.blendPos++;
                      } else {
                        voice.blendDir ^= 1;
                        voice.blendCounter--;
                      }
                    }

                    i = sample.pointer;
                    j = voice.synth;
                    len = i + 31;
                    pos = len + 1;

                    for (; i < len; ++i) {
                      value = (voice.blendPos * this.mixer.memory[pos++]) >> sample.blendRate;
                      this.mixer.memory[pos++] = value + this.mixer.memory[i];
                    }
                  }
                }
              }

              voice = voice.next;
            }
        }}
      });

      o.voices[3] = FEVoice(3,8);
      o.voices[3].next = o.voices[2] = FEVoice(2,4);
      o.voices[2].next = o.voices[1] = FEVoice(1,2);
      o.voices[1].next = o.voices[0] = FEVoice(0,1);

      return Object.seal(o);
    }

    var PERIODS = [
          8192,7728,7296,6888,6504,6136,5792,5464,5160,
          4872,4600,4336,4096,3864,3648,3444,3252,3068,
          2896,2732,2580,2436,2300,2168,2048,1932,1824,
          1722,1626,1534,1448,1366,1290,1218,1150,1084,
          1024, 966, 912, 861, 813, 767, 724, 683, 645,
           609, 575, 542, 512, 483, 456, 430, 406, 383,
           362, 341, 322, 304, 287, 271, 256, 241, 228,
           215, 203, 191, 181, 170, 161, 152, 143, 135];

    window.neoart.FEPlayer = FEPlayer;
  })();


  (function() {
    function FXVoice(idx) {
      return Object.create(null, {
        index       : { value:idx,  writable:true },
        next        : { value:null, writable:true },
        channel     : { value:null, writable:true },
        sample      : { value:null, writable:true },
        enabled     : { value:0,    writable:true },
        period      : { value:0,    writable:true },
        effect      : { value:0,    writable:true },
        param       : { value:0,    writable:true },
        volume      : { value:0,    writable:true },
        last        : { value:0,    writable:true },
        slideCtr    : { value:0,    writable:true },
        slideDir    : { value:0,    writable:true },
        slideParam  : { value:0,    writable:true },
        slidePeriod : { value:0,    writable:true },
        slideSpeed  : { value:0,    writable:true },
        stepPeriod  : { value:0,    writable:true },
        stepSpeed   : { value:0,    writable:true },
        stepWanted  : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel     = null;
            this.sample      = null;
            this.enabled     = 0;
            this.period      = 0;
            this.effect      = 0;
            this.param       = 0;
            this.volume      = 0;
            this.last        = 0;
            this.slideCtr    = 0;
            this.slideDir    = 0;
            this.slideParam  = 0;
            this.slidePeriod = 0;
            this.slideSpeed  = 0;
            this.stepPeriod  = 0;
            this.stepSpeed   = 0;
            this.stepWanted  = 0;
        }}
      });
    }
    function FXPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id         : { value:"FXPlayer" },
        standard   : { value:0,    writable:true },
        track      : { value:null, writable:true },
        patterns   : { value:[],   writable:true },
        samples    : { value:[],   writable:true },
        length     : { value:0,    writable:true },
        voices     : { value:[],   writable:true },
        trackPos   : { value:0,    writable:true },
        patternPos : { value:0,    writable:true },
        jumpFlag   : { value:0,    writable:true },
        delphine   : { value:0,    writable:true },

        force: {
          set: function(value) {
            if (value < SOUNDFX_10)
              value = SOUNDFX_10;
            else if (value > SOUNDFX_20)
              value = SOUNDFX_20;

            this.version = value;
        }},
        ntsc: {
          set: function(value) {
            this.standard = value;
            this.frequency(value);

            value = (value) ? 20.44952532 : 20.637767904;
            value = (value * (this.sampleRate / 1000)) / 120;
            this.mixer.samplesTick = ((this.tempo / 122) * value) >> 0;
        }},

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();
            this.ntsc = this.standard;

            this.speed      = 6;
            this.trackPos   = 0;
            this.patternPos = 0;
            this.jumpFlag   = 0;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[0];
              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var higher = 0, i, id, j, len, offset, row, sample, size = 0, value;
            if (stream.length < 1686) return;

            stream.position = 60;
            id = stream.readString(4);

            if (id != "SONG") {
              stream.position = 124;
              id = stream.readString(4);
              if (id != "SO31") return;
              if (stream.length < 2350) return;

              offset = 544;
              this.samples.length = len = 32;
              this.version = SOUNDFX_20;
            } else {
              offset = 0;
              this.samples.length = len = 16;
              this.version = SOUNDFX_10;
            }

            this.tempo = stream.readUshort();
            stream.position = 0;

            for (i = 1; i < len; ++i) {
              value = stream.readUint();

              if (value) {
                sample = AmigaSample();
                sample.pointer = size;
                size += value;
                this.samples[i] = sample;
              } else {
                this.samples[i] = null;
              }
            }
            stream.position += 20;

            for (i = 1; i < len; ++i) {
              sample = this.samples[i];
              if (!sample) {
                stream.position += 30;
                continue;
              }

              sample.name   = stream.readString(22);
              sample.length = stream.readUshort() << 1;
              sample.volume = stream.readUshort();
              sample.loop   = stream.readUshort();
              sample.repeat = stream.readUshort() << 1;
            }

            stream.position = 530 + offset;
            this.length = len = stream.readUbyte();
            stream.position++;

            for (i = 0; i < len; ++i) {
              value = stream.readUbyte() << 8;
              this.track[i] = value;
              if (value > higher) higher = value;
            }

            if (offset) offset += 4;
            stream.position = 660 + offset;
            higher += 256;
            this.patterns.length = higher;

            len = this.samples.length;

            for (i = 0; i < higher; ++i) {
              row = AmigaRow();
              row.note   = stream.readShort();
              value      = stream.readUbyte();
              row.param  = stream.readUbyte();
              row.effect = value & 0x0f;
              row.sample = value >> 4;

              this.patterns[i] = row;

              if (this.version == SOUNDFX_20) {
                if (row.note & 0x1000) {
                  row.sample += 16;
                  if (row.note > 0) row.note &= 0xefff;
                }
              } else {
                if (row.effect == 9 || row.note > 856)
                  this.version = SOUNDFX_18;

                if (row.note < -3)
                  this.version = SOUNDFX_19;
              }
              if (row.sample >= len || this.samples[row.sample] == null) row.sample = 0;
            }

            this.mixer.store(stream, size);

            for (i = 1; i < len; ++i) {
              sample = this.samples[i];
              if (!sample) continue;

              if (sample.loop) {
                sample.loopPtr = sample.pointer + sample.loop;
              } else {
                sample.loopPtr = this.mixer.memory.length;
                sample.repeat  = 2;
              }
              size = sample.pointer + 4;
              for (j = sample.pointer; j < size; ++j) this.mixer.memory[j] = 0;
            }

            sample = AmigaSample();
            sample.pointer = sample.loopPtr = this.mixer.memory.length;
            sample.length  = sample.repeat  = 2;
            this.samples[0] = sample;

            stream.position = higher = this.delphine = 0;
            for (i = 0; i < 265; ++i) higher += stream.readUshort();

            switch (higher) {
              case 172662:
              case 1391423:
              case 1458300:
              case 1706977:
              case 1920077:
              case 1920694:
              case 1677853:
              case 1931956:
              case 1926836:
              case 1385071:
              case 1720635:
              case 1714491:
              case 1731874:
              case 1437490:
                this.delphine = 1;
                break;
            }
        }},
        process: {
          value: function() {
            var chan, index, period, row, sample, value, voice = this.voices[0];

            if (!this.tick) {
              value = this.track[this.trackPos] + this.patternPos;

              while (voice) {
                chan = voice.channel;
                voice.enabled = 0;

                row = this.patterns[value + voice.index];
                voice.period = row.note;
                voice.effect = row.effect;
                voice.param  = row.param;

                if (row.note == -3) {
                  voice.effect = 0;
                  voice = voice.next;
                  continue;
                }

                if (row.sample) {
                  sample = voice.sample = this.samples[row.sample];
                  voice.volume = sample.volume;

                  if (voice.effect == 5)
                    voice.volume += voice.param;
                  else if (voice.effect == 6)
                    voice.volume -= voice.param;

                  chan.volume = voice.volume;
                } else {
                  sample = voice.sample;
                }

                if (voice.period) {
                  voice.last = voice.period;
                  voice.slideSpeed = 0;
                  voice.stepSpeed  = 0;

                  voice.enabled = 1;
                  chan.enabled  = 0;

                  switch (voice.period) {
                    case -2:
                      chan.volume = 0;
                      break;
                    case -4:
                      this.jumpFlag = 1;
                      break;
                    case -5:
                      break;
                    default:
                      chan.pointer = sample.pointer;
                      chan.length  = sample.length;

                      if (this.delphine) chan.period = voice.period << 1;
                        else chan.period  = voice.period;
                      break;
                  }

                  if (voice.enabled) chan.enabled = 1;
                  chan.pointer = sample.loopPtr;
                  chan.length  = sample.repeat;
                }
                voice = voice.next;
              }
            } else {
              while (voice) {
                chan = voice.channel;

                if (this.version == SOUNDFX_18 && voice.period == -3) {
                  voice = voice.next;
                  continue;
                }

                if (voice.stepSpeed) {
                  voice.stepPeriod += voice.stepSpeed;

                  if (voice.stepSpeed < 0) {
                    if (voice.stepPeriod < voice.stepWanted) {
                      voice.stepPeriod = voice.stepWanted;
                      if (this.version > SOUNDFX_18) voice.stepSpeed = 0;
                    }
                  } else {
                    if (voice.stepPeriod > voice.stepWanted) {
                      voice.stepPeriod = voice.stepWanted;
                      if (this.version > SOUNDFX_18) voice.stepSpeed = 0;
                    }
                  }

                  if (this.version > SOUNDFX_18) voice.last = voice.stepPeriod;
                  chan.period = voice.stepPeriod;
                } else {
                  if (voice.slideSpeed) {
                    value = voice.slideParam & 0x0f;

                    if (value) {
                      if (++voice.slideCtr == value) {
                        voice.slideCtr = 0;
                        value = (voice.slideParam << 4) << 3;

                        if (!voice.slideDir) {
                          voice.slidePeriod += 8;
                          chan.period = voice.slidePeriod;
                          value += voice.slideSpeed;
                          if (value == voice.slidePeriod) voice.slideDir = 1;
                        } else {
                          voice.slidePeriod -= 8;
                          chan.period = voice.slidePeriod;
                          value -= voice.slideSpeed;
                          if (value == voice.slidePeriod) voice.slideDir = 0;
                        }
                      } else {
                        voice = voice.next;
                        continue;
                      }
                    }
                  }

                  value = 0;

                  switch (voice.effect) {
                    case 0:
                      break;
                    case 1:   //arpeggio
                      value = this.tick % 3;
                      index = 0;

                      if (value == 2) {
                        chan.period = voice.last;
                        voice = voice.next;
                        continue;
                      }

                      if (value == 1) value = voice.param & 0x0f;
                        else value = voice.param >> 4;

                      while (voice.last != PERIODS[index]) index++;
                      chan.period = PERIODS[index + value];
                      break;
                    case 2:   //pitchbend
                      value = voice.param >> 4;
                      if (value) voice.period += value;
                        else voice.period -= voice.param & 0x0f;
                      chan.period = voice.period;
                      break;
                    case 3:   //filter on
                      this.mixer.filter.active = 1;
                      break;
                    case 4:   //filter off
                      this.mixer.filter.active = 0;
                      break;
                    case 8:   //step down
                      value = -1;
                    case 7:   //step up
                      voice.stepSpeed  = voice.param & 0x0f;
                      voice.stepPeriod = this.version > SOUNDFX_18 ? voice.last : voice.period;
                      if (value < 0) voice.stepSpeed = -voice.stepSpeed;
                      index = 0;

                      while (true) {
                        period = PERIODS[index];
                        if (period == voice.stepPeriod) break;
                        if (period < 0) {
                          index = -1;
                          break;
                        } else
                          index++;
                      }

                      if (index > -1) {
                        period = voice.param >> 4;
                        if (value > -1) period = -period;
                        index += period;
                        if (index < 0) index = 0;
                        voice.stepWanted = PERIODS[index];
                      } else
                        voice.stepWanted = voice.period;
                      break;
                    case 9:   //auto slide
                      voice.slideSpeed = voice.slidePeriod = voice.period;
                      voice.slideParam = voice.param;
                      voice.slideDir = 0;
                      voice.slideCtr = 0;
                      break;
                  }
                }
                voice = voice.next;
              }
            }

            if (++this.tick == this.speed) {
              this.tick = 0;
              this.patternPos += 4;

              if (this.patternPos == 256 || this.jumpFlag) {
                this.patternPos = this.jumpFlag = 0;

                if (++this.trackPos == this.length) {
                  this.trackPos = 0;
                  this.mixer.complete = 1;
                }
              }
            }
        }}
      });

      o.voices[0] = FXVoice(0);
      o.voices[0].next = o.voices[1] = FXVoice(1);
      o.voices[1].next = o.voices[2] = FXVoice(2);
      o.voices[2].next = o.voices[3] = FXVoice(3);

      o.track = new Uint16Array(128);
      return Object.seal(o);
    }

    var SOUNDFX_10 = 1,
        SOUNDFX_18 = 2,
        SOUNDFX_19 = 3,
        SOUNDFX_20 = 4,

        PERIODS = [
          1076,1016,960,906,856,808,762,720,678,640,604,570,
           538, 508,480,453,428,404,381,360,339,320,302,285,
           269, 254,240,226,214,202,190,180,170,160,151,143,
           135, 127,120,113,113,113,113,113,113,113,113,113,
           113, 113,113,113,113,113,113,113,113,113,113,113,
           113, 113,113,113,113,113,-1];

    window.neoart.FXPlayer = FXPlayer;
  })();


  (function() {
    function HMVoice(idx) {
      return Object.create(null, {
        index        : { value:idx,  writable:true },
        next         : { value:null, writable:true },
        channel      : { value:null, writable:true },
        sample       : { value:null, writable:true },
        enabled      : { value:0,    writable:true },
        period       : { value:0,    writable:true },
        effect       : { value:0,    writable:true },
        param        : { value:0,    writable:true },
        volume1      : { value:0,    writable:true },
        volume2      : { value:0,    writable:true },
        handler      : { value:0,    writable:true },
        portaDir     : { value:0,    writable:true },
        portaPeriod  : { value:0,    writable:true },
        portaSpeed   : { value:0,    writable:true },
        vibratoPos   : { value:0,    writable:true },
        vibratoSpeed : { value:0,    writable:true },
        wavePos      : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel      = null;
            this.sample       = null;
            this.enabled      = 0;
            this.period       = 0;
            this.effect       = 0;
            this.param        = 0;
            this.volume1      = 0;
            this.volume2      = 0;
            this.handler      = 0;
            this.portaDir     = 0;
            this.portaPeriod  = 0;
            this.portaSpeed   = 0;
            this.vibratoPos   = 0;
            this.vibratoSpeed = 0;
            this.wavePos      = 0;
        }}
      });
    }
    function HMSample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        finetune : { value:0,    writable:true },
        restart  : { value:0,    writable:true },
        waveLen  : { value:0,    writable:true },
        waves    : { value:null, writable:true },
        volumes  : { value:null, writable:true }
      });

      return Object.seal(o);
    }
    function HMPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id         : { value:"HMPlayer" },
        track      : { value:null, writable:true },
        patterns   : { value:[],   writable:true },
        samples    : { value:[],   writable:true },
        length     : { value:0,    writable:true },
        restart    : { value:0,    writable:true },
        voices     : { value:[],   writable:true },
        trackPos   : { value:0,    writable:true },
        patternPos : { value:0,    writable:true },
        jumpFlag   : { value:0,    writable:true },

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();

            this.speed      = 6;
            this.trackPos   = 0;
            this.patternPos = 0;
            this.jumpFlag   = 0;

            this.mixer.samplesTick = 884;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[0];
              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var count = 0, higher = 0, i, id, j, mupp = 0, position, row, sample, size = 0, value;
            if (stream.length < 2106) return;

            stream.position = 1080;
            id = stream.readString(4);
            if (id != "FEST") return;

            stream.position = 950;
            this.length  = stream.readUbyte();
            this.restart = stream.readUbyte();

            for (i = 0; i < 128; ++i)
              this.track[i] = stream.readUbyte();

            stream.position = 0;
            this.title = stream.readString(20);
            this.version = 1;

            for (i = 1; i < 32; ++i) {
              this.samples[i] = null;
              id = stream.readString(4);

              if (id == "Mupp") {
                value = stream.readUbyte();
                count = value - higher++;
                for (j = 0; j < 128; ++j)
                  if (this.track[j] && this.track[j] >= count) this.track[j]--;

                sample = HMSample();
                sample.name = id;
                sample.length  = sample.repeat = 32;
                sample.restart = stream.readUbyte();
                sample.waveLen = stream.readUbyte();
                stream.position += 17;
                sample.finetune = stream.readByte();
                sample.volume   = stream.readUbyte();

                position = stream.position + 4;
                value = 1084 + (value << 10);
                stream.position = value;

                sample.pointer = this.mixer.memory.length;
                sample.waves   = new Uint16Array(64);
                sample.volumes = new Uint8Array(64);
                this.mixer.store(stream, 896);

                for (j = 0; j < 64; ++j)
                  sample.waves[j] = stream.readUbyte() << 5;
                for (j = 0; j < 64; ++j)
                  sample.volumes[j] = stream.readUbyte() & 127;

                stream.position = value;
                stream.writeInt(0x666c6f64);
                stream.position = position;
                mupp += 896;
              } else {
                id = id.substr(0, 2);
                if (id == "El")
                  stream.position += 18;
                else {
                  stream.position -= 4;
                  id = stream.readString(22);
                }

                value = stream.readUshort();
                if (!value) {
                  stream.position += 6;
                  continue;
                }

                sample = HMSample();
                sample.name = id;
                sample.pointer  = size;
                sample.length   = value << 1;
                sample.finetune = stream.readByte();
                sample.volume   = stream.readUbyte();
                sample.loop     = stream.readUshort() << 1;
                sample.repeat   = stream.readUshort() << 1;
                size += sample.length;
              }
              this.samples[i] = sample;
            }

            for (i = 0; i < 128; ++i) {
              value = this.track[i] << 8;
              this.track[i] = value;
              if (value > higher) higher = value;
            }

            stream.position = 1084;
            higher += 256;
            this.patterns.length = higher;

            for (i = 0; i < higher; ++i) {
              value = stream.readUint();
              while (value == 0x666c6f64) {
                stream.position += 1020;
                value = stream.readUint();
              }

              row = AmigaRow();
              row.note   = (value >> 16) & 0x0fff;
              row.sample = (value >> 24) & 0xf0 | (value >> 12) & 0x0f;
              row.effect = (value >>  8) & 0x0f;
              row.param  = value & 0xff;

              if (row.sample > 31 || !this.samples[row.sample]) row.sample = 0;

              this.patterns[i] = row;
            }

            this.mixer.store(stream, size);

            for (i = 1; i < 32; ++i) {
              sample = this.samples[i];
              if (sample == null || sample.name == "Mupp") continue;
              sample.pointer += mupp;

              if (sample.loop) {
                sample.loopPtr = sample.pointer + sample.loop;
                sample.length  = sample.loop + sample.repeat;
              } else {
                sample.loopPtr = this.mixer.memory.length;
                sample.repeat  = 2;
              }
              size = sample.pointer + 4;
              for (j = sample.pointer; j < size; ++j) this.mixer.memory[j] = 0;
            }

            sample = HMSample();
            sample.pointer = sample.loopPtr = this.mixer.memory.length;
            sample.length  = sample.repeat  = 2;
            this.samples[0] = sample;
        }},
        process: {
          value: function() {
            var chan, pattern, row, sample, value, voice = this.voices[0];

            if (!this.tick) {
              pattern = this.track[this.trackPos] + this.patternPos;

              while (voice) {
                chan = voice.channel;
                voice.enabled = 0;

                row = this.patterns[pattern + voice.index];
                voice.effect = row.effect;
                voice.param  = row.param;

                if (row.sample) {
                  sample = voice.sample = this.samples[row.sample];
                  voice.volume2 = sample.volume;

                  if (sample.name == "Mupp") {
                    sample.loopPtr = sample.pointer + sample.waves[0];
                    voice.handler = 1;
                    voice.volume1 = sample.volumes[0];
                  } else {
                    voice.handler = 0;
                    voice.volume1 = 64;
                  }
                } else {
                  sample = voice.sample;
                }

                if (row.note) {
                  if (voice.effect == 3 || voice.effect == 5) {
                    if (row.note < voice.period) {
                      voice.portaDir = 1;
                      voice.portaPeriod = row.note;
                    } else if (row.note > voice.period) {
                      voice.portaDir = 0;
                      voice.portaPeriod = row.note;
                    } else {
                      voice.portaPeriod = 0;
                    }
                  } else {
                    voice.period     = row.note;
                    voice.vibratoPos = 0;
                    voice.wavePos    = 0;
                    voice.enabled    = 1;

                    chan.enabled = 0;
                    value = (voice.period * sample.finetune) >> 8;
                    chan.period = voice.period + value;

                    if (voice.handler) {
                      chan.pointer = sample.loopPtr;
                      chan.length  = sample.repeat;
                    } else {
                      chan.pointer = sample.pointer;
                      chan.length  = sample.length;
                    }
                  }
                }

                switch (voice.effect) {
                  case 11:  //position jump
                    this.trackPos = voice.param - 1;
                    this.jumpFlag = 1;
                    break;
                  case 12:  //set volume
                    voice.volume2 = voice.param;
                    if (voice.volume2 > 64) voice.volume2 = 64;
                    break;
                  case 13:  //pattern break
                    this.jumpFlag = 1;
                    break;
                  case 14:  //set filter
                    this.mixer.filter.active = voice.param ^ 1;
                    break;
                  case 15:  //set speed
                    value = voice.param;

                    if (value < 1) value = 1;
                      else if (value > 31) value = 31;

                    this.speed = value;
                    this.tick = 0;
                    break;
                }

                if (!row.note) this.effects(voice);
                this.handler(voice);

                if (voice.enabled) chan.enabled = 1;
                chan.pointer = sample.loopPtr;
                chan.length  = sample.repeat;

                voice = voice.next;
              }
            } else {
              while (voice) {
                this.effects(voice);
                this.handler(voice);

                sample = voice.sample;
                voice.channel.pointer = sample.loopPtr;
                voice.channel.length  = sample.repeat;

                voice = voice.next;
              }
            }

            if (++this.tick == this.speed) {
              this.tick = 0;
              this.patternPos += 4;

              if (this.patternPos == 256 || this.jumpFlag) {
                this.patternPos = this.jumpFlag = 0;
                this.trackPos = (++this.trackPos & 127);

                if (this.trackPos == this.length) {
                  this.trackPos = this.restart;
                  this.mixer.complete = 1;
                }
              }
            }
        }},
        effects: {
          value: function(voice) {
            var chan = voice.channel, i, len, period = voice.period & 0x0fff, slide, value;

            if (voice.effect || voice.param) {
              switch (voice.effect) {
                case 0:   //arpeggio
                  value = this.tick % 3;
                  if (!value) break;
                  if (value == 1) value = voice.param >> 4;
                    else value = voice.param & 0x0f;

                  len = 37 - value;

                  for (i = 0; i < len; ++i) {
                    if (period >= PERIODS[i]) {
                      period = PERIODS[i + value];
                      break;
                    }
                  }
                  break;
                case 1:   //portamento up
                  voice.period -= voice.param;
                  if (voice.period < 113) voice.period = 113;
                  period = voice.period;
                  break;
                case 2:   //portamento down
                  voice.period += voice.param;
                  if (voice.period > 856) voice.period = 856;
                  period = voice.period;
                  break;
                case 3:   //tone portamento
                case 5:   //tone portamento + volume slide
                  if (voice.effect == 5) slide = 1;
                  else if (voice.param) {
                    voice.portaSpeed = voice.param;
                    voice.param = 0;
                  }

                  if (voice.portaPeriod) {
                    if (voice.portaDir) {
                      voice.period -= voice.portaSpeed;

                      if (voice.period < voice.portaPeriod) {
                        voice.period = voice.portaPeriod;
                        voice.portaPeriod = 0;
                      }
                    } else {
                      voice.period += voice.portaSpeed;

                      if (voice.period > voice.portaPeriod) {
                        voice.period = voice.portaPeriod;
                        voice.portaPeriod = 0;
                      }
                    }
                  }
                  period = voice.period;
                  break;
                case 4:   //vibrato
                case 6:   //vibrato + volume slide;
                  if (voice.effect == 6) slide = 1;
                    else if (voice.param) voice.vibratoSpeed = voice.param;

                  value = VIBRATO[(voice.vibratoPos >> 2) & 31];
                  value = ((voice.vibratoSpeed & 0x0f) * value) >> 7;

                  if (voice.vibratoPos > 127) period -= value;
                    else period += value;

                  value = (voice.vibratoSpeed >> 2) & 60;
                  voice.vibratoPos = (voice.vibratoPos + value) & 255;
                  break;
                case 7:   //mega arpeggio
                  value = MEGARPEGGIO[(voice.vibratoPos & 0x0f) + ((voice.param & 0x0f) << 4)];
                  voice.vibratoPos++;

                  for (i = 0; i < 37; ++i) if (period >= PERIODS[i]) break;

                  value += i;
                  if (value > 35) value -= 12;
                  period = PERIODS[value];
                  break;
                case 10:  //volume slide
                  slide = 1;
                  break;
              }
            }
            chan.period = period + ((period * voice.sample.finetune) >> 8);

            if (slide) {
              value = voice.param >> 4;

              if (value) voice.volume2 += value;
                else voice.volume2 -= voice.param & 0x0f;

              if (voice.volume2 > 64) voice.volume2 = 64;
                else if (voice.volume2 < 0) voice.volume2 = 0;
            }
        }},
        handler: {
          value: function(voice) {
            var sample;

            if (voice.handler) {
              sample = voice.sample;
              sample.loopPtr = sample.pointer + sample.waves[voice.wavePos];

              voice.volume1 = sample.volumes[voice.wavePos];

              if (++voice.wavePos > sample.waveLen) {
                voice.wavePos = sample.restart;
              }
            }
            voice.channel.volume = (voice.volume1 * voice.volume2) >> 6;
        }}
      });

      o.voices[0] = HMVoice(0);
      o.voices[0].next = o.voices[1] = HMVoice(1);
      o.voices[1].next = o.voices[2] = HMVoice(2);
      o.voices[2].next = o.voices[3] = HMVoice(3);

      o.track = new Uint16Array(128);
      return Object.seal(o);
    }

    var MEGARPEGGIO = [
           0, 3, 7,12,15,12, 7, 3, 0, 3, 7,12,15,12, 7, 3,
           0, 4, 7,12,16,12, 7, 4, 0, 4, 7,12,16,12, 7, 4,
           0, 3, 8,12,15,12, 8, 3, 0, 3, 8,12,15,12, 8, 3,
           0, 4, 8,12,16,12, 8, 4, 0, 4, 8,12,16,12, 8, 4,
           0, 5, 8,12,17,12, 8, 5, 0, 5, 8,12,17,12, 8, 5,
           0, 5, 9,12,17,12, 9, 5, 0, 5, 9,12,17,12, 9, 5,
          12, 0, 7, 0, 3, 0, 7, 0,12, 0, 7, 0, 3, 0, 7, 0,
          12, 0, 7, 0, 4, 0, 7, 0,12, 0, 7, 0, 4, 0, 7, 0,
           0, 3, 7, 3, 7,12, 7,12,15,12, 7,12, 7, 3, 7, 3,
           0, 4, 7, 4, 7,12, 7,12,16,12, 7,12, 7, 4, 7, 4,
          31,27,24,19,15,12, 7, 3, 0, 3, 7,12,15,19,24,27,
          31,28,24,19,16,12, 7, 4, 0, 4, 7,12,16,19,24,28,
           0,12, 0,12, 0,12, 0,12, 0,12, 0,12, 0,12, 0,12,
           0,12,24,12, 0,12,24,12, 0,12,24,12, 0,12,24,12,
           0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3,
           0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4],

        PERIODS = [
          856,808,762,720,678,640,604,570,538,508,480,453,
          428,404,381,360,339,320,302,285,269,254,240,226,
          214,202,190,180,170,160,151,143,135,127,120,113,0],

        VIBRATO = [
            0, 24, 49, 74, 97,120,141,161,180,197,212,224,
          235,244,250,253,255,253,250,244,235,224,212,197,
          180,161,141,120, 97, 74, 49, 24];

    window.neoart.HMPlayer = HMPlayer;
  })();


  (function() {
    function JHVoice(idx) {
      return Object.create(null, {
        index       : { value:idx,  writable:true },
        next        : { value:null, writable:true },
        channel     : { value:null, writable:true },
        enabled     : { value:0,    writable:true },
        cosoCounter : { value:0,    writable:true },
        cosoSpeed   : { value:0,    writable:true },
        trackPtr    : { value:0,    writable:true },
        trackPos    : { value:0,    writable:true },
        trackTransp : { value:0,    writable:true },
        patternPtr  : { value:0,    writable:true },
        patternPos  : { value:0,    writable:true },
        frqseqPtr   : { value:0,    writable:true },
        frqseqPos   : { value:0,    writable:true },
        volseqPtr   : { value:0,    writable:true },
        volseqPos   : { value:0,    writable:true },
        sample      : { value:0,    writable:true },
        loopPtr     : { value:0,    writable:true },
        repeat      : { value:0,    writable:true },
        tick        : { value:0,    writable:true },
        note        : { value:0,    writable:true },
        transpose   : { value:0,    writable:true },
        info        : { value:0,    writable:true },
        infoPrev    : { value:0,    writable:true },
        volume      : { value:0,    writable:true },
        volCounter  : { value:0,    writable:true },
        volSpeed    : { value:0,    writable:true },
        volSustain  : { value:0,    writable:true },
        volTransp   : { value:0,    writable:true },
        volFade     : { value:0,    writable:true },
        portaDelta  : { value:0,    writable:true },
        vibrato     : { value:0,    writable:true },
        vibDelay    : { value:0,    writable:true },
        vibDelta    : { value:0,    writable:true },
        vibDepth    : { value:0,    writable:true },
        vibSpeed    : { value:0,    writable:true },
        slide       : { value:0,    writable:true },
        sldActive   : { value:0,    writable:true },
        sldDone     : { value:0,    writable:true },
        sldCounter  : { value:0,    writable:true },
        sldSpeed    : { value:0,    writable:true },
        sldDelta    : { value:0,    writable:true },
        sldPointer  : { value:0,    writable:true },
        sldLen      : { value:0,    writable:true },
        sldEnd      : { value:0,    writable:true },
        sldLoopPtr  : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel     = null;
            this.enabled     = 0;
            this.cosoCounter = 0;
            this.cosoSpeed   = 0;
            this.trackPtr    = 0
            this.trackPos    = 12;
            this.trackTransp = 0;
            this.patternPtr  = 0;
            this.patternPos  = 0;
            this.frqseqPtr   = 0;
            this.frqseqPos   = 0;
            this.volseqPtr   = 0;
            this.volseqPos   = 0;
            this.sample      = -1;
            this.loopPtr     = 0;
            this.repeat      = 0;
            this.tick        = 0;
            this.note        = 0;
            this.transpose   = 0;
            this.info        = 0;
            this.infoPrev    = 0;
            this.volume      = 0;
            this.volCounter  = 1;
            this.volSpeed    = 1;
            this.volSustain  = 0;
            this.volTransp   = 0;
            this.volFade     = 100;
            this.portaDelta  = 0;
            this.vibrato     = 0;
            this.vibDelay    = 0;
            this.vibDelta    = 0;
            this.vibDepth    = 0;
            this.vibSpeed    = 0;
            this.slide       = 0;
            this.sldActive   = 0;
            this.sldDone     = 0;
            this.sldCounter  = 0;
            this.sldSpeed    = 0;
            this.sldDelta    = 0;
            this.sldPointer  = 0;
            this.sldLen      = 0;
            this.sldEnd      = 0;
            this.sldLoopPtr  = 0;
        }}
      });
    }
    function JHSong() {
      return Object.create(null, {
        pointer : { value:0, writable:true },
        speed   : { value:0, writable:true },
        length  : { value:0, writable:true }
      });
    }
    function JHPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id          : { value:"JHPlayer" },
        songs       : { value:[],   writable:true },
        samples     : { value:[],   writable:true },
        stream      : { value:null, writable:true },
        base        : { value:0,    writable:true },
        patterns    : { value:0,    writable:true },
        patternLen  : { value:0,    writable:true },
        periods     : { value:0,    writable:true },
        frqseqs     : { value:0,    writable:true },
        volseqs     : { value:0,    writable:true },
        samplesData : { value:0,    writable:true },
        song        : { value:null, writable:true },
        voices      : { value:[],   writable:true },
        coso        : { value:0,    writable:true },
        variant     : { value:0,    writable:true },

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();

            this.song  = this.songs[this.playSong];
            this.speed = this.song.speed;
            this.tick  = (this.coso || this.variant > 1) ? 1 : this.speed;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.trackPtr = this.song.pointer + (voice.index * 3);

              if (this.coso) {
                voice.trackPos   = 0;
                voice.patternPos = 8;
              } else {
                this.stream.position = voice.trackPtr;
                voice.patternPtr = this.patterns + (this.stream.readUbyte() * this.patternLen);
                voice.trackTransp = this.stream.readByte();
                voice.volTransp = this.stream.readByte();

                voice.frqseqPtr = this.base;
                voice.volseqPtr = this.base;
              }

              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var headers, i, id, len, pos, sample, song, songsData, tracks, value = 0;

            this.base = this.periods = 0;
            this.coso = (stream.readString(4) == "COSO");

            if (this.coso) {
              for (i = 0; i < 7; ++i) value += stream.readInt();

              if (value == 16942) {
                stream.position = 47;
                value += stream.readUbyte();
              }

              switch (value) {
                case 22666:
                case 18842:
                case 30012:
                case 22466:
                case 3546:
                  this.variant = 1;
                  break;
                case 16948:
                case 18332:
                case 13698:
                  this.variant = 2;
                  break;
                case 18546:   //Wings of Death
                case 13926:
                case 8760:
                case 17242:
                case 11394:
                case 14494:
                case 14392:
                case 13576:  //Dragonflight
                case 6520:
                  this.variant = 3;
                  break;
                default:
                  this.variant = 4;
              }

              this.version = 2;
              stream.position = 4;

              this.frqseqs     = stream.readUint();
              this.volseqs     = stream.readUint();
              this.patterns    = stream.readUint();
              tracks           = stream.readUint();
              songsData        = stream.readUint();
              headers          = stream.readUint();
              this.samplesData = stream.readUint();

              stream.position = 0;
              stream.writeInt(0x1000000);
              stream.writeInt(0xe1);
              stream.writeShort(0xffff);

              len = ((this.samplesData - headers) / 10) - 1;
              this.lastSong = (headers - songsData) / 6;
            } else {
              while (stream.bytesAvailable > 12) {
                value = stream.readUshort();

                switch (value) {
                  case 0x0240:                                                        //andi.w #x,d0
                    value = stream.readUshort();

                    if (value == 0x007f) {                                            //andi.w #$7f,d0
                      stream.position += 2;
                      this.periods = stream.position + stream.readUshort();
                    }
                    break;
                  case 0x7002:                                                        //moveq #2,d0
                  case 0x7003:                                                        //moveq #3,d0
                    this.channels = value & 0xff;
                    value = stream.readUshort();
                    if (value == 0x7600) value = stream.readUshort();                 //moveq #0,d3

                    if (value == 0x41fa) {                                            //lea x,a0
                      stream.position += 4;
                      this.base = stream.position + stream.readUshort();
                    }
                    break;
                  case 0x5446:                                                        //"TF"
                    value = stream.readUshort();

                    if (value == 0x4d58) {                                            //"MX"
                      id = stream.position - 4;
                      stream.position = stream.length;
                    }
                    break;
                }
              }

              if (!id || !this.base || !this.periods) return;
              this.version = 1;

              stream.position = id + 4;
              this.frqseqs = pos = id + 32;
              value = stream.readUshort();
              this.volseqs = (pos += (++value << 6));

              value = stream.readUshort();
              this.patterns = (pos += (++value << 6));
              value = stream.readUshort();
              stream.position += 2;
              this.patternLen = stream.readUshort();
              tracks = (pos += (++value * this.patternLen));

              stream.position -= 4;
              value = stream.readUshort();
              songsData = (pos += (++value * 12));

              stream.position = id + 16;
              this.lastSong = stream.readUshort();
              headers = (pos += (++this.lastSong * 6));

              len = stream.readUshort();
              this.samplesData = pos + (len * 30);
            }

            stream.position = headers;
            this.samples = [];
            value = 0;

            for (i = 0; i < len; ++i) {
              sample = AmigaSample();
              if (!this.coso) sample.name = stream.readString(18);

              sample.pointer = stream.readUint();
              sample.length  = stream.readUshort() << 1;
              if (!this.coso) sample.volume  = stream.readUshort();
              sample.loopPtr = stream.readUshort() + sample.pointer;
              sample.repeat  = stream.readUshort() << 1;

              if (sample.loopPtr & 1) sample.loopPtr--;
              value += sample.length;
              this.samples[i] = sample;
            }

            stream.position = this.samplesData;
            this.mixer.store(stream, value);

            stream.position = songsData;
            this.songs = [];
            value = 0;

            for (i = 0; i < this.lastSong; ++i) {
              song = JHSong();
              song.pointer = stream.readUshort();
              song.length  = stream.readUshort() - song.pointer + 1;
              song.speed   = stream.readUshort();

              song.pointer = (song.pointer * 12) + tracks;
              song.length *= 12;
              if (song.length > 12) this.songs[value++] = song;
            }

            this.lastSong = this.songs.length - 1;

            if (!this.coso) {
              stream.position = 0;
              this.variant = 1;

              while (stream.position < id) {
                value = stream.readUshort();

                if (value == 0xb03c || value == 0x0c00) {                             //cmp.b #x,d0 | cmpi.b #x,d0
                  value = stream.readUshort();

                  if (value == 0x00e5 || value == 0x00e6 || value == 0x00e9) {        //effects
                    this.variant = 2;
                    break;
                  }
                } else if (value == 0x4efb) {                                         //jmp $(pc,d0.w)
                  this.variant = 3;
                  break;
                }
              }
            }

            this.stream = stream;
        }},
        process: {
          value: function() {
            var chan, loop, period, pos1, pos2, sample, value, voice = this.voices[0];

            if (--this.tick == 0) {
              this.tick = this.speed;

              while (voice) {
                chan = voice.channel;

                if (this.coso) {
                  if (--voice.cosoCounter < 0) {
                    voice.cosoCounter = voice.cosoSpeed;

                    do {
                      this.stream.position = voice.patternPos;

                      do {
                        loop = 0;
                        value = this.stream.readByte();

                        if (value == -1) {
                          if (voice.trackPos == this.song.length) {
                            voice.trackPos = 0;
                            this.mixer.complete = 1;
                          }

                          this.stream.position = voice.trackPtr + voice.trackPos;
                          value = this.stream.readUbyte();
                          voice.trackTransp = this.stream.readByte();
                          pos1 = this.stream.readAt(this.stream.position);

                          if ((this.variant > 3) && (pos1 > 127)) {
                            pos2 = (pos1 >> 4) & 15;
                            pos1 &= 15;

                            if (pos2 == 15) {
                              pos2 = 100;

                              if (pos1) {
                                pos2 = (15 - pos1) + 1;
                                pos2 <<= 1;
                                pos1 = pos2;
                                pos2 <<= 1;
                                pos2 += pos1;
                              }

                              voice.volFade = pos2;
                            } else if (pos2 == 8) {
                              this.mixer.complete = 1;
                            } else if (pos2 == 14) {
                              this.speed = pos1;
                            }
                          } else {
                            voice.volTransp = this.stream.readByte();
                          }

                          this.stream.position = this.patterns + (value << 1);
                          voice.patternPos = this.stream.readUshort();
                          voice.trackPos += 12;
                          loop = 1;
                        } else if (value == -2) {
                          voice.cosoCounter = voice.cosoSpeed = this.stream.readUbyte();
                          loop = 3;
                        } else if (value == -3) {
                          voice.cosoCounter = voice.cosoSpeed = this.stream.readUbyte();
                          voice.patternPos = this.stream.position;
                        } else {
                          voice.note = value;
                          voice.info = this.stream.readByte();

                          if (voice.info & 224) voice.infoPrev = this.stream.readByte();

                          voice.patternPos = this.stream.position;
                          voice.portaDelta = 0;

                          if (value >= 0) {
                            if (this.variant == 1) chan.enabled = 0;
                            value = (voice.info & 31) + voice.volTransp;
                            this.stream.position = this.volseqs + (value << 1);
                            this.stream.position = this.stream.readUshort();

                            voice.volCounter = voice.volSpeed = this.stream.readUbyte();
                            voice.volSustain = 0;
                            value = this.stream.readByte();

                            voice.vibSpeed = this.stream.readByte();
                            voice.vibrato  = 64;
                            voice.vibDepth = voice.vibDelta = this.stream.readByte();
                            voice.vibDelay = this.stream.readUbyte();

                            voice.volseqPtr = this.stream.position;
                            voice.volseqPos = 0;

                            if (value != -128) {
                              if (this.variant > 1 && (voice.info & 64)) value = voice.infoPrev;
                              this.stream.position = this.frqseqs + (value << 1);

                              voice.frqseqPtr = this.stream.readUshort();
                              voice.frqseqPos = 0;

                              voice.tick = 0;
                            }
                          }
                        }
                      } while (loop > 2);
                    } while (loop > 0);
                  }
                } else {
                  this.stream.position = voice.patternPtr + voice.patternPos;
                  value = this.stream.readByte();

                  if (voice.patternPos == this.patternLen || (value & 127) == 1) {
                    if (voice.trackPos == this.song.length) {
                      voice.trackPos = 0;
                      this.mixer.complete = 1;
                    }

                    this.stream.position = voice.trackPtr + voice.trackPos;
                    value = this.stream.readUbyte();
                    voice.trackTransp = this.stream.readByte();
                    voice.volTransp = this.stream.readByte();

                    if (voice.volTransp == -128) this.mixer.complete = 1;

                    voice.patternPtr = this.patterns + (value * this.patternLen);
                    voice.patternPos = 0;
                    voice.trackPos += 12;

                    this.stream.position = voice.patternPtr;
                    value = this.stream.readByte();
                  }

                  if (value & 127) {
                    voice.note = value & 127;
                    voice.portaDelta = 0;

                    pos1 = this.stream.position;
                    if (!voice.patternPos) this.stream.position += this.patternLen;
                    this.stream.position -= 2;

                    voice.infoPrev = this.stream.readByte();
                    this.stream.position = pos1;
                    voice.info = this.stream.readByte();

                    if (value >= 0) {
                      if (this.variant == 1) chan.enabled = 0;
                      value = (voice.info & 31) + voice.volTransp;
                      this.stream.position = this.volseqs + (value << 6);

                      voice.volCounter = voice.volSpeed = this.stream.readUbyte();
                      voice.volSustain = 0;
                      value = this.stream.readByte();

                      voice.vibSpeed = this.stream.readByte();
                      voice.vibrato  = 64;
                      voice.vibDepth = voice.vibDelta = this.stream.readByte();
                      voice.vibDelay = this.stream.readUbyte();

                      voice.volseqPtr = this.stream.position;
                      voice.volseqPos = 0;

                      if (this.variant > 1 && (voice.info & 64)) value = voice.infoPrev;

                      voice.frqseqPtr = this.frqseqs + (value << 6);
                      voice.frqseqPos = 0;

                      voice.tick = 0;
                    }
                  }
                  voice.patternPos += 2;
                }
                voice = voice.next;
              }
              voice = this.voices[0];
            }

            while (voice) {
              chan = voice.channel;
              voice.enabled = 0;

              do {
                loop = 0;

                if (voice.tick) {
                  voice.tick--;
                } else {
                  this.stream.position = voice.frqseqPtr + voice.frqseqPos;

                  do {
                    value = this.stream.readByte();
                    if (value == -31) break;
                    loop = 3;

                    if (this.variant == 3 && this.coso) {
                      if (value == -27) {
                        value = -30;
                      } else if (value == -26) {
                        value = -28;
                      }
                    }

                    switch (value) {
                      case -32:
                        voice.frqseqPos = (this.stream.readUbyte() & 63);
                        this.stream.position = voice.frqseqPtr + voice.frqseqPos;
                        break;
                      case -30:
                        sample = this.samples[this.stream.readUbyte()];
                        voice.sample = -1;

                        voice.loopPtr = sample.loopPtr;
                        voice.repeat  = sample.repeat;
                        voice.enabled = 1;

                        chan.enabled = 0;
                        chan.pointer = sample.pointer;
                        chan.length  = sample.length;

                        voice.volseqPos  = 0;
                        voice.volCounter = 1;
                        voice.slide = 0;
                        voice.frqseqPos += 2;
                        break;
                      case -29:
                        voice.vibSpeed = this.stream.readByte();
                        voice.vibDepth = this.stream.readByte();
                        voice.frqseqPos += 3;
                        break;
                      case -28:
                        sample = this.samples[this.stream.readUbyte()];
                        voice.loopPtr = sample.loopPtr;
                        voice.repeat  = sample.repeat;

                        chan.pointer = sample.pointer;
                        chan.length  = sample.length;

                        voice.slide = 0;
                        voice.frqseqPos += 2;
                        break;
                      case -27:
                        if (this.variant < 2) break;
                        sample = this.samples[this.stream.readUbyte()];
                        chan.enabled  = 0;
                        voice.enabled = 1;

                        if (this.variant == 2) {
                          pos1 = this.stream.readUbyte() * sample.length;

                          voice.loopPtr = sample.loopPtr + pos1;
                          voice.repeat  = sample.repeat;

                          chan.pointer = sample.pointer + pos1;
                          chan.length  = sample.length;

                          voice.frqseqPos += 3;
                        } else {
                          voice.sldPointer = sample.pointer;
                          voice.sldEnd = sample.pointer + sample.length;
                          value = this.stream.readUshort();

                          if (value == 0xffff) {
                            voice.sldLoopPtr = sample.length;
                          } else {
                            voice.sldLoopPtr = value << 1;
                          }

                          voice.sldLen     = this.stream.readUshort() << 1;
                          voice.sldDelta   = this.stream.readShort() << 1;
                          voice.sldActive  = 0;
                          voice.sldCounter = 0;
                          voice.sldSpeed   = this.stream.readUbyte();
                          voice.slide      = 1;
                          voice.sldDone    = 0;

                          voice.frqseqPos += 9;
                        }
                        voice.volseqPos  = 0;
                        voice.volCounter = 1;
                        break;
                      case -26:
                        if (this.variant < 3) break;

                        voice.sldLen     = this.stream.readUshort() << 1;
                        voice.sldDelta   = this.stream.readShort() << 1;
                        voice.sldActive  = 0;
                        voice.sldCounter = 0;
                        voice.sldSpeed   = this.stream.readUbyte();
                        voice.sldDone    = 0;

                        voice.frqseqPos += 6;
                        break;
                      case -25:
                        if (this.variant == 1) {
                          voice.frqseqPtr = this.frqseqs + (this.stream.readUbyte() << 6);
                          voice.frqseqPos = 0;

                          this.stream.position = voice.frqseqPtr;
                          loop = 3;
                        } else {
                          value = this.stream.readUbyte();

                          if (value != voice.sample) {
                            sample = this.samples[value];
                            voice.sample = value;

                            voice.loopPtr = sample.loopPtr;
                            voice.repeat  = sample.repeat;
                            voice.enabled = 1;

                            chan.enabled = 0;
                            chan.pointer = sample.pointer;
                            chan.length  = sample.length;
                          }

                          voice.volseqPos  = 0;
                          voice.volCounter = 1;
                          voice.slide = 0;
                          voice.frqseqPos += 2;
                        }
                        break;
                      case -24:
                        voice.tick = this.stream.readUbyte();
                        voice.frqseqPos += 2;
                        loop = 1;
                        break;
                      case -23:
                        if (this.variant < 2) break;
                        sample = this.samples[this.stream.readUbyte()];
                        voice.sample = -1;
                        voice.enabled = 1;

                        pos2 = this.stream.readUbyte();
                        pos1 = this.stream.position;
                        chan.enabled = 0;

                        this.stream.position = this.samplesData + sample.pointer + 4;
                        value = (this.stream.readUshort() * 24) + (this.stream.readUshort() << 2);
                        this.stream.position += (pos2 * 24);

                        voice.loopPtr = this.stream.readUint() & 0xfffffffe;
                        chan.length   = (this.stream.readUint() & 0xfffffffe) - voice.loopPtr;
                        voice.loopPtr += (sample.pointer + value + 8);
                        chan.pointer  = voice.loopPtr;
                        voice.repeat  = 2;

                        this.stream.position = pos1;
                        pos1 = voice.loopPtr + 1;
                        this.mixer.memory[pos1] = this.mixer.memory[voice.loopPtr];

                        voice.volseqPos  = 0;
                        voice.volCounter = 1;
                        voice.slide = 0;
                        voice.frqseqPos += 3;
                        break;
                      default:
                        voice.transpose = value;
                        voice.frqseqPos++;
                        loop = 0;
                    }
                  } while (loop > 2);
                }
              } while (loop > 0);

              if (voice.slide) {
                if (!voice.sldDone) {
                  if (--voice.sldCounter < 0) {
                    voice.sldCounter = voice.sldSpeed;

                    if (voice.sldActive) {
                      value = voice.sldLoopPtr + voice.sldDelta;

                      if (value < 0) {
                        voice.sldDone = 1;
                        value = voice.sldLoopPtr - voice.sldDelta;
                      } else {
                        pos1 = voice.sldPointer + voice.sldLen + value;

                        if (pos1 > voice.sldEnd) {
                          voice.sldDone = 1;
                          value = voice.sldLoopPtr - voice.sldDelta;
                        }
                      }
                      voice.sldLoopPtr = value;
                    } else {
                      voice.sldActive = 1;
                    }

                    voice.loopPtr = voice.sldPointer + voice.sldLoopPtr;
                    voice.repeat  = voice.sldLen;
                    chan.pointer  = voice.loopPtr;
                    chan.length   = voice.repeat;
                  }
                }
              }

              do {
                loop = 0;

                if (voice.volSustain) {
                  voice.volSustain--;
                } else {
                  if (--voice.volCounter) break;
                  voice.volCounter = voice.volSpeed;

                  do {
                    this.stream.position = voice.volseqPtr + voice.volseqPos;
                    value = this.stream.readByte();
                    if (value <= -25 && value >= -31) break;

                    switch (value) {
                      case -24:
                        voice.volSustain = this.stream.readUbyte();
                        voice.volseqPos += 2;
                        loop = 1;
                        break;
                      case -32:
                        voice.volseqPos = (this.stream.readUbyte() & 63) - 5;
                        loop = 3;
                        break;
                      default:
                        voice.volume = value;
                        voice.volseqPos++;
                        loop = 0;
                    }
                  } while (loop > 2);
                }
              } while (loop > 0);

              value = voice.transpose;
              if (value >= 0) value += (voice.note + voice.trackTransp);
              value &= 127;

              if (this.coso) {
                if (value > 83) value = 0;
                period = PERIODS[value];
                value <<= 1;
              } else {
                value <<= 1;
                this.stream.position = this.periods + value;
                period = this.stream.readUshort();
              }

              if (voice.vibDelay) {
                voice.vibDelay--;
              } else {
                if (this.variant > 3) {
                  if (voice.vibrato & 32) {
                    value = voice.vibDelta + voice.vibSpeed;

                    if (value > voice.vibDepth) {
                      voice.vibrato &= ~32;
                      value = voice.vibDepth;
                    }
                  } else {
                    value = voice.vibDelta - voice.vibSpeed;

                    if (value < 0) {
                      voice.vibrato |= 32;
                      value = 0;
                    }
                  }

                  voice.vibDelta = value;
                  value = (value - (voice.vibDepth >> 1)) * period;
                  period += (value >> 10);
                } else if (this.variant > 2) {
                  value = voice.vibSpeed;

                  if (value < 0) {
                    value &= 127;
                    voice.vibrato ^= 1;
                  }

                  if (!(voice.vibrato & 1)) {
                    if (voice.vibrato & 32) {
                      voice.vibDelta += value;
                      pos1 = voice.vibDepth << 1;

                      if (voice.vibDelta > pos1) {
                        voice.vibrato &= ~32;
                        voice.vibDelta = pos1;
                      }
                    } else {
                      voice.vibDelta -= value;

                      if (voice.vibDelta < 0) {
                        voice.vibrato |= 32;
                        voice.vibDelta = 0;
                      }
                    }
                  }

                  period += (value - voice.vibDepth);
                } else {
                  if (voice.vibrato >= 0 || !(voice.vibrato & 1)) {
                    if (voice.vibrato & 32) {
                      voice.vibDelta += voice.vibSpeed;
                      pos1 = voice.vibDepth << 1;

                      if (voice.vibDelta >= pos1) {
                        voice.vibrato &= ~32;
                        voice.vibDelta = pos1;
                      }
                    } else {
                      voice.vibDelta -= voice.vibSpeed;

                      if (voice.vibDelta < 0) {
                        voice.vibrato |= 32;
                        voice.vibDelta = 0;
                      }
                    }
                  }

                  pos1 = voice.vibDelta - voice.vibDepth;

                  if (pos1) {
                    value += 160;

                    while (value < 256) {
                      pos1 += pos1;
                      value += 24;
                    }

                    period += pos1;
                  }
                }
              }

              if (this.variant < 3) voice.vibrato ^= 1;

              if (voice.info & 32) {
                value = voice.infoPrev;

                if (this.variant > 3) {
                  if (value < 0) {
                    voice.portaDelta += (-value);
                    value = voice.portaDelta * period;
                    period += (value >> 10);
                  } else {
                    voice.portaDelta += value;
                    value = voice.portaDelta * period;
                    period -= (value >> 10);
                  }
                } else {
                  if (value < 0) {
                    voice.portaDelta += (-value << 11);
                    period += (voice.portaDelta >> 16);
                  } else {
                    voice.portaDelta += (value << 11);
                    period -= (voice.portaDelta >> 16);
                  }
                }
              }

              if (this.variant > 3) {
                value = (voice.volFade * voice.volume) / 100;
              } else {
                value = voice.volume;
              }

              chan.period = period;
              chan.volume = value;

              if (voice.enabled) {
                chan.enabled = 1;
                chan.pointer = voice.loopPtr;
                chan.length  = voice.repeat;
              }

              voice = voice.next;
            }
        }}
      });

      o.voices[0] = JHVoice(0);
      o.voices[0].next = o.voices[1] = JHVoice(1);
      o.voices[1].next = o.voices[2] = JHVoice(2);
      o.voices[2].next = o.voices[3] = JHVoice(3);

      return Object.seal(o);
    }

    var PERIODS = [
          1712,1616,1524,1440,1356,1280,1208,1140,1076,1016,
           960, 906, 856, 808, 762, 720, 678, 640, 604, 570,
           538, 508, 480, 453, 428, 404, 381, 360, 339, 320,
           302, 285, 269, 254, 240, 226, 214, 202, 190, 180,
           170, 160, 151, 143, 135, 127, 120, 113, 113, 113,
           113, 113, 113, 113, 113, 113, 113, 113, 113, 113,
          3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,
          1920,1812,6848,6464,6096,5760,5424,5120,4832,4560,
          4304,4064,3840,3624];

    window.neoart.JHPlayer = JHPlayer;
  })();


  (function() {
    function MKVoice(idx) {
      return Object.create(null, {
        index        : { value:idx,  writable:true },
        next         : { value:null, writable:true },
        channel      : { value:null, writable:true },
        sample       : { value:null, writable:true },
        enabled      : { value:0,    writable:true },
        period       : { value:0,    writable:true },
        effect       : { value:0,    writable:true },
        param        : { value:0,    writable:true },
        volume       : { value:0,    writable:true },
        portaDir     : { value:0,    writable:true },
        portaPeriod  : { value:0,    writable:true },
        portaSpeed   : { value:0,    writable:true },
        vibratoPos   : { value:0,    writable:true },
        vibratoSpeed : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel      = null;
            this.sample       = null;
            this.enabled      = 0;
            this.period       = 0;
            this.effect       = 0;
            this.param        = 0;
            this.volume       = 0;
            this.portaDir     = 0;
            this.portaPeriod  = 0;
            this.portaSpeed   = 0;
            this.vibratoPos   = 0;
            this.vibratoSpeed = 0;
        }}
      });
    }
    function MKPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id           : { value:"MKPlayer" },
        track        : { value:null, writable:true },
        patterns     : { value:[],   writable:true },
        samples      : { value:[],   writable:true },
        length       : { value:0,    writable:true },
        restart      : { value:0,    writable:true },
        voices       : { value:[],   writable:true },
        trackPos     : { value:0,    writable:true },
        patternPos   : { value:0,    writable:true },
        jumpFlag     : { value:0,    writable:true },
        vibratoDepth : { value:0,    writable:true },
        restartSave  : { value:0,    writable:true },

        force: {
          set: function(value) {
            if (value < SOUNDTRACKER_23)
              value = SOUNDTRACKER_23;
            else if (value > NOISETRACKER_20)
              value = NOISETRACKER_20;

            this.version = value;

            if (value == NOISETRACKER_20) this.vibratoDepth = 6;
              else this.vibratoDepth = 7;

            if (value == NOISETRACKER_10) {
              this.restartSave = this.restart;
              this.restart = 0;
            } else {
              this.restart = this.restartSave;
              this.restartSave = 0;
            }
        }},

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();
            this.force = this.version;

            this.speed      = 6;
            this.trackPos   = 0;
            this.patternPos = 0;
            this.jumpFlag   = 0;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[0];
              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var higher = 0, i, id, j, row, sample, size = 0, value;
            if (stream.length < 2106) return;

            stream.position = 1080;
            id = stream.readString(4);
            if (id != "M.K." && id != "FLT4") return;

            stream.position = 0;
            this.title = stream.readString(20);
            this.version = SOUNDTRACKER_23;
            stream.position += 22;

            for (i = 1; i < 32; ++i) {
              value = stream.readUshort();

              if (!value) {
                this.samples[i] = null;
                stream.position += 28;
                continue;
              }

              sample = AmigaSample();
              stream.position -= 24;

              sample.name = stream.readString(22);
              sample.length = value << 1;
              stream.position += 3;

              sample.volume = stream.readUbyte();
              sample.loop   = stream.readUshort() << 1;
              sample.repeat = stream.readUshort() << 1;

              stream.position += 22;
              sample.pointer = size;
              size += sample.length;
              this.samples[i] = sample;

              if (sample.length > 32768)
                this.version = SOUNDTRACKER_24;
            }

            stream.position = 950;
            this.length = stream.readUbyte();
            value = stream.readUbyte();
            this.restart = value < length ? value : 0;

            for (i = 0; i < 128; ++i) {
              value = stream.readUbyte() << 8;
              this.track[i] = value;
              if (value > higher) higher = value;
            }

            stream.position = 1084;
            higher += 256;
            this.patterns.length = higher;

            for (i = 0; i < higher; ++i) {
              row = AmigaRow();
              value = stream.readUint();

              row.note   = (value >> 16) & 0x0fff;
              row.effect = (value >>  8) & 0x0f;
              row.sample = (value >> 24) & 0xf0 | (value >> 12) & 0x0f;
              row.param  = value & 0xff;

              this.patterns[i] = row;

              if (row.sample > 31 || !this.samples[row.sample]) row.sample = 0;

              if (row.effect == 3 || row.effect == 4)
                this.version = NOISETRACKER_10;

              if (row.effect == 5 || row.effect == 6)
                this.version = NOISETRACKER_20;

              if (row.effect > 6 && row.effect < 10) {
                this.version = 0;
                return;
              }
            }

            this.mixer.store(stream, size);

            for (i = 1; i < 32; ++i) {
              sample = this.samples[i];
              if (!sample) continue;

              if (sample.name.indexOf("2.0") > -1)
                this.version = NOISETRACKER_20;

              if (sample.loop) {
                sample.loopPtr = sample.pointer + sample.loop;
                sample.length  = sample.loop + sample.repeat;
              } else {
                sample.loopPtr = this.mixer.memory.length;
                sample.repeat  = 2;
              }
              size = sample.pointer + 4;
              for (j = sample.pointer; j < size; ++j) this.mixer.memory[j] = 0;
            }

            sample = AmigaSample();
            sample.pointer = sample.loopPtr = this.mixer.memory.length;
            sample.length  = sample.repeat  = 2;
            this.samples[0] = sample;

            if (this.version < NOISETRACKER_20 && this.restart != 127)
              this.version = NOISETRACKER_11;
        }},
        process: {
          value: function() {
            var chan, i, len, pattern, period, row, sample, slide, value, voice = this.voices[0];

            if (!this.tick) {
              pattern = this.track[this.trackPos] + this.patternPos;

              while (voice) {
                chan = voice.channel;
                voice.enabled = 0;

                row = this.patterns[pattern + voice.index];
                voice.effect = row.effect;
                voice.param  = row.param;

                if (row.sample) {
                  sample = voice.sample = this.samples[row.sample];
                  chan.volume = voice.volume = sample.volume;
                } else {
                  sample = voice.sample;
                }

                if (row.note) {
                  if (voice.effect == 3 || voice.effect == 5) {
                    if (row.note < voice.period) {
                      voice.portaDir = 1;
                      voice.portaPeriod = row.note;
                    } else if (row.note > voice.period) {
                      voice.portaDir = 0;
                      voice.portaPeriod = row.note;
                    } else {
                      voice.portaPeriod = 0;
                    }
                  } else {
                    voice.enabled = 1;
                    voice.vibratoPos = 0;

                    chan.enabled = 0;
                    chan.pointer = sample.pointer;
                    chan.length  = sample.length;
                    chan.period  = voice.period = row.note;
                  }
                }

                switch (voice.effect) {
                  case 11:  //position jump
                    this.trackPos = voice.param - 1;
                    this.jumpFlag ^= 1;
                    break;
                  case 12:  //set volume
                    chan.volume = voice.param;

                    if (this.version == NOISETRACKER_20)
                      voice.volume = voice.param;
                    break;
                  case 13:  //pattern break
                    this.jumpFlag ^= 1;
                    break;
                  case 14:  //set filter
                    this.mixer.filter.active = voice.param ^ 1;
                    break;
                  case 15:  //set speed
                    value = voice.param;

                    if (value < 1) value = 1;
                      else if (value > 31) value = 31;

                    this.speed = value;
                    this.tick = 0;
                    break;
                }

                if (voice.enabled) chan.enabled = 1;
                chan.pointer = sample.loopPtr;
                chan.length  = sample.repeat;

                voice = voice.next;
              }
            } else {
              while (voice) {
                chan = voice.channel;

                if (!voice.effect && !voice.param) {
                  chan.period = voice.period;
                  voice = voice.next;
                  continue;
                }

                switch (voice.effect) {
                  case 0:   //arpeggio
                    value = this.tick % 3;

                    if (!value) {
                      chan.period = voice.period;
                      voice = voice.next;
                      continue;
                    }

                    if (value == 1) value = voice.param >> 4;
                      else value = voice.param & 0x0f;

                    period = voice.period & 0x0fff;
                    len = 37 - value;

                    for (i = 0; i < len; ++i) {
                      if (period >= PERIODS[i]) {
                        chan.period = PERIODS[i + value];
                        break;
                      }
                    }
                    break;
                  case 1:   //portamento up
                    voice.period -= voice.param;
                    if (voice.period < 113) voice.period = 113;
                    chan.period = voice.period;
                    break;
                  case 2:   //portamento down
                    voice.period += voice.param;
                    if (voice.period > 856) voice.period = 856;
                    chan.period = voice.period;
                    break;
                  case 3:   //tone portamento
                  case 5:   //tone portamento + volume slide
                    if (voice.effect == 5) {
                      slide = 1;
                    } else if (voice.param) {
                      voice.portaSpeed = voice.param;
                      voice.param = 0;
                    }

                    if (voice.portaPeriod) {
                      if (voice.portaDir) {
                        voice.period -= voice.portaSpeed;

                        if (voice.period <= voice.portaPeriod) {
                          voice.period = voice.portaPeriod;
                          voice.portaPeriod = 0;
                        }
                      } else {
                        voice.period += voice.portaSpeed;

                        if (voice.period >= voice.portaPeriod) {
                          voice.period = voice.portaPeriod;
                          voice.portaPeriod = 0;
                        }
                      }
                    }
                    chan.period = voice.period;
                    break;
                  case 4:   //vibrato
                  case 6:   //vibrato + volume slide
                    if (voice.effect == 6) {
                      slide = 1
                    } else if (voice.param) {
                      voice.vibratoSpeed = voice.param;
                    }

                    value = (voice.vibratoPos >> 2) & 31;
                    value = ((voice.vibratoSpeed & 0x0f) * VIBRATO[value]) >> this.vibratoDepth;

                    if (voice.vibratoPos > 127) chan.period = voice.period - value;
                      else chan.period = voice.period + value;

                    value = (voice.vibratoSpeed >> 2) & 60;
                    voice.vibratoPos = (voice.vibratoPos + value) & 255;
                    break;
                  case 10:  //volume slide
                    slide = 1;
                    break;
                }

                if (slide) {
                  value = voice.param >> 4;
                  slide = 0;

                  if (value) voice.volume += value;
                    else voice.volume -= voice.param & 0x0f;

                  if (voice.volume < 0) voice.volume = 0;
                    else if (voice.volume > 64) voice.volume = 64;

                  chan.volume = voice.volume;
                }
                voice = voice.next;
              }
            }

            if (++this.tick == this.speed) {
              this.tick = 0;
              this.patternPos += 4;

              if (this.patternPos == 256 || this.jumpFlag) {
                this.patternPos = this.jumpFlag = 0;
                this.trackPos = (++this.trackPos & 127);

                if (this.trackPos == this.length) {
                  this.trackPos = this.restart;
                  this.mixer.complete = 1;
                }
              }
            }
        }}
      });

      o.voices[0] = MKVoice(0);
      o.voices[0].next = o.voices[1] = MKVoice(1);
      o.voices[1].next = o.voices[2] = MKVoice(2);
      o.voices[2].next = o.voices[3] = MKVoice(3);

      o.track = new Uint16Array(128);
      return Object.seal(o);
    }

    var SOUNDTRACKER_23 = 1,
        SOUNDTRACKER_24 = 2,
        NOISETRACKER_10 = 3,
        NOISETRACKER_11 = 4,
        NOISETRACKER_20 = 5,

        PERIODS = [
          856,808,762,720,678,640,604,570,538,508,480,453,
          428,404,381,360,339,320,302,285,269,254,240,226,
          214,202,190,180,170,160,151,143,135,127,120,113,0],

        VIBRATO = [
            0, 24, 49, 74, 97,120,141,161,180,197,212,224,
          235,244,250,253,255,253,250,244,235,224,212,197,
          180,161,141,120, 97, 74, 49, 24];

    window.neoart.MKPlayer = MKPlayer;
  })();


  (function() {
    function PTVoice(idx) {
      return Object.create(null, {
        index        : { value:idx,  writable:true },
        next         : { value:null, writable:true },
        channel      : { value:null, writable:true },
        sample       : { value:null, writable:true },
        enabled      : { value:0,    writable:true },
        loopCtr      : { value:0,    writable:true },
        loopPos      : { value:0,    writable:true },
        step         : { value:0,    writable:true },
        period       : { value:0,    writable:true },
        effect       : { value:0,    writable:true },
        param        : { value:0,    writable:true },
        volume       : { value:0,    writable:true },
        pointer      : { value:0,    writable:true },
        length       : { value:0,    writable:true },
        loopPtr      : { value:0,    writable:true },
        repeat       : { value:0,    writable:true },
        finetune     : { value:0,    writable:true },
        offset       : { value:0,    writable:true },
        portaDir     : { value:0,    writable:true },
        portaPeriod  : { value:0,    writable:true },
        portaSpeed   : { value:0,    writable:true },
        glissando    : { value:0,    writable:true },
        tremoloParam : { value:0,    writable:true },
        tremoloPos   : { value:0,    writable:true },
        tremoloWave  : { value:0,    writable:true },
        vibratoParam : { value:0,    writable:true },
        vibratoPos   : { value:0,    writable:true },
        vibratoWave  : { value:0,    writable:true },
        funkPos      : { value:0,    writable:true },
        funkSpeed    : { value:0,    writable:true },
        funkWave     : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel      = null;
            this.sample       = null;
            this.enabled      = 0;
            this.loopCtr      = 0;
            this.loopPos      = 0;
            this.step         = 0;
            this.period       = 0;
            this.effect       = 0;
            this.param        = 0;
            this.volume       = 0;
            this.pointer      = 0;
            this.length       = 0;
            this.loopPtr      = 0;
            this.repeat       = 0;
            this.finetune     = 0;
            this.offset       = 0;
            this.portaDir     = 0;
            this.portaPeriod  = 0;
            this.portaSpeed   = 0;
            this.glissando    = 0;
            this.tremoloParam = 0;
            this.tremoloPos   = 0;
            this.tremoloWave  = 0;
            this.vibratoParam = 0;
            this.vibratoPos   = 0;
            this.vibratoWave  = 0;
            this.funkPos      = 0;
            this.funkSpeed    = 0;
            this.funkWave     = 0;
        }}
      });
    }
    function PTRow() {
      var o = AmigaRow();

      Object.defineProperties(o, {
        step: { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function PTSample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        finetune : { value:0, writable:true },
        realLen  : { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function PTPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id           : { value:"PTPlayer" },
        track        : { value:null, writable:true },
        patterns     : { value:[],   writable:true },
        samples      : { value:[],   writable:true },
        length       : { value:0,    writable:true },
        voices       : { value:[],   writable:true },
        trackPos     : { value:0,    writable:true },
        patternPos   : { value:0,    writable:true },
        patternBreak : { value:0,    writable:true },
        patternDelay : { value:0,    writable:true },
        breakPos     : { value:0,    writable:true },
        jumpFlag     : { value:0,    writable:true },
        vibratoDepth : { value:0,    writable:true },

        force: {
          set: function(value) {
            if (value < PROTRACKER_10)
              value = PROTRACKER_10;
            else if (value > PROTRACKER_12)
              value = PROTRACKER_12;

            this.version = value;

            if (value < PROTRACKER_11) this.vibratoDepth = 6;
              else this.vibratoDepth = 7;
        }},

        initialize: {
          value: function() {
            var voice = this.voices[0];

            this.tempo        = 125;
            this.speed        = 6;
            this.trackPos     = 0;
            this.patternPos   = 0;
            this.patternBreak = 0;
            this.patternDelay = 0;
            this.breakPos     = 0;
            this.jumpFlag     = 0;

            this.reset();
            this.force = this.version;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[0];
              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var higher = 0, i, id, j, row, sample, size = 0, value;
            if (stream.length < 2106) return;

            stream.position = 1080;
            id = stream.readString(4);
            if (id != "M.K." && id != "M!K!") return;

            stream.position = 0;
            this.title = stream.readString(20);
            this.version = PROTRACKER_10;
            stream.position += 22;

            for (i = 1; i < 32; ++i) {
              value = stream.readUshort();

              if (!value) {
                this.samples[i] = null;
                stream.position += 28;
                continue;
              }

              sample = PTSample();
              stream.position -= 24;

              sample.name = stream.readString(22);
              sample.length = sample.realLen = value << 1;
              stream.position += 2;

              sample.finetune = stream.readUbyte() * 37;
              sample.volume   = stream.readUbyte();
              sample.loop     = stream.readUshort() << 1;
              sample.repeat   = stream.readUshort() << 1;

              stream.position += 22;
              sample.pointer = size;
              size += sample.length;
              this.samples[i] = sample;
            }

            stream.position = 950;
            this.length = stream.readUbyte();
            stream.position++;

            for (i = 0; i < 128; ++i) {
              value = stream.readUbyte() << 8;
              this.track[i] = value;
              if (value > higher) higher = value;
            }

            stream.position = 1084;
            higher += 256;
            this.patterns.length = higher;

            for (i = 0; i < higher; ++i) {
              row = PTRow();
              row.step = value = stream.readUint();

              row.note   = (value >> 16) & 0x0fff;
              row.effect = (value >>  8) & 0x0f;
              row.sample = (value >> 24) & 0xf0 | (value >> 12) & 0x0f;
              row.param  = value & 0xff;

              this.patterns[i] = row;

              if (row.sample > 31 || !this.samples[row.sample]) row.sample = 0;

              if (row.effect == 15 && row.param > 31)
                this.version = PROTRACKER_11;

              if (row.effect == 8)
                this.version = PROTRACKER_12;
            }

            this.mixer.store(stream, size);

            for (i = 1; i < 32; ++i) {
              sample = this.samples[i];
              if (!sample) continue;

              if (sample.loop || sample.repeat > 4) {
                sample.loopPtr = sample.pointer + sample.loop;
                sample.length  = sample.loop + sample.repeat;
              } else {
                sample.loopPtr = this.mixer.memory.length;
                sample.repeat  = 2;
              }
              size = sample.pointer + 2;
              for (j = sample.pointer; j < size; ++j) this.mixer.memory[j] = 0;
            }

            sample = PTSample();
            sample.pointer = sample.loopPtr = this.mixer.memory.length;
            sample.length  = sample.repeat  = 2;
            this.samples[0] = sample;
        }},
        process: {
          value: function() {
            var chan, i, pattern, row, sample, value, voice = this.voices[0];

            if (!this.tick) {
              if (this.patternDelay) {
                this.effects();
              } else {
                pattern = this.track[this.trackPos] + this.patternPos;

                while (voice) {
                  chan = voice.channel;
                  voice.enabled = 0;

                  if (!voice.step) chan.period = voice.period;

                  row = this.patterns[pattern + voice.index];
                  voice.step   = row.step;
                  voice.effect = row.effect;
                  voice.param  = row.param;

                  if (row.sample) {
                    sample = voice.sample = this.samples[row.sample];

                    voice.pointer  = sample.pointer;
                    voice.length   = sample.length;
                    voice.loopPtr  = voice.funkWave = sample.loopPtr;
                    voice.repeat   = sample.repeat;
                    voice.finetune = sample.finetune;

                    chan.volume = voice.volume = sample.volume;
                  } else {
                    sample = voice.sample;
                  }

                  if (!row.note) {
                    this.moreEffects(voice);
                    voice = voice.next;
                    continue;
                  } else {
                    if ((voice.step & 0x0ff0) == 0x0e50) {
                      voice.finetune = (voice.param & 0x0f) * 37;
                    } else if (voice.effect == 3 || voice.effect == 5) {
                      if (row.note == voice.period) {
                        voice.portaPeriod = 0;
                      } else {
                        i = voice.finetune;
                        value = i + 37;

                        for (; i < value; ++i)
                          if (row.note >= PERIODS[i]) break;

                        if (i == value) value--;

                        if (i > 0) {
                          value = ((voice.finetune / 37) >> 0) & 8;
                          if (value) i--;
                        }

                        voice.portaPeriod = PERIODS[i];
                        voice.portaDir = row.note > voice.portaPeriod ? 0 : 1;
                      }
                    } else if (voice.effect == 9) {
                      this.moreEffects(voice);
                    }
                  }

                  for (i = 0; i < 37; ++i)
                    if (row.note >= PERIODS[i]) break;

                  voice.period = PERIODS[voice.finetune + i];

                  if ((voice.step & 0x0ff0) == 0x0ed0) {
                    if (voice.funkSpeed) this.updateFunk(voice);
                    this.extended(voice);
                    voice = voice.next;
                    continue;
                  }

                  if (voice.vibratoWave < 4) voice.vibratoPos = 0;
                  if (voice.tremoloWave < 4) voice.tremoloPos = 0;

                  chan.enabled = 0;
                  chan.pointer = voice.pointer;
                  chan.length  = voice.length;
                  chan.period  = voice.period;

                  voice.enabled = 1;
                  this.moreEffects(voice);
                  voice = voice.next;
                }
                voice = this.voices[0];

                while (voice) {
                  chan = voice.channel;
                  if (voice.enabled) chan.enabled = 1;

                  chan.pointer = voice.loopPtr;
                  chan.length  = voice.repeat;

                  voice = voice.next;
                }
              }
            } else {
              this.effects();
            }

            if (++this.tick == this.speed) {
              this.tick = 0;
              this.patternPos += 4;

              if (this.patternDelay)
                if (--this.patternDelay) this.patternPos -= 4;

              if (this.patternBreak) {
                this.patternBreak = 0;
                this.patternPos = this.breakPos;
                this.breakPos = 0;
              }

              if (this.patternPos == 256 || this.jumpFlag) {
                this.patternPos = this.breakPos;
                this.breakPos = 0;
                this.jumpFlag = 0;

                if (++this.trackPos == this.length) {
                  this.trackPos = 0;
                  this.mixer.complete = 1;
                }
              }
            }
        }},
        effects: {
          value: function() {
            var chan, i, position, slide, value, voice = this.voices[0], wave;

            while (voice) {
              chan = voice.channel;
              if (voice.funkSpeed) this.updateFunk(voice);

              if ((voice.step & 0x0fff) == 0) {
                chan.period = voice.period;
                voice = voice.next;
                continue;
              }

              switch (voice.effect) {
                case 0:   //arpeggio
                  value = this.tick % 3;

                  if (!value) {
                    chan.period = voice.period;
                    voice = voice.next;
                    continue;
                  }

                  if (value == 1) value = voice.param >> 4;
                    else value = voice.param & 0x0f;

                  i = voice.finetune;
                  position = i + 37;

                  for (; i < position; ++i)
                    if (voice.period >= PERIODS[i]) {
                      chan.period = PERIODS[i + value];
                      break;
                    }
                  break;
                case 1:   //portamento up
                  voice.period -= voice.param;
                  if (voice.period < 113) voice.period = 113;
                  chan.period = voice.period;
                  break;
                case 2:   //portamento down
                  voice.period += voice.param;
                  if (voice.period > 856) voice.period = 856;
                  chan.period = voice.period;
                  break;
                case 3:   //tone portamento
                case 5:   //tone portamento + volume slide
                  if (voice.effect == 5) {
                    slide = 1;
                  } else {
                    voice.portaSpeed = voice.param;
                    voice.param = 0;
                  }

                  if (voice.portaPeriod) {
                    if (voice.portaDir) {
                      voice.period -= voice.portaSpeed;

                      if (voice.period <= voice.portaPeriod) {
                        voice.period = voice.portaPeriod;
                        voice.portaPeriod = 0;
                      }
                    } else {
                      voice.period += voice.portaSpeed;

                      if (voice.period >= voice.portaPeriod) {
                        voice.period = voice.portaPeriod;
                        voice.portaPeriod = 0;
                      }
                    }

                    if (voice.glissando) {
                      i = voice.finetune;
                      value = i + 37;

                      for (; i < value; ++i)
                        if (voice.period >= PERIODS[i]) break;

                      if (i == value) i--;
                      chan.period = PERIODS[i];
                    } else {
                      chan.period = voice.period;
                    }
                  }
                  break;
                case 4:   //vibrato
                case 6:   //vibrato + volume slide
                  if (voice.effect == 6) {
                    slide = 1;
                  } else if (voice.param) {
                    value = voice.param & 0x0f;
                    if (value) voice.vibratoParam = (voice.vibratoParam & 0xf0) | value;
                    value = voice.param & 0xf0;
                    if (value) voice.vibratoParam = (voice.vibratoParam & 0x0f) | value;
                  }

                  position = (voice.vibratoPos >> 2) & 31;
                  wave = voice.vibratoWave & 3;

                  if (wave) {
                    value = 255;
                    position <<= 3;

                    if (wave == 1) {
                      if (voice.vibratoPos > 127) value -= position;
                        else value = position;
                    }
                  } else {
                    value = VIBRATO[position];
                  }

                  value = ((voice.vibratoParam & 0x0f) * value) >> this.vibratoDepth;

                  if (voice.vibratoPos > 127) chan.period = voice.period - value;
                    else chan.period = voice.period + value;

                  value = (voice.vibratoParam >> 2) & 60;
                  voice.vibratoPos = (voice.vibratoPos + value) & 255;
                  break;
                case 7:   //tremolo
                  chan.period = voice.period;

                  if (voice.param) {
                    value = voice.param & 0x0f;
                    if (value) voice.tremoloParam = (voice.tremoloParam & 0xf0) | value;
                    value = voice.param & 0xf0;
                    if (value) voice.tremoloParam = (voice.tremoloParam & 0x0f) | value;
                  }

                  position = (voice.tremoloPos >> 2) & 31;
                  wave = voice.tremoloWave & 3;

                  if (wave) {
                    value = 255;
                    position <<= 3;

                    if (wave == 1) {
                      if (voice.tremoloPos > 127) value -= position;
                        else value = position;
                    }
                  } else {
                    value = VIBRATO[position];
                  }

                  value = ((voice.tremoloParam & 0x0f) * value) >> 6;

                  if (voice.tremoloPos > 127) chan.volume = voice.volume - value;
                    else chan.volume = voice.volume + value;

                  value = (voice.tremoloParam >> 2) & 60;
                  voice.tremoloPos = (voice.tremoloPos + value) & 255;
                  break;
                case 10:  //volume slide
                  slide = 1;
                  break;
                case 14:  //extended effects
                  this.extended(voice);
                  break;
              }

              if (slide) {
                slide = 0;
                value = voice.param >> 4;

                if (value) voice.volume += value;
                  else voice.volume -= voice.param & 0x0f;

                if (voice.volume < 0) voice.volume = 0;
                  else if (voice.volume > 64) voice.volume = 64;

                chan.volume = voice.volume;
              }
              voice = voice.next;
            }
        }},
        moreEffects: {
          value: function(voice) {
            var chan = voice.channel, value;
            if (voice.funkSpeed) this.updateFunk(voice);

            switch (voice.effect) {
              case 9:   //sample offset
                if (voice.param) voice.offset = voice.param;
                value = voice.offset << 8;

                if (value >= voice.length) {
                  voice.length = 2;
                } else {
                  voice.pointer += value;
                  voice.length  -= value;
                }
                break;
              case 11:  //position jump
                this.trackPos = voice.param - 1;
                this.breakPos = 0;
                this.jumpFlag = 1;
                break;
              case 12:  //set volume
                voice.volume = voice.param;
                if (voice.volume > 64) voice.volume = 64;
                chan.volume = voice.volume;
                break;
              case 13:  //pattern break
                this.breakPos = ((voice.param >> 4) * 10) + (voice.param & 0x0f);

                if (this.breakPos > 63) this.breakPos = 0;
                  else this.breakPos <<= 2;

                this.jumpFlag = 1;
                break;
              case 14:  //extended effects
                this.extended(voice);
                break;
              case 15:  //set speed
                if (!voice.param) return;

                if (voice.param < 32) this.speed = voice.param;
                  else this.mixer.samplesTick = ((this.sampleRate * 2.5) / voice.param) >> 0;

                this.tick = 0;
                break;
            }
        }},
        extended: {
          value: function(voice) {
            var chan = voice.channel, effect = voice.param >> 4, i, len, memory, param = voice.param & 0x0f;

            switch (effect) {
              case 0:   //set filter
                this.mixer.filter.active = param;
                break;
              case 1:   //fine portamento up
                if (this.tick) return;
                voice.period -= param;
                if (voice.period < 113) voice.period = 113;
                chan.period = voice.period;
                break;
              case 2:   //fine portamento down
                if (this.tick) return;
                voice.period += param;
                if (voice.period > 856) voice.period = 856;
                chan.period = voice.period;
                break;
              case 3:   //glissando control
                voice.glissando = param;
                break;
              case 4:   //vibrato control
                voice.vibratoWave = param;
                break;
              case 5:   //set finetune
                voice.finetune = param * 37;
                break;
              case 6:   //pattern loop
                if (this.tick) return;

                if (param) {
                  if (voice.loopCtr) voice.loopCtr--;
                    else voice.loopCtr = param;

                  if (voice.loopCtr) {
                    this.breakPos = voice.loopPos << 2;
                    this.patternBreak = 1;
                  }
                } else {
                  voice.loopPos = this.patternPos >> 2;
                }
                break;
              case 7:   //tremolo control
                voice.tremoloWave = param;
                break;
              case 8:   //karplus strong
                len = voice.length - 2;
                memory = this.mixer.memory;

                for (i = voice.loopPtr; i < len;)
                  memory[i] = (memory[i] + memory[++i]) * 0.5;

                memory[++i] = (memory[i] + memory[0]) * 0.5;
                break;
              case 9:   //retrig note
                if (this.tick || !param || !voice.period) return;
                if (this.tick % param) return;

                chan.enabled = 0;
                chan.pointer = voice.pointer;
                chan.length  = voice.length;
                chan.delay   = 30;

                chan.enabled = 1;
                chan.pointer = voice.loopPtr;
                chan.length  = voice.repeat;
                chan.period  = voice.period;
                break;
              case 10:  //fine volume up
                if (this.tick) return;
                voice.volume += param;
                if (voice.volume > 64) voice.volume = 64;
                chan.volume = voice.volume;
                break;
              case 11:  //fine volume down
                if (this.tick) return;
                voice.volume -= param;
                if (voice.volume < 0) voice.volume = 0;
                chan.volume = voice.volume;
                break;
              case 12:  //note cut
                if (this.tick == param) chan.volume = voice.volume = 0;
                break;
              case 13:  //note delay
                if (this.tick != param || !voice.period) return;

                chan.enabled = 0;
                chan.pointer = voice.pointer;
                chan.length  = voice.length;
                chan.delay   = 30;

                chan.enabled = 1;
                chan.pointer = voice.loopPtr;
                chan.length  = voice.repeat;
                chan.period  = voice.period;
                break;
              case 14:  //pattern delay
                if (this.tick || this.patternDelay) return;
                this.patternDelay = ++param;
                break;
              case 15:  //funk repeat or invert loop
                if (this.tick) return;
                voice.funkSpeed = param;
                if (param) this.updateFunk(voice);
                break;
            }
        }},
        updateFunk: {
          value: function(voice) {
            var chan = voice.channel, p1, p2, value = FUNKREP[voice.funkSpeed];

            voice.funkPos += value;
            if (voice.funkPos < 128) return;
            voice.funkPos = 0;

            if (this.version == PROTRACKER_10) {
              p1 = voice.pointer + voice.sample.realLen - voice.repeat;
              p2 = voice.funkWave + voice.repeat;

              if (p2 > p1) {
                p2 = voice.loopPtr;
                chan.length = voice.repeat;
              }
              chan.pointer = voice.funkWave = p2;
            } else {
              p1 = voice.loopPtr + voice.repeat;
              p2 = voice.funkWave + 1;

              if (p2 >= p1) p2 = voice.loopPtr;

              this.mixer.memory[p2] = -this.mixer.memory[p2];
            }
        }}
      });

      o.voices[0] = PTVoice(0);
      o.voices[0].next = o.voices[1] = PTVoice(1);
      o.voices[1].next = o.voices[2] = PTVoice(2);
      o.voices[2].next = o.voices[3] = PTVoice(3);

      o.track = new Uint16Array(128);
      return Object.seal(o);
    }

    var PROTRACKER_10 = 1,
        PROTRACKER_11 = 2,
        PROTRACKER_12 = 3,

        PERIODS = [
          856,808,762,720,678,640,604,570,538,508,480,453,
          428,404,381,360,339,320,302,285,269,254,240,226,
          214,202,190,180,170,160,151,143,135,127,120,113,0,
          850,802,757,715,674,637,601,567,535,505,477,450,
          425,401,379,357,337,318,300,284,268,253,239,225,
          213,201,189,179,169,159,150,142,134,126,119,113,0,
          844,796,752,709,670,632,597,563,532,502,474,447,
          422,398,376,355,335,316,298,282,266,251,237,224,
          211,199,188,177,167,158,149,141,133,125,118,112,0,
          838,791,746,704,665,628,592,559,528,498,470,444,
          419,395,373,352,332,314,296,280,264,249,235,222,
          209,198,187,176,166,157,148,140,132,125,118,111,0,
          832,785,741,699,660,623,588,555,524,495,467,441,
          416,392,370,350,330,312,294,278,262,247,233,220,
          208,196,185,175,165,156,147,139,131,124,117,110,0,
          826,779,736,694,655,619,584,551,520,491,463,437,
          413,390,368,347,328,309,292,276,260,245,232,219,
          206,195,184,174,164,155,146,138,130,123,116,109,0,
          820,774,730,689,651,614,580,547,516,487,460,434,
          410,387,365,345,325,307,290,274,258,244,230,217,
          205,193,183,172,163,154,145,137,129,122,115,109,0,
          814,768,725,684,646,610,575,543,513,484,457,431,
          407,384,363,342,323,305,288,272,256,242,228,216,
          204,192,181,171,161,152,144,136,128,121,114,108,0,
          907,856,808,762,720,678,640,604,570,538,508,480,
          453,428,404,381,360,339,320,302,285,269,254,240,
          226,214,202,190,180,170,160,151,143,135,127,120,0,
          900,850,802,757,715,675,636,601,567,535,505,477,
          450,425,401,379,357,337,318,300,284,268,253,238,
          225,212,200,189,179,169,159,150,142,134,126,119,0,
          894,844,796,752,709,670,632,597,563,532,502,474,
          447,422,398,376,355,335,316,298,282,266,251,237,
          223,211,199,188,177,167,158,149,141,133,125,118,0,
          887,838,791,746,704,665,628,592,559,528,498,470,
          444,419,395,373,352,332,314,296,280,264,249,235,
          222,209,198,187,176,166,157,148,140,132,125,118,0,
          881,832,785,741,699,660,623,588,555,524,494,467,
          441,416,392,370,350,330,312,294,278,262,247,233,
          220,208,196,185,175,165,156,147,139,131,123,117,0,
          875,826,779,736,694,655,619,584,551,520,491,463,
          437,413,390,368,347,328,309,292,276,260,245,232,
          219,206,195,184,174,164,155,146,138,130,123,116,0,
          868,820,774,730,689,651,614,580,547,516,487,460,
          434,410,387,365,345,325,307,290,274,258,244,230,
          217,205,193,183,172,163,154,145,137,129,122,115,0,
          862,814,768,725,684,646,610,575,543,513,484,457,
          431,407,384,363,342,323,305,288,272,256,242,228,
          216,203,192,181,171,161,152,144,136,128,121,114,0],

        VIBRATO = [
            0, 24, 49, 74, 97,120,141,161,180,197,212,224,
          235,244,250,253,255,253,250,244,235,224,212,197,
          180,161,141,120, 97, 74, 49, 24],

        FUNKREP = [0,5,6,7,8,10,11,13,16,19,22,26,32,43,64,128];

    window.neoart.PTPlayer = PTPlayer;
  })();


  (function() {
    function RHVoice(idx, bit) {
      return Object.create(null, {
        index       : { value:idx,  writable:true },
        bitFlag     : { value:bit,  writable:true },
        next        : { value:null, writable:true },
        channel     : { value:null, writable:true },
        sample      : { value:null, writable:true },
        trackPtr    : { value:0,    writable:true },
        trackPos    : { value:0,    writable:true },
        patternPos  : { value:0,    writable:true },
        tick        : { value:0,    writable:true },
        busy        : { value:0,    writable:true },
        flags       : { value:0,    writable:true },
        note        : { value:0,    writable:true },
        period      : { value:0,    writable:true },
        volume      : { value:0,    writable:true },
        portaSpeed  : { value:0,    writable:true },
        vibratoPtr  : { value:0,    writable:true },
        vibratoPos  : { value:0,    writable:true },
        synthPos    : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel     = null;
            this.sample      = null;
            this.trackPtr    = 0;
            this.trackPos    = 0;
            this.patternPos  = 0;
            this.tick        = 1;
            this.busy        = 1;
            this.flags       = 0;
            this.note        = 0;
            this.period      = 0;
            this.volume      = 0;
            this.portaSpeed  = 0;
            this.vibratoPtr  = 0;
            this.vibratoPos  = 0;
            this.synthPos    = 0;
        }}
      });
    }
    function RHSample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        relative : { value:0,  writable:true },
        divider  : { value:0,  writable:true },
        vibrato  : { value:0,  writable:true },
        hiPos    : { value:0,  writable:true },
        loPos    : { value:0,  writable:true },
        wave     : { value:[], writable:true }
      });

      return Object.seal(o);
    }
    function RHSong() {
      return Object.create(null, {
        speed  : { value:0,    writable:true },
        tracks : { value:null, writable:true }
      });
    }
    function RHPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id         : { value:"RHPlayer" },
        songs      : { value:[],   writable:true },
        samples    : { value:[],   writable:true },
        song       : { value:null, writable:true },
        periods    : { value:0,    writable:true },
        vibrato    : { value:0,    writable:true },
        voices     : { value:[],   writable:true },
        stream     : { value:null, writable:true },
        complete   : { value:0,    writable:true },
        variant    : { value:0,    writable:true },

        initialize: {
          value: function() {
            var i, j, sample, voice = this.voices[3];
            this.reset();

            this.song = this.songs[this.playSong];
            this.complete = 15;

            for (i = 0; i < this.samples.length; ++i) {
              sample = this.samples[i];

              if (sample.wave.length) {
                for (j = 0; j < sample.length; ++j)
                  this.mixer.memory[sample.pointer + j] = sample.wave[j];
              }
            }

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];

              voice.trackPtr = this.song.tracks[voice.index];
              voice.trackPos = 4;

              this.stream.position = voice.trackPtr;
              voice.patternPos = this.stream.readUint();

              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var i, j, len, pos, sample, samplesData, samplesHeaders, samplesLen, song, songsHeaders, wavesHeaders, wavesPointers, value;
            stream.position = 44;

            while (stream.position < 1024) {
              value = stream.readUshort();

              if (value == 0x7e10 || value == 0x7e20) {                               //moveq #16,d7 || moveq #32,d7
                value = stream.readUshort();

                if (value == 0x41fa) {                                                //lea $x,a0
                  i = stream.position + stream.readUshort();
                  value = stream.readUshort();

                  if (value == 0xd1fc) {                                              //adda.l
                    samplesData = i + stream.readUint();
                    this.mixer.loopLen = 64;
                    stream.position += 2;
                  } else {
                    samplesData = i;
                    this.mixer.loopLen = 512;
                  }

                  samplesHeaders = stream.position + stream.readUshort();
                  value = stream.readUbyte();
                  if (value == 0x72) samplesLen = stream.readUbyte();                 //moveq #x,d1
                }
              } else if (value == 0x51c9) {                                           //dbf d1,x
                stream.position += 2;
                value = stream.readUshort();

                if (value == 0x45fa) {                                                //lea $x,a2
                  wavesPointers = stream.position + stream.readUshort();
                  stream.position += 2;

                  while (1) {
                    value = stream.readUshort();

                    if (value == 0x4bfa) {                                            //lea $x,a5
                      wavesHeaders = stream.position + stream.readUshort();
                      break;
                    }
                  }
                }
              } else if (value == 0xc0fc) {                                           //mulu.w #x,d0
                stream.position += 2;
                value = stream.readUshort();

                if (value == 0x41eb)                                                  //lea $x(a3),a0
                  songsHeaders = stream.readUshort();
              } else if (value == 0x346d) {                                           //movea.w x(a5),a2
                stream.position += 2;
                value = stream.readUshort();

                if (value == 0x49fa)                                                  //lea $x,a4
                  this.vibrato = stream.position + stream.readUshort();
              } else if (value == 0x4240) {                                           //clr.w d0
                value = stream.readUshort();

                if (value == 0x45fa) {                                                //lea $x,a2
                  this.periods = stream.position + stream.readUshort();
                  break;
                }
              }
            }

            if (!samplesHeaders || !samplesData || !samplesLen || !songsHeaders) return;

            stream.position = samplesData;
            this.samples = [];
            samplesLen++;

            for (i = 0; i < samplesLen; ++i) {
              sample = RHSample();
              sample.length   = stream.readUint();
              sample.relative = parseInt(3579545 / stream.readUshort());
              sample.pointer  = this.mixer.store(stream, sample.length);
              this.samples[i] = sample;
            }

            stream.position = samplesHeaders;

            for (i = 0; i < samplesLen; ++i) {
              sample = this.samples[i];
              stream.position += 4;
              sample.loopPtr = stream.readInt();
              stream.position += 6;
              sample.volume = stream.readUshort();

              if (wavesHeaders) {
                sample.divider = stream.readUshort();
                sample.vibrato = stream.readUshort();
                sample.hiPos   = stream.readUshort();
                sample.loPos   = stream.readUshort();
                stream.position += 8;
              }
            }

            if (wavesHeaders) {
              stream.position = wavesHeaders;
              i = (wavesHeaders - samplesHeaders) >> 5;
              len = i + 3;
              this.variant = 1;

              if (i >= samplesLen) {
                for (j = samplesLen; j < i; ++j)
                  this.samples[j] = RHSample();
              }

              for (; i < len; ++i) {
                sample = RHSample();
                stream.position += 4;
                sample.loopPtr   = stream.readInt();
                sample.length    = stream.readUshort();
                sample.relative  = stream.readUshort();

                stream.position += 2;
                sample.volume  = stream.readUshort();
                sample.divider = stream.readUshort();
                sample.vibrato = stream.readUshort();
                sample.hiPos   = stream.readUshort();
                sample.loPos   = stream.readUshort();

                pos = stream.position;
                stream.position = wavesPointers;
                stream.position = stream.readInt();

                sample.pointer = this.mixer.memory.length;
                this.mixer.memory.length += sample.length;

                for (j = 0; j < sample.length; ++j)
                  sample.wave[j] = stream.readByte();

                this.samples[i] = sample;
                wavesPointers += 4;
                stream.position = pos;
              }
            }

            stream.position = songsHeaders;
            this.songs = [];
            value = 65536;

            while (1) {
              song = RHSong();
              stream.position++;
              song.tracks = new Uint32Array(4);
              song.speed  = stream.readUbyte();

              for (i = 0; i < 4; ++i) {
                j = stream.readUint();
                if (j < value) value = j;
                song.tracks[i] = j;
              }

              this.songs.push(song);
              if ((value - stream.position) < 18) break;
            }

            this.lastSong = this.songs.length - 1;

            stream.length = samplesData;
            stream.position = 0x160;

            while (stream.position < 0x200) {
              value = stream.readUshort();

              if (value == 0xb03c) {                                                  //cmp.b #x,d0
                value = stream.readUshort();

                if (value == 0x0085) {                                                //-123
                  this.variant = 2;
                } else if (value == 0x0086) {                                         //-122
                  this.variant = 4;
                } else if (value == 0x0087) {                                         //-121
                  this.variant = 3;
                }
              }
            }

            this.stream  = stream;
            this.version = 1;
        }},
        process: {
          value: function() {
            var chan, loop, sample, value, voice = this.voices[3];

            while (voice) {
              chan = voice.channel;
              this.stream.position = voice.patternPos;
              sample = voice.sample;

              if (!voice.busy) {
                voice.busy = 1;

                if (sample.loopPtr == 0) {
                  chan.pointer = this.mixer.loopPtr;
                  chan.length  = this.mixer.loopLen;
                } else if (sample.loopPtr > 0) {
                  chan.pointer = sample.pointer + sample.loopPtr;
                  chan.length  = sample.length  - sample.loopPtr;
                }
              }

              if (--voice.tick == 0) {
                voice.flags = 0;
                loop = 1;

                while (loop) {
                  value = this.stream.readByte();

                  if (value < 0) {
                    switch (value) {
                      case -121:
                        if (this.variant == 3) voice.volume = this.stream.readUbyte();
                        break;
                      case -122:
                        if (this.variant == 4) voice.volume = this.stream.readUbyte();
                        break;
                      case -123:
                        if (this.variant > 1) this.mixer.complete = 1;
                        break;
                      case -124:
                        this.stream.position = voice.trackPtr + voice.trackPos;
                        value = this.stream.readUint();
                        voice.trackPos += 4;

                        if (!value) {
                          this.stream.position = voice.trackPtr;
                          value = this.stream.readUint();
                          voice.trackPos = 4;

                          if (!this.loopSong) {
                            this.complete &= ~(voice.bitFlag);
                            if (!this.complete) this.mixer.complete = 1;
                          }
                        }

                        this.stream.position = value;
                        break;
                      case -125:
                        if (this.variant == 4) voice.flags |= 4;
                        break;
                      case -126:
                        voice.tick = this.song.speed * this.stream.readByte();
                        voice.patternPos = this.stream.position;

                        chan.pointer = this.mixer.loopPtr;
                        chan.length  = this.mixer.loopLen;
                        loop = 0;
                        break;
                      case -127:
                        voice.portaSpeed = this.stream.readByte();
                        voice.flags |= 1;
                        break;
                      case -128:
                        value = this.stream.readByte();
                        if (value < 0) value = 0;
                        voice.sample = sample = this.samples[value];
                        voice.vibratoPtr = this.vibrato + sample.vibrato;
                        voice.vibratoPos = voice.vibratoPtr;
                        break;
                    }
                  } else {
                    voice.tick = this.song.speed * value;
                    voice.note = this.stream.readByte();
                    voice.patternPos = this.stream.position;

                    voice.synthPos = sample.loPos;
                    voice.vibratoPos = voice.vibratoPtr;

                    chan.pointer = sample.pointer;
                    chan.length  = sample.length;
                    chan.volume  = (voice.volume) ? voice.volume : sample.volume;

                    this.stream.position = this.periods + (voice.note << 1);
                    value = this.stream.readUshort() * sample.relative;
                    chan.period = voice.period = (value >> 10);

                    chan.enabled = 1;
                    voice.busy = loop = 0;
                  }
                }
              } else {
                if (voice.tick == 1) {
                  if (this.variant != 4 || !(voice.flags & 4))
                    chan.enabled = 0;
                }

                if (voice.flags & 1)
                  chan.period = (voice.period += voice.portaSpeed);

                if (sample.divider) {
                  this.stream.position = voice.vibratoPos;
                  value = this.stream.readByte();

                  if (value == -124) {
                    this.stream.position = voice.vibratoPtr;
                    value = this.stream.readByte();
                  }

                  voice.vibratoPos = this.stream.position;
                  value = parseInt(voice.period / sample.divider) * value;
                  chan.period = voice.period + value;
                }
              }

              if (sample.hiPos) {
                value = 0;

                if (voice.flags & 2) {
                  voice.synthPos--;

                  if (voice.synthPos <= sample.loPos) {
                    voice.flags &= -3;
                    value = 60;
                  }
                } else {
                  voice.synthPos++;

                  if (voice.synthPos > sample.hiPos) {
                    voice.flags |= 2;
                    value = 60;
                  }
                }

                this.mixer.memory[sample.pointer + voice.synthPos] = value;
              }

              voice = voice.next;
            }
        }}
      });

      o.voices[3] = RHVoice(3,8);
      o.voices[3].next = o.voices[2] = RHVoice(2,4);
      o.voices[2].next = o.voices[1] = RHVoice(1,2);
      o.voices[1].next = o.voices[0] = RHVoice(0,1);

      return Object.seal(o);
    }

    window.neoart.RHPlayer = RHPlayer;
  })();


  (function() {
    function S1Voice(idx) {
      return Object.create(null, {
        index        : { value:idx,  writable:true },
        next         : { value:null, writable:true },
        channel      : { value:null, writable:true },
        step         : { value:0,    writable:true },
        row          : { value:0,    writable:true },
        sample       : { value:0,    writable:true },
        samplePtr    : { value:0,    writable:true },
        sampleLen    : { value:0,    writable:true },
        note         : { value:0,    writable:true },
        noteTimer    : { value:0,    writable:true },
        period       : { value:0,    writable:true },
        volume       : { value:0,    writable:true },
        bendTo       : { value:0,    writable:true },
        bendSpeed    : { value:0,    writable:true },
        arpeggioCtr  : { value:0,    writable:true },
        envelopeCtr  : { value:0,    writable:true },
        pitchCtr     : { value:0,    writable:true },
        pitchFallCtr : { value:0,    writable:true },
        sustainCtr   : { value:0,    writable:true },
        phaseTimer   : { value:0,    writable:true },
        phaseSpeed   : { value:0,    writable:true },
        wavePos      : { value:0,    writable:true },
        waveList     : { value:0,    writable:true },
        waveTimer    : { value:0,    writable:true },
        waitCtr      : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.step         =  0;
            this.row          =  0;
            this.sample       =  0;
            this.samplePtr    = -1;
            this.sampleLen    =  0;
            this.note         =  0;
            this.noteTimer    =  0;
            this.period       =  0x9999;
            this.volume       =  0;
            this.bendTo       =  0;
            this.bendSpeed    =  0;
            this.arpeggioCtr  =  0;
            this.envelopeCtr  =  0;
            this.pitchCtr     =  0;
            this.pitchFallCtr =  0;
            this.sustainCtr   =  0;
            this.phaseTimer   =  0;
            this.phaseSpeed   =  0;
            this.wavePos      =  0;
            this.waveList     =  0;
            this.waveTimer    =  0;
            this.waitCtr      =  0;
        }}
      });
    }
    function S1Row() {
      var o = AmigaRow();

      Object.defineProperties(o, {
        speed : { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function S1Sample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        waveform     : { value:0,    writable:true },
        arpeggio     : { value:null, writable:true },
        attackSpeed  : { value:0,    writable:true },
        attackMax    : { value:0,    writable:true },
        decaySpeed   : { value:0,    writable:true },
        decayMin     : { value:0,    writable:true },
        sustain      : { value:0,    writable:true },
        releaseSpeed : { value:0,    writable:true },
        releaseMin   : { value:0,    writable:true },
        phaseShift   : { value:0,    writable:true },
        phaseSpeed   : { value:0,    writable:true },
        finetune     : { value:0,    writable:true },
        pitchFall    : { value:0,    writable:true }
      });

      o.arpeggio = new Uint8Array(16);
      return Object.seal(o);
    }
    function S1Player(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id          : { value:"S1Player" },
        tracksPtr   : { value:null, writable:true },
        tracks      : { value:[],   writable:true },
        patternsPtr : { value:null, writable:true },
        patterns    : { value:[],   writable:true },
        samples     : { value:[],   writable:true },
        waveLists   : { value:null, writable:true },
        speedDef    : { value:0,    writable:true },
        patternDef  : { value:0,    writable:true },
        mix1Speed   : { value:0,    writable:true },
        mix2Speed   : { value:0,    writable:true },
        mix1Dest    : { value:0,    writable:true },
        mix2Dest    : { value:0,    writable:true },
        mix1Source1 : { value:0,    writable:true },
        mix1Source2 : { value:0,    writable:true },
        mix2Source1 : { value:0,    writable:true },
        mix2Source2 : { value:0,    writable:true },
        doFilter    : { value:0,    writable:true },
        doReset     : { value:0,    writable:true },
        voices      : { value:[],   writable:true },
        trackPos    : { value:0,    writable:true },
        trackEnd    : { value:0,    writable:true },
        trackLen    : { value:0,    writable:true },
        patternPos  : { value:0,    writable:true },
        patternEnd  : { value:0,    writable:true },
        patternLen  : { value:0,    writable:true },
        mix1Ctr     : { value:0,    writable:true },
        mix2Ctr     : { value:0,    writable:true },
        mix1Pos     : { value:0,    writable:true },
        mix2Pos     : { value:0,    writable:true },
        audPtr      : { value:0,    writable:true },
        audLen      : { value:0,    writable:true },
        audPer      : { value:0,    writable:true },
        audVol      : { value:0,    writable:true },

        initialize: {
          value: function() {
            var chan, step, voice = this.voices[0];
            this.reset();

            this.speed      = this.speedDef;
            this.tick       = this.speedDef;
            this.trackPos   =  1;
            this.trackEnd   =  0;
            this.patternPos = -1;
            this.patternEnd =  0;
            this.patternLen = this.patternDef;

            this.mix1Ctr = this.mix1Pos = 0;
            this.mix2Ctr = this.mix2Pos = 0;

            while (voice) {
              voice.initialize();
              chan = this.mixer.channels[voice.index];

              voice.channel = chan;
              voice.step    = this.tracksPtr[voice.index];
              step = this.tracks[voice.step];
              voice.row     = this.patternsPtr[step.pattern];
              voice.sample  = this.patterns[voice.row].sample;

              chan.length  = 32;
              chan.period  = voice.period;
              chan.enabled = 1;

              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var data, i, id, j, headers, len, position, row, sample, start, step, totInstruments, totPatterns, totSamples, totWaveforms, ver;

            while (stream.bytesAvailable > 8) {
              start = stream.readUshort();
              if (start != 0x41fa) continue;
              j = stream.readUshort();

              start = stream.readUshort();
              if (start != 0xd1e8) continue;
              start = stream.readUshort();

              if (start == 0xffd4) {
                if (j == 0x0fec) ver = SIDMON_0FFA;
                  else if (j == 0x1466) ver = SIDMON_1444;
                    else ver = j;

                position = j + stream.position - 6;
                break;
              }
            }
            if (!position) return;
            stream.position = position;

            id = stream.readString(32);
            if (id != " SID-MON BY R.v.VLIET  (c) 1988 ") return;

            stream.position = position - 44;
            start = stream.readUint();

            for (i = 1; i < 4; ++i)
              this.tracksPtr[i] = ((stream.readUint() - start) / 6) >> 0;

            stream.position = position - 8;
            start = stream.readUint();
            len   = stream.readUint();
            if (len < start) len = stream.length - position;

            totPatterns = (len - start) >> 2;
            this.patternsPtr = new Uint32Array(totPatterns);
            stream.position = position + start + 4;

            for (i = 1; i < totPatterns; ++i) {
              start = (stream.readUint() / 5) >> 0;

              if (start == 0) {
                totPatterns = i;
                break;
              }
              this.patternsPtr[i] = start;
            }

            this.patternsPtr.length = totPatterns;

            stream.position = position - 44;
            start = stream.readUint();
            stream.position = position - 28;
            len = ((stream.readUint() - start) / 6) >> 0;

            this.tracks.length = len;
            stream.position = position + start;

            for (i = 0; i < len; ++i) {
              step = AmigaStep();
              step.pattern = stream.readUint();
              if (step.pattern >= totPatterns) step.pattern = 0;
              stream.readByte();
              step.transpose = stream.readByte();
              if (step.transpose < -99 || step.transpose > 99) step.transpose = 0;
              this.tracks[i] = step;
            }

            stream.position = position - 24;
            start = stream.readUint();
            totWaveforms = stream.readUint() - start;

            for (i = 0; i < 32; ++i) this.mixer.memory[i] = 0;
            this.mixer.store(stream, totWaveforms, position + start);
            totWaveforms >>= 5;

            stream.position = position - 16;
            start = stream.readUint();
            len = (stream.readUint() - start) + 16;
            j = (totWaveforms + 2) << 4;

            this.waveLists = new Uint8Array(len < j ? j : len);
            stream.position = position + start;
            i = 0;

            while (i < j) {
              this.waveLists[i++] = i >> 4;
              this.waveLists[i++] = 0xff;
              this.waveLists[i++] = 0xff;
              this.waveLists[i++] = 0x10;
              i += 12;
            }

            for (i = 16; i < len; ++i)
              this.waveLists[i] = stream.readUbyte();

            stream.position = position - 20;
            stream.position = position + stream.readUint();

            this.mix1Source1 = stream.readUint();
            this.mix2Source1 = stream.readUint();
            this.mix1Source2 = stream.readUint();
            this.mix2Source2 = stream.readUint();
            this.mix1Dest    = stream.readUint();
            this.mix2Dest    = stream.readUint();
            this.patternDef  = stream.readUint();
            this.trackLen    = stream.readUint();
            this.speedDef    = stream.readUint();
            this.mix1Speed   = stream.readUint();
            this.mix2Speed   = stream.readUint();

            if (this.mix1Source1 > totWaveforms) this.mix1Source1 = 0;
            if (this.mix2Source1 > totWaveforms) this.mix2Source1 = 0;
            if (this.mix1Source2 > totWaveforms) this.mix1Source2 = 0;
            if (this.mix2Source2 > totWaveforms) this.mix2Source2 = 0;
            if (this.mix1Dest > totWaveforms) this.mix1Speed = 0;
            if (this.mix2Dest > totWaveforms) this.mix2Speed = 0;
            if (this.speedDef == 0) this.speedDef = 4;

            stream.position = position - 28;
            j = stream.readUint();
            totInstruments = (stream.readUint() - j) >> 5;
            if (totInstruments > 63) totInstruments = 63;
            len = totInstruments + 1;

            stream.position = position - 4;
            start = stream.readUint();

            if (start == 1) {
              stream.position = 0x71c;
              start = stream.readUshort();

              if (start != 0x4dfa) {
                stream.position = 0x6fc;
                start = stream.readUshort();

                if (start != 0x4dfa) {
                  this.version = 0;
                  return;
                }
              }
              stream.position += stream.readUshort();
              this.samples.length = len + 3;

              for (i = 0; i < 3; ++i) {
                sample = S1Sample();
                sample.waveform = 16 + i;
                sample.length   = EMBEDDED[i];
                sample.pointer  = this.mixer.store(stream, sample.length);
                sample.loop     = sample.loopPtr = 0;
                sample.repeat   = 4;
                sample.volume   = 64;
                this.samples[len + i] = sample;
                stream.position += sample.length;
              }
            } else {
              this.samples.length = len;

              stream.position = position + start;
              data = stream.readUint();
              totSamples = (data >> 5) + 15;
              headers = stream.position;
              data += headers;
            }

            sample = S1Sample();
            this.samples[0] = sample;
            stream.position = position + j;

            for (i = 1; i < len; ++i) {
              sample = S1Sample();
              sample.waveform = stream.readUint();
              for (j = 0; j < 16; ++j) sample.arpeggio[j] = stream.readUbyte();

              sample.attackSpeed  = stream.readUbyte();
              sample.attackMax    = stream.readUbyte();
              sample.decaySpeed   = stream.readUbyte();
              sample.decayMin     = stream.readUbyte();
              sample.sustain      = stream.readUbyte();
              stream.readByte();
              sample.releaseSpeed = stream.readUbyte();
              sample.releaseMin   = stream.readUbyte();
              sample.phaseShift   = stream.readUbyte();
              sample.phaseSpeed   = stream.readUbyte();
              sample.finetune     = stream.readUbyte();
              sample.pitchFall    = stream.readByte();

              if (ver == SIDMON_1444) {
                sample.pitchFall = sample.finetune;
                sample.finetune = 0;
              } else {
                if (sample.finetune > 15) sample.finetune = 0;
                sample.finetune *= 67;
              }

              if (sample.phaseShift > totWaveforms) {
                sample.phaseShift = 0;
                sample.phaseSpeed = 0;
              }

              if (sample.waveform > 15) {
                if ((totSamples > 15) && (sample.waveform > totSamples)) {
                  sample.waveform = 0;
                } else {
                  start = headers + ((sample.waveform - 16) << 5);
                  if (start >= stream.length) continue;
                  j = stream.position;

                  stream.position = start;
                  sample.pointer  = stream.readUint();
                  sample.loop     = stream.readUint();
                  sample.length   = stream.readUint();
                  sample.name     = stream.readString(20);

                  if (sample.loop == 0      ||
                      sample.loop == 99999  ||
                      sample.loop == 199999 ||
                      sample.loop >= sample.length) {

                    sample.loop   = 0;
                    sample.repeat = ver == SIDMON_0FFA ? 2 : 4;
                  } else {
                    sample.repeat = sample.length - sample.loop;
                    sample.loop  -= sample.pointer;
                  }

                  sample.length -= sample.pointer;
                  if (sample.length < (sample.loop + sample.repeat))
                    sample.length = sample.loop + sample.repeat;

                  sample.pointer = this.mixer.store(stream, sample.length, data + sample.pointer);
                  if (sample.repeat < 6 || sample.loop == 0) sample.loopPtr = 0;
                    else sample.loopPtr = sample.pointer + sample.loop;

                  stream.position = j;
                }
              } else if (sample.waveform > totWaveforms) {
                sample.waveform = 0;
              }
              this.samples[i] = sample;
            }

            stream.position = position - 12;
            start = stream.readUint();
            len = ((stream.readUint() - start) / 5) >> 0;
            this.patterns.length = len;
            stream.position = position + start;

            for (i = 0; i < len; ++i) {
              row = S1Row();
              row.note   = stream.readUbyte();
              row.sample = stream.readUbyte();
              row.effect = stream.readUbyte();
              row.param  = stream.readUbyte();
              row.speed  = stream.readUbyte();

              if (ver == SIDMON_1444) {
                if (row.note > 0 && row.note < 255) row.note += 469;
                if (row.effect > 0 && row.effect < 255) row.effect += 469;
                if (row.sample > 59) row.sample = totInstruments + (row.sample - 60);
              } else if (row.sample > totInstruments) {
                row.sample = 0;
              }
              this.patterns[i] = row;
            }

            if (ver == SIDMON_1170 || ver == SIDMON_11C6 || ver == SIDMON_1444) {
              if (ver == SIDMON_1170) this.mix1Speed = this.mix2Speed = 0;
              this.doReset = this.doFilter = 0;
            } else {
              this.doReset = this.doFilter = 1;
            }
            this.version = 1;
        }},
        process: {
          value: function() {
            var chan, dst, i, index, memory = this.mixer.memory, row, sample, src1, src2, step, value, voice = this.voices[0];

            while (voice) {
              chan = voice.channel;
              this.audPtr = -1;
              this.audLen = this.audPer = this.audVol = 0;

              if (this.tick == 0) {
                if (this.patternEnd) {
                  if (this.trackEnd) voice.step = this.tracksPtr[voice.index];
                    else voice.step++;

                  step = this.tracks[voice.step];
                  voice.row = this.patternsPtr[step.pattern];
                  if (this.doReset) voice.noteTimer = 0;
                }

                if (voice.noteTimer == 0) {
                  row = this.patterns[voice.row];

                  if (row.sample == 0) {
                    if (row.note) {
                      voice.noteTimer = row.speed;

                      if (voice.waitCtr) {
                        sample = this.samples[voice.sample];
                        this.audPtr = sample.pointer;
                        this.audLen = sample.length;
                        voice.samplePtr = sample.loopPtr;
                        voice.sampleLen = sample.repeat;
                        voice.waitCtr = 1;
                        chan.enabled  = 0;
                      }
                    }
                  } else {
                    sample = this.samples[row.sample];
                    if (voice.waitCtr) chan.enabled = voice.waitCtr = 0;

                    if (sample.waveform > 15) {
                      this.audPtr = sample.pointer;
                      this.audLen = sample.length;
                      voice.samplePtr = sample.loopPtr;
                      voice.sampleLen = sample.repeat;
                      voice.waitCtr = 1;
                    } else {
                      voice.wavePos = 0;
                      voice.waveList = sample.waveform;
                      index = voice.waveList << 4;
                      this.audPtr = this.waveLists[index] << 5;
                      this.audLen = 32;
                      voice.waveTimer = this.waveLists[++index];
                    }

                    voice.noteTimer   = row.speed;
                    voice.sample      = row.sample;
                    voice.envelopeCtr = voice.pitchCtr = voice.pitchFallCtr = 0;
                  }

                  if (row.note) {
                    voice.noteTimer = row.speed;

                    if (row.note != 0xff) {
                      sample = this.samples[voice.sample];
                      step = this.tracks[voice.step];

                      voice.note = row.note + step.transpose;
                      voice.period = this.audPer = PERIODS[1 + sample.finetune + voice.note];
                      voice.phaseSpeed = sample.phaseSpeed;

                      voice.bendSpeed   = voice.volume = 0;
                      voice.envelopeCtr = voice.pitchCtr = voice.pitchFallCtr = 0;

                      switch (row.effect) {
                        case 0:
                          if (row.param == 0) break;
                          sample.attackSpeed = row.param;
                          sample.attackMax   = row.param;
                          voice.waveTimer    = 0;
                          break;
                        case 2:
                          this.speed = row.param;
                          voice.waveTimer = 0;
                          break;
                        case 3:
                          this.patternLen = row.param;
                          voice.waveTimer = 0;
                          break;
                        default:
                          voice.bendTo = row.effect + step.transpose;
                          voice.bendSpeed = row.param;
                          break;
                      }
                    }
                  }
                  voice.row++;
                } else {
                  voice.noteTimer--;
                }
              }
              sample = this.samples[voice.sample];
              this.audVol = voice.volume;

              switch (voice.envelopeCtr) {
                case 8:
                  break;
                case 0:   //attack
                  this.audVol += sample.attackSpeed;

                  if (this.audVol > sample.attackMax) {
                    this.audVol = sample.attackMax;
                    voice.envelopeCtr += 2;
                  }
                  break;
                case 2:   //decay
                  this.audVol -= sample.decaySpeed;

                  if (this.audVol <= sample.decayMin || this.audVol < -256) {
                    this.audVol = sample.decayMin;
                    voice.envelopeCtr += 2;
                    voice.sustainCtr = sample.sustain;
                  }
                  break;
                case 4:   //sustain
                  voice.sustainCtr--;
                  if (voice.sustainCtr == 0 || voice.sustainCtr == -256) voice.envelopeCtr += 2;
                  break;
                case 6:   //release
                  this.audVol -= sample.releaseSpeed;

                  if (this.audVol <= sample.releaseMin || this.audVol < -256) {
                    this.audVol = sample.releaseMin;
                    voice.envelopeCtr = 8;
                  }
                  break;
              }

              voice.volume = this.audVol;
              voice.arpeggioCtr = ++voice.arpeggioCtr & 15;
              index = sample.finetune + sample.arpeggio[voice.arpeggioCtr] + voice.note;
              voice.period = this.audPer = PERIODS[index];

              if (voice.bendSpeed) {
                value = PERIODS[sample.finetune + voice.bendTo];
                index = ~voice.bendSpeed + 1;
                if (index < -128) index &= 255;
                voice.pitchCtr += index;
                voice.period   += voice.pitchCtr;

                if ((index < 0 && voice.period <= value) || (index > 0 && voice.period >= value)) {
                  voice.note   = voice.bendTo;
                  voice.period = value;
                  voice.bendSpeed = 0;
                  voice.pitchCtr  = 0;
                }
              }

              if (sample.phaseShift) {
                if (voice.phaseSpeed) {
                  voice.phaseSpeed--;
                } else {
                  voice.phaseTimer = ++voice.phaseTimer & 31;
                  index = (sample.phaseShift << 5) + voice.phaseTimer;
                  voice.period += memory[index] >> 2;
                }
              }
              voice.pitchFallCtr -= sample.pitchFall;
              if (voice.pitchFallCtr < -256) voice.pitchFallCtr += 256;
              voice.period += voice.pitchFallCtr;

              if (voice.waitCtr == 0) {
                if (voice.waveTimer) {
                  voice.waveTimer--;
                } else {
                  if (voice.wavePos < 16) {
                    index = (voice.waveList << 4) + voice.wavePos;
                    value = this.waveLists[index++];

                    if (value == 0xff) {
                      voice.wavePos = this.waveLists[index] & 254;
                    } else {
                      this.audPtr = value << 5;
                      voice.waveTimer = this.waveLists[index];
                      voice.wavePos += 2;
                    }
                  }
                }
              }
              if (this.audPtr > -1) chan.pointer = this.audPtr;
              if (this.audPer != 0) chan.period  = voice.period;
              if (this.audLen != 0) chan.length  = this.audLen;

              if (sample.volume) chan.volume = sample.volume;
                else chan.volume = this.audVol >> 2;

              chan.enabled = 1;
              voice = voice.next;
            }

            this.trackEnd = this.patternEnd = 0;

            if (++this.tick > this.speed) {
              this.tick = 0;

              if (++this.patternPos == this.patternLen) {
                this.patternPos = 0;
                this.patternEnd = 1;

                if (++this.trackPos == this.trackLen)
                  this.trackPos = this.trackEnd = this.mixer.complete = 1;
              }
            }

            if (this.mix1Speed) {
              if (this.mix1Ctr == 0) {
                this.mix1Ctr = this.mix1Speed;
                index = this.mix1Pos = ++this.mix1Pos & 31;
                dst  = (this.mix1Dest    << 5) + 31;
                src1 = (this.mix1Source1 << 5) + 31;
                src2 =  this.mix1Source2 << 5;

                for (i = 31; i > -1; --i) {
                  memory[dst--] = (memory[src1--] + memory[src2 + index]) >> 1;
                  index = --index & 31;
                }
              }
              this.mix1Ctr--;
            }

            if (this.mix2Speed) {
              if (this.mix2Ctr == 0) {
                this.mix2Ctr = this.mix2Speed;
                index = this.mix2Pos = ++this.mix2Pos & 31;
                dst  = (this.mix2Dest    << 5) + 31;
                src1 = (this.mix2Source1 << 5) + 31;
                src2 =  this.mix2Source2 << 5;

                for (i = 31; i > -1; --i) {
                  memory[dst--] = (memory[src1--] + memory[src2 + index]) >> 1;
                  index = --index & 31;
                }
              }
              this.mix2Ctr--;
            }

            if (this.doFilter) {
              index = this.mix1Pos + 32;
              memory[index] = ~memory[index] + 1;
            }
            voice = this.voices[0];

            while (voice) {
              chan = voice.channel;

              if (voice.waitCtr == 1) {
                voice.waitCtr++;
              } else if (voice.waitCtr == 2) {
                voice.waitCtr++;
                chan.pointer = voice.samplePtr;
                chan.length  = voice.sampleLen;
              }
              voice = voice.next;
            }
        }}
      });

      o.voices[0] = S1Voice(0);
      o.voices[0].next = o.voices[1] = S1Voice(1);
      o.voices[1].next = o.voices[2] = S1Voice(2);
      o.voices[2].next = o.voices[3] = S1Voice(3);

      o.tracksPtr = new Uint32Array(4);
      return Object.seal(o);
    }

    var SIDMON_0FFA = 0x0ffa,
        SIDMON_1170 = 0x1170,
        SIDMON_11C6 = 0x11c6,
        SIDMON_11DC = 0x11dc,
        SIDMON_11E0 = 0x11e0,
        SIDMON_125A = 0x125a,
        SIDMON_1444 = 0x1444,

        EMBEDDED = [1166, 408, 908],

        PERIODS = [0,
          5760,5424,5120,4832,4560,4304,4064,3840,3616,3424,3232,3048,
          2880,2712,2560,2416,2280,2152,2032,1920,1808,1712,1616,1524,
          1440,1356,1280,1208,1140,1076,1016, 960, 904, 856, 808, 762,
           720, 678, 640, 604, 570, 538, 508, 480, 452, 428, 404, 381,
           360, 339, 320, 302, 285, 269, 254, 240, 226, 214, 202, 190,
           180, 170, 160, 151, 143, 135, 127,
           0,0,0,0,0,0,0,
          4028,3806,3584,3394,3204,3013,2855,2696,2538,2395,2268,2141,
          2014,1903,1792,1697,1602,1507,1428,1348,1269,1198,1134,1071,
          1007, 952, 896, 849, 801, 754, 714, 674, 635, 599, 567, 536,
           504, 476, 448, 425, 401, 377, 357, 337, 310, 300, 284, 268,
           252, 238, 224, 213, 201, 189, 179, 169, 159, 150, 142, 134,
           0,0,0,0,0,0,0,
          3993,3773,3552,3364,3175,2987,2830,2672,2515,2374,2248,2122,
          1997,1887,1776,1682,1588,1494,1415,1336,1258,1187,1124,1061,
           999, 944, 888, 841, 794, 747, 708, 668, 629, 594, 562, 531,
           500, 472, 444, 421, 397, 374, 354, 334, 315, 297, 281, 266,
           250, 236, 222, 211, 199, 187, 177, 167, 158, 149, 141, 133,
           0,0,0,0,0,0,0,
          3957,3739,3521,3334,3147,2960,2804,2648,2493,2353,2228,2103,
          1979,1870,1761,1667,1574,1480,1402,1324,1247,1177,1114,1052,
           990, 935, 881, 834, 787, 740, 701, 662, 624, 589, 557, 526,
           495, 468, 441, 417, 394, 370, 351, 331, 312, 295, 279, 263,
           248, 234, 221, 209, 197, 185, 176, 166, 156, 148, 140, 132,
           0,0,0,0,0,0,0,
          3921,3705,3489,3304,3119,2933,2779,2625,2470,2331,2208,2084,
          1961,1853,1745,1652,1560,1467,1390,1313,1235,1166,1104,1042,
           981, 927, 873, 826, 780, 734, 695, 657, 618, 583, 552, 521,
           491, 464, 437, 413, 390, 367, 348, 329, 309, 292, 276, 261,
           246, 232, 219, 207, 195, 184, 174, 165, 155, 146, 138, 131,
           0,0,0,0,0,0,0,
          3886,3671,3457,3274,3090,2907,2754,2601,2448,2310,2188,2065,
          1943,1836,1729,1637,1545,1454,1377,1301,1224,1155,1094,1033,
           972, 918, 865, 819, 773, 727, 689, 651, 612, 578, 547, 517,
           486, 459, 433, 410, 387, 364, 345, 326, 306, 289, 274, 259,
           243, 230, 217, 205, 194, 182, 173, 163, 153, 145, 137, 130,
           0,0,0,0,0,0,0,
          3851,3638,3426,3244,3062,2880,2729,2577,2426,2289,2168,2047,
          1926,1819,1713,1622,1531,1440,1365,1289,1213,1145,1084,1024,
           963, 910, 857, 811, 766, 720, 683, 645, 607, 573, 542, 512,
           482, 455, 429, 406, 383, 360, 342, 323, 304, 287, 271, 256,
           241, 228, 215, 203, 192, 180, 171, 162, 152, 144, 136, 128,
          6848,6464,6096,5760,5424,5120,4832,4560,4304,4064,3840,3616,
          3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,1920,1808,
          1712,1616,1524,1440,1356,1280,1208,1140,1076,1016, 960, 904,
           856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 452,
           428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240, 226,
           214, 202, 190, 180, 170, 160, 151, 143, 135, 127];

    window.neoart.S1Player = S1Player;
  })();


  (function() {
    function S2Voice(idx) {
      return Object.create(null, {
        index          : { value:idx,  writable:true },
        next           : { value:null, writable:true },
        channel        : { value:null, writable:true },
        step           : { value:null, writable:true },
        row            : { value:null, writable:true },
        instr          : { value:null, writable:true },
        sample         : { value:null, writable:true },
        enabled        : { value:0,    writable:true },
        pattern        : { value:0,    writable:true },
        instrument     : { value:0,    writable:true },
        note           : { value:0,    writable:true },
        period         : { value:0,    writable:true },
        volume         : { value:0,    writable:true },
        original       : { value:0,    writable:true },
        adsrPos        : { value:0,    writable:true },
        sustainCtr     : { value:0,    writable:true },
        pitchBend      : { value:0,    writable:true },
        pitchBendCtr   : { value:0,    writable:true },
        noteSlideTo    : { value:0,    writable:true },
        noteSlideSpeed : { value:0,    writable:true },
        waveCtr        : { value:0,    writable:true },
        wavePos        : { value:0,    writable:true },
        arpeggioCtr    : { value:0,    writable:true },
        arpeggioPos    : { value:0,    writable:true },
        vibratoCtr     : { value:0,    writable:true },
        vibratoPos     : { value:0,    writable:true },
        speed          : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.step           = null;
            this.row            = null;
            this.instr          = null;
            this.sample         = null;
            this.enabled        = 0;
            this.pattern        = 0;
            this.instrument     = 0;
            this.note           = 0;
            this.period         = 0;
            this.volume         = 0;
            this.original       = 0;
            this.adsrPos        = 0;
            this.sustainCtr     = 0;
            this.pitchBend      = 0;
            this.pitchBendCtr   = 0;
            this.noteSlideTo    = 0;
            this.noteSlideSpeed = 0;
            this.waveCtr        = 0;
            this.wavePos        = 0;
            this.arpeggioCtr    = 0;
            this.arpeggioPos    = 0;
            this.vibratoCtr     = 0;
            this.vibratoPos     = 0;
            this.speed          = 0;
        }}
      });
    }
    function S2Instrument() {
      return Object.create(null, {
        wave           : { value:0, writable:true },
        waveLen        : { value:0, writable:true },
        waveDelay      : { value:0, writable:true },
        waveSpeed      : { value:0, writable:true },
        arpeggio       : { value:0, writable:true },
        arpeggioLen    : { value:0, writable:true },
        arpeggioDelay  : { value:0, writable:true },
        arpeggioSpeed  : { value:0, writable:true },
        vibrato        : { value:0, writable:true },
        vibratoLen     : { value:0, writable:true },
        vibratoDelay   : { value:0, writable:true },
        vibratoSpeed   : { value:0, writable:true },
        pitchBend      : { value:0, writable:true },
        pitchBendDelay : { value:0, writable:true },
        attackMax      : { value:0, writable:true },
        attackSpeed    : { value:0, writable:true },
        decayMin       : { value:0, writable:true },
        decaySpeed     : { value:0, writable:true },
        sustain        : { value:0, writable:true },
        releaseMin     : { value:0, writable:true },
        releaseSpeed   : { value:0, writable:true }
      });
    }
    function S2Row() {
      var o = AmigaRow();

      Object.defineProperties(o, {
        speed : { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function S2Sample() {
      var o = AmigaSample();

      Object.defineProperties(o, {
        negStart  : { value:0, writable:true },
        negLen    : { value:0, writable:true },
        negSpeed  : { value:0, writable:true },
        negDir    : { value:0, writable:true },
        negOffset : { value:0, writable:true },
        negPos    : { value:0, writable:true },
        negCtr    : { value:0, writable:true },
        negToggle : { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function S2Step() {
      var o = AmigaStep();

      Object.defineProperties(o, {
        soundTranspose: { value:0, writable:true }
      });

      return Object.seal(o);
    }
    function S2Player(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id          : { value:"S2Player" },
        tracks      : { value:[],   writable:true },
        patterns    : { value:[],   writable:true },
        instruments : { value:[],   writable:true },
        samples     : { value:[],   writable:true },
        arpeggios   : { value:null, writable:true },
        vibratos    : { value:null, writable:true },
        waves       : { value:null, writable:true },
        length      : { value:0,    writable:true },
        speedDef    : { value:0,    writable:true },
        voices      : { value:[],   writable:true },
        trackPos    : { value:0,    writable:true },
        patternPos  : { value:0,    writable:true },
        patternLen  : { value:0,    writable:true },
        arpeggioFx  : { value:null, writable:true },
        arpeggioPos : { value:0,    writable:true },

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();

            this.speed      = this.speedDef;
            this.tick       = this.speedDef;
            this.trackPos   = 0;
            this.patternPos = 0;
            this.patternLen = 64;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.instr   = this.instruments[0];

              this.arpeggioFx[voice.index] = 0;
              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var higher = 0, i = 0, id, instr, j, len, pointers, position, pos = 0, row, step, sample, sampleData, value;
            stream.position = 58;
            id = stream.readString(28);
            if (id != "SIDMON II - THE MIDI VERSION") return;

            stream.position = 2;
            this.length   = stream.readUbyte();
            this.speedDef = stream.readUbyte();
            this.samples.length = stream.readUshort() >> 6;

            stream.position = 14;
            len = stream.readUint();
            this.tracks.length = len;
            stream.position = 90;

            for (; i < len; ++i) {
              step = S2Step();
              step.pattern = stream.readUbyte();
              if (step.pattern > higher) higher = step.pattern;
              this.tracks[i] = step;
            }

            for (i = 0; i < len; ++i) {
              step = this.tracks[i];
              step.transpose = stream.readByte();
            }

            for (i = 0; i < len; ++i) {
              step = this.tracks[i];
              step.soundTranspose = stream.readByte();
            }

            position = stream.position;
            stream.position = 26;
            len = stream.readUint() >> 5;
            this.instruments.length = ++len;
            stream.position = position;

            this.instruments[0] = S2Instrument();

            for (i = 0; ++i < len;) {
              instr = S2Instrument();
              instr.wave           = stream.readUbyte() << 4;
              instr.waveLen        = stream.readUbyte();
              instr.waveSpeed      = stream.readUbyte();
              instr.waveDelay      = stream.readUbyte();
              instr.arpeggio       = stream.readUbyte() << 4;
              instr.arpeggioLen    = stream.readUbyte();
              instr.arpeggioSpeed  = stream.readUbyte();
              instr.arpeggioDelay  = stream.readUbyte();
              instr.vibrato        = stream.readUbyte() << 4;
              instr.vibratoLen     = stream.readUbyte();
              instr.vibratoSpeed   = stream.readUbyte();
              instr.vibratoDelay   = stream.readUbyte();
              instr.pitchBend      = stream.readByte();
              instr.pitchBendDelay = stream.readUbyte();
              stream.readByte();
              stream.readByte();
              instr.attackMax      = stream.readUbyte();
              instr.attackSpeed    = stream.readUbyte();
              instr.decayMin       = stream.readUbyte();
              instr.decaySpeed     = stream.readUbyte();
              instr.sustain        = stream.readUbyte();
              instr.releaseMin     = stream.readUbyte();
              instr.releaseSpeed   = stream.readUbyte();
              this.instruments[i] = instr;
              stream.position += 9;
            }

            position = stream.position;
            stream.position = 30;
            len = stream.readUint();
            this.waves = new Uint8Array(len);
            stream.position = position;

            for (i = 0; i < len; ++i) this.waves[i] = stream.readUbyte();

            position = stream.position;
            stream.position = 34;
            len = stream.readUint();
            this.arpeggios = new Int8Array(len);
            stream.position = position;

            for (i = 0; i < len; ++i) this.arpeggios[i] = stream.readByte();

            position = stream.position;
            stream.position = 38;
            len = stream.readUint();
            this.vibratos = new Int8Array(len);
            stream.position = position;

            for (i = 0; i < len; ++i) this.vibratos[i] = stream.readByte();

            len = this.samples.length;
            position = 0;

            for (i = 0; i < len; ++i) {
              sample = S2Sample();
              stream.readUint();
              sample.length    = stream.readUshort() << 1;
              sample.loop      = stream.readUshort() << 1;
              sample.repeat    = stream.readUshort() << 1;
              sample.negStart  = position + (stream.readUshort() << 1);
              sample.negLen    = stream.readUshort() << 1;
              sample.negSpeed  = stream.readUshort();
              sample.negDir    = stream.readUshort();
              sample.negOffset = stream.readShort();
              sample.negPos    = stream.readUint();
              sample.negCtr    = stream.readUshort();
              stream.position += 6;
              sample.name      = stream.readString(32);

              sample.pointer = position;
              sample.loopPtr = position + sample.loop;
              position += sample.length;
              this.samples[i] = sample;
            }

            sampleData = position;
            len = ++higher;
            pointers = new Uint16Array(++higher);
            for (i = 0; i < len; ++i) pointers[i] = stream.readUshort();

            position = stream.position;
            stream.position = 50;
            len = stream.readUint();
            this.patterns = [];
            stream.position = position;
            j = 1;

            for (i = 0; i < len; ++i) {
              row   = S2Row();
              value = stream.readByte();

              if (!value) {
                row.effect = stream.readByte();
                row.param  = stream.readUbyte();
                i += 2;
              } else if (value < 0) {
                row.speed = ~value;
              } else if (value < 112) {
                row.note = value;
                value = stream.readByte();
                i++;

                if (value < 0) {
                  row.speed = ~value;
                } else if (value < 112) {
                  row.sample = value;
                  value = stream.readByte();
                  i++;

                  if (value < 0) {
                    row.speed = ~value;
                  } else {
                    row.effect = value;
                    row.param  = stream.readUbyte();
                    i++;
                  }
                } else {
                  row.effect = value;
                  row.param  = stream.readUbyte();
                  i++;
                }
              } else {
                row.effect = value;
                row.param  = stream.readUbyte();
                i++;
              }

              this.patterns[pos++] = row;
              if ((position + pointers[j]) == stream.position) pointers[j++] = pos;
            }
            pointers[j] = this.patterns.length;

            if ((stream.position & 1) != 0) stream.position++;
            this.mixer.store(stream, sampleData);
            len = this.tracks.length;

            for (i = 0; i < len; ++i) {
              step = this.tracks[i];
              step.pattern = pointers[step.pattern];
            }

            this.length++;
            this.version = 2;
        }},
        process: {
          value: function() {
            var chan, instr, row, sample, value, voice = this.voices[0];
            this.arpeggioPos = ++this.arpeggioPos & 3;

            if (++this.tick >= this.speed) {
              this.tick = 0;

              while (voice) {
                chan = voice.channel;
                voice.enabled = voice.note = 0;

                if (!this.patternPos) {
                  voice.step    = this.tracks[this.trackPos + voice.index * this.length];
                  voice.pattern = voice.step.pattern;
                  voice.speed   = 0;
                }
                if (--voice.speed < 0) {
                  voice.row   = row = this.patterns[voice.pattern++];
                  voice.speed = row.speed;

                  if (row.note) {
                    voice.enabled = 1;
                    voice.note    = row.note + voice.step.transpose;
                    chan.enabled  = 0;
                  }
                }
                voice.pitchBend = 0;

                if (voice.note) {
                  voice.waveCtr      = voice.sustainCtr     = 0;
                  voice.arpeggioCtr  = voice.arpeggioPos    = 0;
                  voice.vibratoCtr   = voice.vibratoPos     = 0;
                  voice.pitchBendCtr = voice.noteSlideSpeed = 0;
                  voice.adsrPos = 4;
                  voice.volume  = 0;

                  if (row.sample) {
                    voice.instrument = row.sample;
                    voice.instr  = this.instruments[voice.instrument + voice.step.soundTranspose];
                    voice.sample = this.samples[this.waves[voice.instr.wave]];
                  }
                  voice.original = voice.note + this.arpeggios[voice.instr.arpeggio];
                  chan.period    = voice.period = PERIODS[voice.original];

                  sample = voice.sample;
                  chan.pointer = sample.pointer;
                  chan.length  = sample.length;
                  chan.enabled = voice.enabled;
                  chan.pointer = sample.loopPtr;
                  chan.length  = sample.repeat;
                }
                voice = voice.next;
              }

              if (++this.patternPos == this.patternLen) {
                this.patternPos = 0;

                if (++this.trackPos == this.length) {
                  this.trackPos = 0;
                  this.mixer.complete = 1;
                }
              }
            }
            voice = this.voices[0];

            while (voice) {
              if (!voice.sample) {
                voice = voice.next;
                continue;
              }
              chan   = voice.channel;
              sample = voice.sample;

              if (sample.negToggle) {
                voice = voice.next;
                continue;
              }
              sample.negToggle = 1;

              if (sample.negCtr) {
                sample.negCtr = --sample.negCtr & 31;
              } else {
                sample.negCtr = sample.negSpeed;
                if (!sample.negDir) {
                  voice = voice.next;
                  continue;
                }

                value = sample.negStart + sample.negPos;
                this.mixer.memory[value] = ~this.mixer.memory[value];
                sample.negPos += sample.negOffset;
                value = sample.negLen - 1;

                if (sample.negPos < 0) {
                  if (sample.negDir == 2) {
                    sample.negPos = value;
                  } else {
                    sample.negOffset = -sample.negOffset;
                    sample.negPos += sample.negOffset;
                  }
                } else if (value < sample.negPos) {
                  if (sample.negDir == 1) {
                    sample.negPos = 0;
                  } else {
                    sample.negOffset = -sample.negOffset;
                    sample.negPos += sample.negOffset;
                  }
                }
              }
              voice = voice.next;
            }
            voice = this.voices[0];

            while (voice) {
              if (!voice.sample) {
                voice = voice.next;
                continue;
              }
              voice.sample.negToggle = 0;
              voice = voice.next;
            }
            voice = this.voices[0];

            while (voice) {
              chan  = voice.channel;
              instr = voice.instr;

              switch (voice.adsrPos) {
                case 0:
                  break;
                case 4:   //attack
                  voice.volume += instr.attackSpeed;
                  if (instr.attackMax <= voice.volume) {
                    voice.volume = instr.attackMax;
                    voice.adsrPos--;
                  }
                  break;
                case 3:   //decay
                  if (!instr.decaySpeed) {
                    voice.adsrPos--;
                  } else {
                    voice.volume -= instr.decaySpeed;
                    if (instr.decayMin >= voice.volume) {
                      voice.volume = instr.decayMin;
                      voice.adsrPos--;
                    }
                  }
                  break;
                case 2:   //sustain
                  if (voice.sustainCtr == instr.sustain) voice.adsrPos--;
                    else voice.sustainCtr++;
                  break;
                case 1:   //release
                  voice.volume -= instr.releaseSpeed;
                  if (instr.releaseMin >= voice.volume) {
                    voice.volume = instr.releaseMin;
                    voice.adsrPos--;
                  }
                  break;
              }
              chan.volume = voice.volume >> 2;

              if (instr.waveLen) {
                if (voice.waveCtr == instr.waveDelay) {
                  voice.waveCtr = instr.waveDelay - instr.waveSpeed;
                  if (voice.wavePos == instr.waveLen) voice.wavePos = 0;
                    else voice.wavePos++;

                  voice.sample = sample = this.samples[this.waves[instr.wave + voice.wavePos]];
                  chan.pointer = sample.pointer;
                  chan.length  = sample.length;
                } else
                  voice.waveCtr++;
              }

              if (instr.arpeggioLen) {
                if (voice.arpeggioCtr == instr.arpeggioDelay) {
                  voice.arpeggioCtr = instr.arpeggioDelay - instr.arpeggioSpeed;
                  if (voice.arpeggioPos == instr.arpeggioLen) voice.arpeggioPos = 0;
                    else voice.arpeggioPos++;

                  value = voice.original + this.arpeggios[instr.arpeggio + voice.arpeggioPos];
                  voice.period = PERIODS[value];
                } else
                  voice.arpeggioCtr++;
              }
              row = voice.row;

              if (this.tick) {
                switch (row.effect) {
                  case 0:
                    break;
                  case 0x70:  //arpeggio
                    this.arpeggioFx[0] = row.param >> 4;
                    this.arpeggioFx[2] = row.param & 15;
                    value = voice.original + this.arpeggioFx[this.arpeggioPos];
                    voice.period = PERIODS[value];
                    break;
                  case 0x71:  //pitch up
                    voice.pitchBend = ~row.param + 1;
                    break;
                  case 0x72:  //pitch down
                    voice.pitchBend = row.param;
                    break;
                  case 0x73:  //volume up
                    if (voice.adsrPos != 0) break;
                    if (voice.instrument != 0) voice.volume = instr.attackMax;
                    voice.volume += row.param << 2;
                    if (voice.volume >= 256) voice.volume = -1;
                    break;
                  case 0x74:  //volume down
                    if (voice.adsrPos != 0) break;
                    if (voice.instrument != 0) voice.volume = instr.attackMax;
                    voice.volume -= row.param << 2;
                    if (voice.volume < 0) voice.volume = 0;
                    break;
                }
              }

              switch (row.effect) {
                case 0:
                  break;
                case 0x75:  //set adsr attack
                  instr.attackMax   = row.param;
                  instr.attackSpeed = row.param;
                  break;
                case 0x76:  //set pattern length
                  this.patternLen = row.param;
                  break;
                case 0x7c:  //set volume
                  chan.volume  = row.param;
                  voice.volume = row.param << 2;
                  if (voice.volume >= 255) voice.volume = 255;
                  break;
                case 0x7f:  //set speed
                  value = row.param & 15;
                  if (value) this.speed = value;
                  break;
              }

              if (instr.vibratoLen) {
                if (voice.vibratoCtr == instr.vibratoDelay) {
                  voice.vibratoCtr = instr.vibratoDelay - instr.vibratoSpeed;
                  if (voice.vibratoPos == instr.vibratoLen) voice.vibratoPos = 0;
                    else voice.vibratoPos++;

                  voice.period += this.vibratos[instr.vibrato + voice.vibratoPos];
                } else
                  voice.vibratoCtr++;
              }

              if (instr.pitchBend) {
                if (voice.pitchBendCtr == instr.pitchBendDelay) {
                  voice.pitchBend += instr.pitchBend;
                } else
                  voice.pitchBendCtr++;
              }

              if (row.param) {
                if (row.effect && row.effect < 0x70) {
                  voice.noteSlideTo = PERIODS[row.effect + voice.step.transpose];
                  value = row.param;
                  if ((voice.noteSlideTo - voice.period) < 0) value = -value;
                  voice.noteSlideSpeed = value;
                }
              }

              if (voice.noteSlideTo && voice.noteSlideSpeed) {
                voice.period += voice.noteSlideSpeed;

                if ((voice.noteSlideSpeed < 0 && voice.period < voice.noteSlideTo) ||
                    (voice.noteSlideSpeed > 0 && voice.period > voice.noteSlideTo)) {
                  voice.noteSlideSpeed = 0;
                  voice.period = voice.noteSlideTo;
                }
              }

              voice.period += voice.pitchBend;
              if (voice.period < 95) voice.period = 95;
                else if (voice.period > 5760) voice.period = 5760;

              chan.period = voice.period;
              voice = voice.next;
            }
        }}
      });

      o.voices[0] = S2Voice(0);
      o.voices[0].next = o.voices[1] = S2Voice(1);
      o.voices[1].next = o.voices[2] = S2Voice(2);
      o.voices[2].next = o.voices[3] = S2Voice(3);

      o.arpeggioFx = new Uint8Array(4);
      return Object.seal(o);
    }

    var PERIODS = [0,
          5760,5424,5120,4832,4560,4304,4064,3840,3616,3424,3232,3048,
          2880,2712,2560,2416,2280,2152,2032,1920,1808,1712,1616,1524,
          1440,1356,1280,1208,1140,1076,1016, 960, 904, 856, 808, 762,
           720, 678, 640, 604, 570, 538, 508, 480, 453, 428, 404, 381,
           360, 339, 320, 302, 285, 269, 254, 240, 226, 214, 202, 190,
           180, 170, 160, 151, 143, 135, 127, 120, 113, 107, 101,  95];

    window.neoart.S2Player = S2Player;
  })();


  (function() {
    function STVoice(idx) {
      return Object.create(null, {
        index   : { value:idx,  writable:true },
        next    : { value:null, writable:true },
        channel : { value:null, writable:true },
        sample  : { value:null, writable:true },
        enabled : { value:0,    writable:true },
        period  : { value:0,    writable:true },
        last    : { value:0,    writable:true },
        effect  : { value:0,    writable:true },
        param   : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel = null;
            this.sample  = null;
            this.enabled = 0;
            this.period  = 0;
            this.last    = 0;
            this.effect  = 0;
            this.param   = 0;
        }}
      });
    }
    function STPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id         : { value:"STPlayer" },
        standard   : { value:0,    writable:true },
        track      : { value:null, writable:true },
        patterns   : { value:[],   writable:true },
        samples    : { value:[],   writable:true },
        length     : { value:0,    writable:true },
        voices     : { value:[],   writable:true },
        trackPos   : { value:0,    writable:true },
        patternPos : { value:0,    writable:true },
        jumpFlag   : { value:0,    writable:true },

        force: {
          set: function(value) {
            if (value < ULTIMATE_SOUNDTRACKER)
              value = ULTIMATE_SOUNDTRACKER;
            else if (value > DOC_SOUNDTRACKER_20)
              value = DOC_SOUNDTRACKER_20;

            this.version = value;
        }},
        ntsc: {
          set: function(value) {
            this.standard = value;
            this.frequency(value);

            if (this.version < DOC_SOUNDTRACKER_9) {
              value = (value) ? 20.44952532 : 20.637767904;
              value = (value * (this.sampleRate / 1000)) / 120;
              this.mixer.samplesTick = ((240 - this.tempo) * value) >> 0;
            }
        }},

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();
            this.ntsc = this.standard;

            this.speed      = 6;
            this.trackPos   = 0;
            this.patternPos = 0;
            this.jumpFlag   = 0;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[0];
              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var higher = 0, i, j, row, sample, score = 0, size = 0, value;
            if (stream.length < 1626) return;

            this.title = stream.readString(20);
            score += this.isLegal(this.title);

            this.version = ULTIMATE_SOUNDTRACKER;
            stream.position = 42;

            for (i = 1; i < 16; ++i) {
              value = stream.readUshort();

              if (!value) {
                this.samples[i] = null;
                stream.position += 28;
                continue;
              }

              sample = AmigaSample();
              stream.position -= 24;

              sample.name = stream.readString(22);
              sample.length = value << 1;
              stream.position += 3;

              sample.volume = stream.readUbyte();
              sample.loop   = stream.readUshort();
              sample.repeat = stream.readUshort() << 1;

              stream.position += 22;
              sample.pointer = size;
              size += sample.length;
              this.samples[i] = sample;

              score += this.isLegal(sample.name);
              if (sample.length > 9999) this.version = MASTER_SOUNDTRACKER;
            }

            stream.position = 470;
            this.length = stream.readUbyte();
            this.tempo  = stream.readUbyte();

            for (i = 0; i < 128; ++i) {
              value = stream.readUbyte() << 8;
              if (value > 16384) score--;
              this.track[i] = value;
              if (value > higher) higher = value;
            }

            stream.position = 600;
            higher += 256;
            this.patterns.length = higher;

            i = (stream.length - size - 600) >> 2;
            if (higher > i) higher = i;

            for (i = 0; i < higher; ++i) {
              row = AmigaRow();

              row.note   = stream.readUshort();
              value      = stream.readUbyte();
              row.param  = stream.readUbyte();
              row.effect = value & 0x0f;
              row.sample = value >> 4;

              this.patterns[i] = row;

              if (row.effect > 2 && row.effect < 11) score--;
              if (row.note) {
                if (row.note < 113 || row.note > 856) score--;
              }

              if (row.sample) {
                if (row.sample > 15 || !this.samples[row.sample]) {
                  if (row.sample > 15) score--;
                  row.sample = 0;
                }
              }

              if (row.effect > 2 || (!row.effect && row.param != 0))
                this.version = DOC_SOUNDTRACKER_9;

              if (row.effect == 11 || row.effect == 13)
                this.version = DOC_SOUNDTRACKER_20;
            }

            this.mixer.store(stream, size);

            for (i = 1; i < 16; ++i) {
              sample = this.samples[i];
              if (!sample) continue;

              if (sample.loop) {
                sample.loopPtr = sample.pointer + sample.loop;
                sample.pointer = sample.loopPtr;
                sample.length  = sample.repeat;
              } else {
                sample.loopPtr = this.mixer.memory.length;
                sample.repeat  = 2;
              }

              size = sample.pointer + 4;
              for (j = sample.pointer; j < size; ++j) this.mixer.memory[j] = 0;
            }

            sample = AmigaSample();
            sample.pointer = sample.loopPtr = this.mixer.memory.length;
            sample.length  = sample.repeat  = 2;
            this.samples[0] = sample;

            if (score < 1) this.version = 0;
        }},
        process: {
          value: function() {
            var chan, row, sample, value, voice = this.voices[0];

            if (!this.tick) {
              value = this.track[this.trackPos] + this.patternPos;

              while (voice) {
                chan = voice.channel;
                voice.enabled = 0;

                row = this.patterns[value + voice.index];
                voice.period = row.note;
                voice.effect = row.effect;
                voice.param  = row.param;

                if (row.sample) {
                  sample = voice.sample = this.samples[row.sample];

                  if (((this.version & 2) == 2) && voice.effect == 12) chan.volume = voice.param;
                    else chan.volume = sample.volume;
                } else {
                  sample = voice.sample;
                }

                if (voice.period) {
                  voice.enabled = 1;

                  chan.enabled = 0;
                  chan.pointer = sample.pointer;
                  chan.length  = sample.length;
                  chan.period  = voice.last = voice.period;
                }

                if (voice.enabled) chan.enabled = 1;
                chan.pointer = sample.loopPtr;
                chan.length  = sample.repeat;

                if (this.version < DOC_SOUNDTRACKER_20) {
                  voice = voice.next;
                  continue;
                }

                switch (voice.effect) {
                  case 11:  //position jump
                    this.trackPos = voice.param - 1;
                    this.jumpFlag ^= 1;
                    break;
                  case 12:  //set volume
                    chan.volume = voice.param;
                    break;
                  case 13:  //pattern break
                    this.jumpFlag ^= 1;
                    break;
                  case 14:  //set filter
                    this.mixer.filter.active = voice.param ^ 1;
                    break;
                  case 15:  //set speed
                    if (!voice.param) break;
                    this.speed = voice.param & 0x0f;
                    this.tick = 0;
                    break;
                }
                voice = voice.next;
              }
            } else {
              while (voice) {
                if (!voice.param) {
                  voice = voice.next;
                  continue;
                }
                chan = voice.channel;

                if (this.version == ULTIMATE_SOUNDTRACKER) {
                  if (voice.effect == 1) {
                    this.arpeggio(voice);
                  } else if (voice.effect == 2) {
                    value = voice.param >> 4;

                    if (value) voice.period += value;
                      else voice.period -= (voice.param & 0x0f);

                    chan.period = voice.period;
                  }
                } else {
                  switch (voice.effect) {
                    case 0: //arpeggio
                      this.arpeggio(voice);
                      break;
                    case 1: //portamento up
                      voice.last -= voice.param & 0x0f;
                      if (voice.last < 113) voice.last = 113;
                      chan.period = voice.last;
                      break;
                    case 2: //portamento down
                      voice.last += voice.param & 0x0f;
                      if (voice.last > 856) voice.last = 856;
                      chan.period = voice.last;
                      break;
                }

                if ((this.version & 2) != 2) {
                  voice = voice.next;
                  continue;
                }

                switch (voice.effect) {
                  case 12:  //set volume
                    chan.volume = voice.param;
                    break;
                  case 13:  //set filter
                    this.mixer.filter.active = 0;
                    break;
                  case 14:  //set speed
                    this.speed = voice.param & 0x0f;
                    break;
                }
              }
              voice = voice.next;
            }
          }

          if (++this.tick == this.speed) {
            this.tick = 0;
            this.patternPos += 4;

            if (this.patternPos == 256 || this.jumpFlag) {
              this.patternPos = this.jumpFlag = 0;

              if (++this.trackPos == this.length) {
                this.trackPos = 0;
                this.mixer.complete = 1;
              }
            }
          }
        }},
        arpeggio: {
          value: function(voice) {
            var chan = voice.channel, i = 0, param = this.tick % 3;

            if (!param) {
              chan.period = voice.last;
              return;
            }

            if (param == 1) param = voice.param >> 4;
              else param = voice.param & 0x0f;

            while (voice.last != PERIODS[i]) i++;
            chan.period = PERIODS[i + param];
        }},
        isLegal: {
          value: function(text) {
            var ascii, i = 0, len = text.length;
            if (!len) return 0;

            for (; i < len; ++i) {
              ascii = text.charCodeAt(i);
              if (ascii && (ascii < 32 || ascii > 127)) return 0;
            }
            return 1;
        }}
      });

      o.voices[0] = STVoice(0);
      o.voices[0].next = o.voices[1] = STVoice(1);
      o.voices[1].next = o.voices[2] = STVoice(2);
      o.voices[2].next = o.voices[3] = STVoice(3);

      o.track = new Uint16Array(128);
      return Object.seal(o);
    }

    var ULTIMATE_SOUNDTRACKER = 1,
        DOC_SOUNDTRACKER_9    = 2,
        MASTER_SOUNDTRACKER   = 3,
        DOC_SOUNDTRACKER_20   = 4,

        PERIODS = [
          856,808,762,720,678,640,604,570,538,508,480,453,
          428,404,381,360,339,320,302,285,269,254,240,226,
          214,202,190,180,170,160,151,143,135,127,120,113,
          0,0,0];

    window.neoart.STPlayer = STPlayer;
  })();


  (function() {
    function F2Voice(idx) {
      var o = Object.create(null, {
        index          : { value:idx,  writable:true },
        next           : { value:null, writable:true },
        flags          : { value:0,    writable:true },
        delay          : { value:0,    writable:true },
        channel        : { value:null, writable:true },
        patternLoop    : { value:0,    writable:true },
        patternLoopRow : { value:0,    writable:true },
        playing        : { value:null, writable:true },
        note           : { value:0,    writable:true },
        keyoff         : { value:0,    writable:true },
        period         : { value:0,    writable:true },
        finetune       : { value:0,    writable:true },
        arpDelta       : { value:0,    writable:true },
        vibDelta       : { value:0,    writable:true },
        instrument     : { value:null, writable:true },
        autoVibratoPos : { value:0,    writable:true },
        autoSweep      : { value:0,    writable:true },
        autoSweepPos   : { value:0,    writable:true },
        sample         : { value:null, writable:true },
        sampleOffset   : { value:0,    writable:true },
        volume         : { value:0,    writable:true },
        volEnabled     : { value:0,    writable:true },
        volEnvelope    : { value:null, writable:true },
        volDelta       : { value:0,    writable:true },
        volSlide       : { value:0,    writable:true },
        volSlideMaster : { value:0,    writable:true },
        fineSlideU     : { value:0,    writable:true },
        fineSlideD     : { value:0,    writable:true },
        fadeEnabled    : { value:0,    writable:true },
        fadeDelta      : { value:0,    writable:true },
        fadeVolume     : { value:0,    writable:true },
        panning        : { value:0,    writable:true },
        panEnabled     : { value:0,    writable:true },
        panEnvelope    : { value:null, writable:true },
        panSlide       : { value:0,    writable:true },
        portaU         : { value:0,    writable:true },
        portaD         : { value:0,    writable:true },
        finePortaU     : { value:0,    writable:true },
        finePortaD     : { value:0,    writable:true },
        xtraPortaU     : { value:0,    writable:true },
        xtraPortaD     : { value:0,    writable:true },
        portaPeriod    : { value:0,    writable:true },
        portaSpeed     : { value:0,    writable:true },
        glissando      : { value:0,    writable:true },
        glissPeriod    : { value:0,    writable:true },
        vibratoPos     : { value:0,    writable:true },
        vibratoSpeed   : { value:0,    writable:true },
        vibratoDepth   : { value:0,    writable:true },
        vibratoReset   : { value:0,    writable:true },
        tremoloPos     : { value:0,    writable:true },
        tremoloSpeed   : { value:0,    writable:true },
        tremoloDepth   : { value:0,    writable:true },
        waveControl    : { value:0,    writable:true },
        tremorPos      : { value:0,    writable:true },
        tremorOn       : { value:0,    writable:true },
        tremorOff      : { value:0,    writable:true },
        tremorVolume   : { value:0,    writable:true },
        retrigx        : { value:0,    writable:true },
        retrigy        : { value:0,    writable:true },

        reset: {
          value: function() {
            this.volume   = this.sample.volume;
            this.panning  = this.sample.panning;
            this.finetune = (this.sample.finetune >> 3) << 2;
            this.keyoff   = 0;
            this.volDelta = 0;

            this.fadeEnabled = 0;
            this.fadeDelta   = 0;
            this.fadeVolume  = 65536;

            this.autoVibratoPos = 0;
            this.autoSweep      = 1;
            this.autoSweepPos   = 0;
            this.vibDelta       = 0;
            this.vibratoReset   = 0;

            if ((this.waveControl & 15) < 4) this.vibratoPos = 0;
            if ((this.waveControl >> 4) < 4) this.tremoloPos = 0;
          }},
        autoVibrato: {
          value: function() {
            var delta;
            this.autoVibratoPos = (this.autoVibratoPos + this.playing.vibratoSpeed) & 255;

            switch (this.playing.vibratoType) {
              case 0:
                delta = AUTOVIBRATO[this.autoVibratoPos];
                break;
              case 1:
                if (this.autoVibratoPos < 128) delta = -64; else delta = 64;
                break;
              case 2:
                delta = ((64 + (this.autoVibratoPos >> 1)) & 127) - 64;
                break;
              case 3:
                delta = ((64 - (this.autoVibratoPos >> 1)) & 127) - 64;
                break;
            }

            delta *= this.playing.vibratoDepth;

            if (this.autoSweep) {
              if (!this.playing.vibratoSweep) {
                this.autoSweep = 0;
              } else {
                if (this.autoSweepPos > this.playing.vibratoSweep) {
                  if (this.autoSweepPos & 2) delta *= (this.autoSweepPos / this.playing.vibratoSweep);
                  this.autoSweep = 0;
                } else {
                  delta *= (++this.autoSweepPos / this.playing.vibratoSweep);
                }
              }
            }

            this.flags |= UPDATE_PERIOD;
            return (delta >> 6);
          }},
        tonePortamento: {
          value: function() {
            if (!this.glissPeriod) this.glissPeriod = this.period;

            if (this.period < this.portaPeriod) {
              this.glissPeriod += this.portaSpeed << 2;

              if (!this.glissando) this.period = this.glissPeriod;
                else this.period = Math.round(this.glissPeriod / 64) << 6;

              if (this.period >= this.portaPeriod) {
                this.period = this.portaPeriod;
                this.glissPeriod = this.portaPeriod = 0;
              }
            } else if (this.period > this.portaPeriod) {
              this.glissPeriod -= this.portaSpeed << 2;

              if (!this.glissando) this.period = this.glissPeriod;
                else this.period = Math.round(this.glissPeriod / 64) << 6;

              if (this.period <= this.portaPeriod) {
                this.period = this.portaPeriod;
                this.glissPeriod = this.portaPeriod = 0;
              }
            }

            this.flags |= UPDATE_PERIOD;
          }},
        tremolo: {
          value: function() {
            var delta = 255, position = this.tremoloPos & 31;

            switch ((this.waveControl >> 4) & 3) {
              case 0:
                delta = VIBRATO[position];
                break;
              case 1:
                delta = position << 3;
                break;
            }

            this.volDelta = (delta * this.tremoloDepth) >> 6;
            if (this.tremoloPos > 31) this.volDelta = -this.volDelta;
            this.tremoloPos = (this.tremoloPos + this.tremoloSpeed) & 63;

            this.flags |= UPDATE_VOLUME;
          }},
        tremor: {
          value: function() {
            if (this.tremorPos == this.tremorOn) {
              this.tremorVolume = this.volume;
              this.volume = 0;
              this.flags |= UPDATE_VOLUME;
            } else {
              this.tremorPos = 0;
              this.volume = this.tremorVolume;
              this.flags |= UPDATE_VOLUME;
            }

            this.tremorPos++;
          }},
        vibrato: {
          value: function() {
            var delta = 255, position = this.vibratoPos & 31;

            switch (this.waveControl & 3) {
              case 0:
                delta = VIBRATO[position];
                break;
              case 1:
                delta = position << 3;
                if (this.vibratoPos > 31) delta = 255 - delta;
                break;
            }

            this.vibDelta = (delta * this.vibratoDepth) >> 7;
            if (this.vibratoPos > 31) this.vibDelta = -this.vibDelta;
            this.vibratoPos = (this.vibratoPos + this.vibratoSpeed) & 63;

            this.flags |= UPDATE_PERIOD;
          }}
      });

      o.volEnvelope = F2Envelope();
      o.panEnvelope = F2Envelope();
      return Object.seal(o);
    }
    function F2Data() {
      return Object.create(null, {
        points    : { value:[], writable:true },
        total     : { value:0,  writable:true },
        sustain   : { value:0,  writable:true },
        loopStart : { value:0,  writable:true },
        loopEnd   : { value:0,  writable:true },
        flags     : { value:0,  writable:true }
      });
    }
    function F2Envelope() {
      return Object.create(null, {
        value    : { value:0, writable:true },
        position : { value:0, writable:true },
        frame    : { value:0, writable:true },
        delta    : { value:0, writable:true },
        fraction : { value:0, writable:true },
        stopped  : { value:0, writable:true },

        reset: {
          value: function() {
            this.value    = 0;
            this.position = 0;
            this.frame    = 0;
            this.delta    = 0;
            this.fraction = 0;
            this.stopped  = 0;
          }}
      });
    }
    function F2Instrument() {
      var o = Object.create(null, {
        name         : { value:"",   writable:true },
        samples      : { value:[],   writable:true },
        noteSamples  : { value:null, writable:true },
        fadeout      : { value:0,    writable:true },
        volData      : { value:null, writable:true },
        volEnabled   : { value:0,    writable:true },
        panData      : { value:null, writable:true },
        panEnabled   : { value:0,    writable:true },
        vibratoType  : { value:0,    writable:true },
        vibratoSweep : { value:0,    writable:true },
        vibratoSpeed : { value:0,    writable:true },
        vibratoDepth : { value:0,    writable:true }
      });

      o.noteSamples = new Uint8Array(96);
      o.volData = F2Data();
      o.panData = F2Data();
      return Object.seal(o);
    }
    function F2Pattern(length, channels) {
      var o = Object.create(null, {
        rows   : { value:[], writable:true },
        length : { value:0,  writable:true },
        size   : { value:0,  writable:true }
      });

      o.rows.length = o.size = length * channels;
      o.length = length;
      return Object.seal(o);
    }
    function F2Point(x, y) {
      var o = Object.create(null, {
        frame : { value:0, writable:true },
        value : { value:0, writable:true }
      });

      o.frame = x || 0;
      o.value = y || 0;
      return Object.seal(o);
    }
    function F2Row() {
      return Object.create(null, {
        note       : { value:0, writable:true },
        instrument : { value:0, writable:true },
        volume     : { value:0, writable:true },
        effect     : { value:0, writable:true },
        param      : { value:0, writable:true }
      });
    }
    function F2Sample() {
      var o = SBSample();

      Object.defineProperties(o, {
        finetune:  { value:0,  writable:true },
        panning:   { value:0,  writable:true },
        relative:  { value:0,  writable:true }
      });

      return Object.seal(o);
    }
    function F2Player(mixer) {
      var o = SBPlayer(mixer);

      Object.defineProperties(o, {
        id            : { value:"F2Player" },
        patterns      : { value:[],   writable:true },
        instruments   : { value:[],   writable:true },
        voices        : { value:[],   writable:true },
        linear        : { value:0,    writable:true },
        complete      : { value:0,    writable:true },
        order         : { value:0,    writable:true },
        position      : { value:0,    writable:true },
        nextOrder     : { value:0,    writable:true },
        nextPosition  : { value:0,    writable:true },
        pattern       : { value:null, writable:true },
        patternDelay  : { value:0,    writable:true },
        patternOffset : { value:0,    writable:true },
        timer         : { value:0,    writable:true },

        initialize: {
          value: function() {
            var i = 0, voice;
            this.reset();

            this.timer         = this.speed;
            this.order         =  0;
            this.position      =  0;
            this.nextOrder     = -1;
            this.nextPosition  = -1;
            this.patternDelay  =  0;
            this.patternOffset =  0;
            this.complete      =  0;
            this.master        = 64;

            this.voices.length = this.channels;

            for (; i < this.channels; ++i) {
              voice = F2Voice(i);

              voice.channel = this.mixer.channels[i];
              voice.playing = this.instruments[0];
              voice.sample  = voice.playing.samples[0];

              this.voices[i] = voice;
              if (i) this.voices[i - 1].next = voice;
            }
        }},
        loader: {
          value: function(stream) {
            var header, i, id, iheader, instr, ipos, j, len, pattern, pos, reserved = 22, row, rows, sample, value;
            if (stream.length < 360) return;
            stream.position = 17;

            this.title = stream.readString(20);
            stream.position++;
            id = stream.readString(20);

            if (id == "FastTracker v2.00   " || id == "FastTracker v 2.00  ") {
              this.version = 1;
            } else if (id == "Sk@le Tracker") {
              reserved = 2;
              this.version = 2;
            } else if (id == "MadTracker 2.0") {
              this.version = 3;
            } else if (id == "MilkyTracker        ") {
              this.version = 4;
            } else if (id == "DigiBooster Pro 2.18") {
              this.version = 5;
            } else if (id.indexOf("OpenMPT") != -1) {
              this.version = 6;
            } else return;

            stream.readUshort();

            header = stream.readUint();
            this.length   = stream.readUshort();
            this.restart  = stream.readUshort();
            this.channels = stream.readUshort();

            value = rows = stream.readUshort();
            this.instruments = [];
            this.instruments.length = stream.readUshort() + 1;

            this.linear = stream.readUshort();
            this.speed  = stream.readUshort();
            this.tempo  = stream.readUshort();

            this.track = new Uint8Array(this.length);

            for (i = 0; i < this.length; ++i) {
              j = stream.readUbyte();
              if (j >= value) rows = j + 1;
              this.track[i] = j;
            }

            this.patterns = [];
            this.patterns.length = rows;

            if (rows != value) {
              pattern = F2Pattern(64, this.channels);
              j = pattern.size;
              for (i = 0; i < j; ++i) pattern.rows[i] = F2Row();
              this.patterns[--rows] = pattern;
            }

            stream.position = pos = header + 60;
            len = value;

            for (i = 0; i < len; ++i) {
              header = stream.readUint();
              stream.position++;

              pattern = F2Pattern(stream.readUshort(), this.channels);
              rows = pattern.size;

              value = stream.readUshort();
              stream.position = pos + header;
              ipos = stream.position + value;

              if (value) {
                for (j = 0; j < rows; ++j) {
                  row = F2Row();
                  value = stream.readUbyte();

                  if (value & 128) {
                    if (value &  1) row.note       = stream.readUbyte();
                    if (value &  2) row.instrument = stream.readUbyte();
                    if (value &  4) row.volume     = stream.readUbyte();
                    if (value &  8) row.effect     = stream.readUbyte();
                    if (value & 16) row.param      = stream.readUbyte();
                  } else {
                    row.note       = value;
                    row.instrument = stream.readUbyte();
                    row.volume     = stream.readUbyte();
                    row.effect     = stream.readUbyte();
                    row.param      = stream.readUbyte();
                  }

                  if (row.note != KEYOFF_NOTE) if (row.note > 96) row.note = 0;
                  pattern.rows[j] = row;
                }
              } else {
                for (j = 0; j < rows; ++j) pattern.rows[j] = F2Row();
              }

              this.patterns[i] = pattern;
              pos = stream.position;
              if (pos != ipos) pos = stream.position = ipos;
            }

            ipos = stream.position;
            len = this.instruments.length;

            for (i = 1; i < len; ++i) {
              iheader = stream.readUint();
              if ((stream.position + iheader) >= stream.length) break;

              instr = F2Instrument();
              instr.name = stream.readString(22);
              stream.position++;

              value = stream.readUshort();
              if (value > 16) value = 16;
              header = stream.readUint();
              if (reserved == 2 && header != 64) header = 64;

              if (value) {
                instr.samples = [];
                instr.samples.length = value;

                for (j = 0; j < 96; ++j)
                  instr.noteSamples[j] = stream.readUbyte();
                for (j = 0; j < 12; ++j)
                  instr.volData.points[j] = F2Point(stream.readUshort(), stream.readUshort());
                for (j = 0; j < 12; ++j)
                  instr.panData.points[j] = F2Point(stream.readUshort(), stream.readUshort());

                instr.volData.total     = stream.readUbyte();
                instr.panData.total     = stream.readUbyte();
                instr.volData.sustain   = stream.readUbyte();
                instr.volData.loopStart = stream.readUbyte();
                instr.volData.loopEnd   = stream.readUbyte();
                instr.panData.sustain   = stream.readUbyte();
                instr.panData.loopStart = stream.readUbyte();
                instr.panData.loopEnd   = stream.readUbyte();
                instr.volData.flags     = stream.readUbyte();
                instr.panData.flags     = stream.readUbyte();

                if (instr.volData.flags & ENVELOPE_ON) instr.volEnabled = 1;
                if (instr.panData.flags & ENVELOPE_ON) instr.panEnabled = 1;

                instr.vibratoType  = stream.readUbyte();
                instr.vibratoSweep = stream.readUbyte();
                instr.vibratoDepth = stream.readUbyte();
                instr.vibratoSpeed = stream.readUbyte();
                instr.fadeout      = stream.readUshort() << 1;

                stream.position += reserved;
                pos = stream.position;
                this.instruments[i] = instr;

                for (j = 0; j < value; ++j) {
                  sample = F2Sample();
                  sample.length    = stream.readUint();
                  sample.loopStart = stream.readUint();
                  sample.loopLen   = stream.readUint();
                  sample.volume    = stream.readUbyte();
                  sample.finetune  = stream.readByte();
                  sample.loopMode  = stream.readUbyte();
                  sample.panning   = stream.readUbyte();
                  sample.relative  = stream.readByte();

                  stream.position++;
                  sample.name = stream.readString(22);
                  instr.samples[j] = sample;

                  stream.position = (pos += header);
                }

                for (j = 0; j < value; ++j) {
                  sample = instr.samples[j];
                  if (!sample.length) continue;
                  pos = stream.position + sample.length;

                  if (sample.loopMode & 16) {
                    sample.bits       = 16;
                    sample.loopMode  ^= 16;
                    sample.length    >>= 1;
                    sample.loopStart >>= 1;
                    sample.loopLen   >>= 1;
                  }

                  if (!sample.loopLen) sample.loopMode = 0;
                  sample.store(stream);
                  if (sample.loopMode) sample.length = sample.loopStart + sample.loopLen;
                  stream.position = pos;
                }
              } else {
                stream.position = ipos + iheader;
              }

              ipos = stream.position;
              if (ipos >= stream.length) break;
            }

            instr = F2Instrument();
            instr.volData = F2Data();
            instr.panData = F2Data();
            instr.samples = [];

            for (i = 0; i < 12; ++i) {
              instr.volData.points[i] = F2Point();
              instr.panData.points[i] = F2Point();
            }

            sample = F2Sample();
            sample.length = 220;
            sample.data = new Float32Array(220);

            for (i = 0; i < 220; ++i) sample.data[i] = 0.0;

            instr.samples[0] = sample;
            this.instruments[0] = instr;
        }},
        process: {
          value: function() {
            var com, curr, instr, i, jumpFlag, next, paramx, paramy, porta, row, sample, slide, value, voice = this.voices[0];

            if (!this.tick) {
              if (this.nextOrder >= 0) this.order = this.nextOrder;
              if (this.nextPosition >= 0) this.position = this.nextPosition;

              this.nextOrder = this.nextPosition = -1;
              this.pattern = this.patterns[this.track[this.order]];

              while (voice) {
                row = this.pattern.rows[this.position + voice.index];
                com = row.volume >> 4;
                porta = (row.effect == 3 || row.effect == 5 || com == 15);
                paramx = row.param >> 4;
                voice.keyoff = 0;

                if (voice.arpDelta) {
                  voice.arpDelta = 0;
                  voice.flags |= UPDATE_PERIOD;
                }

                if (row.instrument) {
                  voice.instrument = (row.instrument < this.instruments.length) ? this.instruments[row.instrument] : null;
                  voice.volEnvelope.reset();
                  voice.panEnvelope.reset();
                  voice.flags |= (UPDATE_VOLUME | UPDATE_PANNING | SHORT_RAMP);
                } else if (row.note == KEYOFF_NOTE || (row.effect == 20 && !row.param)) {
                  voice.fadeEnabled = 1;
                  voice.keyoff = 1;
                }

                if (row.note && row.note != KEYOFF_NOTE) {
                  if (voice.instrument) {
                    instr  = voice.instrument;
                    value  = row.note - 1;
                    sample = instr.samples[instr.noteSamples[value]];
                    value += sample.relative;

                    if (value >= LOWER_NOTE && value <= HIGHER_NOTE) {
                      if (!porta) {
                        voice.note = value;
                        voice.sample = sample;

                        if (row.instrument) {
                          voice.volEnabled = instr.volEnabled;
                          voice.panEnabled = instr.panEnabled;
                          voice.flags |= UPDATE_ALL;
                        } else {
                          voice.flags |= (UPDATE_PERIOD | UPDATE_TRIGGER);
                        }
                      }

                      if (row.instrument) {
                        voice.reset();
                        voice.fadeDelta = instr.fadeout;
                      } else {
                        voice.finetune = (sample.finetune >> 3) << 2;
                      }

                      if (row.effect == 14 && paramx == 5)
                        voice.finetune = ((row.param & 15) - 8) << 3;

                      if (this.linear) {
                        value = ((120 - value) << 6) - voice.finetune;
                      } else {
                        value = this.amiga(value, voice.finetune);
                      }

                      if (!porta) {
                        voice.period = value;
                        voice.glissPeriod = 0;
                      } else {
                        voice.portaPeriod = value;
                      }
                    }
                  } else {
                    voice.volume = 0;
                    voice.flags = (UPDATE_VOLUME | SHORT_RAMP);
                  }
                } else if (voice.vibratoReset) {
                  if (row.effect != 4 && row.effect != 6) {
                    voice.vibDelta = 0;
                    voice.vibratoReset = 0;
                    voice.flags |= UPDATE_PERIOD;
                  }
                }

                if (row.volume) {
                  if (row.volume >= 16 && row.volume <= 80) {
                    voice.volume = row.volume - 16;
                    voice.flags |= (UPDATE_VOLUME | SHORT_RAMP);
                  } else {
                    paramy = row.volume & 15;

                    switch (com) {
                      case 6:   //vx fine volume slide down
                        voice.volume -= paramy;
                        if (voice.volume < 0) voice.volume = 0;
                        voice.flags |= UPDATE_VOLUME;
                        break;
                      case 7:   //vx fine volume slide up
                        voice.volume += paramy;
                        if (voice.volume > 64) voice.volume = 64;
                        voice.flags |= UPDATE_VOLUME;
                        break;
                      case 10:  //vx set vibrato speed
                        if (paramy) voice.vibratoSpeed = paramy;
                        break;
                      case 11:  //vx vibrato
                        if (paramy) voice.vibratoDepth = paramy << 2;
                        break;
                      case 12:  //vx set panning
                        voice.panning = paramy << 4;
                        voice.flags |= UPDATE_PANNING;
                        break;
                      case 15:  //vx tone portamento
                        if (paramy) voice.portaSpeed = paramy << 4;
                        break;
                    }
                  }
                }

                if (row.effect) {
                  paramy = row.param & 15;

                  switch (row.effect) {
                    case 1:   //fx portamento up
                      if (row.param) voice.portaU = row.param << 2;
                      break;
                    case 2:   //fx portamento down
                      if (row.param) voice.portaD = row.param << 2;
                      break;
                    case 3:   //fx tone portamento
                      if (row.param && com != 15) voice.portaSpeed = row.param;
                      break;
                    case 4:   //fx vibrato
                      voice.vibratoReset = 1;
                      break;
                    case 5:   //fx tone portamento + volume slide
                      if (row.param) voice.volSlide = row.param;
                      break;
                    case 6:   //fx vibrato + volume slide
                      if (row.param) voice.volSlide = row.param;
                      voice.vibratoReset = 1;
                      break;
                    case 7:   //fx tremolo
                      if (paramx) voice.tremoloSpeed = paramx;
                      if (paramy) voice.tremoloDepth = paramy;
                      break;
                    case 8:   //fx set panning
                      voice.panning = row.param;
                      voice.flags |= UPDATE_PANNING;
                      break;
                    case 9:   //fx sample offset
                      if (row.param) voice.sampleOffset = row.param << 8;

                      if (voice.sampleOffset >= voice.sample.length) {
                        voice.volume = 0;
                        voice.sampleOffset = 0;
                        voice.flags &= ~(UPDATE_PERIOD | UPDATE_TRIGGER);
                        voice.flags |=  (UPDATE_VOLUME | SHORT_RAMP);
                      }
                      break;
                    case 10:  //fx volume slide
                      if (row.param) voice.volSlide = row.param;
                      break;
                    case 11:  //fx position jump
                      this.nextOrder = row.param;

                      if (this.nextOrder >= this.length) this.complete = 1;
                        else this.nextPosition = 0;

                      jumpFlag = 1;
                      this.patternOffset = 0;
                      break;
                    case 12:  //fx set volume
                      voice.volume = row.param;
                      voice.flags |= (UPDATE_VOLUME | SHORT_RAMP);
                      break;
                    case 13:  //fx pattern break
                      this.nextPosition = ((paramx * 10) + paramy) * this.channels;
                      this.patternOffset = 0;

                      if (!jumpFlag) {
                        this.nextOrder = this.order + 1;

                        if (this.nextOrder >= this.length) {
                          this.complete = 1;
                          this.nextPosition = -1;
                        }
                      }
                      break;
                    case 14:  //fx extended effects

                      switch (paramx) {
                        case 1:   //ex fine portamento up
                          if (paramy) voice.finePortaU = paramy << 2;
                          voice.period -= voice.finePortaU;
                          voice.flags |= UPDATE_PERIOD;
                          break;
                        case 2:   //ex fine portamento down
                          if (paramy) voice.finePortaD = paramy << 2;
                          voice.period += voice.finePortaD;
                          voice.flags |= UPDATE_PERIOD;
                          break;
                        case 3:   //ex glissando control
                          voice.glissando = paramy;
                          break;
                        case 4:   //ex vibrato control
                          voice.waveControl = (voice.waveControl & 0xf0) | paramy;
                          break;
                        case 6:   //ex pattern loop
                          if (!paramy) {
                            voice.patternLoopRow = this.patternOffset = this.position;
                          } else {
                            if (!voice.patternLoop) {
                              voice.patternLoop = paramy;
                            } else {
                              voice.patternLoop--;
                            }

                            if (voice.patternLoop)
                              this.nextPosition = voice.patternLoopRow;
                          }
                          break;
                        case 7:   //ex tremolo control
                          voice.waveControl = (voice.waveControl & 0x0f) | (paramy << 4);
                          break;
                        case 10:  //ex fine volume slide up
                          if (paramy) voice.fineSlideU = paramy;
                          voice.volume += voice.fineSlideU;
                          voice.flags |= UPDATE_VOLUME;
                          break;
                        case 11:  //ex fine volume slide down
                          if (paramy) voice.fineSlideD = paramy;
                          voice.volume -= voice.fineSlideD;
                          voice.flags |= UPDATE_VOLUME;
                          break;
                        case 13:  //ex note delay
                          voice.delay = voice.flags;
                          voice.flags = 0;
                          break;
                        case 14:  //ex pattern delay
                          this.patternDelay = paramy * this.timer;
                          break;
                      }

                      break;
                    case 15:  //fx set speed
                      if (!row.param) break;
                      if (row.param < 32) this.timer = row.param;
                        else this.mixer.samplesTick = ((this.sampleRate * 2.5) / row.param) >> 0;
                      break;
                    case 16:  //fx set global volume
                      this.master = row.param;
                      if (this.master > 64) this.master = 64;
                      voice.flags |= UPDATE_VOLUME;
                      break;
                    case 17:  //fx global volume slide
                      if (row.param) voice.volSlideMaster = row.param;
                      break;
                    case 21:  //fx set envelope position
                      if (!voice.instrument || !voice.instrument.volEnabled) break;
                      instr  = voice.instrument;
                      value  = row.param;
                      paramx = instr.volData.total;

                      for (i = 0; i < paramx; i++)
                        if (value < instr.volData.points[i].frame) break;

                      voice.volEnvelope.position = --i;
                      paramx--;

                      if ((instr.volData.flags & ENVELOPE_LOOP) && i == instr.volData.loopEnd) {
                        i = voice.volEnvelope.position = instr.volData.loopStart;
                        value = instr.volData.points[i].frame;
                        voice.volEnvelope.frame = value;
                      }

                      if (i >= paramx) {
                        voice.volEnvelope.value = instr.volData.points[paramx].value;
                        voice.volEnvelope.stopped = 1;
                      } else {
                        voice.volEnvelope.stopped = 0;
                        voice.volEnvelope.frame = value;
                        if (value > instr.volData.points[i].frame) voice.volEnvelope.position++;

                        curr  = instr.volData.points[i];
                        next  = instr.volData.points[++i];
                        value = next.frame - curr.frame;

                        voice.volEnvelope.delta = (value ? (((next.value - curr.value) << 8) / value) >> 0 : 0) || 0;
                        voice.volEnvelope.fraction = (curr.value << 8);
                      }
                      break;
                    case 24:  //fx panning slide
                      if (row.param) voice.panSlide = row.param;
                      break;
                    case 27:  //fx multi retrig note
                      if (paramx) voice.retrigx = paramx;
                      if (paramy) voice.retrigy = paramy;

                      if (!row.volume && voice.retrigy) {
                        com = this.tick + 1;
                        if (com % voice.retrigy) break;
                        if (row.volume > 80 && voice.retrigx) this.retrig(voice);
                      }
                      break;
                    case 29:  //fx tremor
                      if (row.param) {
                        voice.tremorOn  = ++paramx;
                        voice.tremorOff = ++paramy + paramx;
                      }
                      break;
                    case 33:  //fx extra fine portamento
                      if (paramx == 1) {
                        if (paramy) voice.xtraPortaU = paramy;
                        voice.period -= voice.xtraPortaU;
                        voice.flags |= UPDATE_PERIOD;
                      } else if (paramx == 2) {
                        if (paramy) voice.xtraPortaD = paramy;
                        voice.period += voice.xtraPortaD;
                        voice.flags |= UPDATE_PERIOD;
                      }
                      break;
                  }
                }
                voice = voice.next;
              }
            } else {
              while (voice) {
                row = this.pattern.rows[this.position + voice.index];

                if (voice.delay) {
                  if ((row.param & 15) == this.tick) {
                    voice.flags = voice.delay;
                    voice.delay = 0;
                  } else {
                    voice = voice.next;
                    continue;
                  }
                }

                if (row.volume) {
                  paramx = row.volume >> 4;
                  paramy = row.volume & 15;

                  switch (paramx) {
                    case 6:   //vx volums slide down
                      voice.volume -= paramy;
                      if (voice.volume < 0) voice.volume = 0;
                      voice.flags |= UPDATE_VOLUME;
                      break;
                    case 7:   //vx volums slide up
                      voice.volume += paramy;
                      if (voice.volume > 64) voice.volume = 64;
                      voice.flags |= UPDATE_VOLUME;
                      break;
                    case 11:  //vx vibrato
                      voice.vibrato();
                      break;
                    case 13:  //vx panning slide left
                      voice.panning -= paramy;
                      if (voice.panning < 0) voice.panning = 0;
                      voice.flags |= UPDATE_PANNING;
                      break;
                    case 14:  //vx panning slide right
                      voice.panning += paramy;
                      if (voice.panning > 255) voice.panning = 255;
                      voice.flags |= UPDATE_PANNING;
                      break;
                    case 15:  //vx tone portamento
                      if (voice.portaPeriod) voice.tonePortamento();
                      break;
                  }
                }

                paramx = row.param >> 4;
                paramy = row.param & 15;

                switch (row.effect) {
                  case 0:   //fx arpeggio
                    if (!row.param) break;
                    value = (this.tick - this.timer) % 3;
                    if (value < 0) value += 3;
                    if (this.tick == 2 && this.timer == 18) value = 0;

                    if (!value) {
                      voice.arpDelta = 0;
                    } else if (value == 1) {
                      if (this.linear) {
                        voice.arpDelta = -(paramy << 6);
                      } else {
                        value = this.amiga(voice.note + paramy, voice.finetune);
                        voice.arpDelta = value - voice.period;
                      }
                    } else {
                      if (this.linear) {
                        voice.arpDelta = -(paramx << 6);
                      } else {
                        value = this.amiga(voice.note + paramx, voice.finetune);
                        voice.arpDelta = value - voice.period;
                      }
                    }

                    voice.flags |= UPDATE_PERIOD;
                    break;
                  case 1:   //fx portamento up
                    voice.period -= voice.portaU;
                    if (voice.period < 0) voice.period = 0;
                    voice.flags |= UPDATE_PERIOD;
                    break;
                  case 2:   //fx portamento down
                    voice.period += voice.portaD;
                    if (voice.period > 9212) voice.period = 9212;
                    voice.flags |= UPDATE_PERIOD;
                    break;
                  case 3:   //fx tone portamento
                    if (voice.portaPeriod) voice.tonePortamento();
                    break;
                  case 4:   //fx vibrato
                    if (paramx) voice.vibratoSpeed = paramx;
                    if (paramy) voice.vibratoDepth = paramy << 2;
                    voice.vibrato();
                    break;
                  case 5:   //fx tone portamento + volume slide
                    slide = 1;
                    if (voice.portaPeriod) voice.tonePortamento();
                    break;
                  case 6:   //fx vibrato + volume slide
                    slide = 1;
                    voice.vibrato();
                    break;
                  case 7:   //fx tremolo
                    voice.tremolo();
                    break;
                  case 10:  //fx volume slide
                    slide = 1;
                    break;
                  case 14:  //fx extended effects

                    switch (paramx) {
                      case 9:   //ex retrig note
                        if ((this.tick % paramy) == 0) {
                          voice.volEnvelope.reset();
                          voice.panEnvelope.reset();
                          voice.flags |= (UPDATE_VOLUME | UPDATE_PANNING | UPDATE_TRIGGER);
                        }
                        break;
                      case 12:  //ex note cut
                        if (this.tick == paramy) {
                          voice.volume = 0;
                          voice.flags |= UPDATE_VOLUME;
                        }
                        break;
                    }

                    break;
                  case 17:  //fx global volume slide
                    paramx = voice.volSlideMaster >> 4;
                    paramy = voice.volSlideMaster & 15;

                    if (paramx) {
                      this.master += paramx;
                      if (this.master > 64) this.master = 64;
                      voice.flags |= UPDATE_VOLUME;
                    } else if (paramy) {
                      this.master -= paramy;
                      if (this.master < 0) this.master = 0;
                      voice.flags |= UPDATE_VOLUME;
                    }
                    break;
                  case 20:  //fx keyoff
                    if (this.tick == row.param) {
                      voice.fadeEnabled = 1;
                      voice.keyoff = 1;
                    }
                    break;
                  case 24:  //fx panning slide
                    paramx = voice.panSlide >> 4;
                    paramy = voice.panSlide & 15;

                    if (paramx) {
                      voice.panning += paramx;
                      if (voice.panning > 255) voice.panning = 255;
                      voice.flags |= UPDATE_PANNING;
                    } else if (paramy) {
                      voice.panning -= paramy;
                      if (voice.panning < 0) voice.panning = 0;
                      voice.flags |= UPDATE_PANNING;
                    }
                    break;
                  case 27:  //fx multi retrig note
                    com = this.tick;
                    if (!row.volume) com++;
                    if (com % voice.retrigy) break;

                    if ((!row.volume || row.volume > 80) && voice.retrigx) this.retrig(voice);
                    voice.flags |= UPDATE_TRIGGER;
                    break;
                  case 29:  //fx tremor
                    voice.tremor();
                    break;
                }

                if (slide) {
                  paramx = voice.volSlide >> 4;
                  paramy = voice.volSlide & 15;
                  slide = 0;

                  if (paramx) {
                    voice.volume += paramx;
                    voice.flags |= UPDATE_VOLUME;
                  } else if (paramy) {
                    voice.volume -= paramy;
                    voice.flags |= UPDATE_VOLUME;
                  }
                }
                voice = voice.next;
              }
            }

            if (++this.tick >= (this.timer + this.patternDelay)) {
              this.patternDelay = this.tick = 0;

              if (this.nextPosition < 0) {
                this.nextPosition = this.position + this.channels;

                if (this.nextPosition >= this.pattern.size || this.complete) {
                  this.nextOrder = this.order + 1;
                  this.nextPosition = this.patternOffset;

                  if (this.nextOrder >= this.length) {
                    this.nextOrder = this.restart;
                    this.mixer.complete = 1;
                  }
                }
              }
            }
        }},
        fast: {
          value: function() {
            var chan, delta, flags, instr, panning, voice = this.voices[0], volume;

            while (voice) {
              chan  = voice.channel;
              flags = voice.flags;
              voice.flags = 0;

              if (flags & UPDATE_TRIGGER) {
                chan.index    = voice.sampleOffset;
                chan.pointer  = -1;
                chan.dir      =  0;
                chan.fraction =  0;
                chan.sample   = voice.sample;
                chan.length   = voice.sample.length;

                chan.enabled = chan.sample.data ? 1 : 0;
                voice.playing = voice.instrument;
                voice.sampleOffset = 0;
              }

              instr = voice.playing;
              delta = instr.vibratoSpeed ? voice.autoVibrato() : 0;

              volume = voice.volume + voice.volDelta;

              if (instr.volEnabled) {
                if (voice.volEnabled && !voice.volEnvelope.stopped)
                  this.envelope(voice, voice.volEnvelope, instr.volData);

                volume = (volume * voice.volEnvelope.value) >> 6;
                flags |= UPDATE_VOLUME;

                if (voice.fadeEnabled) {
                  voice.fadeVolume -= voice.fadeDelta;

                  if (voice.fadeVolume < 0) {
                    volume = 0;

                    voice.fadeVolume  = 0;
                    voice.fadeEnabled = 0;

                    voice.volEnvelope.value   = 0;
                    voice.volEnvelope.stopped = 1;
                    voice.panEnvelope.stopped = 1;
                  } else {
                    volume = (volume * voice.fadeVolume) >> 16;
                  }
                }
              } else if (voice.keyoff) {
                volume = 0;
                flags |= UPDATE_VOLUME;
              }

              panning = voice.panning;

              if (instr.panEnabled) {
                if (voice.panEnabled && !voice.panEnvelope.stopped)
                  this.envelope(voice, voice.panEnvelope, instr.panData);

                panning = (voice.panEnvelope.value << 2);
                flags |= UPDATE_PANNING;

                if (panning < 0) panning = 0;
                  else if (panning > 255) panning = 255;
              }

              if (flags & UPDATE_VOLUME) {
                if (volume < 0) volume = 0;
                  else if (volume > 64) volume = 64;

                chan.volume = VOLUMES[(volume * this.master) >> 6];
                chan.lvol = chan.volume * chan.lpan;
                chan.rvol = chan.volume * chan.rpan;
              }

              if (flags & UPDATE_PANNING) {
                chan.panning = panning;
                chan.lpan = PANNING[256 - panning];
                chan.rpan = PANNING[panning];

                chan.lvol = chan.volume * chan.lpan;
                chan.rvol = chan.volume * chan.rpan;
              }

              if (flags & UPDATE_PERIOD) {
                delta += voice.period + voice.arpDelta + voice.vibDelta;

                if (this.linear) {
                  chan.speed = (((548077568 * Math.pow(2, ((4608 - delta) / 768))) / this.sampleRate) >> 0) / 65536;
                } else {
                  chan.speed = (((65536 * (14317456 / delta)) / this.sampleRate) >> 0) / 65536;
                }

                chan.delta  = chan.speed >> 0;
                chan.speed -= chan.delta;
              }
              voice = voice.next;
            }
        }},
        accurate: {
          value: function() {
            var chan, delta, flags, instr, lpan, lvol, panning, rpan, rvol, voice = this.voices[0], volume;

            while (voice) {
              chan  = voice.channel;
              flags = voice.flags;
              voice.flags = 0;

              if (flags & UPDATE_TRIGGER) {
                if (chan.sample) {
                  flags |= SHORT_RAMP;
                  chan.mixCounter = 220;
                  chan.oldSample  = null;
                  chan.oldPointer = -1;

                  if (chan.enabled) {
                    chan.oldDir      = chan.dir;
                    chan.oldFraction = chan.fraction;
                    chan.oldSpeed    = chan.speed;
                    chan.oldSample   = chan.sample;
                    chan.oldPointer  = chan.pointer;
                    chan.oldLength   = chan.length;

                    chan.lmixRampD  = chan.lvol;
                    chan.lmixDeltaD = chan.lvol / 220;
                    chan.rmixRampD  = chan.rvol;
                    chan.rmixDeltaD = chan.rvol / 220;
                  }
                }

                chan.dir = 1;
                chan.fraction = 0;
                chan.sample  = voice.sample;
                chan.pointer = voice.sampleOffset;
                chan.length  = voice.sample.length;

                chan.enabled = chan.sample.data ? 1 : 0;
                voice.playing = voice.instrument;
                voice.sampleOffset = 0;
              }

              instr = voice.playing;
              delta = instr.vibratoSpeed ? voice.autoVibrato() : 0;

              volume = voice.volume + voice.volDelta;

              if (instr.volEnabled) {
                if (voice.volEnabled && !voice.volEnvelope.stopped)
                  this.envelope(voice, voice.volEnvelope, instr.volData);

                volume = (volume * voice.volEnvelope.value) >> 6;
                flags |= UPDATE_VOLUME;

                if (voice.fadeEnabled) {
                  voice.fadeVolume -= voice.fadeDelta;

                  if (voice.fadeVolume < 0) {
                    volume = 0;

                    voice.fadeVolume  = 0;
                    voice.fadeEnabled = 0;

                    voice.volEnvelope.value   = 0;
                    voice.volEnvelope.stopped = 1;
                    voice.panEnvelope.stopped = 1;
                  } else {
                    volume = (volume * voice.fadeVolume) >> 16;
                  }
                }
              } else if (voice.keyoff) {
                volume = 0;
                flags |= UPDATE_VOLUME;
              }

              panning = voice.panning;

              if (instr.panEnabled) {
                if (voice.panEnabled && !voice.panEnvelope.stopped)
                  this.envelope(voice, voice.panEnvelope, instr.panData);

                panning = (voice.panEnvelope.value << 2);
                flags |= UPDATE_PANNING;

                if (panning < 0) panning = 0;
                  else if (panning > 255) panning = 255;
              }

              if (!chan.enabled) {
                chan.volCounter = 0;
                chan.panCounter = 0;
                voice = voice.next;
                continue;
              }

              if (flags & UPDATE_VOLUME) {
                if (volume < 0) volume = 0;
                  else if (volume > 64) volume = 64;

                volume = VOLUMES[(volume * this.master) >> 6];
                lvol = volume * PANNING[256 - panning];
                rvol = volume * PANNING[panning];

                if (volume != chan.volume && !chan.mixCounter) {
                  chan.volCounter = (flags & SHORT_RAMP) ? 220 : this.mixer.samplesTick;

                  chan.lvolDelta = (lvol - chan.lvol) / chan.volCounter;
                  chan.rvolDelta = (rvol - chan.rvol) / chan.volCounter;
                } else {
                  chan.lvol = lvol;
                  chan.rvol = rvol;
                }
                chan.volume = volume;
              }

              if (flags & UPDATE_PANNING) {
                lpan = PANNING[256 - panning];
                rpan = PANNING[panning];

                if (panning != chan.panning && !chan.mixCounter && !chan.volCounter) {
                  chan.panCounter = this.mixer.samplesTick;

                  chan.lpanDelta = (lpan - chan.lpan) / chan.panCounter;
                  chan.rpanDelta = (rpan - chan.rpan) / chan.panCounter;
                } else {
                  chan.lpan = lpan;
                  chan.rpan = rpan;
                }
                chan.panning = panning;
              }

              if (flags & UPDATE_PERIOD) {
                delta += voice.period + voice.arpDelta + voice.vibDelta;

                if (this.linear) {
                  chan.speed = (((548077568 * Math.pow(2, ((4608 - delta) / 768))) / this.sampleRate) >> 0) / 65536;
                } else {
                  chan.speed = (((65536 * (14317456 / delta)) / this.sampleRate) >> 0) / 65536;
                }
              }

              if (chan.mixCounter) {
                chan.lmixRampU  = 0.0;
                chan.lmixDeltaU = chan.lvol / 220;
                chan.rmixRampU  = 0.0;
                chan.rmixDeltaU = chan.rvol / 220;
              }
              voice = voice.next;
            }
        }},
        envelope: {
          value: function(voice, envelope, data) {
            var pos = envelope.position, curr = data.points[pos], next;

            if (envelope.frame == curr.frame) {
              if ((data.flags & ENVELOPE_LOOP) && pos == data.loopEnd) {
                pos  = envelope.position = data.loopStart;
                curr = data.points[pos];
                envelope.frame = curr.frame;
              }

              if (pos == (data.total - 1)) {
                envelope.value = curr.value;
                envelope.stopped = 1;
                return;
              }

              if ((data.flags & ENVELOPE_SUSTAIN) && pos == data.sustain && !voice.fadeEnabled) {
                envelope.value = curr.value;
                return;
              }

              envelope.position++;
              next = data.points[envelope.position];

              envelope.delta = (((next.value - curr.value << 8) / (next.frame - curr.frame)) >> 0) || 0;
              envelope.fraction = (curr.value << 8);
            } else {
              envelope.fraction += envelope.delta;
            }

            envelope.value = (envelope.fraction >> 8);
            envelope.frame++;
        }},
        amiga: {
          value: function(note, finetune) {
            var delta = 0.0, period = PERIODS[++note];

            if (finetune < 0) {
              delta = (PERIODS[--note] - period) / 64;
            } else if (finetune > 0) {
              delta = (period - PERIODS[++note]) / 64;
            }

            return (period - (delta * finetune)) >> 0;
        }},
        retrig: {
          value: function(voice) {
            switch (voice.retrigx) {
              case 1:
                voice.volume--;
                break;
              case 2:
                voice.volume++;
                break;
              case 3:
                voice.volume -= 4;
                break;
              case 4:
                voice.volume -= 8;
                break;
              case 5:
                voice.volume -= 16;
                break;
              case 6:
                voice.volume = (voice.volume << 1) / 3;
                break;
              case 7:
                voice.volume >>= 1;
                break;
              case 8:
                voice.volume = voice.sample.volume;
                break;
              case 9:
                voice.volume++;
                break;
              case 10:
                voice.volume += 2;
                break;
              case 11:
                voice.volume += 4;
                break;
              case 12:
                voice.volume += 8;
                break;
              case 13:
                voice.volume += 16;
                break;
              case 14:
                voice.volume = (voice.volume * 3) >> 1;
                break;
              case 15:
                voice.volume <<= 1;
                break;
            }

            if (voice.volume < 0) voice.volume = 0;
              else if (voice.volume > 64) voice.volume = 64;

            voice.flags |= UPDATE_VOLUME;
        }}
      });

      return Object.seal(o);
    }

    var UPDATE_PERIOD    = 1,
        UPDATE_VOLUME    = 2,
        UPDATE_PANNING   = 4,
        UPDATE_TRIGGER   = 8,
        UPDATE_ALL       = 15,
        SHORT_RAMP       = 32,

        ENVELOPE_ON      = 1,
        ENVELOPE_SUSTAIN = 2,
        ENVELOPE_LOOP    = 4,

        LOWER_NOTE       = 0,
        HIGHER_NOTE      = 118,
        KEYOFF_NOTE      = 97,

        AUTOVIBRATO = [
            0, -2, -3, -5, -6, -8, -9,-11,-12,-14,-16,-17,-19,-20,-22,-23,
          -24,-26,-27,-29,-30,-32,-33,-34,-36,-37,-38,-39,-41,-42,-43,-44,
          -45,-46,-47,-48,-49,-50,-51,-52,-53,-54,-55,-56,-56,-57,-58,-59,
          -59,-60,-60,-61,-61,-62,-62,-62,-63,-63,-63,-64,-64,-64,-64,-64,
          -64,-64,-64,-64,-64,-64,-63,-63,-63,-62,-62,-62,-61,-61,-60,-60,
          -59,-59,-58,-57,-56,-56,-55,-54,-53,-52,-51,-50,-49,-48,-47,-46,
          -45,-44,-43,-42,-41,-39,-38,-37,-36,-34,-33,-32,-30,-29,-27,-26,
          -24,-23,-22,-20,-19,-17,-16,-14,-12,-11, -9, -8, -6, -5, -3, -2,
            0,  2,  3,  5,  6,  8,  9, 11, 12, 14, 16, 17, 19, 20, 22, 23,
           24, 26, 27, 29, 30, 32, 33, 34, 36, 37, 38, 39, 41, 42, 43, 44,
           45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 56, 57, 58, 59,
           59, 60, 60, 61, 61, 62, 62, 62, 63, 63, 63, 64, 64, 64, 64, 64,
           64, 64, 64, 64, 64, 64, 63, 63, 63, 62, 62, 62, 61, 61, 60, 60,
           59, 59, 58, 57, 56, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46,
           45, 44, 43, 42, 41, 39, 38, 37, 36, 34, 33, 32, 30, 29, 27, 26,
           24, 23, 22, 20, 19, 17, 16, 14, 12, 11,  9,  8,  6,  5,  3,  2],

        VIBRATO = [
            0, 24, 49, 74, 97,120,141,161,180,197,212,224,235,244,250,253,
          255,253,250,244,235,224,212,197,180,161,141,120, 97, 74, 49, 24],

        PANNING = [
          0.000000,0.044170,0.062489,0.076523,0.088371,0.098821,0.108239,0.116927,0.124977,
          0.132572,0.139741,0.146576,0.153077,0.159335,0.165350,0.171152,0.176772,0.182210,
          0.187496,0.192630,0.197643,0.202503,0.207273,0.211951,0.216477,0.220943,0.225348,
          0.229631,0.233854,0.237985,0.242056,0.246066,0.249985,0.253873,0.257670,0.261437,
          0.265144,0.268819,0.272404,0.275989,0.279482,0.282976,0.286409,0.289781,0.293153,
          0.296464,0.299714,0.302965,0.306185,0.309344,0.312473,0.315602,0.318671,0.321708,
          0.324746,0.327754,0.330700,0.333647,0.336563,0.339449,0.342305,0.345161,0.347986,
          0.350781,0.353545,0.356279,0.359013,0.361717,0.364421,0.367094,0.369737,0.372380,
          0.374992,0.377574,0.380157,0.382708,0.385260,0.387782,0.390303,0.392794,0.395285,
          0.397746,0.400176,0.402606,0.405037,0.407437,0.409836,0.412206,0.414576,0.416915,
          0.419254,0.421563,0.423841,0.426180,0.428458,0.430737,0.432985,0.435263,0.437481,
          0.439729,0.441916,0.444134,0.446321,0.448508,0.450665,0.452852,0.455009,0.457136,
          0.459262,0.461389,0.463485,0.465611,0.467708,0.469773,0.471839,0.473935,0.475970,
          0.478036,0.480072,0.482077,0.484112,0.486117,0.488122,0.490127,0.492101,0.494106,
          0.496051,0.498025,0.500000,0.501944,0.503888,0.505802,0.507746,0.509660,0.511574,
          0.513488,0.515371,0.517255,0.519138,0.521022,0.522905,0.524758,0.526611,0.528465,
          0.530318,0.532140,0.533993,0.535816,0.537639,0.539462,0.541254,0.543046,0.544839,
          0.546631,0.548423,0.550216,0.551978,0.553739,0.555501,0.557263,0.558995,0.560757,
          0.562489,0.564220,0.565952,0.567683,0.569384,0.571116,0.572817,0.574518,0.576220,
          0.577890,0.579592,0.581262,0.582964,0.584634,0.586305,0.587946,0.589617,0.591257,
          0.592928,0.594568,0.596209,0.597849,0.599459,0.601100,0.602710,0.604350,0.605960,
          0.607570,0.609150,0.610760,0.612370,0.613950,0.615560,0.617139,0.618719,0.620268,
          0.621848,0.623428,0.624977,0.626557,0.628106,0.629655,0.631205,0.632754,0.634303,
          0.635822,0.637372,0.638890,0.640440,0.641959,0.643478,0.644966,0.646485,0.648004,
          0.649523,0.651012,0.652500,0.653989,0.655477,0.656966,0.658454,0.659943,0.661431,
          0.662890,0.664378,0.665836,0.667294,0.668783,0.670241,0.671699,0.673127,0.674585,
          0.676043,0.677471,0.678929,0.680357,0.681785,0.683213,0.684641,0.686068,0.687496,
          0.688894,0.690321,0.691749,0.693147,0.694574,0.695972,0.697369,0.698767,0.700164,
          0.701561,0.702928,0.704326,0.705723,0.707110],

        VOLUMES = [
          0.000000,0.005863,0.013701,0.021569,0.029406,0.037244,0.045082,0.052919,0.060757,
          0.068625,0.076463,0.084300,0.092138,0.099976,0.107844,0.115681,0.123519,0.131357,
          0.139194,0.147032,0.154900,0.162738,0.170575,0.178413,0.186251,0.194119,0.201956,
          0.209794,0.217632,0.225469,0.233307,0.241175,0.249013,0.256850,0.264688,0.272526,
          0.280394,0.288231,0.296069,0.303907,0.311744,0.319582,0.327450,0.335288,0.343125,
          0.350963,0.358800,0.366669,0.374506,0.382344,0.390182,0.398019,0.405857,0.413725,
          0.421563,0.429400,0.437238,0.445076,0.452944,0.460781,0.468619,0.476457,0.484294,
          0.492132,0.500000],

        PERIODS = [
          29024,27392,25856,24384,23040,21696,20480,19328,18240,17216,16256,15360,14512,
          13696,12928,12192,11520,10848,10240, 9664, 9120, 8608, 8128, 7680, 7256, 6848,
           6464, 6096, 5760, 5424, 5120, 4832, 4560, 4304, 4064, 3840, 3628, 3424, 3232,
           3048, 2880, 2712, 2560, 2416, 2280, 2152, 2032, 1920, 1814, 1712, 1616, 1524,
           1440, 1356, 1280, 1208, 1140, 1076, 1016,  960,  907,  856,  808,  762,  720,
            678,  640,  604,  570,  538,  508,  480,  453,  428,  404,  381,  360,  339,
            320,  302,  285,  269,  254,  240,  227,  214,  202,  190,  180,  169,  160,
            151,  142,  134,  127,  120,  113,  107,  101,   95,   90,   85,   80,   75,
             71,   67,   63,   60,   57,   53,   50,   48,   45,   42,   40,   38,   36,
             34,   32,   30,   28];

    window.neoart.F2Player = F2Player;
  })();
})()
