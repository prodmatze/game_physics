/* template GTAT2 Game Technology & Interactive Systems */
/* Autor: Mathieu Wassmuth  */
/* Übung Nr.3 */
/* Datum: 27.10.2024 */



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
	vertex(100, 50);
	vertex(100, 200);

	endShape();
}


function drawTriangle(x1, y1, x2, y2, x3, y3, c) {
	fill(c);
	noStroke();
	triangle(x1, y1, x2, y2, x3, y3);
}

function drawFlag(x1, y1, x2, y2, x3, y3, c) {
	fill(c);
	stroke(5);
	triangle(x1, y1, x2, y2, x3, y3);
}

function draw_scene(scale) {
	fill("#0000FF");
	noStroke();
	beginShape();
	vertex(0 + metric.length * scale, 0 + canvasHeight - 10);
	vertex(100, 50);
	vertex(100, 200);

	endShape();
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
