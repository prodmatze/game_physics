function generate_segments() {
  let ground_segment_left = {
    x1: -metric.right_rect_width - metric.hole_width - metric.left_rect_width,
    y1: metric.height,
    x2: -metric.right_rect_width - metric.hole_width,
    y2: metric.height
  };

  let ground_segment_right = {
    x1: -metric.right_rect_width,
    y1: metric.height,
    x2: 0,
    y2: metric.height
  };

  let hole_ground_segment = {
    //add ball_d to y because 
    name: "Hole ground segment",
    x2: -metric.right_rect_width,
    y2: metric.hole_height,
    x1: -metric.right_rect_width - metric.hole_width,
    y1: metric.hole_height
  };

  let hole_left_segment = {
    name: "hole_left_segment",
    x1: -metric.right_rect_width - metric.hole_width,
    y1: metric.height,
    x2: -metric.right_rect_width - metric.hole_width,
    y2: metric.hole_height
  };

  let hole_right_segment = {
    name: "hole_right_segment",
    x1: -metric.right_rect_width,
    y1: metric.hole_height,
    x2: -metric.right_rect_width,
    y2: metric.height
  };

  let obstacle_left_segment = {
    name: "Obstacle left segment",
    x1: obstacle.x,
    y1: obstacle.y,
    x2: obstacle.x,
    y2: obstacle.y + obstacle.height,
  };

  let obstacle_right_segment = {
    name: "Obstacle right segment",
    x2: obstacle.x + obstacle.width,
    y2: obstacle.y,
    x1: obstacle.x + obstacle.width,
    y1: obstacle.y + obstacle.height,
  };


  //this messes with edge detection as now the same edge gets counted twice
  // let obstacle_top_segment = {
  //   name: "Obstacle top segment",
  //   x1: obstacle.x,
  //   y1: obstacle.y + obstacle.height,
  //   x2: obstacle.x + obstacle.width,
  //   y2: obstacle.y + obstacle.height,
  // }

  let wall_segment = {
    x1: -metric.right_rect_width - metric.left_rect_width - metric.hole_width + metric.schornstein_width,
    y1: metric.schornstein_height,
    x2: -metric.right_rect_width - metric.left_rect_width - metric.hole_width + metric.schornstein_width,
    y2: metric.height
  };

  let triangle_segment = {
    x1: triangle_coords.x1,
    y1: triangle_coords.y1,
    x2: triangle_coords.x3,
    y2: triangle_coords.y3
  }

  let segments = [ground_segment_left, ground_segment_right, hole_ground_segment, hole_left_segment, hole_right_segment, obstacle_left_segment, obstacle_right_segment, wall_segment, triangle_segment];

  return segments;
}

function get_segments_list() {
  return segments
}

