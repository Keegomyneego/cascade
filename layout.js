(function () {
	"use strict";

	var viewModel = {
		content: ko.observable()
	};

	$.ajax("views/cascadeView.html")
	 .done(function (data, textStatus) {
		viewModel.content("haha");
	});

	$("body").load("views/cascadeView.html");

	$(document).ready(function () {
		ko.applyBindings(viewModel);
	});
}());