// Copyright (c) 2015 Jordan Naumann. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

	var client_id = '9b0aa5cb5d65843',
	client_secret = '97851ab8356b4994619acc566d854529b0ca640f';

function uploadImage(image) {
	var authorization = 'Client-id ' + client_id;

	makeUpload(image, authorization, function (response) {
		if (response.success == true) {
			toClipboard(response.data);
		} else {
			notify("That didn't work. You might want to try again.");
		}
	});
}

function makeUpload(image, auth, callback) {
	var xhr = new XMLHttpRequest();
	
	xhr.open('POST', 'https://api.imgur.com/3/image', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
	xhr.setRequestHeader('Authorization', auth);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.responseText && xhr.responseText.length !== "") {
				var response = JSON.parse(xhr.responseText);
				callback(response);
			}	
		}
	};

	data = 'image=' + image;
	xhr.send(data);
}

function toClipboard(data) {
	var ta = document.createElement('textarea');
	
	document.body.appendChild(ta);
	ta.value = data.link;
	ta.select();
	document.execCommand('copy', false, null);
	document.body.removeChild(ta);
}

/**
 * Returns a handler which will open a new window when activated.
 */
function getClickHandler() {
  return function(info, tab) {
	uploadImage(encodeURIComponent(info.srcUrl));
  };
};

/**
 * Create a context menu which will only show up for images.
 */
chrome.contextMenus.create({
  "title" : "Upload to Imgur",
  "type" : "normal",
  "contexts" : ["image"],
  "onclick" : getClickHandler()
});
