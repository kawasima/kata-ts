import LineParser from '../src/LineParser';

const lineParser = new LineParser();

test('Strike All', () => {
    const line = lineParser.readFromString("X X X X X X X X X X X X");
    expect(line.getScore()).toBe(300);
})

test('Spare All', () => {
    const line = lineParser.readFromString("5 / 5 / 5 / 5 / 5 / 5 / 5 / 5 / 5 / 5 / 5");
    expect(line.getScore()).toBe(150);
})

test('Gutter All', () => {
    const line = lineParser.readFromString("- - - - - - - - - - - - - - - - - - - -");
    expect(line.getScore()).toBe(0);
})
