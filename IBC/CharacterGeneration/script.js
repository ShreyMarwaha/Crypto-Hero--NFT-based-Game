function ColorToHex(color) {
  var hexadecimal = color.toString(16);
  return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}

function colorit() {
  var cc1 = parseInt(document.getElementById("c1").value);
  var cc2 = parseInt(document.getElementById("c2").value);
  var cc3 = parseInt(document.getElementById("c3").value);
  var c = "#" + ColorToHex(cc1) + ColorToHex(cc2) + ColorToHex(cc3);
  document.getElementById("shape").style.backgroundColor = c;
}
