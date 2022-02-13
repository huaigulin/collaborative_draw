let shared;
let thisPlayerId = makeid(7);
let colorPicker;
let slider;
let span3;

function preload() {
  // connect & init
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "kl_game_sketch_2",
    "main"
  );
  shared = partyLoadShared("shared");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
  // clear shared object on first user entry
  if (partyIsHost()) {
    partySetShared(shared, {});
  }
  // init the player data
  shared[thisPlayerId] = [];
  // create div
  let div = createDiv();
  div.style("width", "300px");
  div.style("height", "100px");
  div.style("background-color", "#FFFFFF");
  div.position(0, 0);
  // create color picker
  let span1 = createSpan("Stroke color: ");
  span1.position(20, 10);
  div.child(span1);
  colorPicker = createColorPicker("#000000");
  colorPicker.position(120, 4);
  div.child(colorPicker);
  // create slider to pick stroke width
  let span2 = createSpan("Stroke width: ");
  span2.position(20, 40);
  div.child(span2);
  slider = createSlider(0.1, 10, 1, 0.1);
  slider.position(120, 40);
  div.child(slider);
  span3 = createSpan(slider.value());
  span3.position(256, 40);
  div.child(span3);
}

function draw() {
  // update stroke width text
  span3.html(slider.value());
  if (mouseIsPressed) {
    shared[thisPlayerId] = [
      ...shared[thisPlayerId],
      {
        mouseX,
        mouseY,
        pmouseX,
        pmouseY,
        r: colorPicker.color().levels[0],
        g: colorPicker.color().levels[1],
        b: colorPicker.color().levels[2],
        strokeWidth: slider.value(),
      },
    ];
  }
  for (const p in shared) {
    shared[p].forEach((l) => {
      strokeWeight(l.strokeWidth);
      stroke(color(l.r, l.g, l.b));
      line(l.mouseX, l.mouseY, l.pmouseX, l.pmouseY);
    });
  }
}

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
