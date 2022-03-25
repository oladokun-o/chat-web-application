
function fade_in(element) {
    var el = document.querySelector(element);
    if (el.classList.contains('d-none') || el.classList.contains('fade-out')) {
      el.classList.remove('d-none', 'fade-out');
    } else {
      if (el.classList.contains('error')) el.classList.add('fade-in', 'd-flex');
      el.classList.add('fade-in', 'd-block');
    }
  }
  
  function fade_out(element) {
    var el = document.querySelector(element);
    if (el.classList.contains('fade-in') || el.classList.contains('d-block')) {
      if (el.classList.contains('error')) el.classList.remove('fade-in', 'd-flex');
      el.classList.remove('d-block', 'fade-in');
    }
    el.classList.add('fade-out', 'd-none');
  }

jQuery(function() { 
  if (error) {
    $('.error').addClass('d-flex fade-in').removeClass('d-none fade-out');
    $('.error-msg').html(error)
    setTimeout(() => {
        $('.error').addClass('fade-out').removeClass('d-flex fade-in')
    }, 3000);
  }
  //get users
  if (app == 'entry') {
    $.ajax({
      method: "POST",
      url: "/users",
      data: {
          id: groupid,
          users: 'all'
      }
  }).done(function( response ) {
      let users = response.users;
      let userList = $.map(users, (li) => { let user = Object.assign({'name': li}); return user });
      getUserList(userList)
      let expHtml = $.map(response.users, function (value) {          
          return ('<li>' + value + '</li>');
      })
      let list = expHtml.join('');
      $('.user-list').append(list);
      getMessages();
  })
  }
  //notice group on new user 
  if (newuser) {
    pingNotice(newuser, groupid)
  }
})

//get messages
function getMessages() {
  $.ajax({
    method: "POST",
    url: "/getmsgs",
    data: {
        id: groupid
    }
    }).done(function( response ) {     
        var msgs = response[0].messages;
        msgs.forEach(addMessages)
    });
  }

function addMessages(message) {
  $(`
     <li class="clearfix">
      <div class="message-data text-left"> ${message.user}</div>
      <div class="message my-message">
        <span>${message.message}</span>
        <div class="span message-data-time">${message.time}</div>
      </div>
     </li>
    `).insertBefore($('#last-item'))
  $('.about .last-user-msg').html(`<span class="text-capitalize">${message.user}</span>: 
  ${message.message}`)
  $('.about .message-data-time').html(`${message.time}`);
  scrollDownChats();
}

function scrollDownChats() {
  document.querySelector('#last-item').scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
}
