(function () {
	var canvas = document.getElementById('canvas');
	var canvasLeftOffset = canvas.offsetLeft;
	var canvasTopOffset = canvas.offsetTop;
	var ctx = canvas.getContext('2d');
	var circles = [];
	var mouse = {x: null, y: null, EFFECT_RADIUS: 100};

	function Circle(params) {
		var self = this;
		params = params || {};
		self.x = params.x || Math.round(Math.random() * canvas.width);
		self.y = params.y || Math.round(Math.random() * canvas.height);
		self.v = getRandomVelocity();
		self.initRadius = params.radius || 5 + Math.round(Math.random()) * 10;
		self.radius = self.initRadius;
		self.fillColor = params.fillColor || getRandomColor();
		self.strokeColor = params.strokeColor || getRandomColor();
		self.randomMotion = params.randomMotion || false;

		if (self.randomMotion) {
			cyclicChangeVelocityVector();
		}

		function cyclicChangeVelocityVector() {
			self.v = getRandomVelocity();
			setTimeout(cyclicChangeVelocityVector, 200);
		}
	}

	Circle.prototype.move = function () {
		this.x += this.v.x;
		this.y += this.v.y;

		var radiusDiff = 0;
		if (mouse.x !== null && mouse.y !== null) {
			var mouseCircleRadius = Math.sqrt(Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2));
			radiusDiff = mouse.EFFECT_RADIUS - mouseCircleRadius;
		}
		this.radius = this.initRadius + Math.max(0.7 * radiusDiff, 0);

		if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
			this.v.x = -this.v.x;
		}
		if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
			this.v.y = -this.v.y;
		}
	};

	Circle.prototype.draw = function () {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.strokeStyle = this.strokeColor;
		ctx.lineWidth = 1;
		ctx.fillStyle = this.fillColor;
		ctx.fill();
		ctx.stroke();
	};

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		circles.forEach(function (circle) {
			circle.move();
			circle.draw();
		});

		requestAnimationFrame(draw);
	}

	ctx.canvas.addEventListener('click', function (event) {
		var x = event.pageX - canvasLeftOffset,
			y = event.pageY - canvasTopOffset;
		circles.push(new Circle({x: x, y: y, randomMotion: Math.random() > 0.5}));
	});

	ctx.canvas.addEventListener('mousemove', function (event) {
		mouse.x = event.pageX - canvasLeftOffset;
		mouse.y = event.pageY - canvasTopOffset;
	});

	ctx.canvas.addEventListener('mouseout', function () {
		mouse.x = null;
		mouse.y = null;
	});

	requestAnimationFrame(draw);

	function getRandomColor() {
		var colors = ['blue', 'orange', 'black', 'brown', 'yellow', 'magento', 'white', 'red'];
		return colors[Math.floor(Math.random() * colors.length)];
	}

	function getRandomMinusOrPlusUnit() {
		return Math.random() < 0.5 ? -1 : 1;
	}


	function getRandomVelocity() {
		return {
			x: getRandomMinusOrPlusUnit() * Math.round(Math.random() * 2),
			y: getRandomMinusOrPlusUnit() * Math.round(Math.random() * 2)
		}
	}

	for (var i = 0; i < 100; i++) {
		circles.push(new Circle({randomMotion: Math.random() > 0.5}));
	}
})();