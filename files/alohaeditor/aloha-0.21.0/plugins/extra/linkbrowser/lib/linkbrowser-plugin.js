define([
	'aloha',
	'jquery',
	'aloha/plugin',
	'aloha/pluginmanager',
	'ui/ui',
	'ui/button',
	'link/link-plugin',
	'RepositoryBrowser',
	'i18n!linkbrowser/nls/i18n',
	'i18n!aloha/nls/i18n'
], function(
	Aloha,
	jQuery,
	Plugin,
	PluginManager,
	Ui,
	Button,
	Links,
	RepositoryBrowser,
	i18n,
	i18nCore
) {
	

	var LinkBrowser = RepositoryBrowser.extend({

		init: function (config) {
			this._super(config);

			var that = this;

			this._linkBrowserButton = Ui.adopt('linkBrowser', Button, {
				tooltip: i18n.t('button.addlink.tooltip'),
				icon: 'aloha-icon-tree',
				scope: 'Aloha.continuoustext',
				click: function () {
					that.open();
				}
			});

			this._linkBrowserButton.hide();

			this.url = Aloha.getAlohaUrl() + '/../plugins/extra/linkbrowser/';

			Aloha.bind('aloha-link-selected', function (event, rangeObject) {
				that._linkBrowserButton.show();
			});

			Aloha.bind('aloha-link-unselected', function (event, rangeObject) {
				that._linkBrowserButton.hide();
			});
		},

		onSelect: function (item) {
			Links.hrefField.setItem(item)

			// Now create a selection within the editable since the user should
			// be able to type once the link has been created.

			// 1. We need to save the current cursor position since the a
			//    activate editable event will be fired and this will set the
			//    cursor in the upper left cornor of the editable.
			var range = Aloha.Selection.getRangeObject();
			var currentStartContainer = range.startContainer = range.endContainer;
			var currentStartOffset = range.startOffset = range.endOffset;

			// 2. Do the first select - this will invoke the activate editable
			//    event.
			range.select();

			// 3. Restore the range.
			range.startContainer = range.endContainer = currentStartContainer;
			range.startOffset = range.endOffset = currentStartOffset;

			// 4. Invoke the final selection.
			range.select();

			Aloha.trigger('aloha-link-selected-in-linkbrowser', item);

			// Close the browser lightbox.
			this.close();
		},

		renderRowCols: function (item) {
			var row = {},
			    pluginUrl = this.url,
			    icon = '__page__',
			    idMatch = item.id.match(/(\d+)\./);

			jQuery.each(this.columns, function (colName, v) {
				switch (colName) {
				case 'icon':
					row.icon = '<div class="aloha-browser-icon\
						aloha-browser-icon-' + icon + '"></div>';
					break;
				case 'translations':
					if (!item.renditions) {
						break;
					}

					var rends = item.renditions,
					    i = rends.length,
					    strBldr = [],
					    r;

					for (; i > 0; --i) {
						r = rends[i];
						if (r.kind == 'translation') {
							strBldr.push(
								//'<a href="' + repo_host + r.url + '">' +
								'<img src="'   + pluginUrl  + 'img/flags/' + r.language + '.png"\
									  alt="'   + r.language + '"\
									  title="' + r.filename + '" />'
								//'</a>'
							);
						}
					}

					row.translations = strBldr.join('');
					break;
				case 'language':
					row.language = item.language;
					break;
				default:
					row[colName] = item[colName] || '--';
				}
			});

			return row;
		}

	});

	var LinkBrowserPlugin = Plugin.create('linkbrowser', {
		dependencies: ['link'],

		browser: null,

		init: function () {
			var config = {
				repositoryManager : Aloha.RepositoryManager,
				repositoryFilter  : [],
				objectTypeFilter  : ['website', 'file', 'image', 'language' /*, '*' */],
				renditionFilter	  : ['*'],
				filter			  : ['language'],
				columns : {
					icon         : {title: '',     width: 30,  sortable: false, resizable: false},
					name         : {title: 'Name', width: 320, sorttype: 'text'},
					language     : {title: '',     width: 30,  sorttype: 'text'},
					translations : {title: '',     width: 350, sorttype: 'text'}
				},
				rootPath : Aloha.settings.baseUrl + '/vendor/repository-browser/'
			};

			this.browser = new LinkBrowser(config);
		}
	});

	return LinkBrowserPlugin;
});
