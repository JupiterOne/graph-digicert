import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { StepIds } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test.skip(StepIds.FETCH_ORDERS, async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: StepIds.FETCH_ORDERS,
  });

  const stepConfig = buildStepTestConfigForStep(StepIds.FETCH_ORDERS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
