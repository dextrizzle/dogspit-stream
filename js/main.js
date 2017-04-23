$(document).ready(function(){
    if(!Cookies.get('name'))
    	Cookies.set('name','anonymous');
    if(!Cookies.get('color'))
	    Cookies.set('color','#eeeeee');

    let currentviewers = 0;
    firebase.database().ref('viewers').once('value').then(function(snapshot) {
      currentviewers = snapshot.val().viewers || 0;
      firebase.database().ref('viewers').set({viewers: currentviewers+1})
    })

    $('#usrname').val(Cookies.get('name'));
    $('#color').val(Cookies.get('color'));

    $('#send').on('click', function(event) {
        event.preventDefault();
        let test = firebase.database().ref().child('posts');
        test.push({
            name: Cookies.get('name'),
            color: Cookies.get('color'),
            message: $('#msg').val()
        }, function(error) {
            if (error) {
                console.log('error creating post');
            } else {
                $('#msg').val('');
            }
        });
    });
    $("#msg").keypress(function (e) {
        if(e.which == 13) {
            let test = firebase.database().ref().child('posts');
            test.push({
                name: Cookies.get('name'),
                color: Cookies.get('color'),
                message: $('#msg').val()
            }, function(error) {
                if (error) {
                    console.log('error creating post');
                } else {
                    $('#msg').val('');
                }
            });
            $(this).val("");
            e.preventDefault();
        }
    });
    firebase.database().ref('posts').on('value',
    function(data) {
        const posts = data.val();
        $('.message').empty();
        for (let key in posts) {
            let name = posts[key].name;
            let color = posts[key].color;
            let message = posts[key].message;

            $('.message').append(`
              <span style="color:${color};">${name}</span>: ${message}
              <br>
          `);
        }
        $('.message').scrollTop($('.message')[0].scrollHeight);
    });

    firebase.database().ref('viewers').on('value',
    function(data) {
        const views = data.val().viewers;
        $('#viewers').html(views+' <span class="glyphicon glyphicon-eye-open"></span>');
    });

    $('#settings').click(function(){
      $('.usersettings').slideDown();
    })
    $('#close').click(function(){
      $('.usersettings').slideUp();
    })
    $('#save').click(function(){
      $('.usersettings').slideUp();
      let name = $('#usrname').val();
      let color = $('#color').val();
      Cookies.remove('name');
      Cookies.set('name',name,{expires:365});
      Cookies.remove('color');
      Cookies.set('color',color,{expires:365});
    })
    $(window).on('beforeunload', function(){
      firebase.database().ref('viewers').set({viewers: currentviewers})
    })
});
