const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const requireDir = require("require-dir");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const awsService = require("../awsService");

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

requireDir("./models");

const Crossing = mongoose.model("crossing");

let currentLight = "GREEN";
let timer = null;

app.use(express.json());
app.use(cors());

mongoose.connect(
	"mongodb+srv://admin:admin@cluster0.nl6lm.mongodb.net/prueba2?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useCreateIndex: true,
	}
);

const public = path.join(__dirname, "../public");
app.use(express.static(public));

app.get("/", (req, res) => {
	res.sendFile(`${public}/index.html`);
});

app.get("/api/semaphores/stop", (req, res) => {
	if (currentLight == "RED" || currentLight == "YELLOW") {
		return res.status(200).json({
			status: false,
			message: "Semaphore current stop",
		});
	}

	if (currentLight == "GREEN") {
		console.log(currentLight);
		if (timer) {
			clearTimeout(timer);
		}
		awsService.device.publish(
			"semaphore",
			JSON.stringify({
				light: "YELLOW",
			})
		);

		timer = setTimeout(() => {
			awsService.device.publish(
				"semaphore",
				JSON.stringify({
					light: "RED",
				})
			);
		}, 5000);
	}

	return res.status(200).json({
		status: true,
		message: "Semaphore change to red",
	});
});

server.listen(port, function () {
	console.log(`Listening on port ${port}...`);
});

io.on("connection", (socket) => {
	io.emit("updateSemaphore", `{"light":"${currentLight}"}`);
	updateData();
	socket.on("stop", () => {
		console.log("stop");
		if (currentLight == "RED" || currentLight == "YELLOW") {
			console.log("Semaphore current stop");
			return;
		}

		if (currentLight == "GREEN") {
			console.log(currentLight);
			if (timer) {
				clearTimeout(timer);
			}
			awsService.device.publish(
				"semaphore",
				JSON.stringify({
					light: "YELLOW",
				})
			);

			timer = setTimeout(() => {
				awsService.device.publish(
					"semaphore",
					JSON.stringify({
						light: "RED",
					})
				);
				saveCrossing();
			}, 5000);
		}
	});
});

awsService.device.on("connect", function () {
	console.log("connect");
	awsService.device.subscribe("semaphore");
	awsService.device.publish(
		"semaphore",
		JSON.stringify({
			light: "GREEN",
		})
	);
});
awsService.device.on("close", function () {
	console.log("close");
});
awsService.device.on("reconnect", function () {
	console.log("reconnect");
});
awsService.device.on("offline", function () {
	console.log("offline");
});
awsService.device.on("error", function (error) {
	console.log("error", error);
});
awsService.device.on("message", function (topic, payload) {
	console.log("message", topic, payload.toString());
	currentLight = JSON.parse(payload.toString()).light;
	app.set("currentLight", currentLight);
	io.emit("updateSemaphore", payload.toString());
	semaphoreLogic();
});

function semaphoreLogic() {
	if (currentLight == "RED") {
		timer = setTimeout(() => {
			awsService.device.publish(
				"semaphore",
				JSON.stringify({
					light: "GREEN",
				})
			);
		}, 10000);
	}

	if (currentLight == "GREEN") {
		timer = setTimeout(() => {
			awsService.device.publish(
				"semaphore",
				JSON.stringify({
					light: "YELLOW",
				})
			);

			timer = setTimeout(() => {
				awsService.device.publish(
					"semaphore",
					JSON.stringify({
						light: "RED",
					})
				);
			}, 5000);
		}, 20000);
	}
}

function saveCrossing() {
	const crossing = Crossing.create({
		steps: "10",
		location:
			Math.floor(Math.random() * 255) +
			1 +
			"." +
			Math.floor(Math.random() * 255) +
			"." +
			Math.floor(Math.random() * 255) +
			"." +
			Math.floor(Math.random() * 255),
	}).then((d) => {
		updateData();
	});
}

function updateData() {
	Crossing.find().then((res) => {
		var totalM = res.length;
		var totalP = res.length * 10;
		var data = {
			totalM: totalM,
			totalP: totalP,
			data: res,
		};

		io.emit("updateData", data);
	});
}
