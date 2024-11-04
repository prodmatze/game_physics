/* Autor: Mathieu Wassmuth  */
/* Übung Nr.4 */
/* Datum: 04.11.2024 */

function mousePressed() {
  console.log("MOUSE PRESSED!")
  let d = dist(mx, my, ball_x, ball_y);
  if (d < ball_d) {
    dragging = true;
  }
}

function mouseDragged() {
  if (dragging) {
    //distance mouse to slingshot
    let distance = dist(slingshot_metrics.center_x, slingshot_metrics.center_y, mx, my);

    if (distance > max_radius) {
      distance = max_radius;
      can_drag_ball = false;
    } else if (distance < min_radius) {
      distance = min_radius;
      can_drag_ball = false;
    } else if (distance < max_radius && distance > min_radius) {
      can_drag_ball = true;
    }
  }
}

function mouseReleased() {
  if (dragging) {
    ball_x = slingshot_metrics.center_x;
    ball_y = slingshot_metrics.center_y;
  }
  if ((game_state == STATE_START) && dragging) {
    launch_velocity = map(distance_ball_slingshot, 0, max_radius, 0, 100);
    ball_angle = atan2(distance_ball_slingshot_y, distance_ball_slingshot_x);
    game_state = STATE_MOVING_IN_AIR;
  }

  dragging = false;
  can_drag_ball = false;


}
