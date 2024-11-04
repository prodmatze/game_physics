function mousePressed() {
  console.log("MOUSE PRESSED!")
  let d = dist(mx, my, ball_x, ball_y);
  if (d < ball_d) {
    dragging = true;
  }
  console.log(dragging)
}

function mouseDragged() {
  if (dragging) {
    //distance mouse to slingshot
    let distance = dist(slingshot_center.x, slingshot_center.y, mx, my);

    console.log(distance)

    if (distance > max_radius) {
      distance = max_radius;
    } else if (distance < min_radius) {
      distance = min_radius;
    } else if (distance < max_radius && distance > min_radius) {
      ball_x = mx;
      ball_y = my;

    }
  }
}

function mouseReleased() {
  if (dragging) {
    ball_x = slingshot_center.x;
    ball_y = slingshot_center.y;
  }

  dragging = false;
}
