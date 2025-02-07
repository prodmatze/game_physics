function in_triangle_range(ball_x) {
  if (ball_x - ball_d / 2 < triangle_coords.x3) {
    return true;
  } else {
    return false;
  }
}

function check_hole_top(ball_x) {
  if ((ball_x <= -metric.right_rect_width) && ball_x >= -metric.right_rect_width - metric.hole_width && ball_y - ball_d / 2 <= metric.height) {
    return true;
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

