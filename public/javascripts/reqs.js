//create
$('.create form').on('submit',  function(e) {
    e.preventDefault();
    $('.submit-create').addClass('null').html('<i class="fa fa-spinner fa-spin"></i>')
    $('.write').addClass('null').attr('disabled', true)
    setTimeout(() => {
        $.ajax({
            type: "POST",
            url: "/create-group",
            data: {
                group_name: $('#group_name').val(),
                chatInitiator: $('#username2').val().toLowerCase(),
                username: $('#username2').val().toLowerCase(),
                users: $('#username2').val().toLowerCase(),
            },
            success: function (response) {
                $('#groupCode').val(response.id)
                $('.create').find('button').attr('for', response.id)
                console.log(response.user)
                $('.create').find('button').attr('newuser', response.user)
                fade_in('.error');$('.error-msg').addClass('error-success').html(response.msg)
                setTimeout(() => {
                    fade_out('.error');$('.error-msg').removeClass('error-success')
                }, 2500);
                $('.submit-create').html('<i class="fa fa-check sent"></i>');
                setTimeout(() => {                    
                    $('.write').fadeOut('fast');
                    $('.read').animate().removeClass('d-none');
                }, 800);                
            },
            error: function(response) {
                fade_in('.error');$('.error-msg').html(response.responseText)
                setTimeout(() => {
                    $('.write').removeClass('null').attr('disabled', false)                                       
                    $('.submit-create').html('Create Group Chat'); 
                }, 1000);
                setTimeout(() => {
                    fade_out('.error')
                    $('.submit-create').removeClass('null'); 
                }, 2500);
            }
        });
    }, 1500);
})

//join
$('.join form').on('submit',  function(e) {
    e.preventDefault();
    $('.join .cancel, .submit-join').addClass('null');
    $('.submit-join').html('<i class="fa fa-spinner fa-spin"></i>')
    $('.write').addClass('null').attr('disabled', true)
    setTimeout(() => {
        $.ajax({
            type: "POST",
            url: "/join-group",
            data: {
                group_id: $('#group_id').val(),
                username: $('#username1').val(),
            },
            success: function (response) {
                $('.submit-join').html('<i class="fa fa-check sent"></i>');
                $('.error').addClass('d-flex fade-in').removeClass('d-none fade-out');$('.error-msg').addClass('error-success').html(response.msg)
                if (!response.exist) $('.join').find('button').attr('newuser', response.username);
                setTimeout(() => {
                    $('.write').fadeOut('fast');
                    $('.read').find('#groupName').val(response.group_name);
                    $('.read').find('#group_no').html(response.group_no);
                    $('.read').find('button span').html('Enter Group as '+response.username)
                    $('.join').find('button').attr('for', response.groupId);
                    $('.join').find('button').attr('user', response.username);                    
                    $('.read').animate().removeClass('d-none');
                }, 800);             
                setTimeout(() => {
                    $('.error').addClass('fade-out').removeClass('d-flex fade-in')
                    $('.error-msg').removeClass('error-success')
                }, 2500);   
            },
            error: function(response) {
                if (response.responseJSON) {
                    $('.error').addClass('d-flex fade-in').removeClass('d-none fade-out');$('.error-msg').html(response.responseJSON.errMsg)
                setTimeout(() => {
                    $('.write').fadeOut('fast');
                    $('.read').find('#groupName').val(response.responseJSON.group_name);
                    $('.read').find('#group_no').html(response.responseJSON.group_no);
                    $('.read').find('button span').html('Enter Group as '+response.responseJSON.username)
                    $('.join').find('button').attr('for', response.responseJSON.groupId);
                    $('.join').find('button').attr('user', response.responseJSON.username);
                    $('.join').find('button').attr('newuser', response.responseJSON.username);
                    $('.cancel').removeClass('null');
                    $('.read').animate().removeClass('d-none'); 
                }, 1000);
                setTimeout(() => {
                    $('.error').addClass('fade-out').removeClass('d-flex fade-in')
                    $('.submit-join').removeClass('null'); 
                }, 2500);
                } else {
                    $('.error').addClass('d-flex fade-in').removeClass('d-none fade-out');$('.error-msg').html(response.responseText)
                    setTimeout(() => {
                        $('.write').removeClass('null').attr('disabled', false)                                       
                        $('.submit-join').html('Join Group'); 
                    }, 1000);
                    setTimeout(() => {
                        $('.error').addClass('fade-out').removeClass('d-flex fade-in')
                        $('.submit-join').removeClass('null'); 
                    }, 2500);
                }
            }
        });
    }, 1500);
})

//enter group
function enterGroup(target) {
    $('.enter-btn').html('<i class="fa fa-spinner fa-spin"></i>')
    if (target.hasAttribute('newuser')) {
        window.location = `/group/${target.getAttribute('for')}/${target.getAttribute('newuser')}/${target.getAttribute('newuser')}`;
    } else {
        window.location = `/group/${target.getAttribute('for')}/${target.getAttribute('user')}`;
    }
}

var socket = io();

//send message
$('.submit').on('click', function() {
    //uploads
    if (!$('#con').hasClass('d-none')) fade_out('#con');$('.for-text').removeClass('null')
    let uploads = $('.uploads');
    if (uploads.find('span').length > 0) {
        uploads.find('button').remove();uploads.find('span').removeAttr('id');
        var loads = uploads.html()//.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;");
        $('.visuell-view').append(loads);
    }

    var d = new Date();
    var currentTime = d.toLocaleTimeString();
    var msg = $('.visuell-view').html() 

    var message = {
        user: $('.user-name').val(),
        message: msg,
        time: currentTime,
        group: groupid
    }
    
    $.ajax({
        type: "POST",
        url: "/message",
        data: message,
        success: function (response) {                    
            $('.uploads span').remove();
            $('.visuell-view').html('');            
        },
        error: function(response) {
            $('.error').addClass('d-flex fade-in').removeClass('d-none fade-out');$('.error-msg').html(response)
            setTimeout(() => {
                $('.write').removeClass('null').attr('disabled', false)                                       
                $('.submit-join').html('Join Group'); 
            }, 1000);
            setTimeout(() => {
                $('.error').addClass('fade-out').removeClass('d-flex fade-in')
                $('.submit-join').removeClass('null'); 
            }, 2500);
        }
    });
})

function newMessage(e) {
    if (groupid == e.group) {
        $(`
       <li class="clearfix">
        <div class="message-data text-left"> ${e.msg.user}</div>
        <div class="message my-message">
          <span>${e.msg.message}</span>
          <div class="span message-data-time">${e.msg.time}</div>
        </div>
       </li>
      `).insertBefore($('#last-item'));
    $('.about .last-user-msg').html(`<span class="text-capitalize">${e.msg.user} </span>:  ${e.msg.message}`)
    $('.about .message-data-time').html(`${e.msg.time}`);
    $('.last-user-msg').find('.uploads-box').html('🔗')
    scrollDownChats();
    }
}
socket.on('message', newMessage);

function newUserJoin(e) {
    if (groupid == e.group) {
        $(".chat-history .chats").append(`
       <li class="notice">
            <span>
                <span class="text-capitalize">${e.user}</span>joined the group chat
            </span>
       </li>
      `)
      scrollDownChats()
    }
}
//socket.on('join', newUserJoin);

function pingNotice(user, id) {
    $.ajax({
        type: "POST",
        url: "/ping",
        data: {
            user: user,
            group: id
        }
    });
}