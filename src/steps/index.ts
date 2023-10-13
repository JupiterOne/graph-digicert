import { accountSteps } from './account';
import { ordersSteps } from './orders';
import { usersSteps } from './users';

const integrationSteps = [...accountSteps, ...usersSteps, ...ordersSteps];

export { integrationSteps };
