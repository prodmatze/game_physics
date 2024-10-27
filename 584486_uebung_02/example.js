/* template GTAT2 Game Technology & Interactive Systems */
/* Autor: Mathieu Wassmuth  */
/* Übung Nr.2 */
/* Datum: 15.10.2024 */

/* declarations */
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
/* prepare program */
function setup() {
  createCanvas(canvasWidth, canvasHeight);
}

//all metric dimensions are in centimeters
const padding = 100;

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


/* run program */
function draw() {
  background(255);


  /* administration */

  fill(0);

  //trying different things with the text
  textAlign(CENTER, TOP),
    textSize(32 * M);
  text("LETS GO! 🏌️⛳️", canvasWidth / 2, padding);

  /* calculation */


  /* display */
  push();

  console.log(M)
  translate(canvasWidth - padding, canvasHeight - padding);

  //scale entire coordinate system so i dont have to calculate M into every object
  scale(M, -M);

  //right rect
  drawRectangle(-metric.right_rect_width, 0, metric.right_rect_width, metric.height, '#0000ff');

  //left rect
  drawRectangle(-metric.right_rect_width - metric.left_rect_width - metric.hole_width, 0, metric.left_rect_width, metric.height, '#0000ff');

  //hole rect
  drawRectangle(-metric.right_rect_width - metric.hole_width, 0, metric.hole_width, metric.hole_height, "#0000ff");

  //schortstein
  drawRectangle(-metric.right_rect_width - metric.left_rect_width - metric.hole_width, 0, metric.schornstein_width, metric.schornstein_height, "#0000ff");

  //red rectangle
  drawRectangle(- metric.right_rect_width / 2, metric.height, metric.red_rec_width, metric.red_rec_height, "#ff0000");

  //blue triangle
  drawTriangle(triangle_coords.x1, triangle_coords.y1, triangle_coords.x2, triangle_coords.y2, triangle_coords.x3, triangle_coords.y3, "#0000ff");

  //flagpole
  drawRectangle(flag_pole_coords.x1, flag_pole_coords.y1, 5, metric.flagpole_height, "#000000")

  drawFlag(flag_coords.x1, flag_coords.y1, flag_coords.x2, flag_coords.y2, flag_coords.x3, flag_coords.y3, ("#ffff00"))

  //red ball
  draw_circle(-playground.width / 2, metric.height + metric.ball_diameter / 2, metric.ball_diameter, "#ff0000")

  //green ball
  draw_circle(-30, metric.height + metric.red_rec_height, metric.ball_diameter, "#00ff00")

  //slingshot
  drawTriangle(slingshot.x1, slingshot.y1, slingshot.x2, slingshot.y2, slingshot.x3, slingshot.y3, "#00ff00")
  pop();

  draw_scene();

}

/* isr */
function windowResized() {						/* responsive design */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  resizeCanvas(windowWidth, windowHeight);

  //M = canvasWidth / (playground.width + padding);
  M = (canvasWidth - 2 * padding) / (playground.width);
}
