import { Kafka } from 'kafkajs';
import { EmailAdapter } from './adapter/email';

require("dotenv").config();

const kafka = new Kafka({
  clientId: 'email1',
  brokers: ['localhost:9092'],
  requestTimeout: 500
});

const connect = async () => {
  const consumer = kafka.consumer({ groupId: 'email-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: 'user-created', fromBeginning: true })

  // sales-topic
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message && message.value && topic === 'user-created') {
        const text = `Welcome to the appName\n`
        try{
          const user = JSON.parse(message.value.toString())

          if (user && user.email) {
            new EmailAdapter().send({ to: user.email, subject: 'Welcome', text })
          }
        }catch(err){
          console.log(err);
        }
      }
    },
  })
}

connect()

const topics = [
  { topic: 'sales-topic', partition: 0 }
]