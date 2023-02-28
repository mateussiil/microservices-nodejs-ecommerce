import { Kafka, ProducerConfig } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'producer1',
  brokers: ['localhost:9092'],
  requestTimeout:500
});

const MyPartitioner = () => {
  return () => {
    return 0
  }
}

const run  = async () =>{
  const producerConfig: ProducerConfig = {
    createPartitioner: MyPartitioner
  }

  const producer = kafka.producer(producerConfig)

  await producer.connect()

  setInterval(async () => {
    await producer.send({
      topic: 'sales-topic',
      messages: [
        { value: 'Hello KafkaJS user!' },
      ],
    })
  }, 3000);
}

run()