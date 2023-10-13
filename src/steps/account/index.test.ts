import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { StepIds } from '../constants';

let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test(StepIds.FETCH_ACCOUNT, async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: StepIds.FETCH_ACCOUNT,
  });

  const stepConfig = buildStepTestConfigForStep(StepIds.FETCH_ACCOUNT);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
