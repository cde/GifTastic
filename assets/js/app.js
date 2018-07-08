class Topic {
    constructor(topics) {
        this.names = topics;
    }
    contains(topics) {
        return topics.every((topic) => this.names.indexOf(topic) !== -1);
    }
    add(topic) {
        if(!this.contains([topic])){
            this.names.push(topic)        
        }
    }
}
var topics = new Topic(['soccer', 'tennis', 'rugby', 'baskeball', 'football', 'cycling', 'golf', 'gymnastics', 'fishing', 'hunting']);

var giphy = {
    apiKey: 'fGkQ1WcO0HJOJ3nyp6c2GiLqx6c1yGPt',
    urlSearch: 'http://api.giphy.com/v1/gifs/search?',
    limit: '10',
    search: function(query){
        
        var rating = $(".rating").val();
        if(rating === "Choose rating..."){
            rating = "G"
        }
        var queryURL = this.urlSearch + "q=" + query + "&api_key=" + this.apiKey + "&limit=10&rating=" + rating;
        var xhr = $.get(queryURL);
        xhr.done(function(response) { 
            parseResponse(response)
        });
    },
}

class Card {
    constructor(gif) {
        this.images = gif.images
        this.title = gif.title
        this.rating = gif.rating.toUpperCase()
    }
    createDiv(){
        var  $card = $("<div>").addClass('card mb-4 box-shadow');
        var img = $("<img>", {
            class: "card-img-top image",
            src: this.images.fixed_height_small_still.url,
            "data-still": this.images.fixed_height_small_still.url,
            "data-animate": this.images.fixed_height_small.url,
            "data-state": "still"
        })
        var carBody = $("<div>").addClass("card-body")
        var title = $("<h3>").text(this.title)
        var rating = $("<p>", {
            class: "card-text text-secondary",
            text: "Rating: " + this.rating
        })
        carBody.append(title)
        carBody.append(rating)
        $card.append(img)
        $card.append(carBody)
        return $card
    }

}

function parseResponse(response){
    var results = response.data;
    var $giphysView = $('.giphys');
    $giphysView.empty(); // erasing anything in this div id so that it doesnt keep any from the previous click

    if (results == ""){
      $giphysView.append("<p class='text-danger'>There are not gifs for this selected button</>");
    }
    for (var i = 0; i < results.length; i++) {
        var $col = $('<div class="col-md-4">');
        var cardObj = new Card(results[i]);
        $col.append(cardObj.createDiv());
        $giphysView.prepend($col)
    }
}
    
function buildButtons (){
    var $topicsDiv = $('.topics')
    $topicsDiv.empty();

    topics.names.forEach(function(topic){
        var $button = $('<button type="button" class="btn btn-success mr-2 mb-1 topic">')
        $button.attr('data-topic', topic);
        $button.text(topic);
        $topicsDiv.append($button);
    });
}
function animateGif(img){
    var $img = $(img);
    var state = $img.attr('data-state');
    if ( state == 'still'){
        $img.attr('src', $img.data('animate'));
        $img.attr('data-state', 'animate');
    }else{
        $img.attr('src', $img.data('still'));
        $img.attr('data-state', 'still');
    }
}

$(document).ready(function() {
    buildButtons(); // build default topics 
    giphy.search(topics[0]);

    $(document).on("click", "button.topic", function(){
        giphy.search($(this).data('topic'));
    })

    $(document).on("click", ".image", function(){
        animateGif($(this));
    });

    $("#add-search").on("click", function(e) {
        e.preventDefault();

        var topic = $('input').val().trim()
        if(topic == "") {
            return false;
        }
        topics.add(topic);
        buildButtons();
        giphy.search(topic);

        $('input').val("")
        return false;
    })
  });