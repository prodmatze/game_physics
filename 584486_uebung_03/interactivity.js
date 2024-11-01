function mousePressed() {
  let d = dist(mouseX, mouseY, ball.x, ball.y);
  if (d < ball.d * M / 2) {
    dragging = true;  // Start dragging if mouse is within the ball
  }
}

function mouseDragged() {
  if (dragging) {
    // Calculate the distance from the catapult center to the mouse
    let dx = mouseX - slingshot_center.x
    let dy = mouseY - slingshot_center.y
    let distance = dist(slingshot_center.x, slingshot_center.y, mouseX, mouseY);

    // Limit the ball's position within the min and max radius
    if (distance > maxRadius) {
      distance = maxRadius;
    } else if (distance < minRadius) {
      distance = minRadius;
    }

    // Set the ball's position within the restricted circular path
    let angle = atan2(dy, dx);
    ballX = slingshot_center.x + cos(angle) * distance;
    ballY = slingshot_center.y + sin(angle) * distance;

    // Update the catapult angle based on the ball's position if needed
  }
}

function mouseReleased() {
  dragging = false;  // Stop dragging when mouse is released
}
