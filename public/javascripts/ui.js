//ripple effect
function createRipple(event) {
    const button = event.currentTarget;
  
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
  
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");
  
    const ripple = button.getElementsByClassName("ripple")[0];
  
    if (ripple) {
      ripple.remove();
    }
  
    button.appendChild(circle);
  }
  
  const buttons = document.getElementsByTagName("button");
  const lis = document.querySelectorAll(".chat-");
  for (const button of buttons) {
    //button.addEventListener("click", createRipple);
  }
  for (const li of lis) {
    //li.addEventListener("click", createRipple);
  }

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


//sign up UI
const join = () => {
  if ($('.join').hasClass('d-none')) {
    $('.join').addClass('fade-in').removeClass('fade-out, d-none');
  }
},
  create = () => {
    if ($('.create').hasClass('d-none')) {
      $('.create').addClass('fade-in').removeClass('fade-out, d-none');
    }
  };

function cancel(target) {  
  if (target == 'join') {
    $('.join').addClass('fade-out, d-none').removeClass('fade-in');
  } else {
    $('.create').addClass('fade-out, d-none').removeClass('fade-in');
  }
  $('.read').animate().addClass('d-none').find('input').val('');
  $('.write').find('input').val('');
  $('.write').fadeIn().removeClass('null').attr('disabled', false)                                            
  $('.submit-join').html('Join Group');                              
  $('.submit-create').html('Create Group Chat');   
}

function copyToClipboard(element) {
  console.log(element)
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).val()).select();
  document.execCommand("copy");
  $temp.remove();
  $('.clone').find('i').removeClass('fa-clone').addClass('success fa-check')
  setTimeout(() => {
    $('.clone').find('i').removeClass('fa-check success').addClass('fa-clone')
  }, 2500);
}

function copyCode(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(element.querySelector('span').innerHTML).select();
  document.execCommand("copy");
  $temp.remove();
}


$('.create-btn').on('click', function() {
  create()
})

$('.join-btn').on('click', function() {
  join()
})

//group chat ui
$('.chat-message').on('mouseenter', function (e) { 
  e.preventDefault();
  $('.text-btns, .content-area, .text-edit').removeClass('null');
});

$('.chat-message').on('mouseleave', function (e) { 
  e.preventDefault();
  if ($('.textarea').hasClass('act')) {
    $('.text-btns, .content-area, .text-edit').removeClass('null');
  } else {
    $('.text-btns, .content-area, .text-edit').addClass('null');
  }
});

$('.textarea').on('focus', function() {
  $('.textarea').addClass('act');
})


$('.textarea').on('keyup', function() {
  if ($(this).text().length > 0) {
    $('.submit').removeClass('null');    
  } else {
    $('.submit').addClass('null')
  }
})

$('.chap-options-btn').on('click', function(e) {
  e.preventDefault();
  fade_in('.chat-options')
})

$(".emoji").on('click', function(){
  if ($('#con').hasClass('d-none')) {
    fade_in('#con')
    $('.for-text').addClass('null')
    $(this).removeClass('null').addClass('active-tool')
  } else {
    fade_out('#con')
    $('.for-text').removeClass('null')
    $(this).removeClass('active-tool')
  }
});

var emojis = document.querySelectorAll('.emojiFrame');
emojis.forEach(element => {
    let emoji = element.querySelector('span').innerHTML;
    
    element.addEventListener('click', function() {
      $('.emoji').removeClass('active-tool');
      visuellView.append(emoji);
      visuellView.focus();
      //placeCaretAtEnd($('.visuell-view').get(0));
      if ($('.textarea').text().length < 0 || $('.submit').hasClass('null')) {
        $('.submit').removeClass('null');
      }
    })
});

function placeCaretAtEnd(el) {
  el.focus();
  if (typeof window.getSelection != "undefined"
          && typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
  } else if (typeof document.body.createTextRange != "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
  }
}

$('.at').on('click', function(e) {
  e.preventDefault();
  visuellView.append('@');
  visuellView.focus();
  $('.submit').removeClass('null')
})

function cursor_position() {
  var sel = document.getSelection();
  var pos = sel.anchorOffset;
  if(sel.anchorNode != undefined) sel.collapseToEnd();

  return pos;
}
function printCaretPosition(){
  this.setAttribute('length', cursor_position());
  placeCaretAtEnd($('.visuell-view').get(0));
}

function linkUp(link) { 
  if (link) {
    let url = link
  var linkTag = document.createElement('a');
  let span = document.createElement('span')
  let fileId = ID()
  linkTag.classList.add('text-truncate', 'link')
  var domain = urlify(url)
  linkTag.setAttribute('link', fileId)
  
  //get website details 
  $.ajax({
    url: "http://api.linkpreview.net",
    dataType: 'jsonp',
    data: {q: url, key: 'e8d061dfbb8575fd36728a1d22d14ab9'},
    success: function (data) {
      linkTag.setAttribute('href', data.url)
      let anchordiv = document.createElement('div')
      anchordiv.classList.add('upload-link')
      //anchordiv.innerHTML = domain;
      linkTag.append(anchordiv)
      span.setAttribute('id', fileId) 
      span.classList.add('link-span') 
      span.append(linkTag)
      fade_in('.uploads')
      uploadSection.append(span); 
      uploadSection.find('[link="'+fileId+'"]').prepend(`<div class="upload-img"><img src="${data.image}"></div>`);   
      uploadSection.find('.upload-link').html(`
        <h6 class="text-truncate d-inline-block">${data.title}</h6>
        <p class="text-truncate d-inline-block">${data.description}</p>
        <a class="text-truncate d-inline-block linked" href="${data.url}">${urlify(data.url)}</a>
      `)
    }
  });
  var button = $('<button class="" for='+ fileId +' onclick="cancelLink(this)">');
  button.append('<i class="bi bi-x">');
  uploadSection.find('[link="'+fileId+'"]').after(button)
  if ($('.submit').hasClass('null')) $('.submit').removeClass('null')
  }
}

function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex);
}

function cancelLink(elem) {
  $(`#${elem.getAttribute('for')}`).remove();
  if (!$('.submit').hasClass('null') && $('#text').text().length == 0) $('.submit').addClass('null')
}

$('.text-format').on('click', function() {
  if (!$(this).hasClass('active-tool')) {
    $('.text-btns').fadeOut()
    $(this).addClass('active-tool')
  } else {
    $('.text-btns').fadeIn().removeClass('d-none')
    $(this).removeClass('active-tool')
  }
})