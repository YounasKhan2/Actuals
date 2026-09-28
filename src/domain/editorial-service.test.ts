import {describe,expect,it} from "vitest";
import {assertCanCorroborateFinding,canCorroborateFinding,nextRevisionNumber,prepareEvidence,preparePublish} from "./editorial-service";
const rev={id:"rev-2",articleId:"a1",revisionNumber:2,title:"Revision two"};
describe("editorial invariants",()=>{
it("increments revisions",()=>expect(nextRevisionNumber([{...rev,id:"r1",revisionNumber:1},rev])).toBe(3));
it("publishes exact reviewed revision",()=>expect(preparePublish("review",rev).publishedRevisionId).toBe("rev-2"));
it("prevents bypassing review",()=>expect(()=>preparePublish("draft",rev)).toThrow(/Invalid article transition/));
it("requires a revision",()=>expect(()=>preparePublish("review",undefined)).toThrow(/concrete revision/));
it("deduplicates evidence metadata",()=>{const r=prepareEvidence({kind:"user_experience",sourceId:"9b9977d6-dc1e-40f2-a9fd-95e403bce2ad",publicParaphrase:"Report",productIds:["3a4991e2-2b1a-4c95-b22e-b6ca03d85b4f","3a4991e2-2b1a-4c95-b22e-b6ca03d85b4f"],themes:["pricing"," pricing "],experienceType:"first_hand",environment:"production"});expect(r.productIds).toHaveLength(1);expect(r.themes).toEqual(["pricing"])});
it("rejects experience metadata on claims",()=>expect(()=>prepareEvidence({kind:"vendor_claim",sourceId:"9b9977d6-dc1e-40f2-a9fd-95e403bce2ad",publicParaphrase:"Claim",productIds:["3a4991e2-2b1a-4c95-b22e-b6ca03d85b4f"],themes:[],environment:"production"})).toThrow(/Experience metadata/));
it("needs two independent retained sources",()=>{const one=[{evidenceId:"e1",sourceId:"s1",relationship:"supports" as const,status:"retained" as const},{evidenceId:"e2",sourceId:"s1",relationship:"supports" as const,status:"retained" as const}];expect(canCorroborateFinding(one)).toBe(false);expect(()=>assertCanCorroborateFinding(one)).toThrow();expect(canCorroborateFinding([...one,{evidenceId:"e3",sourceId:"s2",relationship:"supports",status:"retained"}])).toBe(true)});
});
