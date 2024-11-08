/* template GTAT2 Game Technology & Interactive Systems */
/* Autor: Mathieu Wassmuth  */
/* Übung Nr.4 */
/* Datum: 04.11.2024 */

/* declarations */
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

//all metric dimensions are in centimeters
const padding = 100;

//game meta variables
let score = 0;
let remaining_attempts = 5;
let status_text = `Score: ${score} - Remaining attempts: ${remaining_attempts}`;
let dt = 0;

let min_radius = 30;
let max_radius = 100;

let dragging = false;
let can_drag_ball = false;

const STATE_START = 0;
const STATE_MOVING_IN_AIR = 1;
const STATE_MOVING_ON_PLANE = 2;
const STATE_END_MOVEMENT = 3;

let game_state = STATE_START;

let ball_angle = 0;
let distance_ball_slingshot = 0;
let distance_ball_slingshot_x = 0;
let distance_ball_slingshot_y = 0;

let launch_velocity = 0;
let ball_velocity_x = 0;
let ball_velocity_y = 0;

let red_ball_velocity_x = 0;
let red_ball_velocity_y = 0;

let ball_bounce = 0.8;
let bounce_velocity_threshold = 90;

let plane_friction = 0.95;

let gravity = 981;

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

let mx;
let my;

let info_panel_width = 200;

console.log('CURRENT GAME STATE:', game_state);

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

  distance_ball_slingshot_x = slingshot_metrics.center_x - ball_x;
  distance_ball_slingshot_y = slingshot_metrics.center_y - ball_y;
  distance_ball_slingshot = dist(slingshot_metrics.center_x, slingshot_metrics.center_y, ball_x, ball_y);

  dt = deltaTime / 1000;
  ball_x += ball_velocity_x * dt;
  ball_y += ball_velocity_y * dt;

  red_ball_x += red_ball_velocity_x * dt;
  red_ball_y += red_ball_velocity_y * dt;
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
  //drawTriangle(triangle_coords.x1, triangle_coords.y1, triangle_coords.x2, triangle_coords.y2, triangle_coords.x3, triangle_coords.y3, "#0000ff");

  //flagpole
  drawRectangle(flag_pole_coords.x1, flag_pole_coords.y1, 5, metric.flagpole_height, "#000000");
  //flag
  drawFlag(flag_coords.x1, flag_coords.y1, flag_coords.x2, flag_coords.y2, flag_coords.x3, flag_coords.y3, ("#ffff00"), 1);

  //slingshot
  drawTriangle(slingshot.x1, slingshot.y1, slingshot.x2, slingshot.y2, slingshot.x3, slingshot.y3, "#00ff00");

  //red ball
  draw_circle(red_ball_x, red_ball_y, red_ball_d, "#ff0000");

  //playball
  draw_circle(ball_x, ball_y, ball_d, "#0000ff");


  console.log("CURRENT STATE:", game_state);
  switch (game_state) {
    case STATE_START:
      ball_velocity = 8;
      //draws distance indicators and sling 
      if (dragging) {
        noFill();
        stroke(0, 0, 255);
        strokeWeight(1 / M);

        //draw_min radius circle 
        ellipse(slingshot_metrics.center_x, slingshot_metrics.center_y, min_radius * 2, min_radius * 2);

        //draw max radius circle
        ellipse(slingshot_metrics.center_x, slingshot_metrics.center_y, max_radius * 2, max_radius * 2);

        //draw sling
        fill(0, 0, 0, 200);
        noStroke();

        beginShape();
        vertex(slingshot.x3, slingshot.y3);
        vertex(ball_x, ball_y + ball_d / 2);
        vertex(ball_x, ball_y - ball_d / 2);

        endShape(CLOSE);

      }
      if (can_drag_ball) {
        ball_x = mx;
        ball_y = my;
      }
      break;

    case STATE_MOVING_IN_AIR:
      ball_velocity_y -= gravity * dt;

      //making ball bounce 
      if (ground_collision(ball_x, ball_y)) {
        console.log("BALL BOUNCED!, VELOCITY_Y:", ball_velocity_y)
        ball_velocity_y += gravity * dt

        ball_y = metric.height + ball_d / 2;
        ball_velocity_y = -ball_velocity_y * 0.8;
        ball_velocity_x *= plane_friction;
        if (Math.abs(ball_velocity_y) < bounce_velocity_threshold) {
          ball_velocity_y = 0;
          game_state = STATE_MOVING_ON_PLANE;
        }
      }

      //making ball bounce off wall
      if (wall_collision(ball_x, ball_y)) {
        ball_x = -metric.right_rect_width - metric.left_rect_width - metric.hole_width + metric.schornstein_width + ball_d;
        ball_velocity_x = -ball_velocity_x * ball_bounce;
      }
      /*
      //making ball stop at hole
      if (ball_x < (-metric.right_rect_width)) {
        ball_velocity_x = 0;
      }
      */
      if (ball_collision(ball_x, ball_y, red_ball_x, red_ball_y)) {
        red_ball_velocity_x = ball_velocity_x * ball_bounce;
      }

      if (obstacle_collision(ball_x, ball_y)) {
        ball_velocity_x = -ball_velocity_x * ball_bounce;
      }
      break;

    case STATE_MOVING_ON_PLANE:
      console.log("CURRENT STATE: ", game_state);
      ball_velocity_x *= plane_friction;
      if (ball_x < (-metric.right_rect_width)) {
        ball_velocity_x = 0;
        game_state = STATE_END_MOVEMENT;
      }
      break;

    case STATE_END_MOVEMENT:

      break;
  }
  pop();

  display_info(mx, my);

  draw_scene();
}

function new_attempt() {
  console.log("New attempt button was pressed!")
  if (remaining_attempts > 0) {
    remaining_attempts -= 1;
    reset_balls();

    game_state = STATE_START;
  }

}

function reset_game() {
  console.log("Reset game button was pressed!")
  score = 0;
  remaining_attempts = 5;
  reset_balls();

  game_state = STATE_START;
}

function reset_balls() {
  ball_x = slingshot.x1 - metric.slingshot_width / 2;
  ball_y = metric.height + metric.slingshot_height;
  launch_velocity = 0;
  ball_velocity_x = 0;
  ball_velocity_y = 0;

  red_ball_x = -playground.width / 2;
  red_ball_y = metric.height + metric.ball_diameter / 2;
  red_ball_velocity_x = 0;
  red_ball_velocity_y = 0;

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

function draw_info_panel_background() {
  fill(220);
  noStroke();
  rect(canvasWidth - info_panel_width - padding, 0 + padding, info_panel_width, canvasHeight - padding * 4);
}

function display_info(mx, my) {
  fill(0);
  textSize(16);
  textAlign(CENTER, TOP);

  let x = canvasWidth / 2;
  let y = padding * 2.5;

  text(`Ball Position: (${floor(ball_x)}, ${floor(ball_y)})`, x, y);
  y += 24;

  text(`Ball Velocity: (${floor(ball_velocity_x)}, ${floor(ball_velocity_y)})`, x, y);
  y += 24;

  text(`Ball Angle: ${degrees(ball_angle).toFixed(2)}°`, x, y);
  y += 24;

  text(`Mouse X: ${floor(mx)} - Mouse Y: ${floor(my)}`, x, y);
  y += 24;

}

/* isr */
function windowResized() {						/* responsive design */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);

  M = (canvasWidth - 2 * padding) / (playground.width);
}
