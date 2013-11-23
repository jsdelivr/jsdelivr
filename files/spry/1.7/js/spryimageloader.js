// SpryImageLoader.js - version 0.2 - Spry Pre-Release 1.6.1
//
// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var Spry; if (!Spry) Spry = {}; if (!Spry.Utils) Spry.Utils = {};

Spry.Utils.ImageLoader = function()
{
	this.queue = [];
	this.timerID = 0;
	this.currentEntry = null;
};

Spry.Utils.ImageLoader.prototype.start = function()
{
	if (!this.timerID)
	{
		var self = this;
		this.timerID = setTimeout(function()
		{
			self.timerID = 0;
			self.processQueue();
		}, 0);
	}
};

Spry.Utils.ImageLoader.prototype.stop = function()
{
	if (this.currentEntry)
	{
		var entry = this.currentEntry;
		entry.loader.onload = null;
		entry.loader.src = "";
		entry.loader = null;
		this.currentEntry = null;
		this.queue.unshift(entry);
	}

	if (this.timerID)
		clearTimeout(this.timerID);

	this.timerID = 0;
};

Spry.Utils.ImageLoader.prototype.clearQueue = function()
{
	this.stop();
	this.queue.length = 0;
};

Spry.Utils.ImageLoader.prototype.load = function(url, callback, priority)
{
	if (url)
	{
		if (typeof priority == "undefined")
			priority = 0;
		this.queue.push({ url: url, callback: callback, priority: priority });

		// Entries in the queue are sorted by priority. Those entries
		// with a higher priority are at the start of the queue, while
		// those with lower priority are pushed towards the end. If an
		// entry has the same priority as something already in the queue,
		// it gets processed in the order they were received.

		this.queue.sort(function(a,b){ return (a.priority > b.priority) ? -1 : ((a.priority < b.priority) ? 1 : 0); });
		this.start();
	}
};

Spry.Utils.ImageLoader.prototype.processQueue = function()
{
	if (this.queue.length < 1)
		return;

	var entry = this.currentEntry = this.queue.shift();
	var loader = entry.loader = new Image;
	var self = this;

	loader.onload = function()
	{
		self.currentEntry = null;
		if (entry.callback)
			entry.callback(entry.url, entry.loader);
		if (self.queue.length > 0)
			self.start();
	};

	loader.onerror = function()
	{
		// If a load fails, keep the queue going!
		self.currentEntry = null;
		if (self.queue.length > 0)
			self.start();
	};

	this.currentLoader = loader;
	loader.src = entry.url;
};