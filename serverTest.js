function generateUuid() {
  return Math.random().toString() +
    Math.random().toString() +
    Math.random().toString();
}

async function main() {
  var url = process.env.CLOUDAMQP_URL || "amqp://localhost";
  var conn = await require('amqplib').connect(url);

  var ch = await conn.createChannel()

  // Publisher
  var q = await ch.assertQueue('', { exclusive: true });
  var correlationId = generateUuid();

  var consumer = await ch.consume(q.queue, function (msg) {
    if (msg.properties.correlationId == correlationId) {
      console.log(msg.content.toString())
      ch.cancel(consumer.consumerTag)
    }
  }, {
    noAck: true
  });

  ch.sendToQueue('tasks', Buffer.from('DAVID'), {
    correlationId: correlationId,
    replyTo: q.queue
  });
}

main()