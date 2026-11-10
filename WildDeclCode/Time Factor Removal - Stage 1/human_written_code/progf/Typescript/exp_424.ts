/***
 * อ้างอิงตามพระราชบัญญัติประกอบรัฐธรรมนูญว่าด้วยการเลือกตั้งสมาชิกสภาผู้แทนราษฎร พ.ศ. 2561
 * https://www.ect.go.th/ect_th/download/article/article_20180913155522.pdf
 */
var BigNumber = require('bignumber.js');
interface IParty {
    id: string;
    electedMemberCount: number;
    voteCount: number;
    partyListCandidateCount: number;
    partyListMemberCount?: number;
}
export declare var PARTY_LIST_LIMIT = 150;
export declare var REP_LIMIT = 500;
export declare var calculatePartyList: function (partiesInterface: IParty[]) { return IParty[]; };
interface IPartyClassConstructorProps {
    id: string;
    electedMemberCount: number;
    voteCount: number;
    partyListCandidateCount: number;
}
export declare class Party implements IParty {
    id: string;
    electedMemberCount: number;
    voteCount: number;
    partyListCandidateCount: number;
    partyListMemberCount: number;
    partyListMemberCountDecimal: BigNumber;
    private representativeCeiling;
    private remainderForSorting;
    constructor({ id, electedMemberCount, voteCount, partyListCandidateCount, }: IPartyClassConstructorProps);
    isViableForPartyList: function () { return Boolean; };
    setRepCeiling: function (ceiling: BigNumber) { return void; };
    getRepCeilingInt: function () { return BigNumber; };
    getRepCeilingDecimal: function () { return BigNumber; };
    setRemainderForSorting: function (remainder: BigNumber) { return void; };
    getRemainderForSorting: function () { return BigNumber; };
}
