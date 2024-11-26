/* template GTAT2 Game Technology & Interactive Systems */
/* Autor: Mathieu Wassmuth  */
/* Übung Nr.6 */
/* Datum: 25.11.2024 */

const playground = {
  height: 700,  //in cm
  width: 1000,  //in cm 
};

var M = (canvasWidth - 2 * padding) / (playground.width);
var x0 = playground.width + padding;
var y0 = padding + playground.height;
let info_panel_width = 200;

let mx;
let my;

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

//playball
let ball_x = slingshot.x1 - metric.slingshot_width / 2;
let ball_y = metric.height + metric.slingshot_height;
let ball_d = 15;

//red ball
let red_ball_x = -playground.width / 2;
let red_ball_y = metric.height + metric.ball_diameter / 2;
let red_ball_d = metric.ball_diameter;

var slingshot_metrics = {
  center_x: slingshot.x1 - metric.slingshot_width / 2,
  center_y: metric.height + metric.slingshot_height,
}


