/* template GTAT2 Game Technology & Interactive Systems */
/* Autor: Mathieu Wassmuth  */
/* Übung Nr.10 */
/* Datum: 14.02.2025 */

function update_game_state(current_bounce_velocity) {
  if (!ball_has_bounced) {
    ball_has_bounced = true;
    ball_initial_bounce_velocity = current_bounce_velocity;
  }
  if ((current_bounce_velocity <= ball_initial_bounce_velocity * 0.1) && !check_hole_top(ball_x) && !in_triangle_range(ball_x)) {
    game_state = STATE_MOVING_ON_PLANE;
  }
}

function ball_collision(ball_0_x, ball_0_y, ball_1_x, ball_1_y) {
  distance = dist(ball_0_x, ball_0_y, ball_1_x, ball_1_y);
  if (distance < ball_d) {
    return true;
  }
  else {
    return false;
  }
}

function ground_collision(ball_x, ball_y) {
  if ((ball_y - ball_d / 2 <= metric.height) && (ball_x < 0) && (ball_x > -metric.right_rect_width - metric.left_rect_width - metric.hole_width)) {
    if (ball_has_bounced == false) {
      (ball_initial_bounce_velocity = ball_current_velocity)
    }
    update_game_state();
    return true;
  }
  else {
    return false;
  }
}

function hole_ground_collision(ball_y) {
  if (ball_y - ball_d / 2 <= (metric.hole_height)) {
    return true;
  } else {
    return false;
  }
}

function wall_collision(ball_x, ball_y) {
  if ((ball_x - ball_d / 2) <= (-metric.right_rect_width - metric.left_rect_width - metric.hole_width + metric.schornstein_width) && (ball_y < metric.schornstein_height + ball_d)) {
    return true;
  }
  else {
    return false;
  }
}

function obstacle_collision_left(ball_x, ball_y) {
  segment_obstacle_left = {
    x1: obstacle.x,
    y1: obstacle.y,
    x2: obstacle.x,
    y2: obstacle.y + obstacle.height,
  };
  const distance_obstacle_left = distance_to_segment(ball_x, ball_y, segment_obstacle_left)
  if (distance_obstacle_left <= ball_d / 2) {
    console.log("OBSTACLE COLLISION LEFT!")
    return true;
  } else {
    return false;
  }
}

function obstacle_collision_right(ball_x, ball_y) {
  segment_obstacle_right = {
    x1: obstacle.x + obstacle.width,
    y1: obstacle.y,
    x2: obstacle.x + obstacle.width,
    y2: obstacle.y + obstacle.height,
  };
  const distance_obstacle_right = distance_to_segment(ball_x, ball_y, segment_obstacle_right);
  if (distance_obstacle_right <= ball_d / 2) {
    console.log("OBSTACLE COLLISION RIGHT!")
    return true;
  } else {
    return false;
  }
}

function distance_to_segment(ball_x, ball_y, segment) {

  const dx = segment.x2 - segment.x1;
  const dy = segment.y2 - segment.y1;

  const t = ((ball_x - segment.x1) * dx + (ball_y - segment.y1) * dy) / (dx * dx + dy * dy);

  let closestX, closestY;

  if (t < 0) {
    closestX = segment.x1;
    closestY = segment.y1;
  } else if (t > 1) {
    closestX = segment.x2;
    closestY = segment.y2;
  } else {
    closestX = segment.x1 + t * dx;
    closestY = segment.y1 + t * dy;
  }
  return dist(ball_x, ball_y, closestX, closestY);
}

function calculate_angle(ball_velocity_x, ball_velocity_y, segment) {

  let velocity = Math.sqrt(ball_velocity_x * ball_velocity_x + ball_velocity_y * ball_velocity_y);
  let velocity_vector = createVector(ball_velocity_x, ball_velocity_y);
  let segment_vector = createVector(segment.x2 - segment.x1, segment.y2 - segment.y1)

  let angle_velocity_segment = velocity_vector.angleBetween(segment_vector)

  return { angle: degrees(angle_velocity_segment), velocity: velocity }
}

function triangle_collision(ball_x, ball_y) {
  segment = {
    x1: triangle_coords.x1,
    y1: triangle_coords.y1,
    x2: triangle_coords.x3,
    y2: triangle_coords.y3
  }
  const distance = distance_to_segment(ball_x, ball_y, segment)

  if (distance <= ball_d / 2) {
    console.log("TRIANGLE COLLISION!")
    return { collision: true, distance: distance };
  } else {
    return false;
  }
}

function check_hole_top(ball_x) {
  if ((ball_x <= -metric.right_rect_width) && ball_x >= -metric.right_rect_width - metric.hole_width) {
    return true;
  } else {
    return false;
  }
}

function check_hole_left(ball_x, ball_y) {
  let hole_left_segment = {
    x1: -metric.right_rect_width - metric.hole_width,
    y1: metric.hole_height,
    x2: -metric.right_rect_width - metric.hole_width,
    y2: metric.height
  }
  let dist_to_left_segment = distance_to_segment(ball_x, ball_y, hole_left_segment);
  if (dist_to_left_segment <= ball_d / 2) {
    return true;
  } else {
    return false;
  }
}

function check_hole_right(ball_x, ball_y) {
  let hole_right_segment = {
    x1: -metric.right_rect_width,
    y1: metric.hole_height,
    x2: -metric.right_rect_width,
    y2: metric.height
  }
  let dist_to_right_segment = distance_to_segment(ball_x, ball_y, hole_right_segment);
  if (dist_to_right_segment <= ball_d / 2) {
    return true;
  } else {
    return false;
  }
}

function reflect_ball(ball_velocity_x, ball_velocity_y, segment) {
  return None

}

function check_collisions() {

  //ground collision for play_ball
  if (!check_hole_top(ball_x)) {
    if (ground_collision(ball_x, ball_y) && game_state != STATE_ON_CATAPULT) {
      if (game_state == STATE_MOVING_IN_AIR) {
        ball_y = metric.height + ball_d / 2;
        console.log("GROUND COLLISION!", "BOUNCING BALL", ball_velocity_y)
        ball_velocity_y = -ball_velocity_y * ball_bounce;
        ball_velocity_x *= ball_bounce
        num_ball_bounces += 1;
      } else {
        ball_y = metric.height + ball_d / 2;
        ball_velocity_x *= plane_friction;
        ball_velocity_y = 0;
      }
    }
  } else {
    console.log("PLAYBALL IS OVER HOLE");
    if (hole_ground_collision(ball_y)) {
      if (game_state == STATE_MOVING_IN_AIR) {
        console.log("PLAYBALL BALL GROUND COLLISION AT: ", Math.abs(ball_velocity_y))
        ball_velocity_y = -ball_velocity_y * ball_bounce;
        ball_velocity_y += gravity * dt;
        num_ball_bounces += 1;
      } else {
        ball_velocity_x *= plane_friction;
        ball_y = metric.hole_height + ball_d / 2;
        ball_velocity_y = 0;
      }
    }
    if (check_hole_left(ball_x, ball_y)) {
      ball_x = -metric.right_rect_width - metric.hole_width + ball_d / 2;
      ball_velocity_x = -ball_velocity_x * ball_bounce;
    }
    if (check_hole_right(ball_x, ball_y)) {
      ball_x = -metric.right_rect_width - ball_d / 2;
      ball_velocity_x = -ball_velocity_x * ball_bounce;
    }
  }
  //ground collision for red_ball
  if (!check_hole_top(red_ball_x)) {
    if (ground_collision(red_ball_x, red_ball_y)) {
      if (Math.abs(red_ball_velocity_y) >= bounce_velocity_threshold) {
        red_ball_velocity_y += gravity * dt;
        red_ball_y = metric.height + ball_d / 2;
        red_ball_velocity_y = -red_ball_velocity_y * ball_bounce;
      } else {
        red_ball_velocity_x *= plane_friction;
        red_ball_velocity_y = 0;
      }
    }
  } else {
    if (hole_ground_collision(red_ball_y)) {
      if (Math.abs(red_ball_velocity_y) >= bounce_velocity_threshold) {
        console.log("RED BALL GROUND COLLISION AT: ", Math.abs(red_ball_velocity_y))
        red_ball_velocity_y = -red_ball_velocity_y * ball_bounce;
        red_ball_velocity_y += gravity * dt;
        red_ball_velocity_x *= plane_friction;
      } else {
        red_ball_y = metric.hole_height + ball_d / 2;
        red_ball_velocity_y = 0;
      }
    }
    if (check_hole_left(red_ball_x, red_ball_y)) {
      red_ball_x = -metric.right_rect_width - metric.hole_width + ball_d / 2;
      red_ball_velocity_x = -red_ball_velocity_x * ball_bounce;
    }
    if (check_hole_right(red_ball_x, red_ball_y)) {
      red_ball_x = -metric.right_rect_width - red_ball_d / 2;
      red_ball_velocity_x = -red_ball_velocity_x * ball_bounce;
    }
  }

  //wall collision for play_ball
  if (wall_collision(ball_x, ball_y)) {
    ball_x = -metric.right_rect_width - metric.left_rect_width - metric.hole_width + metric.schornstein_width + ball_d;
    ball_velocity_x = -ball_velocity_x * ball_bounce;
  }

  //wall collision for red ball
  if (wall_collision(red_ball_x, red_ball_y)) {
    red_ball_x = -metric.right_rect_width - metric.left_rect_width - metric.hole_width + metric.schornstein_width + ball_d;
    red_ball_velocity_x = -red_ball_velocity_x * ball_bounce;
  }
  //checks which ball is faster to make them collide accordingly
  if (Math.abs(ball_velocity_x) > Math.abs(red_ball_velocity_x)) {
    if (ball_collision(ball_x, ball_y, red_ball_x, red_ball_y)) {
      if (ball_velocity_x < 0) {
        red_ball_x = ball_x - ball_d;
      } else if (ball_velocity_x > 0) {
        red_ball_x = ball_x + ball_d;
      }
      red_ball_velocity_x = ball_velocity_x * 0.6;
      ball_velocity_x *= 0.4;
    }
  } else if (Math.abs(ball_velocity_x) < Math.abs(red_ball_velocity_x)) {
    if (ball_collision(red_ball_x, red_ball_y, ball_x, ball_y)) {
      if (red_ball_velocity_x < 0) {
        ball_x = red_ball_x - ball_d;
      } else if (red_ball_velocity_x > 0) {
        ball_x = red_ball_x + ball_d;
      }
      ball_velocity_x = red_ball_velocity_x * 0.6;
      red_ball_velocity_x *= 0.4;
    }
  }


  /*
  //check if balls collide vertically
  if (ball_collision(ball_x, ball_y, red_ball_x, red_ball_y)) {
    if (ball_y - ball_d > red_ball_y + ball_d) {
      ball_y = red_ball_y + ball_d;
      //ball_velocity_y = -ball_velocity_y * 0.2;
    } else if (red_ball_y - ball_d > ball_velocity_y + ball_d) {
      red_ball_y = ball_y + ball_d;
      //red_ball_velocity_y = -red_ball_velocity_y * 0.2;
    }
  }
  */

  //obstacle collision for play_ball
  if (obstacle_collision_left(ball_x, ball_y)) {
    ball_x = obstacle.x - ball_d / 2;
    ball_velocity_x = -ball_velocity_x;
  }
  if (obstacle_collision_right(ball_x, ball_y)) {
    ball_x = obstacle.x + obstacle.width + ball_d / 2;
    ball_velocity_x = -ball_velocity_x;
  }

  //obstacle collision for red ball
  if (obstacle_collision_left(red_ball_x, red_ball_y)) {
    red_ball_x = obstacle.x - ball_d / 2;
    red_ball_velocity_x = -red_ball_velocity_x;
  }
  if (obstacle_collision_right(red_ball_x, red_ball_y)) {
    red_ball_x = obstacle.x + obstacle.width + ball_d / 2;
    red_ball_velocity_x = -red_ball_velocity_x;
  }

  //triangle_collision for play_ball
  //hier wird nun der normalen-vektor der Reflektion berechnet und dann der Ball dementsprechent
  //reflektiert und der "bounce_factor" mit der Geschwindigkeit verrechnet, so dass der Ball
  //an Geschwindigkeit verliert
  if (triangle_collision(ball_x, ball_y)) {
    segment = {
      x1: triangle_coords.x1,
      y1: triangle_coords.y1,
      x2: triangle_coords.x3,
      y2: triangle_coords.y3
    };

    let edge_vector = createVector(segment.x2 - segment.x1, segment.y2 - segment.y1)
    let orthogonal_edge_vector = createVector(-edge_vector.y, edge_vector.x).normalize();

    let collision_result = triangle_collision(ball_x, ball_y);
    let pen_depth = ball_d / 2 - collision_result.distance

    //ball_x, ball_y, ball_velocity_slope = roll_down_slope(ball_x, ball_y);
    if (pen_depth >= 0) {
      ball_x += orthogonal_edge_vector.x * (pen_depth + 0.01)
      ball_y += orthogonal_edge_vector.y * (pen_depth + 0.01)
    }

    let velocity_vector = createVector(ball_velocity_x, ball_velocity_y)
    let reflected = p5.Vector.sub(velocity_vector, orthogonal_edge_vector.mult(2 * velocity_vector.dot(orthogonal_edge_vector)));

    let angle_velocity = calculate_angle(ball_velocity_x, ball_velocity_y, segment)
    let angle = angle_velocity.angle
    let velocity = angle_velocity.velocity * ball_bounce

    ball_velocity_x = reflected.x * ball_bounce
    ball_velocity_y = reflected.y * ball_bounce


  }
  //triangle_collision for red_ball
  if (triangle_collision(red_ball_x, red_ball_y)) {
    segment = {
      x1: triangle_coords.x1,
      y1: triangle_coords.y1,
      x2: triangle_coords.x3,
      y2: triangle_coords.y3
    };

    let edge_vector = createVector(segment.x2 - segment.x1, segment.y2 - segment.y1)
    let orthogonal_edge_vector = createVector(-edge_vector.y, edge_vector.x).normalize();

    let collision_result = triangle_collision(red_ball_x, red_ball_y);
    let pen_depth = ball_d / 2 - collision_result.distance

    //ball_x, ball_y, ball_velocity_slope = roll_down_slope(ball_x, ball_y);
    if (pen_depth >= 0) {
      ball_x += orthogonal_edge_vector.x * (pen_depth + 0.01)
      ball_y += orthogonal_edge_vector.y * (pen_depth + 0.01)
    }

    let velocity_vector = createVector(red_ball_velocity_x, red_ball_velocity_y)
    let reflected = p5.Vector.sub(velocity_vector, orthogonal_edge_vector.mult(2 * velocity_vector.dot(orthogonal_edge_vector)));

    let angle_velocity = calculate_angle(red_ball_velocity_x, red_ball_velocity_y, segment)
    let angle = angle_velocity.angle
    let velocity = angle_velocity.velocity * ball_bounce

    red_ball_velocity_x = reflected.x * ball_bounce
    red_ball_velocity_y = reflected.y * ball_bounce


  }

}
