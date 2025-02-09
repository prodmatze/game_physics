/* template GTAT2 Game Technology & Interactive Systems */
/* Autor: Mathieu Wassmuth  */
/* Übung Nr.9 */
/* Datum: 25.01.2025 */

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

let min_radius = 0.3;
let max_radius = 1;

let dragging = false;
let can_drag_ball = false;

const STATE_START = "Start";
const STATE_ON_CATAPULT = "On Catapult"
const STATE_MOVING_IN_AIR = "Moving in Air";
const STATE_MOVING_ON_PLANE = "Moving on Plane";
const STATE_END_MOVEMENT = "End";

let game_state = STATE_START;

let ball_angle = 0;
let distance_ball_slingshot = 0;
let distance_ball_slingshot_x = 0;
let distance_ball_slingshot_y = 0;

let spring_displacement = 0;
let sring_force = 0;

let launch_velocity = 0;
let ball_velocity_x = 0;
let ball_velocity_y = 0;

let ball_acceleration_x = 0;
let ball_acceleration_y = 0;

let play_ball_is_in_hole = false;

let red_ball_velocity_x = 0;
let red_ball_velocity_y = 0;
let red_ball_is_in_hole = false;

let ball_bounce = 0.8;
let ball_bounce_together_factor = 0.3;
let bounce_velocity_threshold = 1;
let num_ball_bounces = 0;

let ball_has_bounced = false;
let ball_initial_bounce_velocity = null;
let ball_current_velocity = 0;

//generate segments
let segments = [];

//after 7 bounces, the balls velocity equals 20% of its starting velocity
let max_num_ball_bounces = 7;

let plane_friction = 0.999;

let gravity = 9.81;

//parameters for drag and wind
//masse des balls in kg
const ball_mass = 0.05;

//luftwiderstandsbeiwert für kugel
const c_w = 0.45

//dichte luft
const density_air = 1.3;

//wind-speed
//errechnet einmal pro spiel eine zufällige windgeschwindigkeit zwischen -25 und +25 m/s aus
const wind_speed = Math.floor(Math.random() * (25 - (-25) + 1)) - 25;

const spring_constants = {
  n: 50,
  l_0: 0.25,
  r_m: 0.8,
}

let obstacle_at_start = true;
function reposition_obstacle_and_set_bool() {
  reposition_obstacle(obstacle_at_start);
  obstacle_at_start = !obstacle_at_start;
}

/* prepare program */
function setup() {
  createCanvas(canvasWidth, canvasHeight);

  //create and style buttons 
  reset_button = createButton('RESET');
  new_button = createButton('NEW');
  test_triangle_button = createButton("TEST TRIANGLE");
  style_button(test_triangle_button);
  test_triangle_button.mousePressed(position_ball_to_triangle);

  test_ball_collision_button = createButton("TEST BALL COLLISION");
  style_button(test_ball_collision_button);
  test_ball_collision_button.mousePressed(test_ball_collision);

  //button to reposition obstacle
  position_obstacle_button = createButton("MOVE OBSTACLE");
  style_button(position_obstacle_button);
  position_obstacle_button.mousePressed(reposition_obstacle_and_set_bool);

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

function style_button(button) {
  button.style('background-color', 'red');
  button.style('color', 'white');
  button.style('font-size', '20px');
  button.style('padding', '15px 30px');
  button.style('border-radius', '10px');
}


const playground = {
  height: 7,  //in m
  width: 10,  //in m
};

var M = (canvasWidth - 2 * padding) / (playground.width);
var x0 = playground.width + padding;
var y0 = padding + playground.height;

var metric = {
  height: playground.height * 0.1,

  //important that right rectangle, left rectange, and hole add up to 100% of playground width to make playground symetric and centered
  right_rect_width: playground.width * 0.6,
  left_rect_width: playground.width * 0.33,

  hole_width: playground.width * 0.07,
  hole_height: (playground.height * 0.1) / 2,

  schornstein_height: playground.height * 0.5,
  schornstein_width: 0.2,

  triangle_height: 0.7,
  triangle_width: 1.5,

  red_rec_height: 0.5,
  red_rec_width: 0.15,

  flagpole_height: 1.5,
  flagpole_width: 0.05,

  flag_height: 0.4,
  flag_width: 0.65,

  ball_diameter: 0.15,

  slingshot_pos_x: 1,
  slingshot_height: 0.5,
  slingshot_width: 0.15,
}


var triangle_coords = {
  x1: -metric.right_rect_width - metric.left_rect_width - metric.hole_width + metric.schornstein_width,
  y1: metric.height + metric.triangle_height,
  x2: -metric.right_rect_width - metric.left_rect_width - metric.hole_width + metric.schornstein_width,
  y2: metric.height,
  x3: -metric.right_rect_width - metric.left_rect_width - metric.hole_width + metric.triangle_width,
  y3: metric.height,
}

var flag_pole_coords = {
  x1: - metric.right_rect_width - metric.hole_width - 0.3,
  y1: metric.height,
}

var flag_coords = {
  x1: flag_pole_coords.x1 + metric.flagpole_width / 2,
  y1: flag_pole_coords.y1 + metric.flagpole_height,
  x2: flag_pole_coords.x1 + metric.flagpole_width / 2,
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
  d: 0.15,
  x: slingshot.x1 - metric.slingshot_width / 2,
  y: metric.height + metric.slingshot_height + 15 / 2,
}

//playball
let ball_x = slingshot.x1 - metric.slingshot_width / 2;
let ball_y = metric.height + metric.slingshot_height;
let ball_d = 0.15;

//recalc to metric
let ball_cross_section_a = Math.PI * (ball_d / 2) * (ball_d / 2);

//red ball
let red_ball_x = -playground.width / 2 + 1;
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

  segments = generate_segments();

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
  ball_current_velocity = Math.sqrt(ball_velocity_x * ball_velocity_x + ball_velocity_y * ball_velocity_y)




  red_ball_x += red_ball_velocity_x * dt;
  red_ball_y += red_ball_velocity_y * dt;
  /* display */
  push();

  translate(canvasWidth - padding, canvasHeight - padding);

  //scale entire coordinate system so i dont have to calculate M into every object
  scale(M, -M);

  draw_scene(wind_speed);

  switch (game_state) {
    case STATE_START:

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
        let angle_of_attack = atan2(ball_y - slingshot_metrics.center_y, ball_x - slingshot_metrics.center_x)
        console.log(angle_of_attack)

      }
      if (can_drag_ball) {
        ball_x = mx;
        ball_y = my;
      }
      ball_x += ball_velocity_x * dt;
      ball_y += ball_velocity_y * dt;

      break;

    case STATE_ON_CATAPULT:

      distance_ball_slingshot = dist(
        slingshot_metrics.center_x,
        slingshot_metrics.center_y,
        ball_x,
        ball_y
      );
      spring_displacement = distance_ball_slingshot - spring_constants.l_0;
      //could implement if statement here to save computation (only calc spring_force when displacement is in range)
      let angle_of_attack = atan2(ball_y - slingshot_metrics.center_y, ball_x - slingshot_metrics.center_x)

      spring_force = spring_constants.n * spring_displacement

      let spring_acceleration_x = spring_force / ball_mass * cos(angle_of_attack) + spring_constants.r_m * ball_velocity_x;
      let spring_acceleration_y = spring_force / ball_mass * sin(angle_of_attack) + gravity + spring_constants.r_m * ball_velocity_y;

      ball_velocity_x -= spring_acceleration_x * dt
      ball_velocity_y -= spring_acceleration_y * dt

      if (spring_displacement <= 0) {
        game_state = STATE_MOVING_IN_AIR;
      }
      ball_x += ball_velocity_x * dt;
      ball_y += ball_velocity_y * dt;
      break;

    case STATE_MOVING_IN_AIR:
      check_collisions_in_flight(ball_x, ball_y, dt);
      let drag = calculate_drag(ball_velocity_x, ball_velocity_y, c_w, density_air, ball_mass, ball_cross_section_a, wind_speed)

      ball_acceleration_x = drag.ax;
      ball_acceleration_y = drag.ay - gravity;

      ball_velocity_x += ball_acceleration_x * dt;
      ball_velocity_y += ball_acceleration_y * dt;

      ball_x += ball_velocity_x * dt;
      ball_y += ball_velocity_y * dt;

      //red_ball_velocity_y -= gravity * dt;
      break;

    case STATE_MOVING_ON_PLANE:
      check_collisions_in_flight(ball_x, ball_y);
      //apply gravity if ball is higher than ground
      if (ball_y > metric.height + ball_d / 2) {
        ball_velocity_y -= gravity * dt;
      } else {
        ball_y = metric.height + ball_d / 2;
        ball_velocity_y = 0;
        ball_velocity_x *= plane_friction;
      }


      //change state when ball rolls into hole
      if (check_hole_top(ball_x)) {
        game_state = STATE_MOVING_IN_AIR;
        ball_has_bounced = false;
        ball_initial_bounce_velocity = null;
      }
      if (in_triangle_range(ball_x)) {
        //implement TRIANGLE_STATE later
        ball_velocity_x = 0;
      }
      ball_x += ball_velocity_x * dt;
      ball_y += ball_velocity_y * dt;
      break;

    case STATE_END_MOVEMENT:

      break;
  }
  pop();

  display_info(mx, my);

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
  game_state = STATE_START;
  ball_x = slingshot.x1 - metric.slingshot_width / 2;
  ball_y = metric.height + metric.slingshot_height;
  launch_velocity = 0;
  ball_velocity_x = 0;
  ball_velocity_y = 0;
  ball_acceleration_x = 0;
  ball_acceleration_y = 0;
  play_ball_is_in_hole = false;

  red_ball_x = -playground.width / 2 + 1;
  red_ball_y = metric.height + metric.ball_diameter / 2;
  red_ball_velocity_x = 0;
  red_ball_velocity_y = 0;
  red_ball_is_in_hole = false;

  ball_has_bounced = false;
  num_ball_bounces = 0;
  ball_current_velocity = 0;
  ball_initial_bounce_velocity = null;
}

function position_ball_to_triangle() {
  reset_balls();

  //ball_x = triangle_coords.x1 + ball_d / 2;
  ball_x = triangle_coords.x1 + 1;
  ball_y = triangle_coords.y1 + ball_d / 5;

  ball_velocity_y += gravity * dt;
  game_state = STATE_MOVING_IN_AIR;
}

function test_ball_collision() {
  reset_balls();
  direction = "left";
  game_state = STATE_MOVING_ON_PLANE;
  if (direction == "left") {
    ball_x = -3.5;
    ball_y = metric.height + ball_d / 2;
    ball_velocity_x = -2.5;
  } else if (direction == "right") {
    ball_x = obstacle.x + obstacle.width + 0.1;
    ball_y = metric.height + ball_d / 2;
    ball_velocity_x = 2.5;

  }
}

function position_buttons() {
  reset_button.position(padding + 10, canvasHeight - padding * 0.8);
  new_button.position(canvasWidth - padding - 120, canvasHeight - padding * 0.8);
  test_triangle_button.position(canvasWidth / 5, canvasHeight - padding * 0.8);
  test_ball_collision_button.position(canvasWidth / 2 - padding, canvasHeight - padding * 0.8);
  position_obstacle_button.position(padding + metric.right_rect_width / 2 + metric.left_rect_width + metric.hole_width, canvasHeight / 2)
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

  text(`BLUE Ball Velocity: (${floor(ball_velocity_x)}, ${floor(ball_velocity_y)})`, x, y);
  y += 24;

  text(`RED Ball Velocity: (${floor(red_ball_velocity_x)}, ${floor(red_ball_velocity_y)})`, x, y);
  y += 24;

  text(`Ball Angle: ${degrees(ball_angle).toFixed(2)}°`, x, y);
  y += 24;

  text(`Mouse X: ${floor(mx)} - Mouse Y: ${floor(my)}`, x, y);
  y += 24;

  text(`Current State: ${game_state}`, x, y);
  y += 24;

  text(`Wind Speed: ${wind_speed} m/s`, x, y);
  y += 24;

  text(`Total Bounces: ${num_ball_bounces}`, x, y);
  y += 24;

  text(`Ball has BOUNCED: ${ball_has_bounced}`, x, y);
  y += 24;

  text(`Initial Bounce Velocity: ${ball_initial_bounce_velocity}`, x, y);
  y += 24;

  text(`Ball current Velocity : ${ball_current_velocity}`, x, y);
  y += 24;
}

/* isr */
function windowResized() {						/* responsive design */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);

  M = (canvasWidth - 2 * padding) / (playground.width);
}
