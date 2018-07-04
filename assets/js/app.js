function parseResponse(response){
    var results = response.data;
    console.log(results);
    var $giphysView = $('.giphys');
    $giphysView.empty(); // erasing anything in this div id so that it doesnt keep any from the previous click

    if (results == ""){
      $giphysView.append("<p>There isn't a gif for this selected button</>");
    }
    for (var i = 0; i < results.length; i++) {
        var col = $('<div class="col-md-4">')
        var card = $('<div class="card mb-4 box-shadow">');
        var gifImage = $("<img>");
        gifImage.addClass('card-img-top image')
        gifImage.attr("src", results[i].images.fixed_height_small_still.url); // still image stored into src of image
        gifImage.attr("data-still",results[i].images.fixed_height_small_still.url); // still image
        gifImage.attr("data-animate",results[i].images.fixed_height_small.url); // animated image
        gifImage.attr("data-state", "still"); // set the image state
        gifImage.addClass("image");
        card.append(gifImage);
        var carBody = $('<div class="card-body">')
        carBody.append('<p class="card-text">' + results[i].title + '</p>')
        carBody.append('<p><strong>Rating: </strong>' + results[i].rating + '</p>')
        card.append(carBody);   
        col.append(card);
        $giphysView.prepend(col)
    }
}
    
function buildButtons (){
    var $topicsDiv = $('.topics')
    $topicsDiv.empty(); // erasing anything in this div id so that it doesnt duplicate the results

    topics.forEach(function(topic){
        var $button = $('<button type="button" class="btn btn-info mr-4 mb-1 topic">')
        $button.attr('data-topic', topic);
        $button.text(topic);
        $topicsDiv.append($button);
    });
}

var topics = ['soccer', 'tennis', 'rugby', 'baskeball', 'football', 'cycling', 'golf', 'gymnastics', 'fishing', 'hunting']
var giphy = {
    apiKey: 'fGkQ1WcO0HJOJ3nyp6c2GiLqx6c1yGPt',
    urlSearch: 'http://api.giphy.com/v1/gifs/search?',
    search: function(query){
        var queryURL = this.urlSearch + "q=" + query + "&api_key=" + this.apiKey + "&limit=10";
        var xhr = $.get(queryURL);
        xhr.done(function(response) { 
            parseResponse(response)
        });
    },
}

$(document).ready(function() {
    buildButtons(); // build default topics 
    giphy.search(topics[0]);

    $(document).on("click", "button.topic", function(){
        giphy.search($(this).data('topic'));
    })

    $(document).on("click", ".image", function(){
        var state = $(this).attr('data-state');
        if ( state == 'still'){
            $(this).attr('src', $(this).data('animate'));
            $(this).attr('data-state', 'animate');
        }else{
            $(this).attr('src', $(this).data('still'));
            $(this).attr('data-state', 'still');
        }
    });

    $("#add-search").on("click", function(e) {
        e.preventDefault();
        var topic = $('input').val().trim()
        if(topic == "") {
            return false;
        }
        topics.push(topic);
        buildButtons();
        giphy.search(topic);
        $('input').val("")
        return false;
    })

  });