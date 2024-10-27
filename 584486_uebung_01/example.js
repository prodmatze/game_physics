/* template GTAT2 Game Technology & Interactive Systems */
/* Autor: Mathieu Wassmuth  */
/* Übung Nr.1 */
/* Datum: 08.10.2022 */

/* declarations */
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var scaled_canvas_width = canvasWidth / 1000;
var scaled_canvas_height = canvasHeight / 1000;

/* prepare program */
function setup() {
  createCanvas(canvasWidth, canvasHeight);
}

var x0 = 0 - canvasWidth;
var y0 = 0 - canvasHeight;

var metric = {
  padding: 200,
  right_rect_length: 800,
  left_rect_length: 250,
  hole_length: 35,
  height: 60,

  schornstein_height: 400,
  schornstein_width: 30,

  bottom: 500,

  triangle_length: 100,

  red_rec_height: 60,
  red_rec_width: 25,


  flag_height: 40,

  ball_diameter: 30,


}

var triangle_coords = {
  x1: metric.padding + metric.schornstein_width,
  y1: metric.bottom,
  x2: metric.padding + metric.schornstein_width,
  y2: metric.bottom - metric.triangle_length,
  x3: metric.padding + metric.schornstein_width * 2 + metric.triangle_length,
  y3: metric.bottom,
}

var flag_coords = {
  x1: metric.padding + metric.left_rect_length - 30,
  y1: metric.bottom - metric.schornstein_height / 2,
  x2: metric.padding + metric.left_rect_length - 30,
  y2: metric.bottom - metric.schornstein_height / 2 + metric.flag_height,
  x3: metric.padding + metric.left_rect_length / 2 + 10,
  y3: metric.bottom - metric.schornstein_height / 2 + metric.flag_height / 2,
}

var slingshot = {
  x1: metric.padding + metric.right_rect_length,
  y1: metric.bottom,
  x2: metric.padding + metric.right_rect_length + 30,
  y2: metric.bottom,
  x3: metric.padding + metric.right_rect_length + 15,
  y3: metric.bottom - 100,
}

/* run program */
function draw() {
  background(255);

  /* administration */
  fill(0);
  text("this is an example", 200, 50);

  /* calculation */


  /* display */
  //right rect
  drawRectangle(metric.padding + metric.left_rect_length + metric.hole_length, metric.bottom, metric.right_rect_length, metric.height, '#0000ff');

  //left rect
  drawRectangle(metric.padding, metric.bottom, metric.left_rect_length, metric.height, '#0000ff');

  //hole rect
  drawRectangle(metric.padding + metric.left_rect_length, metric.bottom + metric.height / 2, metric.hole_length, metric.height / 2, '#0000ff');

  //schortstein
  drawRectangle(metric.padding, metric.bottom, metric.schornstein_width, - metric.schornstein_height, "#0000ff");

  drawRectangle(metric.padding + metric.left_rect_length + metric.right_rect_length / 2, metric.bottom, metric.red_rec_width, - metric.red_rec_height, "#ff0000");

  drawTriangle(triangle_coords.x1, triangle_coords.y1, triangle_coords.x2, triangle_coords.y2, triangle_coords.x3, triangle_coords.y3, "#0000ff");

  //flagpole
  drawRectangle(flag_coords.x1, flag_coords.y1 - 10, 5, 210, "#000000")

  drawFlag(flag_coords.x1, flag_coords.y1, flag_coords.x2, flag_coords.y2, flag_coords.x3, flag_coords.y3, ("#00ff00"))

  //red ball
  draw_circle(metric.padding + metric.left_rect_length * 2, metric.bottom - metric.ball_diameter / 2, metric.ball_diameter, "#ff0000")

  //green ball
  draw_circle(metric.padding + metric.right_rect_length + metric.left_rect_length / 2, metric.bottom - metric.ball_diameter * 3 - metric.red_rec_height, metric.ball_diameter, "#00ff00")

  //greenPyramid
  drawTriangle(slingshot.x1, slingshot.y1, slingshot.x2, slingshot.y2, slingshot.x3, slingshot.y3, "#00ff00")


  draw_scene();

}

/* isr */
function windowResized() {						/* responsive design */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  resizeCanvas(windowWidth, windowHeight);
}
