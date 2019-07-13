$('document').ready(function() {

  $('.save_article_btn').on("click", function(e) {
    e.preventDefault();
    var articleTitle = $(this).data("title");
    var articleId = $(this).data("id");
    console.log("article clicked");
    console.log(articleId);

    // the parameter e is the event location on the DOM

      // you can use jquery to target elements and do what ever you want in this function after the data comes back from the server
      $.post( `/articles/${articleId}`)
       .done(function( data ) {
        console.log(`Load was performed. Article clicked: ${articleTitle}`);
        alert( "Data Loaded: " + data );
      });
      // $( ".result" ).html( data );
      //  $( "." ).html( data );




  })





})
