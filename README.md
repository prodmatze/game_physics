# Game Physics Project

> **Author**: Mathieu Wassmuth  
> **Date**: November 4, 2024

## Overview

This repository contains code for my game physics project for the **Advanced Games Physics** course at HTW Berlin. The project is a basic physics-based game, where a slingshot launches a ball to hit a target. This project aims to apply concepts like acceleration, friction, collisions, and scaling within a cartesian coordinate system, all while working with `p5.js`.

## Features

- **State Machine**: Manages game states (start, moving in air, moving on the plane, end).
- **Collision Detection**: Detects collisions with game objects like walls and obstacles.
- **Slingshot Mechanics**: Implements slingshot physics with adjustable angles and launch speeds.
- **Game UI**: Displays score, remaining attempts, and updates on game status.
- **Realistic Physics**:
  - Gravity and bounce effects for projectile motion
  - Friction for movement on the ground
  - Adjustable constants to change physics behavior

## Getting Started

To run this project locally, you need `p5.js`. Clone the repository, then open `index.html` in your browser to start the game.

### Prerequisites

- **p5.js**: [Download and install p5.js](https://p5js.org/download/)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/game_physics.git
2. Open `index.html` in your browser to run the game.

## Usage
- **NEW Button**: Starts a new attempt without resetting the score.
- **RESET Button**: Resets the game and score.

## Code Structure
- `example.js`: Main script handling game setup, states, and primary interactions.
- `collisions.j`: Manages collision detection for the ball, walls, ground, and obstacles.
- `interactivity.js`: Handles mouse controls for the slingshot and launching the ball.
- `addOns.js: Contains`: drawing functions for game elements like rectangles, triangles, and the flag.
