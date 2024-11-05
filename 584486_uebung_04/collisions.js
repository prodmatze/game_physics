function ball_collision() {
  distance = dist(ball_x, ball_y, red_ball_x, red_ball_y);
  if (distance < ball_d) {
    return true;
  }
  else {
    return false;
  }
}
