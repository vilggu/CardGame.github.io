
$(document).ready( function() {
  //Important game variables
  var firstCardColor="";
  var secondCardColor="";
  var points = 0;
  var round = 1;
  var numberOfCards = 4;
  var numberOfcolours = 2;
  var maxNumberOfColours = 9;
  var maxNumberOfCards = 81;
  var colours = ["red","blue","green","orange","LightBlue","YellowGreen","Lime","Purple","Brown"]

  //Function that will generate card table and get random color
  function prepare(){
    $("#choices tr").remove();
    firstCardColor="";
    secondCardColor="";
    var i = 0;
    var j = 0;
    var numberOfrows = Math.floor(Math.sqrt(numberOfCards));
    var numberOfcols = Math.floor((numberOfCards-numberOfrows*numberOfrows)/numberOfrows)+numberOfrows;
    while (i<numberOfrows) {
      j=0;
      var row = document.getElementById("choices").insertRow(i);
      while (j<numberOfcols){
        var randomColorNumber = Math.floor(Math.random()*numberOfcolours);
        row.insertCell(j).innerHTML = colours[randomColorNumber];
        j=j+1;
      }
      i=i+1;
    }
    setTimeout(
      function(){
        $("#commandText").text("Choose two cards:");
      },1000);

  }
  prepare();

  //Game over function which will send scores after game is over
  function gameOver(){
    round = 1;
    numberOfCards = 4;
    numberOfcolours = 2;
    $("#commandText").text("Game Over!");
    var msg = {
      "messageType": "SCORE",
      "score": parseFloat($("#points").text())
    };
    points = 0;
    window.parent.postMessage(msg, "*");
  }

  //Save method when save button is pressed
  $("#save").click(function(){
    var msg = {
      "messageType": "SAVE",
      "score": parseFloat($("#points").text())
    };
    window.parent.postMessage(msg, "*");
  });

  //Load method when load button is pressed
  $("#load").click(function(){
    var msg = {
      "messageType": "LOAD_REQUEST",
    };
    window.parent.postMessage(msg, "*");
  });

  //Newgame method when New Game button is pressed
  $("#newgame").click(function(){
    readyToChoose = true;
    points = 0;
    round = 1;
    numberOfCards = 4;
    numberOfcolours = 2;
    prepare();
    $("#points").text(points);
  });

  $("#choices").on("click", "td",function(){
      if(firstCardColor===""){
        firstCardColor = $(this).text();
        $(this).css("border", "4px solid yellow");
        $(this).css("background-color",firstCardColor)
      }
      else{
        if(secondCardColor===""){
          secondCardColor = $(this).text();
          $(this).css("border", "4px solid yellow");
          $(this).css("background-color",secondCardColor)
          if(secondCardColor===firstCardColor){
              points = points + 1;
              round = round + 1;

              //Adding cards when round is not odd
              if(numberOfCards<=maxNumberOfCards && round%2===0){
                numberOfCards = numberOfCards + 2;
              }
              else{

                //If round is odd then one new color is added
                if(numberOfcolours<=maxNumberOfColours){
                  numberOfcolours = numberOfcolours + 1;
                }
              }
              $("#commandText").text("You won!");
              $("#points").text(points);
              setTimeout(function(){prepare()},1000);
          }
          else{
            $("#commandText").text("You lost!");
            gameOver();
          }
        }
      }
  });
});
