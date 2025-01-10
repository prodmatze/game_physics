/* template GTAT2 Game Technology & Interactive Systems */
/* Autor: Mathieu Wassmuth  */
/* Übung Nr.8 */
/* Datum: 09.01.2025 */


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

    distance_ball_slingshot_x = slingshot_metrics.center_x - ball_x;
    distance_ball_slingshot_y = slingshot_metrics.center_y - ball_y;
    distance_ball_slingshot = dist(
      slingshot_metrics.center_x,
      slingshot_metrics.center_y,
      ball_x,
      ball_y
    );

    ball_angle = atan2(distance_ball_slingshot_y, distance_ball_slingshot_x);
    console.log(`Ball Angle: ${degrees(ball_angle).toFixed(2)}`);

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
    //calculate spring forces + acceleration only once when mouse is released
    //Energieerhaltung:
    //Potentielle energie der Feder = 1/2 * (n * displacement^2)
    //wird beim loslassen in kinetische Energie des Balles umgewandelt = 1/2 * (m * v^2)
    // - > Beide Formeln gleichsetzen und nach v auflösen um die Geschwindigkeit des Balles nach dem Loslassen zu erhalten:
    // v^2 = (n*displacement^2)/m

    let spring_displacement = distance_ball_slingshot - spring_constants.l_0;
    let spring_force = spring_constants.n * spring_displacement;

    launch_velocity = Math.sqrt((spring_constants.n * Math.pow(spring_displacement, 2)) / ball_mass);

    ball_velocity_x = launch_velocity * cos(ball_angle);
    ball_velocity_y = launch_velocity * sin(ball_angle);


    game_state = STATE_MOVING_IN_AIR;
  }

  dragging = false;
  can_drag_ball = false;
}
