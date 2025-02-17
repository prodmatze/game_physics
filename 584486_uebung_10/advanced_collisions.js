/* template GTAT2 Game Technology & Interactive Systems */
/* Autor: Mathieu Wassmuth  */
/* Übung Nr.10 */
/* Datum: 14.02.2025 */

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

//get collision_time within current time frame
//returns collision details if collision occurs, otherwise return null
function compute_collision_time(ball_x, ball_y, ball_vx, ball_vy, segment, dt) {
  const r = ball_d / 2;
  let earliest_t = dt + 1; //needs to be initialied bigger than dt
  let collision_info = null; //return object

  //get vectors for starting pos and velocity
  let p0 = createVector(ball_x, ball_y);
  let v = createVector(ball_vx, ball_vy);

  //get vectors for endpoints
  let segStart = createVector(segment.x1, segment.y1);
  let segEnd = createVector(segment.x2, segment.y2);
  let edge = p5.Vector.sub(segEnd, segStart);
  let edgeSquaredLength = edge.magSq();

  //1. check collisions on infinite segment
  if (edgeSquaredLength !== 0) {  //sometimes segments get fcked up, so making sure here to not divide by 0
    //get normal for the segment 
    let normal = createVector(-edge.y, edge.x).normalize();

    //get distance from ball to segment
    let diff = p5.Vector.sub(p0, segStart);
    let d0 = diff.dot(normal);

    //delta V
    let dv = v.dot(normal);

    //check if ball is moving parallel to segment (implemented small tolerance value because of floating point precission)
    if (Math.abs(dv) > 0.0001) { //again for tolerance

      //get time of impact
      let t_line = (r - d0) / dv;

      //only continue of t_line is in future and within dt (current timestep)
      if (t_line >= 0 && t_line <= dt) {
        //get point of collsion (going out from t_line)
        let collision_point = p5.Vector.add(p0, p5.Vector.mult(v, t_line));

        //project collision_point onto segment to see if collision is with segments face
        let proj = p5.Vector.sub(collision_point, segStart).dot(edge) / edgeSquaredLength;
        let epsilon = 0.01;
        if (proj >= -epsilon && proj <= 1 + epsilon) {

          //if t_line < earliest_t we have a valid collision
          if (t_line < earliest_t) {
            earliest_t = t_line;
            collision_info = {
              t: t_line,
              normal: normal.copy(), //collision normal
              type: 'line',
              segment: segment
            };
          }
        }
      }
    }
  }

  // 2. check collision with edges
  //solve quadratic for each endpoint:
  //(ball_x + ball_vx * t - ep_x)^2 + (ball_y + ball_vy * t - ep_y)^2 = r^2
  let endpoints = [
    { x: segment.x1, y: segment.y1 },
    { x: segment.x2, y: segment.y2 }
  ];

  //A is squared magnitude of vel
  let A = ball_vx * ball_vx + ball_vy * ball_vy;

  endpoints.forEach(function(ep) {
    let dx = ball_x - ep.x;
    let dy = ball_y - ep.y;
    let B = 2 * (ball_vx * dx + ball_vy * dy);
    let epsilon = 0.001; //small tolerance for floating point precision 
    let C = dx * dx + dy * dy - (r + epsilon) * (r + epsilon);

    let discriminant = B * B - 4 * A * C;
    if (discriminant >= 0) { //if discriminant >= 0, solution exists
      let sqrtDisc = Math.sqrt(discriminant);
      //two solutions:
      let t1 = (-B - sqrtDisc) / (2 * A);
      let t2 = (-B + sqrtDisc) / (2 * A);

      //get smallest positive t 
      let t_candidate = null;
      if (t1 >= 0 && t1 <= dt) {
        t_candidate = t1;
      }
      if (t2 >= 0 && t2 <= dt) {
        if (t_candidate === null || t2 < t_candidate) {
          t_candidate = t2;
        }
      }

      //update earliest_t
      if (t_candidate !== null && t_candidate >= 0 && t_candidate <= dt) {
        earliest_t = t_candidate;
        //get collision point
        let collision_point = {
          x: ball_x + ball_vx * t_candidate,
          y: ball_y + ball_vy * t_candidate
        };
        //normal is from endpoint to collision point
        let normal_vec = createVector(collision_point.x - ep.x, collision_point.y - ep.y);
        if (normal_vec.mag() !== 0) {
          normal_vec.normalize();
        }
        collision_info = {
          t: t_candidate,
          normal: normal_vec,
          type: 'endpoint',
          segment: segment
        };
      }
    }
  });

  //get possible penetration here
  if (collision_info && collision_info.t <= dt) {
    let pos_at_collision_x = ball_x + ball_vx * collision_info.t;
    let pos_at_collision_y = ball_y + ball_vy * collision_info.t;
    let current_dist = distance_to_segment(pos_at_collision_x, pos_at_collision_y, segment);
    collision_info.penetration = Math.abs(r - current_dist);
    return collision_info;
  }
  //if no collision found, compute fallback
  let final_pos = createVector(ball_x + ball_vx * dt, ball_y + ball_vy * dt);
  let closest_point = closest_point_on_segment(final_pos, segment);
  let fallback_normal = p5.Vector.sub(final_pos, closest_point);

  if (fallback_normal.magSq() !== 0) {
    fallback_normal.normalize();
  } else {
    fallback_normal = createVector(0, -1);
  }

  let fallback_dist = p5.Vector.dist(final_pos, closest_point);

  //if ball is inside segment, trigger correction
  let ground_threshold = r * 0.01; //allow small threshold for floating point precisssion
  if (fallback_dist < ball_d / 2 - ground_threshold) {
    return {
      t: dt, //entire timestep
      normal: fallback_normal,
      type: 'fallback',
      segment: segment
    };
  }
  return null
}


function closest_point_on_segment(point, segment) {
  let segStart = createVector(segment.x1, segment.y1);
  let segEnd = createVector(segment.x2, segment.y2);
  let edge = p5.Vector.sub(segEnd, segStart);
  let edgeLengthSq = edge.magSq();

  if (edgeLengthSq === 0) return segStart; //no 0 divisiion

  //project point on line
  let t = p5.Vector.sub(point, segStart).dot(edge) / edgeLengthSq;
  t = Math.max(0, Math.min(1, t)); //between 0-1 to stay on segment

  return p5.Vector.add(segStart, p5.Vector.mult(edge, t)); //closest point on segment
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


function detect_collision(ball_x, ball_y, segment) {
  const distance = distance_to_segment(ball_x, ball_y, segment)
  if (distance <= ball_d / 2) {
    return { collision: true, segment: segment, penetration: ball_d / 2 - distance };
  } else {
    return { collision: false };
  }
}

function update_game_state(current_bounce_velocity) {
  console.log("UPDTATE GAME STATE WAS CALLED!");
  if (!ball_has_bounced) {
    ball_has_bounced = true;
    ball_initial_bounce_velocity = current_bounce_velocity;
  }
  if ((current_bounce_velocity <= ball_initial_bounce_velocity * 0.1) && !check_hole_top(ball_x) && !in_triangle_range(ball_x)) {
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

      let current_bounce_velocity = Math.abs(ball_velocity_x * collision.normal.x + ball_velocity_y * collision.normal.y)

      update_game_state(current_bounce_velocity);

      if (collision.type == 'endpoint' && ball_current_velocity > 5) {
        console.log("Detected collision with ENDPOINT!! AT: ", collision.segment)

        //move to point of collision
        ball_x += ball_velocity_x * collision.t;
        ball_y += ball_velocity_y * collision.t;

        //reflect velocity
        let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, collision.normal);
        ball_velocity_x = reflection.velocity_x * ball_bounce;
        ball_velocity_y = reflection.velocity_y * ball_bounce;

        // //process remaining time
        let remaining_time = dt - collision.t;
        ball_x += ball_velocity_x * remaining_time;
        ball_y += ball_velocity_y * remaining_time;
      }
      // //move to point of collision
      // ball_x += ball_velocity_x * collision.t;
      // ball_y += ball_velocity_y * collision.t;
      //
      // if (collision.penetration) {
      //   ball_x -= collision.normal.x * collision.penetration;
      //   ball_y -= collision.normal.y * collision.penetration;
      // }
      //
      // //reflect velocity
      // let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, collision.normal);
      // ball_velocity_x = reflection.velocity_x * ball_bounce;
      // ball_velocity_y = reflection.velocity_y * ball_bounce;
      //
      // //process remaining time
      // let remaining_time = dt - collision.t;
      // ball_x += ball_velocity_x * remaining_time;
      // ball_y += ball_velocity_y * remaining_time;
      //


      break; //exit after one collision
    }
  }
}

function check_collisions_in_flight_old(ball_pos_x, ball_pos_y) {
  for (let segment of segments) {
    let collision = compute_collision_time(ball_pos_x, ball_pos_y, ball_velocity_x, ball_velocity_y, segment, dt);
    if (collision) {

      console.log("Collision Detected with segment: ", segment.name, "at:", segment, "ball x: ", ball_x, "ball y: ", ball_y)
      //move to point of collision
      ball_x += ball_velocity_x * collision.t;
      ball_y += ball_velocity_y * collision.t;

      if (collision.penetration) {
        ball_x -= collision.normal.x * collision.penetration;
        ball_y -= collision.normal.y * collision.penetration;
      }

      //reflect velocity
      let reflection = reflect_ball(ball_velocity_x, ball_velocity_y, collision.normal);
      ball_velocity_x = reflection.velocity_x * ball_bounce;
      ball_velocity_y = reflection.velocity_y * ball_bounce;

      //process remaining time
      let remaining_time = dt - collision.t;
      ball_x += ball_velocity_x * remaining_time;
      ball_y += ball_velocity_y * remaining_time;

      update_game_state(Math.abs(ball_velocity_x * collision.normal.x + ball_velocity_y * collision.normal.y));

      break; //exit after one collision
    }
  }
}

