import { Kafka } from 'kafkajs';
import { EmailAdapter } from './adapter/email';
import logger from '../lib/log';

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
        let user;

        try{
          user = JSON.parse(message.value.toString())
        }catch(err){
          logger.error('Cannot parse message');
        }

        if (user && user.email) {
          const { email } = user;

          await new EmailAdapter().send({ to: email, subject: 'Welcome', text })
            .then((value) => {
              return logger.info(`send mail to ${email}`,)
            })
            .catch((err) => {
              return logger.error(`failed to send mail to ${email}`)
            })
        }
      }
    },
  })
}

connect()

const topics = [
  { topic: 'sales-topic', partition: 0 }
]