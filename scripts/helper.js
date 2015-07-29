var helper = (function () {
	function loadSuccess() {}

	function loadFail() {}

	return {
		loadContent: function getScript(url) {
			return $.ajax(url)
						.done(loadSuccess)
						.fail(loadFail);
		}
	};
}());