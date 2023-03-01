import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'consumer1',
  brokers: ['localhost:9092'],
  requestTimeout: 500
});


const connect = async () => {
  const consumer = kafka.consumer({ groupId: 'test-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'user-created', fromBeginning: true })
  
  // sales-topic
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message && message.value){
        console.log({
          value: message.value.toString(),
        })
      }
    },
  })

  // sales-topic
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message && message.value) {
        console.log({
          value: message.value.toString(),
        })
      }
    },
  })
}

connect()

const topics = [
  { topic: 'sales-topic', partition: 0 }
]