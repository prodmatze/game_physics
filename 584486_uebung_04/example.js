/* template GTAT2 Game Technology & Interactive Systems */
/* Autor: Mathieu Wassmuth  */
/* Übung Nr.3 */
/* Datum: 27.10.2024 */

/* declarations */
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

//all metric dimensions are in centimeters
const padding = 100;

//game meta variables
let score = 0;
let remaining_attempts = 5;
let status_text = `Score: ${score} - Remaining attempts: ${remaining_attempts}`;

let min_radius = 30;
let max_radius = 100;

let dragging = false;




/* prepare program */
function setup() {
  createCanvas(canvasWidth, canvasHeight);

  //create and style buttons 
  reset_button = createButton('RESET');
  new_button = createButton('NEW');

  reset_button.style('background-color', 'red');
  reset_button.style('color', 'white');
  reset_button.style('font-size', '20px');
  reset_button.style('padding', '15px 30px');
  reset_button.style('border-radius', '10px');

  new_button.style('background-color', 'green');
  new_button.style('color', 'white');
  new_button.style('font-size', '20px');
  new_button.style('padding', '15px 30px');
  new_button.style('border-radius', '10px');

  //button interactions
  reset_button.mousePressed(reset_game);
  new_button.mousePressed(new_attempt);
}


const playground = {
  height: 700,  //in cm
  width: 1000,  //in cm 
};

var M = (canvasWidth - 2 * padding) / (playground.width);
var x0 = playground.width + padding;
var y0 = padding + playground.height;

var metric = {
  height: playground.height * 0.1,

  //important that right rectangle, left rectange, and hole add up to 100% of playground width to make playground symetric and centered
  right_rect_width: playground.width * 0.62,
  left_rect_width: playground.width * 0.35,

  hole_width: playground.width * 0.03,
  hole_height: (playground.height * 0.1) / 2,

  schornstein_height: playground.height * 0.5,
  schornstein_width: 20,

  triangle_height: 70,
  triangle_width: 150,

  red_rec_height: 50,
  red_rec_width: 15,

  flagpole_height: 150,


  flag_height: 40,
  flag_width: 65,

  ball_diameter: 15,

  slingshot_pos_x: 100,
  slingshot_height: 50,
  slingshot_width: 15,
}


var triangle_coords = {
  x1: -metric.right_rect_width - metric.left_rect_width - metric.hole_width,
  y1: metric.height + metric.triangle_height,
  x2: -metric.right_rect_width - metric.left_rect_width - metric.hole_width,
  y2: metric.height,
  x3: -metric.right_rect_width - metric.left_rect_width - metric.hole_width + metric.triangle_width,
  y3: metric.height,
}

var flag_pole_coords = {
  x1: - metric.right_rect_width - metric.hole_width - 30,
  y1: metric.height,
}

var flag_coords = {
  x1: flag_pole_coords.x1,
  y1: flag_pole_coords.y1 + metric.flagpole_height,
  x2: flag_pole_coords.x1,
  y2: flag_pole_coords.y1 + metric.flagpole_height - metric.flag_height,
  x3: flag_pole_coords.x1 - metric.flag_width,
  y3: flag_pole_coords.y1 + metric.flagpole_height - metric.flag_height / 2,
}

var slingshot = {
  x1: -metric.slingshot_pos_x,
  y1: metric.height,
  x2: -metric.slingshot_pos_x - metric.slingshot_width,
  y2: metric.height,
  x3: -metric.slingshot_pos_x - metric.slingshot_width / 2,
  y3: metric.height + metric.slingshot_height,
}

var ball = {
  d: 15,
  x: slingshot.x1 - metric.slingshot_width / 2,
  y: metric.height + metric.slingshot_height + 15 / 2,
}

let ball_x = slingshot.x1 - metric.slingshot_width / 2;
let ball_y = metric.height + metric.slingshot_height;
let ball_d = 15;

var slingshot_center = {
  x: slingshot.x1 - metric.slingshot_width / 2,
  y: metric.height + metric.slingshot_height,
}

let mx;
let my;

/* run program */
function draw() {
  background(255);


  /* administration */
  fill(0);

  //position buttons
  position_buttons();

  //status text
  if (remaining_attempts > 0) {
    status_text = `⛳ Score: ${score} - Remaining attempts: ${remaining_attempts} 🏌️`;
  } else {
    status_text = `No remaining attempts! 😔`
  }

  textAlign(CENTER, TOP);
  textSize(32);
  text(status_text, canvasWidth / 2, padding * 2);


  /* calculation */
  mx = mouseX_to_internal(mouseX);
  my = mouseY_to_internal(mouseY);

  /* display */
  push();


  translate(canvasWidth - padding, canvasHeight - padding);

  //scale entire coordinate system so i dont have to calculate M into every object
  scale(M, -M);

  //right rect
  drawRectangle(-metric.right_rect_width, 0, metric.right_rect_width, metric.height, '#0000ff');

  //left rect
  drawRectangle(-metric.right_rect_width - metric.left_rect_width - metric.hole_width, 0, metric.left_rect_width, metric.height, '#0000ff');

  //hole rec
  drawRectangle(-metric.right_rect_width - metric.hole_width, 0, metric.hole_width, metric.hole_height, "#0000ff");

  //schortstein
  drawRectangle(-metric.right_rect_width - metric.left_rect_width - metric.hole_width, 0, metric.schornstein_width, metric.schornstein_height, "#0000ff");

  //red rectangle
  drawRectangle(- metric.right_rect_width / 2, metric.height, metric.red_rec_width, metric.red_rec_height, "#ff0000");

  //blue triangle
  drawTriangle(triangle_coords.x1, triangle_coords.y1, triangle_coords.x2, triangle_coords.y2, triangle_coords.x3, triangle_coords.y3, "#0000ff");

  //flagpole
  drawRectangle(flag_pole_coords.x1, flag_pole_coords.y1, 5, metric.flagpole_height, "#000000");

  drawFlag(flag_coords.x1, flag_coords.y1, flag_coords.x2, flag_coords.y2, flag_coords.x3, flag_coords.y3, ("#ffff00"), 1);

  if (dragging) {
    noFill();
    stroke(0, 0, 255);
    strokeWeight(1 / M);

    //min radius circle 
    ellipse(slingshot_center.x, slingshot_center.y, min_radius * 2, min_radius * 2);

    //max radius circle
    ellipse(slingshot_center.x, slingshot_center.y, max_radius * 2, max_radius * 2);

    //draw sling
    fill(0, 0, 0, 200);
    noStroke();

    beginShape();
    vertex(slingshot.x3, slingshot.y3);
    vertex(ball_x, ball_y + ball_d / 2);
    vertex(ball_x, ball_y - ball_d / 2);

    endShape(CLOSE);
  }

  //red ball
  draw_circle(-playground.width / 2, metric.height + metric.ball_diameter / 2, metric.ball_diameter, "#ff0000");


  //playball
  draw_circle(ball_x, ball_y, ball_d, "#0000ff");

  //slingshot
  drawTriangle(slingshot.x1, slingshot.y1, slingshot.x2, slingshot.y2, slingshot.x3, slingshot.y3, "#00ff00");
  pop();

  draw_scene();

}

function new_attempt() {
  console.log("New attempt button was pressed!")
  if (remaining_attempts > 0) {
    remaining_attempts -= 1;
  }
}

function reset_game() {
  console.log("Reset game button was pressed!")
  score = 0;
  remaining_attempts = 5;
}

function position_buttons() {
  reset_button.position(padding + 10, canvasHeight - padding * 0.8);
  new_button.position(canvasWidth - padding - 120, canvasHeight - padding * 0.8);
}

function mouseX_to_internal(mouse_x) {
  let mx = (mouse_x - (canvasWidth - padding)) / M;
  return mx;
}

function mouseY_to_internal(mouse_y) {
  let my = (canvasHeight - padding - mouse_y) / M
  return my;
}

/* isr */
function windowResized() {						/* responsive design */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);

  M = (canvasWidth - 2 * padding) / (playground.width);
}
