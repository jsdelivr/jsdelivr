YUI.add('gallery-console-test', function (Y, NAME) {

"use strict";

/**
 * @module gallery-console-test
 */

/**********************************************************************
 * <p>Adds a menu of registered unit test suites to the YUI 3 Console.</p>
 *
 * @main gallery-console-test
 * @class ConsoleTest
 * @namespace Plugin
 * @extends Plugin.Base
 */

function ConsoleTest(config)
{
	ConsoleTest.superclass.constructor.call(this, config);
}

ConsoleTest.NAME = "ConsoleTestPlugin";
ConsoleTest.NS   = "test";

function updateMenu(menu)
{
	var options    = Y.Node.getDOMNode(menu);
	options.length = 0;

	options[0] = new Option('All tests', -1);

	Y.Array.each(Y.Test.Runner.masterSuite.items, function(t, i)
	{
		options[i+1] = new Option(t.name, i);
	});
}

Y.extend(ConsoleTest, Y.Plugin.Base,
{
	initializer: function(config)
	{
		this.doAfter('renderUI', this.renderUI);

		if (this.get('host').get('rendered'))
		{
			this.renderUI();
		}
	},

	destructor: function()
	{
		this.container.remove(true);
	},

	renderUI: function()
	{
		var ft = this.get('host').get('contentBox').one('.'+Y.Console.CHROME_CLASSES.console_ft_class);
		if (ft)
		{
			this.container = Y.Node.create(
				Y.Lang.sub(
					'<div class="{c}">' +
						'<select class="menu"></select>' +
						'<button type="button" class="run">{b1}</button>' +
						'<button type="button" class="refresh">{b2}</button>' +
					'</div>',
				{
					c:  Y.ClassNameManager.getClassName('console', 'test', 'container'),
					b1: 'Run',
					b2: 'Refresh'
				}));

			var menu = this.container.one('select');
			updateMenu(menu);

			this.container.one('button.run').on('click', function()
			{
				var i = menu.get('value');
				if (i >= 0)
				{
					var tests = Y.Test.Runner.masterSuite.items;
					Y.Test.Runner.clear();
					Y.Test.Runner.add(tests[i]);

					var h = Y.Test.Runner.on('complete', function()
					{
						h.detach();
						Y.Test.Runner.clear();
						Y.Array.each(tests, function(t)
						{
							Y.Test.Runner.add(t);
						});
					});
				}

				Y.Test.Runner.run();
			});

			this.container.one('button.refresh').on('click', function()
			{
				updateMenu(menu);
			});

			var n1 = ft.one('.'+Y.Console.CHROME_CLASSES.console_controls_class);
			var n2 = n1.get('nextSibling');
			if (n2)
			{
				ft.insertBefore(this.container, n2);
			}
			else
			{
				ft.appendChild(this.container);
			}
		}
	}
});

Y.namespace("Plugin");
Y.Plugin.ConsoleTest = ConsoleTest;


}, 'gallery-2013.01.16-21-05', {"skinnable": "true", "requires": ["console", "plugin", "test"]});
