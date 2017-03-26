$(document).ready(function() {
	var lastIndex = -1;
	var buttonIndex;
	var topics = ["dog", "cat", "lion", "rabbit"];

	// Display buttons
	function renderButtons() {
		$("#buttons-view").empty();
		for (var i = 0; i < topics.length; i++) {
			var a = $("<button>");
			a.addClass("btn btn-default animal");
			a.attr("type", "button");
			a.attr("data-name", topics[i]);
			a.attr("data-index", i);
			a.text(topics[i]);
			$("#buttons-view").append(a);
		}
	}

	// Add animal button
	$("#add-animal").on("click", function(event) {
		event.preventDefault();
		var animal = $("#animal-input").val().trim();

		if (topics.indexOf(animal) === -1 && animal !== "") {
			// Add animal to the array
			topics.push(animal);
			// Generate buttons
			renderButtons();
		}

		$("#animal-input").val("");
	});

	// Button is clicked
	$(document).on("click", ".animal", function() {
		// Switch on button selected
		$(this).blur();
		$(this).toggleClass("btn-primary");
		buttonIndex = $(this).attr("data-index");
		// Switch off last button selected
		if (lastIndex > -1) {
			$("[data-index=" + lastIndex + "]").toggleClass("btn-primary");
		}
		// Store last button selected
		setTimeout(function() {
			lastIndex = buttonIndex;
		}, 10);
		var animal = $(this).attr("data-name");
		var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + animal + "&api_key=dc6zaTOxFJmzC&limit=10";
		// var queryURL = "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" + animal;

		$.ajax({
			url: queryURL,
			method: "GET"
		}).done(function(response) {
			$(".animals-view").empty();
			var results = response.data;

			for (var i = 0; i < results.length; i++) {
				var gifDiv = $("<div class=\"item\">");

				var rating = results[i].rating;

				var p = $("<p>").text("Rating: " + rating.toUpperCase());

				var animalImage = $("<img>");
				animalImage.addClass("gif");
				animalImage.attr("src", results[i].images.fixed_height_still.url);
				animalImage.attr("data-still", results[i].images.fixed_height_still.url);
				animalImage.attr("data-animate", results[i].images.fixed_height.url);
				animalImage.attr("data-state", "still");

				gifDiv.prepend(p);
				gifDiv.prepend(animalImage);

				$(".animals-view").prepend(gifDiv);
			}
		});
	});

	// Gif is clicked
	$(document).on("click", ".gif", function() {
	  var state = $(this).attr("data-state");

	  if (state === "still") {
	  	$(this).attr("src", $(this).data("animate"));
	  	$(this).attr("data-state", "animate");
	  }
	  else {
	  	$(this).attr("src", $(this).data("still"));
	  	$(this).attr("data-state", "still");
	  }
	});

	// Clear gifs
	$("#empty-animals").on("click", function(event) {
		event.preventDefault();
		$(".animals-view").empty();
	});

	// Calling the renderButtons function to display the intial buttons
	renderButtons();
});