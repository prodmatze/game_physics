function ball_collision() {
  distance = dist(ball_x, ball_y, red_ball_x, red_ball_y);
  if (distance < ball_d) {
    return true;
  }
  else {
    return false;
  }
}

function ground_collision() {
  if ((ball_y - ball_d / 2 <= metric.height) && (ball_x < 0) && (ball_x > -metric.right_rect_width - metric.left_rect_width - metric.hole_width)) {
    return true;
  }
  else {
    return false;
  }
}

function wall_collision() {
  if ((ball_x - ball_d / 2) <= (-metric.right_rect_width - metric.left_rect_width - metric.hole_width + metric.schornstein_width)) {
    return true;
  }
  else {
    return false;
  }
}

function obstacle_collision() {
  if ((ball_x <= - metric.right_rect_width / 2 + metric.red_rec_width) && (ball_y <= metric.height + metric.red_rec_height) && (ball_x >= metric.right_rect_width / 2)) {
    return true;
  }
  else {
    return false;
  }
}
