/* template GTAT2 Game Technology & Interactive Systems */
/* Autor: Mathieu Wassmuth  */
/* Übung Nr.9 */
/* Datum: 25.01.2025 */

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

/*
function calculate_angle(ball_velocity_x, ball_velocity_y, segment) {

  let velocity = Math.sqrt(ball_velocity_x * ball_velocity_x + ball_velocity_y * ball_velocity_y);
  let velocity_vector = createVector(ball_velocity_x, ball_velocity_y);
  let segment_vector = createVector(segment.x2 - segment.x1, segment.y2 - segment.y1)

  let angle_velocity_segment = velocity_vector.angleBetween(segment_vector)

  return { angle: degrees(angle_velocity_segment), velocity: velocity }
}
*/

function reflect_ball(ball_velocity_x, ball_velocity_y, segment) {
  let edge_vector = createVector(segment.x2 - segment.x1, segment.y2 - segment.y1)
  let orthogonal_edge_vector = createVector(-edge_vector.y, edge_vector.x).normalize();

  let velocity_vector = createVector(ball_velocity_x, ball_velocity_y)
  let reflected = p5.Vector.sub(velocity_vector, orthogonal_edge_vector.mult(2 * velocity_vector.dot(orthogonal_edge_vector)));

  let reflection = { x: reflected.x, y: reflected.y, normal: orthogonal_edge_vector }
  return reflection
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
  if ((ball_x - ball_d / 2 <= -metric.right_rect_width) && ball_x + ball_d / 2 >= -metric.right_rect_width - metric.hole_width) {
    return true;
  } else {
    return false;
  }
}

function detect_collision(ball_x, ball_y, segment) {
  const distance = distance_to_segment(ball_x, ball_y, segment)
  if (distance <= ball_d / 2) {
    return { collision: true, segment: segment, penetration: ball_d / 2 - distance };
  } else {
    return { collision: false };
  }
}

function update_game_state(current_bounce_velocity) {
  if (!ball_has_bounced) {
    ball_has_bounced = true
    if (ball_current_velocity <= 3) {
      ball_initial_bounce_velocity = 3;
    } else {
      ball_initial_bounce_velocity = ball_current_velocity;
    }
  }
  if (current_bounce_velocity <= (ball_initial_bounce_velocity * 0.1)) {
    game_state = STATE_MOVING_ON_PLANE;
  }
}

function get_current_velocity(ball_velocity_x, ball_velocity_y) {
  let current_velocity = Math.sqrt(ball_velocity_x ** 2 + ball_velocity_y ** 2);
  return current_velocity;
}

function update_velocity(ball_velocity_x, ball_velocity_y) {
  let current_velocity = get_current_velocity(ball_velocity_x, ball_velocity_y)
  if (ball_velocity_x < 0) {
    ball_velocity_x = -current_velocity;
  } else {
    ball_velocity_x = current_velocity;
  }
  return { x: ball_velocity_x, y: 0 }
}



function check_collisions_in_flight(ball_x, ball_y) {

  for (let segment of segments) {
    let collision = detect_collision(ball_x, ball_y, segment);
    if (collision.collision) {
      let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, segment);
      let current_bounce_velocity = get_current_velocity(ball_velocity_x, ball_velocity_y)

      ball_x += collision.penetration * reflection.normal.x;
      ball_y += collision.penetration * reflection.normal.y;
      ball_velocity_x = reflection.x * ball_bounce;
      ball_velocity_y = reflection.y * ball_bounce;
      update_game_state(current_bounce_velocity);
      break;
    }
  }
}
function check_collisions_on_plane(ball_x, ball_y) {


  for (let segment of segments) {
    console.log("SEGMENTS:", segments)
    console.log("CURRENT SEGMENT BEING CHECKED:", segment)
    let collision = detect_collision(ball_x, ball_y, segment);
    if (collision.collision) {
      ball_velocity_y = 0;
      let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, segment);

      ball_x += collision.penetration * reflection.normal.x;
      ball_y += collision.penetration * reflection.normal.y;

      ball_velocity_x = reflection.x;
      ball_velocity_y = reflection.y;
      break;
    } else {
      ball_velocity_y -= gravity * dt;
    }
  }
}
/*
//triangle_collision for play_ball
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
 
 
  */



