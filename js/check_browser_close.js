var validNavigation = false;

function updatePlays() {
  var delRef = new Firebase('https://nyn531.firebaseIO.com/del');
  delRef.set(window.my_id);

  /*
  var countRef = new Firebase('https://nyn531.firebaseIO.com/player_count');
  countRef.transaction(function(current_value) {
    return current_value - 1;
  });
  */
}

function wireUpEvents() {
  /**
   * For a list of events that triggers onbeforeunload on IE
   * check http://msdn.microsoft.com/en-us/library/ms536907(VS.85).aspx
   *
   * onbeforeunload for IE and chrome
   * check http://stackoverflow.com/questions/1802930/setting-onbeforeunload-on-body-element-in-chrome-and-ie-using-jquery
   */
  var dont_confirm_leave = 0; //set dont_confirm_leave to 1 when you want the user to be able to leave withou confirmation
  var leave_message = 'You sure you want to leave?'
  function goodbye(e) {
    if (!validNavigation) {
      if (dont_confirm_leave!==1) {
        if(!e) e = window.event;
        //e.cancelBubble is supported by IE - this will kill the bubbling process.
        e.cancelBubble = true;
        e.returnValue = leave_message;
        //e.stopPropagation works in Firefox.
        if (e.stopPropagation) {
          e.stopPropagation();
          e.preventDefault();
        }
        //return works for Chrome and Safari
        updatePlays();
        return leave_message;
      }
    }
  }
  window.onbeforeunload=goodbye;
 
  // Attach the event keypress to exclude the F5 refresh
  $(document).bind('keypress', function(e) {
    if (e.keyCode == 116){
      validNavigation = true;
    }
  });
 
  // Attach the event click for all links in the page
  $("a").bind("click", function() {
    validNavigation = true;
  });
 
  // Attach the event submit for all forms in the page
  $("form").bind("submit", function() {
    validNavigation = true;
  });
 
  // Attach the event click for all inputs in the page
  $("input[type=submit]").bind("click", function() {
    validNavigation = true;
  });
 
}
 
// Wire up the events as soon as the DOM tree is ready
$(document).ready(function() {
  if(navigator.userAgent.toLowerCase().indexOf('firefox') <= -1)
  {
    alert("wire up!");
    wireUpEvents();
  }
});