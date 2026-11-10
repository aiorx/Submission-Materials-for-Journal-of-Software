```javascript
function setDraftPickOrder(draftPickTable, draftPicks, teamPositions, teamTableId)
{    
    const tradedPicks = [];
    
    // im keeping the old code here because the code for the tied group snaking was Penned via standard programming aids and i dont entirely trust it yet even though it seems to work fine
    /*for(let i = 0; i < draftPicks.length; i++)
    {
        const newTeamBinary = getBinaryReferenceData(teamTableId, teamPositions[i % 32]);
        
        if(!(draftPickTable.records[draftPicks[i]]['CurrentTeam'] === draftPickTable.records[draftPicks[i]]['OriginalTeam']))
        {
            const tradedPick = {
                'OriginalTeam': draftPickTable.records[draftPicks[i]]['OriginalTeam'],
                'CurrentTeam': draftPickTable.records[draftPicks[i]]['CurrentTeam'],
                'Round': draftPickTable.records[draftPicks[i]]['Round']
            }

            tradedPicks.push(tradedPick);
        }
        
        draftPickTable.records[draftPicks[i]]['CurrentTeam'] = newTeamBinary;
        draftPickTable.records[draftPicks[i]]['OriginalTeam'] = newTeamBinary;
        draftPickTable.records[draftPicks[i]]['PickNumber'] = i;
    }

    for(let i = 0; i < tradedPicks.length; i++)
    {
        const searchRound = tradedPicks[i]['Round'];
        const searchOriginalTeam = tradedPicks[i]['OriginalTeam'];
        const newCurrentTeam = tradedPicks[i]['CurrentTeam'];

        for(let j = 0; j < draftPicks.length; j++)
        {
            if(draftPickTable.records[draftPicks[j]]['Round'] === searchRound && draftPickTable.records[draftPicks[j]]['OriginalTeam'] === searchOriginalTeam)
            {
                draftPickTable.records[draftPicks[j]]['CurrentTeam'] = newCurrentTeam;
            }
        }
    }*/
```