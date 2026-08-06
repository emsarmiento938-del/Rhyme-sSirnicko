import 'dotenv/config';
import { sequelize } from './models/db.js';
import { User } from './models/userModel.js';

try {
  await sequelize.authenticate();
  console.log('AUTH_OK');
  const result = await User.create({
    name: 'Debug Judge',
    email: 'debugjudge@example.com',
    password: 'x',
    role: 'judge',
    isActive: true
  });
  console.log('CREATED', JSON.stringify(result.toJSON()));
} catch (err) {
  console.error('ERROR', err);
  process.exit(1);
} finally {
  await sequelize.close();
}
