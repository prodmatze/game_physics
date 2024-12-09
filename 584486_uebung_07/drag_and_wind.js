/* template GTAT2 Game Technology & Interactive Systems */
/* Autor: Mathieu Wassmuth  */
/* Übung Nr.7 */
/* Datum: 09.12.2024 */

function calculate_drag(ball_velocity_x, ball_velocity_y, c_w, density_air, ball_mass, cross_section_a) {

  //insgesamtgeschwindigkeit berechnen
  let v = Math.sqrt(ball_velocity_x * ball_velocity_x + ball_velocity_y * ball_velocity_y);

  if (v === 0) {
    return { ax: 0, ay: 0 };
  }

  //reibungskraft berechnen
  let drag_force = 0.5 * c_w * density_air * cross_section_a * v * v;

  //einheitsvektoren entgegengesetzt zur bewegung
  let ball_velocity_x_normal = ball_velocity_x / v;
  let ball_velocity_y_normal = ball_velocity_y / v;

  //reibungskraft für jede richtung
  let drag_force_x = - drag_force * ball_velocity_x_normal;
  let drag_force_y = - drag_force * ball_velocity_y_normal;

  //neue beschleunigung ausrechnen
  let acceleration_x = drag_force_x / ball_mass;
  let acceleration_y = drag_force_y / ball_mass;

  return { ax: acceleration_x, ay: acceleration_y };

}

function get_random_wind_speed(min, max) {
  let wind_speed = (Math.floor(Math.random() * (max - min + 1)) + min)
  return wind_speed;
}

