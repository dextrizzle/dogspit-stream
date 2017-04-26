$(document).ready(function(){
    if(!Cookies.get('name'))
    	Cookies.set('name','anonymous');
    if(!Cookies.get('color'))
	    Cookies.set('color','#eeeeee');

    let currentviewers = 0;
    let userlink = '';
    firebase.database().ref('viewers').once('value').then(function(snapshot) {
      currentviewers = snapshot.val().viewers || 0;
      // firebase.database().ref('viewers').set({viewers: currentviewers+1})
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
        if(views)
        firebase.database().ref('viewers').set({viewers: Object.keys(views).length})
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
    $('#theme').click(function(){
      if($('.chatmain').css('color')=="rgb(238, 238, 238)"){
        $('body').css('background-color','#ccc');
        $('.btn-inverse').css('background-color','#ccc');
        $('.btn-inverse').css('border-color','#bbb');
        $('.btn-inverse').css('color','#555');
        $('.chatmain').css('color','#111');
        $('.chatmain').css('text-shadow','2px 2px 3px #eee');
        $('.chatfooter').css('background-color','#eee');
        $('.chatfooter').css('border-color','#bbb');
        $('.form-control').css('background-color','#ccc');
        $('.form-control').css('border-color','#bbb');
        $('.form-control').css('color','#555')
        $('.glyphicon').css('color','#777');
        $('.navbar-inverse').css('background-color','#eee');
        $('.navbar-inverse').css('border-color','#bbb');
        $('.message').css('color','#555');
        $('.message').css('text-shadow','1px 1px 3px #eee');
        $('.userlist').css('background-color','#eee');
        $('.userlist').css('border-color','#aaa');
        $('#viewers').css('color','#777');
        $('.dropdown-menu').css('background-color','#eee');
        $('.dropdown-menu').css('border-color','#aaa');
        $('.dropdown-menu > div > a').css('color','#555');
      } else {
        $('body').css('background-color','#111');
        $('.btn-inverse').css('background-color','#555');
        $('.btn-inverse').css('border-color','#000');
        $('.btn-inverse').css('color','#eee');
        $('.chatmain').css('color','#eee');
        $('.chatmain').css('text-shadow','1px 1px 2px #000');
        $('.chatfooter').css('background-color','#222');
        $('.chatfooter').css('border-color','#000');
        $('.form-control').css('background-color','#111');
        $('.form-control').css('border-color','#000');
        $('.form-control').css('color','#bbb')
        $('.glyphicon').css('color','#999');
        $('.navbar-inverse').css('background-color','#222');
        $('.navbar-inverse').css('border-color','#111');
        $('.message').css('color','#eee');
        $('.message').css('text-shadow','1px 1px 2px #000');
        $('.userlist').css('background-color','#222');
        $('.userlist').css('border-color','#000');
        $('#viewers').css('color','#999');
        $('.dropdown-menu').css('background-color','#222');
        $('.dropdown-menu').css('border-color','#000');
        $('.dropdown-menu > div > a').css('color','#eee');
      }
    })


    $('#save').click(function(){
      $('.usersettings').slideUp();
      let name = $('#usrname').val();
      let color = $('#color').val();
      Cookies.remove('name');
      Cookies.set('name',name,{expires:365});
      Cookies.remove('color');
      Cookies.set('color',color,{expires:365});

      firebase.database().ref('users').once('value').then(function(snapshot){
        userlink.remove(function(error) {
          if(error)
            console.log("Uh oh!");
          else
            ;
            // console.log("success");
        })
        userlink = firebase.database().ref('users').push([`${Cookies.get('name')}`,`${Cookies.get('color')}`,currentviewers]);
      })
    });



    $(window).on('beforeunload', function(){

      firebase.database().ref('users').once('value').then(function(snapshot){
        userlink.remove(function(error) {
          if(error)
            console.log("Uh oh!");
          else
            ;
            // console.log("success");
        })
      })
      // firebase.database().ref('viewers').set({viewers: currentviewers})
    })
});
