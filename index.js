let shared;
let colorPicker;
let slider;
let span3;
let drawStrokeWidthPanel = false;

function preload() {
  // connect & init
  partyConnect("wss://deepstream-server-1.herokuapp.com", "kl_game_a", "main");
  shared = partyLoadShared("shared");
}

function createDock() {
  // create div
  let div = createDiv();
  // style it
  div.style("width", "80px");
  div.style("height", "400px");
  div.style("background-color", "#FFFFFF");
  div.style("border-radius", "0 8px 8px 0");
  div.style(
    "box-shadow",
    "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)"
  );
  // set its position
  div.position(0, 0);

  // create slider to pick stroke width
  slider = createSlider(0.5, 100, 5, 0.1);
  // set its position
  slider.position(-82, 136);
  // style it
  slider.style("width", "240px");
  // -- rotate it to vertical
  slider.style("transform", "rotate(-90deg)");
  // -- change cursor to pointer
  slider.style("cursor", "pointer");
  // add as child to div
  div.child(slider);

  // create color picker
  colorPicker = createColorPicker("#FF00EA");
  // set its position
  colorPicker.position(16, 300);
  // style it
  // -- remove browser style
  colorPicker.style("-webkit-appearance", "none");
  colorPicker.style("-moz-appearance", "none");
  colorPicker.style("appearance", "none");
  // -- remove default background color & border
  colorPicker.style("background-color", "transparent");
  colorPicker.style("border", "none");
  // -- dynamically update width & height
  colorPicker.style("width", `${slider.value() * 10}px`);
  colorPicker.style("height", `${slider.value() * 10}px`);
  // -- change cursor to pointer
  colorPicker.style("cursor", "pointer");
  // -- use css to give the color content a circle look
  colorPicker.id("color-picker");
  // add as child to div
  div.child(colorPicker);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // clear shared object on first user entry
  if (partyIsHost()) {
    partySetShared(shared, { drawData: [] });
  }
  // create brushes & settings dock
  createDock();
}

function draw() {
  background(220);

  if (mouseIsPressed) {
    if (mouseX > 82 || mouseY > 402) {
      // hide the stroke width indicator
      drawStrokeWidthPanel = false;
      // add draw data to shared obj
      shared.drawData.push({
        mouseX,
        mouseY,
        pmouseX,
        pmouseY,
        r: colorPicker.color().levels[0],
        g: colorPicker.color().levels[1],
        b: colorPicker.color().levels[2],
        strokeWidth: slider.value(),
      });
    } else if (
      mouseX > 20 &&
      mouseX < 56 &&
      mouseY > 120 - 103 &&
      mouseY < 376 - 103
    ) {
      // mouse click on the slider
      drawStrokeWidthPanel = true;
    }
  }

  // use shared data to draw on canvas
  shared.drawData.forEach((l) => {
    push();
    strokeWeight(l.strokeWidth);
    stroke(color(l.r, l.g, l.b));
    line(l.mouseX, l.mouseY, l.pmouseX, l.pmouseY);
    pop();
  });

  if (drawStrokeWidthPanel) {
    // draw the stroke width indicator on the canvas
    push();
    circle(144, 80, 116);
    noStroke();
    fill(colorPicker.color());
    circle(144, 80, slider.value() + 2);
    pop();
  }
}
