let hole_left_segment = {
  name: "hole_left_segment",
  x1: -metric.right_rect_width - metric.hole_width,
  y1: metric.height,
  x2: -metric.right_rect_width - metric.hole_width,
  y2: metric.hole_height
};

let hole_right_segment = {
  name: "hole_right_segment",
  x1: -metric.right_rect_width,
  y1: metric.hole_height,
  x2: -metric.right_rect_width,
  y2: metric.height
};



function in_triangle_range(ball_x) {
  if (ball_x - ball_d / 2 < triangle_coords.x3) {
    return true;
  } else {
    return false;
  }
}

function check_hole_top(ball_x) {
  if ((ball_x - ball_d / 2 < -metric.right_rect_width) && ball_x + ball_d / 2 > -metric.right_rect_width - metric.hole_width && ball_y - ball_d / 2 <= metric.height) {
    return true;
  } else {
    return false;
  }
}

function check_hole_left(ball_x, ball_y) {
  if (distance_to_segment(ball_x, ball_y, hole_left_segment) <= ball_d / 2) {
    return true;
  }
}

function check_hole_right(ball_x, ball_y) {
  if (distance_to_segment(ball_x, ball_y, hole_right_segment) <= ball_d / 2) {
    return true;
  }
}


function hole_left_failsafe(ball_x, ball_y) {
  if (check_hole_left(ball_x, ball_y)) {
    new_ball_x = -metric.right_rect_width - metric.hole_width + ball_d / 2;
    return new_ball_x;
  } else {
    return false
  }
}

function hole_right_failsafe(ball_x, ball_y) {
  if (check_hole_right(ball_x, ball_y)) {
    new_ball_x = -metric.right_rect_width - ball_d / 2;
    return new_ball_x;
  } else {
    return false;
  }
}

function check_ground(ball_y) {
  if (ball_y - ball_d / 2 < metric.height) {
    return true;
  } else {
    return false;
  }
}

function check_hole_ground(ball_y) {
  if (ball_y <= metric.hole_height) {
    return true;
  } else {
    return false;
  }
}

function ground_failsafe() {
  if (check_ground(ball_y)) {
    ball_y = metric.height + ball_d / 2;
  }
}

function hole_ground_failsafe() {
  if (check_hole_ground(ball_y)) {
    ball_y = metric.hole_height + ball_d / 2;
  }
}

