'use strict';

import Snake from './snake';
import Apple from './apple';
import Scoreboard from './scoreboard';
import * as constant from './constant';

export default class Board {

	constructor(canvasContext) {
		this.context = canvasContext;
		this.snakes = [];
		this.apples = [];
		this.color = [
			"#468966",
			"#fff1a8",
			"#FFB03B",
			"#B64926",
			"#f64804",
			"#3032cd",
			"#CD2C24",
			"#13ad00",
			"#51f1e0",
			"#F2385A"
		];
	}

	newSnake(x, y, name) {
		if(this.snakes.length < 10){
			let snake = new Snake(this.context, x, y, this.getAvailableColor(), name);
			this.scoreboard.addPlayer(snake);
			snake.draw();

			this.snakes.push(snake);

			return snake;
		} else {
			console.error('Error : only 10 snakes can be on the board');
		}
	}

	newApple(x, y) {
		let apple = new Apple(this.context, x, y);

		this.apples.push(apple);

		return apple;
	}

	generateApple(){

		var x = Math.floor(Math.random() * constant.CANVAS_WIDTH/constant.GRID_SIZE) * constant.GRID_SIZE + constant.GRID_SIZE/2;
		var y = Math.floor(Math.random() * constant.CANVAS_HEIGHT/constant.GRID_SIZE) * constant.GRID_SIZE + constant.GRID_SIZE/2;

		return this.newApple(x,y);

	}

	getAvailableColor() {
		let snakeColor = this.snakes.map(function (snake) {
			return snake.color;
		});

		return this.color.find(function (c) {
			if (!snakeColor.includes(c)) {
				return c;
			}
		});
	}

	createScoreboard() {
		this.scoreboard = new Scoreboard();

		this.scoreboard.playersContainer.appendTo('#scoreboard');
	}

	render() {

		setInterval(() => {
			this.snakes.forEach(snake => {
				snake.move(this);
			});
			this.scoreboard.updateScores(this.snakes);
			this.checkSnakeSelfCollision();
		}, constant.DELAY);
	}

	checkSnakeSelfCollision() {

		this.snakes.forEach((snake, i) => {

			let firstBodyPart = snake.bodyParts[0];
			snake.bodyParts.forEach((bodyPart, index) => {
				if (index === 0) {
					return;
				}

				if (firstBodyPart.x < bodyPart.x + bodyPart.width &&
                    firstBodyPart.x + firstBodyPart.width > bodyPart.x &&
                    firstBodyPart.y < bodyPart.y + bodyPart.height &&
                    firstBodyPart.height + firstBodyPart.y > bodyPart.y) {

					this.removeSnakeFromArray(i);
				}
			});
		});
	}

	removeSnakeFromArray(i) {
		this.snakes[i].remove();
		this.scoreboard.removePlayer(this.snakes[i]);
		this.snakes.splice(i, 1);
	}

}