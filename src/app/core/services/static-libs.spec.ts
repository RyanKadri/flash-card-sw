import { join } from "./static-libs";

describe(`Join Craziness`, () => {
    const thingMap = { "1": { thingness: 7 }, "2": { thingness: 8}};
    const hasThings = [{name: "Bob", things: ["1"]}, {name: "Joe", things: ["1","2"]}];
    const hasThing = [{ type: "Apple", thing: "1"}, { type: "Pear", thing: "2"}];
    
    it('Mutliple objects multiple children', () => {
        const multiMulti = join(hasThings, thingMap, "things", "whatever");
        expect(multiMulti.length).toEqual(2); 
        expect(multiMulti[0].whatever.length).toEqual(1);
        expect(multiMulti[0].whatever[0].thingness).toEqual(7);
    });

    it('One object multiple children', () => {
        const singleMulti = join(hasThings[0], thingMap, "things", "blahh");
        expect(singleMulti.blahh[0].thingness).toEqual(7);
    });

    it('Mutliple objects single child', () => {
        const multiSingle = join(hasThing, thingMap, "thing", "myThing");
        multiSingle[0].myThing.thingness;
        
    });

    it('Single object single child', () => {
        const singleSingle = join(hasThing[0], thingMap, "thing", "test");
            singleSingle.test.thingness;
    });
})