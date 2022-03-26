// define vars
const editor = document.getElementsByClassName('text-editor')[0];
const toolbar = editor.getElementsByClassName('toolbar')[0];
const toolbarbtns = toolbar.querySelectorAll('.edit-btn:not(.has-submenu)');
const contentArea = editor.getElementsByClassName('content-area')[0];
const visuellView = contentArea.getElementsByClassName('visuell-view')[0];
const htmlView = contentArea.getElementsByClassName('html-view')[0];
const modal = document.getElementById('hyperlinkModal');
const forText = document.querySelectorAll('.for-text');

// add active tag event
document.addEventListener('selectionchange', selectionChange);

// add paste event
visuellView.addEventListener('paste', pasteEvent);

// add paragraph tag on new line
contentArea.addEventListener('keypress', addParagraphTag);

// add toolbar button actions
for(let i = 0; i < toolbarbtns.length; i++) {
  let button = toolbarbtns[i];
  
  button.addEventListener('click', function(e) {
    let action = this.dataset.action;
    switch(action) {
      case 'code-block':
        execCodeAction(this, editor);
        break;
      case 'code-snippet':
        execCodeSnippetAction(this, editor);
        break;
      case 'createLink':
        execLinkAction();
        break;
      default:
        execDefaultAction(action);
    }
    
  });
}

var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

/** 
 * This function toggles between visual and html view
 */
function execCodeAction(button, editor) {
  let codeBlock = document.getElementById('editing'),
    pre = document.getElementById('highlighting'), code = document.getElementById('highlighting-content');
  
  if (document.querySelector('.html').classList.contains('d-none')) {
    for(let i = 0; i < forText.length; i++) {
      let btn = forText[i];
      btn.classList.add('null')
    }
    code.innerHTML = visuellView.innerHTML;
    codeBlock.value = visuellView.innerHTML;
    fade_out('.visuell-view');
    fade_in('.html');
    codeBlock.focus();
  } else {
    for(let i = 0; i < forText.length; i++) {
      let btn = forText[i];
      btn.classList.remove('null')
    }
    fade_in('.visuell-view');
    fade_out('.html')
    visuellView.innerHTML = code.innerHTML;
    visuellView.innerHTML = codeBlock.value;
    visuellView.focus();
  }
}

function update(text) {
  let result_element = document.querySelector("#highlighting-content");
  // Handle final newlines (see article)
  if(text[text.length-1] == "\n") {
    text += " ";
  }
  // Update code
  result_element.innerHTML = text.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;"); /* Global RegExp */
}

function sync_scroll(element) {
  /* Scroll result to scroll coords of event - sync with textarea */
  let result_element = document.querySelector("#highlighting");
  // Get and set x and y
  result_element.scrollTop = element.scrollTop;
  result_element.scrollLeft = element.scrollLeft;
}

function check_tab(element, event) {
  let code = element.value;
  if(event.key == "Tab") {
    /* Tab key pressed */
    event.preventDefault(); // stop normal
    let before_tab = code.slice(0, element.selectionStart); // text before tab
    let after_tab = code.slice(element.selectionEnd, element.value.length); // text after tab
    let cursor_pos = element.selectionEnd + 1; // where cursor moves after tab - moving forward by 1 char to after tab
    element.value = before_tab + "\t" + after_tab; // add tab char
    // move cursor
    element.selectionStart = cursor_pos;
    element.selectionEnd = cursor_pos;
    update(element.value); // Update text to include indent
  }
}

function execCodeSnippetAction() {
  document.execCommand('backColor', false, '#d95444')
}

/**
 * This function adds a link to the current selection
 */
function execLinkAction() {  
  fade_in('#hyperlinkModal')
  let selection = saveSelection();

  let submit = modal.querySelectorAll('.done')[0];
  let close = modal.querySelectorAll('.close-link');
  
  close.forEach(element => {
        element.addEventListener('click', closeH)
  });

  // done button active => add link
  submit.addEventListener('click', function(e) {
    e.preventDefault();
    let linkInput = modal.querySelectorAll('#linkValue')[0];
    if (linkInput.value == '') {
      $('.error-msg').html('Enter link!')
      fade_in('.error');
      setTimeout(() => {
        fade_out('.error')
      }, 1000);
    } else {
      linkUp(linkInput.value)
      restoreSelection(selection);
      
      if(window.getSelection().toString()) {
          let a = document.createElement('a');
          a.href = linkInput.value;
          window.getSelection().getRangeAt(0).surroundContents(a);
      }

      fade_out('#hyperlinkModal')
      linkInput.value = '';
      
      // deregister modal events
      submit.removeEventListener('click', arguments.callee);
      close.forEach(element => {
        element.removeEventListener('click', arguments.callee);
      });
    }
  });  
  
  // close modal on X click
  function closeH(e) {
    e.preventDefault();
    let linkInput = modal.querySelectorAll('#linkValue')[0];
    
    fade_out('#hyperlinkModal')
    linkInput.value = '';
    
    // deregister modal events
    submit.removeEventListener('click', arguments.callee);
    close.forEach(element => {
      element.removeEventListener('click', arguments.callee);
    });
  };
}

/**
 * This function executes all 'normal' actions
 */
function execDefaultAction(action) {
  document.execCommand(action, false);
}

/**
 * Saves the current selection
 */
function saveSelection() {
    if(window.getSelection) {
        sel = window.getSelection();
        if(sel.getRangeAt && sel.rangeCount) {
            let ranges = [];
            for(var i = 0, len = sel.rangeCount; i < len; ++i) {
                ranges.push(sel.getRangeAt(i));
            }
            return ranges;
        }
    } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
    }
    return null;
}

/**
 *  Loads a saved selection
 */
function restoreSelection(savedSel) {
    if(savedSel) {
        if(window.getSelection) {
            sel = window.getSelection();
            sel.removeAllRanges();
            for(var i = 0, len = savedSel.length; i < len; ++i) {
                sel.addRange(savedSel[i]);
            }
        } else if(document.selection && savedSel.select) {
            savedSel.select();
        }
    }
}

/**
 * Sets the current selected format toolbarbtns active/inactive
 */ 
function selectionChange(e) {
  
  for(let i = 0; i < toolbarbtns.length; i++) {
    let button = toolbarbtns[i];
    
    // don't remove active class on code toggle button
    if(button.dataset.action === 'toggle-view') continue;
    
    button.classList.remove('active-tool');
  }
  
  if(!childOf(window.getSelection().anchorNode.parentNode, editor)) return false;
  
  parentTagActive(window.getSelection().anchorNode.parentNode);
}

/**
 * Checks if the passed child has the passed parent
 */
function childOf(child, parent) {
  return parent.contains(child);
}

/**
 * Sets the tag active that is responsible for the current element
 */
function parentTagActive(elem) {
  if(!elem ||!elem.classList || elem.classList.contains('visuell-view')) return false;
  
  let toolbarButton;
  
  // active by tag names
  let tagName = elem.tagName.toLowerCase();
  toolbarButton = document.querySelectorAll(`.toolbar .edit-btn[data-tag-name="${tagName}"]`)[0];
  if(toolbarButton) {
    toolbarButton.classList.add('active-tool');
  }
  
  // active by text-align
  let textAlign = elem.style.textAlign;
  toolbarButton = document.querySelectorAll(`.toolbar .edit-btn[data-style="textAlign:${textAlign}"]`)[0];
  if(toolbarButton) {
    toolbarButton.classList.add('active-tool');
  }
  
  return parentTagActive(elem.parentNode);
}

/**
 * Handles the paste event and removes all HTML tags
 */
function pasteEvent(e) {
  e.preventDefault();
  
  let text = (e.originalEvent || e).clipboardData.getData('text/plain');
  document.execCommand('insertHTML', false, text);
}

/**
 * This functions adds a paragraph tag when the enter key is pressed
 */
function addParagraphTag(evt) {
  if (evt.keyCode == '13') {
    
    // don't add a p tag on list item
    if(window.getSelection().anchorNode.parentNode.tagName === 'LI') return;
    document.execCommand('formatBlock', false, 'p');
  }
}

var uploadSection = $('.toolbar .uploads-box');
$('.upload').on('click', function() {
  $('#fileUpload').trigger('click');
})

function cancelFile(elem) {
  $(`#${elem.getAttribute('for')}`).remove();
  if (!$('.submit').hasClass('null') && $('#text').text().length == 0) $('.submit').addClass('null')
}

$('input[type="file"]').on('change', function(e) {
  let file = e.target.files[0].name,fil = document.createElement('span'),cancelFile = document.createElement('button');
  //file = file.split('.').slice(0, -1).join('.');
  cancelFile.innerHTML = '<i class="bi bi-x"></i>';
  let fileId = ID()
  cancelFile.setAttribute('for', fileId);
  fil.classList.add('text-truncate', 'd-inline-block', 'file')
  cancelFile.setAttribute('onclick', 'cancelFile(this)');
  fil.setAttribute('id', fileId)
  fil.append(file);
  fil.append(cancelFile);  
  fade_in('.uploads')

  if (uploadSection.find('span.file').length >= 3) {
    $('.error-msg').html('Max file upload reached!')
    fade_in('.error');
    setTimeout(() => {
      fade_out('.error')
    }, 1000);
  } else {
    uploadSection.append(fil)
    if ($('.submit').hasClass('null')) $('.submit').removeClass('null')
  }
});

//text editor
var toolBar = document.querySelector('.toolbar'),
btns = toolBar.querySelectorAll('button');

for(let i = 0; i < btns.length; i++) {
  let button = btns[i];
  
  button.addEventListener('click', function(e) {
    $('.textarea').focus();
    if (this.classList.contains('active-tool')) {
      this.classList.remove('active-tool');
      //document.execCommand(action, false, '')
    } else {
      this.classList.add('active-tool');              
    }   
  });
}

//mention someone
function getUserList(users) {
  mentionPerson(users)
}

function mentionPerson(users) {
  new Mention({
  input: document.querySelector('#text'),
  options: users,
  update: function() {
    //fade_in('#data')
    //document.querySelector('#data').innerHTML = JSON.stringify(this.findMatches(), null, '\t')
  },
  match: function(word, option) {
    return option.name.startsWith(word)
        || option.description.toLowerCase().indexOf(word.toLowerCase()) >= 0
  },
  template: function(option) {
    return '@' + option.name+' '// + ' [' + option.description + ']'
  }
})
}

$('body').on('click', function(e) {
  //e.preventDefault();
  if (e.target.id == 'chat_message' || e.target.id == 'chat_options_btn' || e.target.id == 'con')
    return;
  if($(e.target).closest('#chat_message').length || $(e.target).closest('#chat_options_btn').length)
    return;
  $('.textarea').removeClass('act');
  $('.text-btns, .content-area, .text-edit').addClass('null');
  fade_out('.chat-options');
  fade_out('#con');$('.emoji').removeClass('active-tool')
})