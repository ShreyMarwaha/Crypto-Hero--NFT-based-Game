function compute() {
  var dam1 = parseInt(document.getElementById("dam1").value);
  var def1 = parseInt(document.getElementById("def1").value);
  var h1   = parseInt(document.getElementById("h1").value);
  var dam2 = parseInt(document.getElementById("dam2").value);
  var def2 = parseInt(document.getElementById("def2").value);
  var h2   = parseInt(document.getElementById("h2").value);
  var p1 = 0;
  var s1 = def1+h1-dam2;
  var s2 = def2+h2-dam1;
  if (s1===s2) {
      if(dam1===dam2){
        if (def1===def2) {
          p1 = ((h1 > h2) ? 1 : 0);
        }
        else{
          p1 = ((def1 > def2) ? 1 : 0);
        }
      }
      else{
        p1 = ((dam1 > dam2) ? 1 : 0);
      }
  }
  else{
    p1 = ((s1 > s2) ? 1 : 0);
  }

  if (p1===1) {
    alert("PLAYER 1 WINS!");
  }
  else{
    alert("PLAYER 2 WINS!");
  }
}
