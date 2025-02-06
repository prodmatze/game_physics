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

// Computes the collision time (t) within dt between a moving ball and a segment.
// Returns an object with collision details if a collision occurs within dt, otherwise returns null.
function compute_collision_time(ball_x, ball_y, ball_vx, ball_vy, segment, dt) {
  const r = ball_d / 2;  // ball's radius
  let earliestT = dt + 1; // initialize with a value larger than dt
  let collisionInfo = null; // will hold info about the earliest collision

  // Create vectors for the ball's starting point and velocity
  let p0 = createVector(ball_x, ball_y);
  let v = createVector(ball_vx, ball_vy);

  // Create vectors for the segment endpoints
  let segStart = createVector(segment.x1, segment.y1);
  let segEnd = createVector(segment.x2, segment.y2);
  let edge = p5.Vector.sub(segEnd, segStart);
  let edgeSquaredLength = edge.magSq();

  // 1. Check collision with the infinite line (the flat side of the segment)
  if (edgeSquaredLength !== 0) {  // avoid division by zero for degenerate segments
    // Compute a perpendicular (normal) to the segment.
    // Note: There are two normals; we need the one that the ball is approaching.
    let normal = createVector(-edge.y, edge.x).normalize();

    // Determine the signed distance from the ball's center to the line.
    let diff = p5.Vector.sub(p0, segStart);
    let d0 = diff.dot(normal);
    //let d0 = distance_to_segment(ball_x, ball_y, segment);

    // Compute the rate of change of this distance.
    let dv = v.dot(normal);

    // Only proceed if the ball is moving (dv != 0) and is approaching the line.
    // (If dv is 0, the ball is moving parallel to the line, so no collision with the flat side.)
    if (dv !== 0) {
      // Solve for t such that: d0 + dv * t = r (when approaching the side)
      // (This assumes the ball is coming from the side where the distance is > r.)
      let t_line = (r - d0) / dv;

      // Only consider t_line if it's in the future and within the current dt.
      if (t_line >= 0 && t_line <= dt) {
        // Compute where the ball would be at time t_line.
        let collisionPoint = p5.Vector.add(p0, p5.Vector.mult(v, t_line));

        // Project the collision point onto the segment to see if the collision is with the segment's face.
        let proj = p5.Vector.sub(collisionPoint, segStart).dot(edge) / edgeSquaredLength;
        if (proj >= 0 && proj <= 1) {
          // Valid collision with the flat side of the segment.
          if (t_line < earliestT) {
            earliestT = t_line;
            collisionInfo = {
              t: t_line,
              normal: normal.copy(), // normal at the point of collision
              type: 'line',
              segment: segment
            };
          }
        }
      }
    }
  }

  // 2. Check collision with the endpoints.
  // For each endpoint, we solve the quadratic:
  //   (ball_x + ball_vx * t - ep_x)^2 + (ball_y + ball_vy * t - ep_y)^2 = r^2
  let endpoints = [
    { x: segment.x1, y: segment.y1 },
    { x: segment.x2, y: segment.y2 }
  ];

  // Coefficient A is the squared magnitude of velocity.
  let A = ball_vx * ball_vx + ball_vy * ball_vy;

  endpoints.forEach(function(ep) {
    let dx = ball_x - ep.x;
    let dy = ball_y - ep.y;
    let B = 2 * (ball_vx * dx + ball_vy * dy);
    let C = dx * dx + dy * dy - r * r;

    let discriminant = B * B - 4 * A * C;
    if (discriminant >= 0) { // Real solutions exist.
      let sqrtDisc = Math.sqrt(discriminant);
      // Two possible solutions:
      let t1 = (-B - sqrtDisc) / (2 * A);
      let t2 = (-B + sqrtDisc) / (2 * A);

      // Choose the smallest positive t (collision must happen in the future).
      let t_candidate = null;
      if (t1 >= 0 && t1 <= dt) {
        t_candidate = t1;
      }
      if (t2 >= 0 && t2 <= dt) {
        if (t_candidate === null || t2 < t_candidate) {
          t_candidate = t2;
        }
      }

      // If a candidate collision time is found and it's the earliest so far, update collisionInfo.
      if (t_candidate !== null && t_candidate < earliestT) {
        earliestT = t_candidate;
        // Compute the collision point.
        let collisionPoint = {
          x: ball_x + ball_vx * t_candidate,
          y: ball_y + ball_vy * t_candidate
        };
        // The normal is from the endpoint to the collision point.
        let normalVec = createVector(collisionPoint.x - ep.x, collisionPoint.y - ep.y);
        if (normalVec.mag() !== 0) {
          normalVec.normalize();
        }
        collisionInfo = {
          t: t_candidate,
          normal: normalVec,
          type: 'endpoint',
          segment: segment
        };
      }
    }
  });

  // If we found a collision within the timestep, return the collision details.
  // You might also want to compute penetration here; at t the ball should be just touching, so penetration is ideally 0.
  if (collisionInfo && collisionInfo.t <= dt) {
    // (Optional) compute a small penetration value due to floating-point precision.
    let posAtCollisionX = ball_x + ball_vx * collisionInfo.t;
    let posAtCollisionY = ball_y + ball_vy * collisionInfo.t;
    let currentDist = distance_to_segment(posAtCollisionX, posAtCollisionY, segment);
    collisionInfo.penetration = r - currentDist;
    return collisionInfo;
  } else {
    return null;
  }
}

function reflect_ball(ball_velocity_x, ball_velocity_y, normal) {
  let velocity_vector = createVector(ball_velocity_x, ball_velocity_y);
  //copy to not modify original normal
  let n = normal.copy();
  let dot = velocity_vector.dot(n);
  n.mult(2 * dot);
  let reflected_velocity = p5.Vector.sub(velocity_vector, n);
  return { velocity_x: reflected_velocity.x, velocity_y: reflected_velocity.y };
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
  if ((ball_x <= -metric.right_rect_width) && ball_x >= -metric.right_rect_width - metric.hole_width && ball_y - ball_d / 2 <= metric.height) {
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
    ball_has_bounced = true;
    ball_initial_bounce_velocity = current_bounce_velocity;
  }
  if (current_bounce_velocity <= (ball_initial_bounce_velocity * 0.1 && !check_hole_top(ball_x))) {
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


function check_collisions_in_flight(ball_pos_x, ball_pos_y) {
  for (let segment of segments) {
    let collision = compute_collision_time(ball_pos_x, ball_pos_y, ball_velocity_x, ball_velocity_y, segment, dt);
    if (collision) {

      console.log("Collision Detected with segment: ", segment.name, "at:", segment)
      // Move ball to collision point
      ball_x += ball_velocity_x * collision.t;
      ball_y += ball_velocity_y * collision.t;

      // Reflect velocity
      let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, collision.normal);
      ball_velocity_x = reflection.velocity_x * ball_bounce;
      ball_velocity_y = reflection.velocity_y * ball_bounce;

      // Process remaining time
      let remaining_time = dt - collision.t;
      ball_x += ball_velocity_x * remaining_time;
      ball_y += ball_velocity_y * remaining_time;


      update_game_state(Math.abs(ball_velocity_x * collision.normal.x + ball_velocity_y * collision.normal.y));
      break; // Exit after processing one collision.
    }
  }
}

