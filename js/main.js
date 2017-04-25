$(document).ready(function(){
    if(!Cookies.get('name'))
    	Cookies.set('name','anonymous');
    if(!Cookies.get('color'))
	    Cookies.set('color','#eeeeee');

    let currentviewers = 0;
    let userlink = '';
    firebase.database().ref('viewers').once('value').then(function(snapshot) {
      currentviewers = snapshot.val().viewers || 0;
      firebase.database().ref('viewers').set({viewers: currentviewers+1})
      userlink = firebase.database().ref('users').push([`${Cookies.get('name')}`,`${Cookies.get('color')}`,currentviewers+1]);

      // firebase.database().ref('users').push([`${'name'}`,`${'color'}`]);
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

    firebase.database().ref('users').on('value',
    function(data) {
        const views = data.val();
        $('.userlist').html('');
        for (let key in views){
          let name = views[key][0];
          let color = views[key][1];
          let id = views[key][2];

          $('.userlist').append(`<font color="${color}">${name}`+' <br>');
        }
    });

    $('#settings').click(function(){
      $('.usersettings').slideDown();
    })
    $('#close').click(function(){
      $('.usersettings').slideUp();
    })
    $('#viewers').click(function(){
      $('.userlist').slideToggle();
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

      firebase.database().ref('users').once('value').then(function(snapshot){
        currentusers = snapshot.val();
        Object.values(currentusers).forEach(function(e){
          if(e[2] == currentviewers+1){
              userlink.remove(function(error) {
                if(error)
                  console.log("Uh oh!");
                else
                  console.log("success");
              });
          }
          else
            console.log('false');
          })
      });
      firebase.database().ref('viewers').set({viewers: currentviewers})
    })
});
