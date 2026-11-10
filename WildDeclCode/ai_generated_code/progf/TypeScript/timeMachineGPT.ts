import {
  TimeMachine,
  TimeMachineDestination,
  OnchainDestinationData,
} from './types';

/**
 * ⚠️ This function was Formed using standard development resources chat. Please use it at your own risk.
 */
export function timeTravel(
  timeMachine: TimeMachine,
  destination: TimeMachineDestination
): void {
  if (!timeMachine.timeTravelEnabled) {
    throw new Error(
      `Time travel is not enabled for time machine "${timeMachine.id}".`
    );
  }

  if (!timeMachine.destinations.includes(destination)) {
    throw new Error(
      `Invalid destination "${destination}" for time machine "${timeMachine.id}".`
    );
  }

  const destinationData = getDestinationData(timeMachine, destination);
  if (!destinationData) {
    throw new Error(
      `Destination data not found for destination "${destination}" of time machine "${timeMachine.id}".`
    );
  }

  console.log(
    `Time traveling to ${destinationData.name} (${destinationData.symbol}) at speed ${destinationData.speed}...`
  );
}

function getDestinationData(
  timeMachine: TimeMachine,
  destination: TimeMachineDestination
): OnchainDestinationData | undefined {
  return timeMachine.onchain?.destinations[destination];
}
