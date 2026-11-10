```typescript
import { runCommand } from '../../../../lib/sfdx';
import { ensureArray, ensureString, get } from '@salesforce/ts-types';

async function getLatestApexLog(orgUsername: string): Promise<string> {
  const apexLogLists = ensureArray((await runCommand(`sfdx force:apex:log:list -u ${orgUsername}`)).result);
  const logId = ensureString(get(apexLogLists[apexLogLists.length - 1], 'Id'));
  const apexLog = await runCommand(`sfdx force:apex:log:get -i ${logId} -u ${orgUsername}`);
  return ensureString(apexLog.result);
}
```