var Attacklab = Attacklab || {};

Attacklab.wmd_env = {};
Attacklab.account_options = {};
Attacklab.wmd_defaults = {version:1, output:"HTML", lineLength:40, delayLoad:false};

if(!Attacklab.wmd)
{
	Attacklab.wmd = function()
	{
		Attacklab.loadEnv = function()
		{
			var mergeEnv = function(env)
			{
				if(!env)
				{
					return;
				}
			
				for(var key in env)
				{
					Attacklab.wmd_env[key] = env[key];
				}
			};
			
			mergeEnv(Attacklab.wmd_defaults);
			mergeEnv(Attacklab.account_options);
			mergeEnv(top["wmd_options"]);
			Attacklab.full = true;
			
			var defaultButtons = "bold italic | link blockquote code image | ol ul heading hr";
			Attacklab.wmd_env.buttons = Attacklab.wmd_env.buttons || defaultButtons;
		};
		Attacklab.loadEnv();
		
		var codeFiles = ["showdown.js", "wmd-base.js", "wmd-plus.js"];
		
		// This is a roundabout way of making sure the editor isn't
		// invoked until all the code files have been read in.  Each
		// file calls this function which increments a count variable
		// which is attached to the function.  Clever but weird.
		Attacklab.fileLoaded = function(name)
		{
			arguments.callee.count = arguments.callee.count || 0;
			if(++arguments.callee.count == codeFiles.length)
			{
				var go = function()
				{
					Attacklab.wmdBase();
					Attacklab.Util.startEditor();
				};
				
				if(Attacklab.wmd_env.delayLoad)
				{
					// This is bs since the delay is 0.
					window.setTimeout(go, 0);
				}
				else
				{
					go();
				}
			}
		};
		
		Attacklab.editorInit = function()
		{
			Attacklab.wmdPlus();
		};
		
		// Adds the wmd script tags to the <head> of the page.
		var addScript = function(name, noCache)
		{
			var url = Attacklab.basePath + name;
			if(noCache)
			{
				url += "?nocache=" + (new Date()).getTime();
			}
			var elem = document.createElement("script");
			elem.src = url;
			top.document.documentElement.firstChild.appendChild(elem);
		};
		
		var getPrefix = function(name)
		{
			var re = RegExp("(.*)" + name + "(\\?(.+))?$", "g");
			var elements = document.getElementsByTagName("script");
			
			for(var i = 0; i < elements.length; i++)
			{
				if(re.test(elements[i].src))
				{
					return RegExp.$1;
				}
			}
		};
		
		Attacklab.basePath = getPrefix("wmd.js");
		
		for(var file, i = 0; file = codeFiles[i]; i++)
		{
			addScript(file, false);
		}
	};
	
	Attacklab.wmd();
}

