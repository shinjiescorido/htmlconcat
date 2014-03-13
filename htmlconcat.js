/**************************************************************
 *
 * HtmlConcat 1.0
 *
 **************************************************************/

(function($) {
		var Htmlconcat = function(element, options) {

				var addTags = function(text, startTag, closeTag) {
						var result = "";
						result = startTag.concat(text);
						result = result.concat(closeTag);
						return result
				}


				var setElementValue = function(value) {
						$(element).html(value);
				}

				var isClosingTag = function(htmltag) {
						var regCheck = /<\/[^>]+>/;
						var match = regCheck.exec(htmltag);

						if (match !== null) {
								return true;
						} else {
								return false;
						}
				}

				var getHtmlTags = function(htmltext) {

						var arrayTags = [];
						var myRegexp = /<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/ig;
						var match;

						while ((match = myRegexp.exec(htmltext)) !== null) {
								var tag = {
										'tagName': match[0],
										'length': match[0].length,
										'lastIndex': myRegexp.lastIndex,
										'startIndex': myRegexp.lastIndex - match[0].length
								};
								arrayTags.push(tag);
								//console.log(tag);
						}
						return arrayTags;

				}

				var settings = $.extend({}, $.fn.htmlconcat.defaults, options);

				var content = '';
				content = $(element).text();


				var myString = $(element).html();
				var arrayTags = getHtmlTags(myString);
				//if tag exist
				if (settings.length < content.length && arrayTags.length > 0) {
						var strfinal = "";
						var lencon = 0; //len of text(w/tags) with in the 2 arraytags.

						for (var i = 0; i < arrayTags.length && lencon <= settings.length; i++) {
								var currentTag = arrayTags[i];
								var nextTag = arrayTags[i + 1];

								if (i + 1 != arrayTags.length) {
										var res = nextTag.startIndex - currentTag.lastIndex;
										lencon = lencon + res; //total len for  plaintext
										//check if lencon > limit
										var minicontent = "";
										var actualstr = "";
										if (lencon > settings.length) {
												//get number of characters to substring [i+1]
												var extra = lencon - settings.length;
												minicontent = myString.substring(currentTag.lastIndex, nextTag.startIndex - extra);
												if (!(i % 2)) {
														actualstr = currentTag.tagName + "" + minicontent;
												} else {
														actualstr = minicontent;
												}

												if (isClosingTag(nextTag.tagName) && lencon < content.length) {
														actualstr = actualstr.concat(nextTag.tagName);

												}

										} else {
												minicontent = myString.substring(currentTag.lastIndex, nextTag.startIndex);
												actualstr = addTags(minicontent, currentTag.tagName, nextTag.tagName);
										}
										strfinal = strfinal + "" + actualstr;
								} else {
										if (i + 1 == arrayTags.length && lencon < content.length) {
												var lastfewchars = settings.length - lencon;
												var lastStr = myString.substring(currentTag.lastIndex, currentTag.lastIndex + lastfewchars);
												strfinal = strfinal + "" + lastStr;

										}
								}

						}

						setElementValue(strfinal.concat(settings.stringAppend));
				} else {
						setElementValue(content.substring(0, settings.length)+settings.stringAppend);
					//	console.dir(content);
				}




		}



		$.fn.htmlconcat = function(options) {
				return this.each(function(key, value) {
						var element = $(this);
						if (element.data('htmlconcat')) {
								return element.data('htmlconcat');
						}
						var htmlconcat = new Htmlconcat(this, options);
						element.data('htmlconcat', htmlconcat);
				});
		};

		$.fn.htmlconcat.defaults = {
				length: 10,
				stringAppend: "..."
		};

})(jQuery);


/*$('.except').htmlconcat({
	length: 42,
	stringAppend: '...'
});*/