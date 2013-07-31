var text = '';
var correction = '';
var corrections = new Array();
var toCorrect = new Array();
var index = 0;
var replacer = '';

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

function handleSubmit() {
  var correction = document.getElementById('garea').value;
  if (correction != '') {
    /* replace original with corrected
    front += correction;
    correction = front + spanned;
    */
    err = (toCorrect.pop()).toString();
    console.log(err);
    myDataRef.push({correction: correction, err: err});
    // add hover through CSS fieldset
    highlight(err);
    //var highlite = '<span id="highlite" style="background: yellow">' + err + '</span>';
    //document.body.innerHTML = document.body.innerHTML.replace(err, highlite);

  }
}

myDataRef.limit(10).on('child_added', function(snapshot) {
  var message = snapshot.val();
  highlight(message.err);
});

function highlight (str) {
        var spanned = '<span id="highlite" style="background: yellow">' + str + '</span>';
        document.body.innerHTML = document.body.innerHTML.replace(str, spanned);
};

function onSubmit() {
  handleSubmit();
}

function trim1 (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

Grammer.Selector.mouseup = function(){
  var st = getSelectionText();
  if(st!=''){
    st = trim1(st);
    text = st;
    toCorrect.push(st);
    document.getElementById('grammerPolice').innerHTML = '<p>You have selected the following text: </p>';
    document.getElementById('grammerPolice').innerHTML += st;
    document.getElementById('grammerPolice').innerHTML += '<form method="post" id="gform" style="width:100%; height:100%"><fieldset>' + 
        '<label for="correction" style="float:left; display:block; padding-top:8px; width:6%">correction</label>' +
        '<textarea name="garea" id="garea" rows cols style="width: 88%; float: left; display:block;"></textarea>' +
        '<input type="button" id="gsub" onclick="onSubmit()"value="submit" style="float:right; padding-top:8px; width:6%;"></fieldset></form>';
  //document.write("You selected:\n"+st);
  //alert("You selected:\n"+st);
  }
}

$(document).ready(function(){
  $(document).bind("mouseup", Grammer.Selector.mouseup);
});