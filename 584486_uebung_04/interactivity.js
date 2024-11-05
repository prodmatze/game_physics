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
  if ((game_state == STATE_START) && dragging && can_drag_ball) {
    distance_ball_slingshot_x = slingshot_metrics.center_x - ball_x;
    distance_ball_slingshot_y = slingshot_metrics.center_y - ball_y;
    distance_ball_slingshot = dist(
      slingshot_metrics.center_x,
      slingshot_metrics.center_y,
      ball_x,
      ball_y
    );

    ball_angle = atan2(distance_ball_slingshot_y, distance_ball_slingshot_x);

    launch_velocity = map(distance_ball_slingshot, 0, max_radius, 0, 800);

    ball_velocity_x = launch_velocity * cos(ball_angle);
    ball_velocity_y = launch_velocity * sin(ball_angle);


    game_state = STATE_MOVING_IN_AIR;
  }

  dragging = false;
  can_drag_ball = false;


}
