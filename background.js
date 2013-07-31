var text = '';
var correction = '';
var corrections = new Array();
var toCorrect = new Array();
var websites = new Array();	
var index = 0;
var replacer = '';
var currentURL = '';
var mark = '#32f9d3as'

var myDataRef = new Firebase('https://cyamada.firebaseio.com/');

var grammerDiv = document.createElement('div');

if(!window.Grammer){
  Grammer = {};
}

Grammer.Selector = {};
function getSelectionText() {
	if (window.getSelection) {
	  text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != "Control") {
	  text = document.selection.createRange().text;
	}
	return text;
}

myDataRef.limit(10).on('child_added', function(snapshot) {
  var message = snapshot.val();
  var mesURL = (message.url).toString();
  currentURL = (document.URL).toString();
  if (currentURL == mesURL) {
  	highlight(message.err);
  }
});

function highlight (str) {
        var spanned = '<span id="highlite" style="background: yellow">' + str + '</span>';
        document.body.innerHTML = document.body.innerHTML.replace(str, spanned);
};

function trim1 (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

Grammer.Selector.mouseup = function(){
	getSelectionParentElement();
  var st = getSelectionText();
  getSelectedWordIndex();
  if(st!=''){
    st = trim1(st);
    text = st;
    toCorrect.push(st);
    document.getElementById('grammerPolice').innerHTML += '<p>You have selected the following text: </p>';
    document.getElementById('grammerPolice').innerHTML += st;
    document.getElementById('click-me').addEventListener('click', clickHandler);
    
  //document.write("You selected:\n"+st);
  //alert("You selected:\n"+st);
  }
}

function clicked() {
	var correction = document.getElementById('garea').value;
  if (correction != '') {
    /* replace original with corrected
    front += correction;
    correction = front + spanned;
    */
    err = (toCorrect.pop()).toString();
    currentURL = (document.URL).toString();
    myDataRef.push({url: currentURL, correction: correction, err: err});
    // add hover through CSS fieldset
    highlight(err);
    //var highlite = '<span id="highlite" style="background: yellow">' + err + '</span>';
    //document.body.innerHTML = document.body.innerHTML.replace(err, highlite);
  }
}

function getSelectedWordIndex(id) {
    if (window.getSelection) {
        var sel = window.getSelection();
        var div = document.getElementById(id);
    
        if (sel.rangeCount) {
            // Get the selected range
            var range = sel.getRangeAt(0);
    
            // Check that the selection is wholly contained within the div text
            if (range.commonAncestorContainer == div.firstChild) {
                var precedingRange = document.createRange();
                precedingRange.setStartBefore(div.firstChild);
                precedingRange.setEnd(range.startContainer, range.startOffset);
                var textPrecedingSelection = precedingRange.toString();
                var wordIndex = textPrecedingSelection.split(/\s+/).length;
                alert("Word index: " + wordIndex);
            }
        }
    }
}

function clickHandler(e) {
	console.log('click handler');
  clicked();
}

function inject() {
  grammerDiv.id = 'grammerPolice';
  grammerDiv.style.width = '100%';
  grammerDiv.style.height = 'relative';
  grammerDiv.style.position = 'fixed';
  grammerDiv.style.bottom = '0px';
  grammerDiv.style.color = '#000';
  grammerDiv.style.background = '#39f';
  document.body.appendChild(grammerDiv);
  document.getElementById('grammerPolice').innerHTML += '<form method="post" id="gform" style="width:100%; height:100%"><fieldset>' + 
        '<label for="correction" style="float:left; display:block; padding-top:8px; width:6%">correction</label>' +
        '<textarea name="garea" id="garea" rows cols style="width: 88%; float: left; display:block;"></textarea>' +
        '<button id="click-me">submit</button></fieldset></form>';
}

function idGenerator() {
	return (Math.floor(Math.random() * 1000000000));
}

function addID() {
	$('p, h1, h2, div').each(function() {
    $(this).attr('id-tag', idGenerator());
	});
}

function getSelectionParentElement() {
    var parentEl = null, sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }
    console.log(parentEl.attr());
    alert(parentEl.attr());
}

window.onload = function() {
	addID();
	inject();
  $(document).bind("mouseup", Grammer.Selector.mouseup);
};