function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
  var conn = await require('amqplib').connect(url);

  var ch = await conn.createChannel()

  // Consumer
  ch.assertQueue('tasks', { durable: true });
  ch.prefetch(1);

  ch.consume('tasks', async function (msg) {
    await sleep(2000)
    var content = msg.content.toString()
    ch.sendToQueue(msg.properties.replyTo, Buffer.from(content.toLowerCase()), {
      correlationId: msg.properties.correlationId
    })
  }, { noAck: true });
}

main()