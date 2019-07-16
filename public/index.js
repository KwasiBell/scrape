$('document').ready(function () {

  $('.save_article_btn').on("click", function (e) {
    e.preventDefault();
    var articleTitle = $(this).data("title");
    var articleId = $(this).data("id");
    // you can use jquery to target elements and do what ever you want in this function after the data comes back from the server
    // $.(`/articles/${articleId}`)

    $.ajax({
      type: 'PUT',
      url: `/articles/${articleId}`,
      contentType: 'application/json',
      data: JSON.stringify({"saved": true}), // access in body
    }).done(function (data) {
      console.log(`Load was performed. Article clicked: ${articleTitle}`);
      alert("Data Loaded: " + data);
    }).fail(function (msg) {
      console.log('FAIL');
    }).always(function (msg) {
      console.log('ALWAYS');
    });
    // $( ".result" ).html( data );
    //  $( "." ).html( data );
  })


  function savedArticleRoutine() {

  }



  function addNoteRoutine() {
    // add note to the article id
    // show modal
    const articleId = $(this).data("id");
    $('.saved-note-modal').show();
    $('.save-submit-btn').on("click", (e) => {
      e.preventDefault();
      const articleNote = $("#article-note").val();
      const noteTitle = $("#note-title").val();
      // note should be added to the Notes model
      $.post( `/articles/${articleId}`, {
        title: noteTitle,
        body: articleNote
      })
      .done(function( data ) {
        $("#article-note").empty();
        $("#note-title").empty();
        $('.saved-note-modal').hide();
        alert( "Data Loaded: " + data );
      });

    })

  }

  function viewNotes() {
    const articleId = $(this).data("id");
    $('.previous-notes-modal').show();
    $.get( `/articles/${articleId}`)
    .done(function(data) {
      // $('.previous-notes-modal').hide();
      console.log(data.note);
      let notesContent = $(`<h3>hello<h3>`);
      // notesContent.html(JSON.stringify(data.note));
      $('#previous-notes').append(notesContent);
    })
    .fail(function () {
      alert("could not retrieve data")
    })
  }

  function closeModal() {
    $('.saved-note-modal').hide();
  }

  $('.add-note, .saved-article').on("click", addNoteRoutine);
  $('.view-note').on("click", viewNotes);

  $('.modal-close').on("click", () => {
    $('.saved-note-modal').hide();
  });

  $('.previous-notes-close').on("click", () => {
    $('.previous-notes-modal').hide();
  });

})
