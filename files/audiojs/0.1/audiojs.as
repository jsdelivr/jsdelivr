package {

import flash.display.Sprite;
import flash.external.ExternalInterface;
import flash.net.URLRequest;
import flash.media.Sound;
import flash.media.SoundChannel;
import flash.media.SoundTransform;
import flash.events.Event;
import flash.errors.IOError;
import flash.events.IOErrorEvent;
import flash.events.ProgressEvent;
import flash.events.TimerEvent;
import flash.utils.Timer;
import flash.system.Security;

public class audiojs extends Sprite {

  private var _channel:SoundChannel;
  private var sound:Sound;
  private var duration:Number;
  private var playerInstance:String;

  private var pausePoint:Number = 0;
  private var playing:Boolean = false;
  private var volume:Number = 1;
  private var timer:Timer = new Timer(250, 0);


  private function get channel():SoundChannel {
    return this._channel;
  }

  private function set channel(channel:SoundChannel):void {
    this._channel = channel;
    this._channel.addEventListener(Event.SOUND_COMPLETE, this.soundEnded);
  }

  public function audiojs():void {
    Security.allowDomain("*");

    this.playerInstance = root.loaderInfo.parameters.playerInstance+'.';

    ExternalInterface.addCallback('init', init);
    ExternalInterface.addCallback('load', load);
    ExternalInterface.addCallback('playPause', playPause);
    ExternalInterface.addCallback('pplay', play);
    ExternalInterface.addCallback('ppause', pause);
    ExternalInterface.addCallback('skipTo', skipTo);
    ExternalInterface.addCallback('setVolume', setVolume);

    ExternalInterface.call(this.playerInstance+'loadStarted');
  }

  private function updatePlayhead(e:TimerEvent = null):void {
    var targetPosition:Number = e ? this.channel.position : this.pausePoint;
    var playProgress:Number = targetPosition / this.duration;

    if (playProgress > 1) playProgress = 1;
    if (playProgress > 0) {
      ExternalInterface.call(this.playerInstance+'updatePlayhead', playProgress);
    }
  }

  private function loadProgress(e:ProgressEvent):void {
    this.duration = (e.bytesTotal / (e.bytesLoaded / this.sound.length))
    var loadPercent:Number = e.bytesLoaded / e.bytesTotal;

    if (loadPercent > 1) loadPercent = 1;
    if (loadPercent > 0) {
      ExternalInterface.call(this.playerInstance+'loadProgress', loadPercent, (this.duration/1000));
    }
  }
  
  private function init(mp3:String):void {
    this.load(mp3);
  }

  private function load(mp3:String):void {
    if (this.channel) this.channel.stop();
    if (this.sound) this.sound.removeEventListener(ProgressEvent.PROGRESS, this.loadProgress);
    
    this.channel = new SoundChannel();
    this.sound = new Sound(new URLRequest(mp3));
    
    this.pausePoint = 0;
    this.sound.addEventListener(IOErrorEvent.IO_ERROR, this.loadError);
    this.sound.addEventListener(ProgressEvent.PROGRESS, this.loadProgress);

    this.timer.addEventListener(TimerEvent.TIMER, this.updatePlayhead);
    this.timer.start();
  }

  private function loadError(e:IOErrorEvent):void {
    ExternalInterface.call(this.playerInstance+'loadError');
  }

  private function play():void {
    this.channel = this.sound.play(this.pausePoint);
    this.setVolume(this.volume);
    this.playing = true;
    this.timer.start();
  }

  private function pause():void {
    this.pausePoint = this.channel.position;
    this.channel.stop();
    this.playing = false;
    this.timer.stop();
  }

  private function playPause():void {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  private function skipTo(percent:Number):void {
    this.channel.stop();
    this.pausePoint = this.duration * percent;
    if (this.playing) {
      this.channel = this.sound.play(this.pausePoint);
      this.setVolume(this.volume);
    } else {
      this.updatePlayhead();
    }
  }

  private function setVolume(vol:Number):void {
    this.volume = vol;
    var transform:SoundTransform = this.channel.soundTransform;
    if (vol < 0) vol = 0;
    if (vol > 1) vol = 1;
    transform.volume = vol;
    channel.soundTransform = transform;
  }

  private function soundEnded(e:Event):void {
    ExternalInterface.call(this.playerInstance+'trackEnded');
  }

}

}