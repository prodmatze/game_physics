/* template GTAT2 Game Technology & Interactive Systems */
/* Autor: Mathieu Wassmuth  */
/* Übung Nr.8 */
/* Datum: 09.01.2025 */

/* draw red rectangle */
function drawRedRectangle(x, y, w, h, c) {
	fill(c);
	rectMode(CORNER);
	rect(x, y, w, h);
}

function drawRectangle(x, y, w, h, c) {
	fill(c);
	noStroke();
	rectMode(CORNER);
	rect(x, y, w, h);
}

function draw_flagpole() {
	fill("#0000FF");
	noStroke();
	beginShape();
	vertex(0 + metric.length * scale, 0 + canvasHeight - 10);
	vertex(1, 0.5);
	vertex(1, 2);

	endShape();
}

function drawTriangle(x1, y1, x2, y2, x3, y3, c) {
	fill(c);
	noStroke();
	triangle(x1, y1, x2, y2, x3, y3);
}

function drawFlag(x1, y1, x2, y2, x3, y3, c, s) {
	fill(c);
	strokeWeight(0.01);
	stroke(1);
	triangle(x1, y1, x2, y2, x3, y3);
}


function draw_circle(x, y, d, c) {
	fill(c);
	noStroke();
	circle(x, y, d);
}

function scale_canvas(canvas_width, canvas_height, scale_factor) {
	const new_canvas_width = canvas_width / scale_factor;
	const new_canvas_height = canvas_height / scale_factor;

	return new_canvas_width, new_canvas_height;
}

let obstacle = {
	x: - metric.right_rect_width / 2,
	y: metric.height,
	height: 1,
	width: 0.15,
}

function reposition_obstacle(obstacle_at_start) {
	if (obstacle_at_start) {
		obstacle.x = - 7.7;
	} else {
		obstacle.x = -metric.right_rect_width / 2;
	}
}

function draw_scene(wind_speed) {


	let wind_speed_map = map(wind_speed, -25, 25, -1, 1);
	//right rect
	drawRectangle(-metric.right_rect_width, 0, metric.right_rect_width, metric.height, '#0000ff');

	//left rect
	drawRectangle(-metric.right_rect_width - metric.left_rect_width - metric.hole_width, 0, metric.left_rect_width, metric.height, '#0000ff');

	//hole rec
	drawRectangle(-metric.right_rect_width - metric.hole_width, 0, metric.hole_width, metric.hole_height, "#0000ff");

	//schortstein
	drawRectangle(-metric.right_rect_width - metric.left_rect_width - metric.hole_width, 0, metric.schornstein_width, metric.schornstein_height, "#0000ff");

	//red obstacle
	drawRectangle(obstacle.x, obstacle.y, obstacle.width, obstacle.height, "#ff0000");

	//blue triangle
	drawTriangle(triangle_coords.x1, triangle_coords.y1, triangle_coords.x2, triangle_coords.y2, triangle_coords.x3, triangle_coords.y3, "#0000ff");

	//flagpole
	drawRectangle(flag_pole_coords.x1, flag_pole_coords.y1, metric.flagpole_width, metric.flagpole_height, "#000000");
	//flag
	drawFlag(flag_coords.x1, flag_coords.y1, flag_coords.x2, flag_coords.y2, flag_coords.x2 - wind_speed_map, flag_coords.y3, ("#00ffff"), 1);

	//slingshot
	drawTriangle(slingshot.x1, slingshot.y1, slingshot.x2, slingshot.y2, slingshot.x3, slingshot.y3, "#00ff00");

	//red ball
	draw_circle(red_ball_x, red_ball_y, red_ball_d, "#ff0000");

	//playball
	draw_circle(ball_x, ball_y, ball_d, "#0000ff");
}
