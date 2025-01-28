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

function calculate_angle(ball_velocity_x, ball_velocity_y, segment) {

  let velocity = Math.sqrt(ball_velocity_x * ball_velocity_x + ball_velocity_y * ball_velocity_y);
  let velocity_vector = createVector(ball_velocity_x, ball_velocity_y);
  let segment_vector = createVector(segment.x2 - segment.x1, segment.y2 - segment.y1)

  let angle_velocity_segment = velocity_vector.angleBetween(segment_vector)

  return { angle: degrees(angle_velocity_segment), velocity: velocity }
}

function reflect_ball(ball_velocity_x, ball_velocity_y, segment) {
  let edge_vector = createVector(segment.x2 - segment.x1, segment.y2 - segment.y1)
  let orthogonal_edge_vector = createVector(-edge_vector.y, edge_vector.x).normalize();

  let velocity_vector = createVector(ball_velocity_x, ball_velocity_y)
  let reflected = p5.Vector.sub(velocity_vector, orthogonal_edge_vector.mult(2 * velocity_vector.dot(orthogonal_edge_vector)));



  let reflection = { x: reflected.x * ball_bounce, y: reflected.y * ball_bounce, normal: orthogonal_edge_vector }
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

function ground_collision_left(ball_x, ball_y) {
  let ground_segment_left = {
    x1: -metric.right_rect_width - metric.hole_width - metric.left_rect_width,
    y1: metric.height,
    x2: -metric.right_rect_width - metric.hole_width,
    y2: metric.height
  }
  if (distance_to_segment(ball_x, ball_y, ground_segment_left) <= ball_d / 2) {
    return { collision: true, segment: ground_segment_left }
  }
  else {
    return { collision: false, segment: null };
  }
}

function ground_collision_right(ball_x, ball_y) {
  let ground_segment_right = {
    x1: -metric.right_rect_width,
    y1: metric.height,
    x2: 0,
    y2: metric.height
  }
  if (distance_to_segment(ball_x, ball_y, ground_segment_right) <= ball_d / 2) {
    return { collision: true, segment: ground_segment_right }
  }
  else {
    return { collision: false, segment: null };
  }
}

function ground_collision_hole(ball_x, ball_y) {
  let hole_ground_segment = {
    x1: -metric.right_rect_width,
    y1: metric.hole_height,
    x2: -metric.right_rect_width - metric.hole_width,
    y2: metric.hole_height
  }
  if (distance_to_segment(ball_x, ball_y, hole_ground_segment) <= ball_d / 2) {
    return { collision: true, segment: hole_ground_segment }
  }
  else {
    return { collision: false, segment: null }
  }
}

function hole_collision_left(ball_x, ball_y) {
  let hole_left_segment = {
    x1: -metric.right_rect_width - metric.hole_width,
    y1: metric.hole_height,
    x2: -metric.right_rect_width - metric.hole_width,
    y2: metric.height
  }
  if (distance_to_segment(ball_x, ball_y, hole_left_segment) <= ball_d / 2) {
    return { collision: true, segment: hole_left_segment };
  } else {
    return { collision: false, segment: null };
  }
}

function hole_collision_right(ball_x, ball_y) {
  let hole_right_segment = {
    x1: -metric.right_rect_width,
    y1: metric.hole_height,
    x2: -metric.right_rect_width,
    y2: metric.height
  }
  if (distance_to_segment(ball_x, ball_y, hole_right_segment) <= ball_d / 2) {
    return { collision: true, segment: hole_right_segment };
  } else {
    return { collision: false, segment: null };
  }
}

function obstacle_collision_left(ball_x, ball_y) {
  let obstacle_left_segment = {
    x1: obstacle.x,
    y1: obstacle.y,
    x2: obstacle.x,
    y2: obstacle.y + obstacle.height,
  };
  if (distance_to_segment(ball_x, ball_y, obstacle_left_segment) <= ball_d / 2) {
    return { collision: true, segment: obstacle_left_segment };
  } else {
    return { collision: false, segment: null };
  }
}

function obstacle_collision_right(ball_x, ball_y) {
  let obstacle_right_segment = {
    x1: obstacle.x + obstacle.width,
    y1: obstacle.y,
    x2: obstacle.x + obstacle.width,
    y2: obstacle.y + obstacle.height,
  };
  if (distance_to_segment(ball_x, ball_y, obstacle_right_segment) <= ball_d / 2) {
    return { collision: true, segment: obstacle_right_segment };
  } else {
    return { collision: false, segment: null };
  }
}

function wall_collision(ball_x, ball_y) {
  let wall_segment = {
    x1: -metric.right_rect_width - metric.left_rect_width - metric.hole_width + metric.schornstein_width,
    y1: metric.schornstein_height,
    x2: -metric.right_rect_width - metric.left_rect_width - metric.hole_width + metric.schornstein_width,
    y2: metric.height
  };
  if (distance_to_segment(ball_x, ball_y, wall_segment) <= ball_d / 2) {
    return { collision: true, segment: wall_segment };
  }
  else {
    return { collision: false, segment: null };
  }
}


function triangle_test_collision(ball_x, ball_y) {
  let segment = {
    x1: triangle_coords.x1,
    y1: triangle_coords.y1,
    x2: triangle_coords.x3,
    y2: triangle_coords.y3
  }
  if (distance_to_segment(ball_x, ball_y, segment) <= ball_d / 2) {
    return { collision: true, segment: segment };
  }
  else {
    return { collision: false, segment: null };
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

let slope_dx = triangle_coords.x3 - triangle_coords.x1;
let slope_dy = triangle_coords.y3 - triangle_coords.y1;
let slope_length = Math.sqrt(slope_dx * slope_dx + slope_dy * slope_dy);

let slope_unit_x = slope_dx / slope_length;
let slope_unit_y = slope_dy / slope_length;
let normal_unit_x = -slope_unit_y;
let normal_unit_y = slope_unit_x;

let acceleration_slope = -gravity * slope_unit_y;

function check_hole_top(ball_x) {
  if ((ball_x - ball_d / 2 <= -metric.right_rect_width) && ball_x + ball_d / 2 >= -metric.right_rect_width - metric.hole_width) {
    return true;
  } else {
    return false;
  }
}

function detect_collision(ball_x, ball_y, segment) {
  const distance = distance_to_segment(ball_x, ball_y, segment)

  if (!ball_has_bounced) {
    ball_has_bounced = true
    ball_initial_bounce_velocity = Math.sqrt(ball_velocity_x * ball_velocity_x + ball_velocity_y * ball_velocity_y)
  }
  if (ball_current_velocity <= ball_initial_bounce_velocity * 0.1) {
    //game_state = STATE_MOVING_ON_PLANE;
  }

  num_ball_bounces += 1;
  if (distance <= ball_d / 2) {
    return { collision: true, segment: segment, penetration: ball_d / 2 - distance };
  } else {
    return { collision: false };
  }
}

function check_collisions(ball_x, ball_y) {

  for (let segment of segments) {
    let collision = detect_collision(ball_x, ball_y, segment);
    if (collision.collision) {
      let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, segment);

      ball_x += collision.penetration * reflection.normal.x;
      ball_y += collision.penetration * reflection.normal.y;

      ball_velocity_x = reflection.x;
      ball_velocity_y = reflection.y;
    }
  }

  /*
  let right_ground_collision = ground_collision_right(ball_x, ball_y);
  if (right_ground_collision.collision) {
    let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, right_ground_collision.segment)
    ball_velocity_x = reflection.x
    ball_velocity_y = reflection.y
  }
 
  let left_ground_collision = ground_collision_left(ball_x, ball_y);
  if (left_ground_collision.collision) {
    let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, left_ground_collision.segment)
    ball_velocity_x = reflection.x
    ball_velocity_y = reflection.y
  }
 
  let hole_ground_collision = ground_collision_hole(ball_x, ball_y);
  if (hole_ground_collision.collision) {
    let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, hole_ground_collision.segment)
    ball_velocity_x = reflection.x
    ball_velocity_y = reflection.y
  }
 
  let hole_left_collision = hole_collision_left(ball_x, ball_y);
  if (hole_left_collision.collision) {
    let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, hole_left_collision.segment)
    ball_velocity_x = reflection.x
    ball_velocity_y = reflection.y
  }
 
  let hole_right_collision = hole_collision_right(ball_x, ball_y);
  if (hole_right_collision.collision) {
    let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, hole_right_collision.segment)
    ball_velocity_x = reflection.x
    ball_velocity_y = reflection.y
  }
 
  let obstacle_left_collision = obstacle_collision_left(ball_x, ball_y);
  if (obstacle_left_collision.collision) {
    let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, obstacle_left_collision.segment)
    ball_velocity_x = reflection.x
    ball_velocity_y = reflection.y
  }
 
  let obstacle_right_collision = obstacle_collision_right(ball_x, ball_y);
  if (obstacle_right_collision.collision) {
    let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, obstacle_right_collision.segment)
    ball_velocity_x = reflection.x
    ball_velocity_y = reflection.y
  }
 
  let wall_collision_result = wall_collision(ball_x, ball_y);
  if (wall_collision_result.collision) {
    let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, wall_collision_result.segment)
    ball_velocity_x = reflection.x
    ball_velocity_y = reflection.y
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
*/

}


