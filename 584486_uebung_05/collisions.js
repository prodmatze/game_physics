/* template GTAT2 Game Technology & Interactive Systems */
/* Autor: Mathieu Wassmuth  */
/* Übung Nr.5 */
/* Datum: 12.11.2024 */

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
    return true;
  }
  else {
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

function obstacle_collision(ball_x, ball_y) {
  if ((ball_x <= - metric.right_rect_width / 2 + metric.red_rec_width) && (ball_y <= metric.height + metric.red_rec_height) && (ball_x >= metric.right_rect_width / 2)) {
    return true;
  }
  else {
    return false;
  }
}

function distance_to_segment(ball_x, ball_y) {

  const dx = triangle_coords.x3 - triangle_coords.x1;
  const dy = triangle_coords.y3 - triangle_coords.y1;

  const t = ((ball_x - triangle_coords.x1) * dx + (ball_y - triangle_coords.y1) * dy) / (dx * dx + dy * dy);

  let closestX, closestY;

  if (t < 0) {
    closestX = triangle_coords.x1;
    closestY = triangle_coords.y1;
  } else if (t > 1) {
    closestX = triangle_coords.x3;
    closestY = triangle_coords.y3;
  } else {
    closestX = triangle_coords.x1 + t * dx;
    closestY = triangle_coords.y1 + t * dy;
  }
  return dist(ball_x, ball_y, closestX, closestY);
}

function triangle_collision(ball_x, ball_y) {
  const distance = distance_to_segment(ball_x, ball_y)
  if (distance <= ball_d) {
    console.log("TRIANGLE COLLISION!")
    return true;
  } else {
    return false;
  }
}
