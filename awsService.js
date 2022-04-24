const awsIot = require("aws-iot-device-sdk");

const device = awsIot.device({
	keyPath:
		"./awsCerts/abccf2909b099d50db1fd84dedcba88f85d5facf99b9474edb797a1ae0dcddbb-private.pem.key",
	certPath:
		"./awsCerts/abccf2909b099d50db1fd84dedcba88f85d5facf99b9474edb797a1ae0dcddbb-certificate.pem.crt",
	caPath: "./awsCerts/AmazonRootCA1.pem",
	host: "a2ovvg6bmrdolz-ats.iot.us-east-1.amazonaws.com",
	clientId: "iot_practice_semaforo",
	region: "us-east-1",
});

module.exports = { device };
