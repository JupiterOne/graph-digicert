import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { StepIds } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test(StepIds.FETCH_USERS, async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: StepIds.FETCH_USERS,
  });

  const stepConfig = buildStepTestConfigForStep(StepIds.FETCH_USERS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
