'use strict';

(function (_root) {

  var Dummy = {};
  var dummyTextFillTags = [];
  var isEnabled = true;
  var debug = true;

  Dummy = {
    getConfig: function getConfig() {

      return {

        isEnabled: isEnabled,
        debug: debug

      };
    },
    log: function log(message) {

      if (debug) console.debug('Dummy.js Debug: ' + message);
    },
    resolveConfig: function resolveConfig() {
      var _this = this;

      var scriptTags = document.getElementsByTagName('script');

      for (var i = 0; i < scriptTags.length; i++) {

        var currentTag = scriptTags[i];
        var src = currentTag.getAttribute('src');

        if (src && src.toLowerCase().indexOf('dummy') > 0) {

          var configTags = currentTag.getAttribute('data-dummy');

          this.log('found anchoring tag in DOM');

          if (!configTags) {

            this.log('did not find any `data-dummy` attribute; configuration done');
            return;
          }

          configTags = configTags.split(',');
          configTags.forEach(function (configTag) {

            _this.log('resolved; `' + configTag + '`');

            if (configTag === 'debug') debug = true;
            if (configTag === 'disable' || configTag === 'disabled') {

              isEnabled = false;
              _this.log('SCRIPT DISABLED');
            }
          });
        }
      }
    },
    indexElements: function indexElements() {

      var textTags = document.querySelectorAll('p, span, h1, h2, h3');

      if (!textTags || textTags.length === 0) {

        this.log('no elements to be indexed');
        return;
      }

      for (var i = 0; i < textTags.length; i++) {

        var currentElement = textTags[i];
        var dummyDataValue = currentElement.getAttribute('data-dummy-fill');

        if (dummyDataValue !== null && dummyDataValue !== '' && dummyDataValue !== 'disable') {

          dummyTextFillTags.push(currentElement);
        }
      }

      if (dummyTextFillTags.length === 0) {

        this.log('no DummyJS-enabled DOM element(s) found in current tree');
      } else {

        this.log('indexed ' + dummyTextFillTags.length + ' elements in current DOM tree');
      }
    },
    dummy: function dummy() {

      for (var i = 0; i < dummyTextFillTags.length; i++) {

        // we're looking at something like:
        // data-dummy-fill="3,sentences"

        var currentElement = dummyTextFillTags[i];
        var dummyConfig = currentElement.getAttribute('data-dummy-fill').split(',');

        if (dummyConfig[0] === 'disable' || dummyConfig[0] === '') continue;

        currentElement.innerText = this.generateLoremBlock(dummyConfig[1], dummyConfig[0]);
      }
    },
    generateLoremBlock: function generateLoremBlock(type, count) {

      var ipsumArray = 'lorem,ipsum,dolor,sit,amet,consectetur,adipiscing,elit,proin,accumsan,lacus,ut,consectetur,tristique,ante,est,vehicula,risus,eget,ornare,tortor,libero,sed,lorem,donec,porttitor,felis,non,massa,porttitor,vestibulum,maecenas,lorem,urna,pretium,sit,amet,sodales,in,semper,a,leo,morbi,luctus,nisl,id,eleifend,lacinia,quam,orci,consequat,lacus,sit,amet,luctus,neque,dui,eu,felis,nullam,condimentum,nibh,sed,tortor,pulvinar,at,consequat,sem,viverra,ut,auctor,mauris,euismod,vulputate,pharetra,suspendisse,quis,bibendum,eros,duis,auctor,egestas,venenatis,sed,volutpat,magna,non,volutpat,convallis,vivamus,maximus,sit,amet,leo,in,malesuada,aliquam,ultricies,risus,a,nisi,laoreet,luctus,nullam,ut,interdum,orci,vestibulum,maximus,turpis,vel,sagittis,ullamcorper,sed,ultrices,velit,at,aliquam,placerat,suspendisse,sit,amet,velit,mollis,suscipit,diam,id,viverra,ligula,vestibulum,mollis,cursus,felis,sodales,auctor,magna,luctus,eu,nullam,scelerisque,massa,ut,porta,pulvinar,diam,neque,ornare,quam,vitae,placerat,ligula,lectus,a,velit,vestibulum,ante,ipsum,primis,in,faucibus,orci,luctus,et,ultrices,posuere,cubilia,curae,aliquam,malesuada,interdum,eros,sagittis,sollicitudin,vivamus,quis,mollis,lorem,in,tincidunt,ante,mauris,lacus,justo,egestas,ut,ipsum,a,consectetur,auctor,neque,proin,at,malesuada,felis,ac,maximus,diam,aenean,placerat,purus,elit,ac,sodales,arcu,finibus,non,maecenas,facilisis,felis,non,neque,posuere,in,varius,urna,dignissim,proin,dapibus,orci,ac,quam,congue,et,gravida,quam,egestas,etiam,a,mi,urna,cras,ipsum,neque,posuere,a,ligula,vitae,molestie,convallis,justo,maecenas,et,sagittis,lectus,fusce,justo,ipsum,consectetur,eget,diam,auctor,sodales,consequat,ante,aliquam,dignissim,mi,vitae,nunc,posuere,sed,blandit,urna,tempus,lorem,ipsum,dolor,sit,amet,consectetur,adipiscing,elit,quisque,dapibus,ligula,ut,convallis,congue,aenean,vitae,mauris,scelerisque,aliquet,lectus,in,blandit,sapien,proin,in,risus,eget,ligula,volutpat,ornare,nunc,aliquet,ligula,quam,donec,ac,ligula,mollis,venenatis,leo,vel,ornare,leo,donec,erat,dolor,ullamcorper,sed,felis,ac,semper,laoreet,velit,sed,vel,urna,fringilla,viverra,lectus,at,egestas,risus,nam,mattis,ligula,ligula,a,ultricies,nisl,egestas,vitae,vivamus,consectetur,elit,ut,condimentum,semper,proin,dapibus,justo,nec,arcu,viverra,eu,rutrum,est,tempus,nam,sit,amet,sapien,in,mauris,tincidunt,tincidunt,non,vel,purus,mauris,auctor,libero,diam,ac,gravida,velit,varius,sit,amet,pellentesque,quis,iaculis,ex,vestibulum,facilisis,elit,quis,ornare,hendrerit,nunc,tellus,magna,lacinia,a,dictum,in,egestas,quis,ex,duis,scelerisque,tempus,ex,pellentesque,quis,sodales,odio,praesent,id,bibendum,mauris,aliquam,ut,purus,interdum,molestie,mauris,non,molestie,tellus,sed,non,lacus,velit,donec,id,tincidunt,risus,eu,elementum,lectus,nunc,bibendum,metus,sagittis,vulputate,convallis,proin,quis,diam,vitae,leo,lacinia,ultricies,donec,ac,lorem,nec,risus,luctus,pellentesque,aliquam,sed,neque,pretium,tristique,est,ullamcorper,consequat,metus,sed,vel,enim,faucibus,hendrerit,mauris,ut,consequat,neque,suspendisse,non,orci,mi,cras,euismod,purus,quis,mollis,consequat,quisque,urna,sapien,cursus,at,semper,a,lacinia,ac,nibh,ut,elit,dui,lacinia,in,lectus,aliquam,rutrum,venenatis,erat,nulla,dui,augue,gravida,a,tristique,feugiat,dapibus,a,lacus,praesent,luctus,nunc,quis,maximus,porta,donec,lacinia,lorem,quis,vestibulum,malesuada,aenean,molestie,felis,ac,augue,fringilla,efficitur,sed,ultricies,suscipit,dolor,viverra,semper,ligula,semper,ac,donec,ultricies,interdum,aliquet,praesent,cursus,diam,non,nulla,commodo,sollicitudin,duis,sit,amet,laoreet,metus,donec,dolor,erat,sagittis,eget,tortor,a,venenatis,varius,diam,aliquam,rhoncus,orci,lectus,non,porta,erat,convallis,ut,nulla,condimentum,mi,sit,amet,posuere,tempus,suspendisse,quis,dolor,sed,urna,lacinia,imperdiet,vitae,vel,nulla,nulla,eu,urna,et,lectus,tincidunt,interdum,quis,sit,amet,risus,etiam,rhoncus,neque,a,arcu,lobortis,in,blandit,nunc,mollis,nunc,efficitur,mauris,et,feugiat,consectetur,risus,nisi,consectetur,nunc,vitae,euismod,eros,nulla,sed,ipsum,praesent,convallis,augue,sed,laoreet,feugiat,eros,purus,accumsan,neque,sed,tincidunt,neque,mauris,et,risus,aenean,bibendum,facilisis,dapibus,integer,velit,quam,tempus,in,metus,vel,pretium,faucibus,libero,ut,ultrices,efficitur,velit,quisque,tempus,a,justo,hendrerit,aliquam,proin,magna,orci,condimentum,at,metus,sed,sodales,porttitor,massa,cras,iaculis,ligula,non,iaculis,suscipit,proin,mollis,turpis,iaculis,aliquet,erat,sit,amet,aliquam,urna,proin,vitae,ultrices,est,nec,interdum,dolor,curabitur,urna,metus,convallis,at,ante,vitae,ultrices,scelerisque,mi,nam,id,ultricies,eros,etiam,vestibulum,risus,justo,sed,dignissim,lorem,posuere,nec,sed,id,massa,quis,augue,scelerisque,molestie,eu,ut,neque,duis,et,mollis,justo,a,pellentesque,lacus,pellentesque,id,libero,et,urna,pretium,pharetra,id,eget,nunc,duis,in,nunc,felis,nam,non,diam,a,augue,pulvinar,suscipit,sed,venenatis,lectus,ante,in,condimentum,purus,finibus,mattis,tristique,vestibulum,dapibus,nibh,in,urna,vestibulum,accumsan,aliquam,tincidunt,urna,nec,lacus,eleifend,imperdiet,suspendisse,dictum,erat,eu,purus,maximus,blandit,phasellus,ut,luctus,tortor,ac,consequat,massa,vestibulum,nibh,elit,tincidunt,eget,tempus,aliquet,volutpat,ut,nisi,interdum,et,malesuada,fames,ac,ante,ipsum,primis,in,faucibus,interdum,et,malesuada,fames,ac,ante,ipsum,primis,in,faucibus,phasellus,ipsum,ex,consequat,sit,amet,efficitur,rutrum,sodales,in,lorem,ut,id,leo,euismod,ex,auctor,luctus,non,nec,nibh,phasellus,ullamcorper,dolor,in,lacus,finibus,a,pretium,mi,consequat,nulla,quis,eros,rutrum,tortor,commodo,pellentesque,praesent,accumsan,mi,scelerisque,finibus,imperdiet,nulla,diam,scelerisque,nulla,eget,gravida,dolor,felis,vel,velit,class,aptent,taciti,sociosqu,ad,litora,torquent,per,conubia,nostra,per,inceptos,himenaeos,curabitur,venenatis,elit,ut,sem,faucibus,mattis,quis,eget,tortor,proin,et,neque,et,leo,mattis,faucibus,proin,sollicitudin,erat,a,neque,euismod,suscipit,aliquam,sed,malesuada,tellus,nec,feugiat,massa,nam,vitae,elementum,enim,quisque,nec,ultricies,lectus,cras,a,viverra,elit,cras,quis,arcu,urna,in,iaculis,nibh,a,tellus,congue,posuere,aliquam,non,dapibus,velit,suspendisse,a,semper,metus,pellentesque,ornare,tortor,nec,molestie,dignissim,magna,ipsum,consectetur,sapien,viverra,vehicula,urna,est,fermentum,diam,sed,cursus,risus,eget,laoreet,molestie,turpis,risus,dapibus,arcu,id,semper,nisi,eros,in,urna,proin,imperdiet,orci,pulvinar,dui,hendrerit,gravida,in,posuere,erat,sit,amet,tellus,aliquam,sagittis,mollis,justo,maximus'.split(','); //Stores considerably large dictionary of ipsum words.

      switch (type) {

        case 'word':
        case 'words':
          return this.loremWords(ipsumArray, count);

        case 'sentence':
        case 'sentences':
          return this.loremSentences(ipsumArray, count);

        case 'paragraph':
        case 'paragraphs':
          return this.loremParagraphs(ipsumArray, count);
        default:
          this.log('invalid \'type\' parameter supplied');

      }
    },
    loremWords: function loremWords(dict, number) {

      var ipsumString = this.capitalize(dict[Math.floor(Math.random() * dict.length)]) + ' ';

      for (var i = 0; i < number - 1; i++) {

        ipsumString = ipsumString + dict[Math.floor(Math.random() * dict.length)] + ' ';
      }

      return ipsumString;
    },
    loremSentences: function loremSentences(dict, number) {

      var ipsumString = '';

      for (var i = 0; i < number; i++) {

        var sentenceLength = Math.floor(Math.random() * 4 + 7);

        ipsumString += this.capitalize(this.loremWords(dict, 1)) + this.loremWords(dict, sentenceLength) + this.loremWords(dict, 1).trim() + '. ';
      }

      return ipsumString;
    },


    loremParagraphs: function loremParagraphs(dict, number) {

      var ipsumString = '';

      for (var i = 0; i < number; i++) {

        var paragraphLength = Math.floor(Math.random() * 4 + 7);

        ipsumString += this.loremSentences(dict, paragraphLength).trim() + '\r\n\r\n';
      }

      return ipsumString;
    },

    capitalize: function capitalize(str) {

      return str.charAt(0).toUpperCase() + str.substring(1, str.length);
    },

    init: function init() {
      var _this2 = this;

      window.onload = function () {

        _this2.resolveConfig();

        if (!isEnabled) {
          return;
        }

        _this2.indexElements();
        _this2.dummy();

        _root.dummy = _this2;
      };
    }

  };

  Dummy.init();
})(window || {});
//# sourceMappingURL=dummy.dev.js.map
