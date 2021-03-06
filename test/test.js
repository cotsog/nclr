const nclr = require('../index');
const { info, dbg, out, inp, warn, quest, error, succ, log, extend, use } = nclr, { updateTheme } = require('../src/lib');
const stdout = require('test-console').stdout;

const clr = require('colors/safe');
const theme = require('../src/theme');
clr.setTheme(theme);

const text = 'Hello',
  END = '\u001b[39m',
  OUT_END = '\u001b[39m\u001b[22m',
  START = {
    info: '\u001b[36m',
    dbg: '\u001b[90m',
    out: '\u001b[1m\u001b[36m',
    inp: '\u001b[37m',
    warn: '\u001b[33m',
    quest: '\u001b[34m',
    error: '\u001b[31m',
    succ: '\u001b[32m'
  };

test('info', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.info(text)));
  expect(output).toStrictEqual([`${START.info}${text}${END}`]);
  const res = stdout.inspectSync(() => info(text));
  expect(res).toStrictEqual([`${START.info}${text}${END}\n`]);
  expect(info(text)).toBeTruthy();
});

test('dbg', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.dbg(text)));
  expect(output).toStrictEqual([`${START.dbg}${text}${END}`]);
  const res = stdout.inspectSync(() => dbg(text));
  expect(res).toStrictEqual([`${START.dbg}${text}${END}\n`]);
  expect(dbg(text)).toBeTruthy();
});

test('out', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.out(text)));
  expect(output).toStrictEqual([`${START.out}${text}${OUT_END}`]);
  const res = stdout.inspectSync(() => out(text));
  expect(res).toStrictEqual([`${START.out}${text}${OUT_END}\n`]);
  expect(out(text)).toBeTruthy();
});

test('inp', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.inp(text)));
  expect(output).toStrictEqual([`${START.inp}${text}${END}`]);
  const res = stdout.inspectSync(() => inp(text));
  expect(res).toStrictEqual([`${START.inp}${text}${END}\n`]);
  expect(inp(text)).toBeTruthy();
});

test('warn', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.warn(text)));
  expect(output).toStrictEqual([`${START.warn}${text}${END}`]);
  const res = stdout.inspectSync(() => warn(text));
  expect(res).toStrictEqual([`${START.warn}${text}${END}\n`]);
  expect(warn(text)).toBeTruthy();
});

test('quest', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.quest(text)));
  expect(output).toStrictEqual([`${START.quest}${text}${END}`]);
  const res = stdout.inspectSync(() => quest(text));
  expect(res).toStrictEqual([`${START.quest}${text}${END}\n`]);
  expect(quest(text)).toBeTruthy();
});

test('error', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.error(text)));
  expect(output).toStrictEqual([`${START.error}${text}${END}`]);
  const res = stdout.inspectSync(() => error(text));
  expect(res).toStrictEqual([`${START.error}${text}${END}\n`]);
  expect(error(text)).toBeTruthy();
});

test('succ', () => {
  const output = stdout.inspectSync(() => process.stdout.write(clr.succ(text)));
  expect(output).toStrictEqual([`${START.succ}${text}${END}`]);
  const res = stdout.inspectSync(() => succ(text));
  expect(res).toStrictEqual([`${START.succ}${text}${END}\n`]);
  expect(succ(text)).toBeTruthy();
});

test('log', () => {
  const output = stdout.inspectSync(() => log(text));
  expect(output).toStrictEqual([text]);
});

test('extend', () => {
  extend({
    suc: 'magenta'
  });

  nclr.suc(text);
  expect('suc' in nclr).toBeTruthy();
  expect(typeof nclr.suc).toStrictEqual('function');

  const res = stdout.inspectSync(() => nclr.suc(text));
  expect(res).toStrictEqual([`\u001b[35m${text}${END}\n`]);
});

test('Illigal extend', () => {
  const myFx = () => console.log('Muhaha!');
  const ext = () => extend({
    [myFx]: 'red'
  });
  expect(ext).toThrowError(`Invalid extension key "${myFx}"`);
});

test('Dangerous extend', () => {
  const harmless = (evt) => console.log('harmless: This=', this, 'evt=', evt);
  const myFx = (evt) => console.log('myFx: This=', this, 'evt=', evt);
  const ext = () => extend({
    [harmless(this)]: 'green',
    [myFx]: 'red'
  });
  expect(ext).toThrowError('Invalid extension key "undefined"');
});

test('use', () => {
  const result = `${START.info}${text}${END}`;
  const output = stdout.inspectSync(() => process.stdout.write(use('info', text)));
  expect(output).toStrictEqual([result]);
  const res = stdout.inspectSync(() => log(use('info', text)));
  expect(res).toStrictEqual([result]);
  expect(use('info', text)).toStrictEqual(result);
});

test('use failed 1/2', () => {
  let result = `${START.info}${text}${END}`,
    name = 'spec';
  const output = () => stdout.inspectSync(() => process.stdout.write(use(name, text)));
  expect(output).toThrowError(`The name ${name} isn't specified in the theme used`);
  const res = stdout.inspectSync(() => log(use('info', text)));
  expect(res).toStrictEqual([result]);
  expect(use('info', text)).toStrictEqual(result);
});

test('use failed 2/2', () => {
  let result = `${START.info}${text}${END}`,
    name = () => null;
  const output = () => stdout.inspectSync(() => process.stdout.write(use(name, text)));
  expect(output).toThrowError(`Invalid name "${name}"`);
  const res = stdout.inspectSync(() => log(use('info', text)));
  expect(res).toStrictEqual([result]);
  expect(use('info', text)).toStrictEqual(result);
});

test('nested use()', () => {
  let result = `${START.info}${text} ${START.error}Error${START.info}${END}`;
  const output = stdout.inspectSync(() => process.stdout.write(use('info', text, use('error', 'Error'))));
  expect(output).toStrictEqual([result]);
});

test('info and use', () => {
  let result = `${START.info}${text} ${START.error}Error${START.info}${END}`;
  const output = stdout.inspectSync(() => info(text, use('error', 'Error')));
  expect(output).toStrictEqual([`${result}\n`]);
});

test('info and use(use)', () => {
  let result = `${START.info}${text} ${START.warn}My ${START.error}dear${START.warn}${START.info}${END}`;
  const output = stdout.inspectSync(() => info(text, use('warn', 'My', use('error', 'dear'))));
  expect(output).toStrictEqual([`${result}\n`]);
});

test('info and use(`${use}`)', () => {
  let result = `${START.info}${text} ${START.warn}My${START.error}Dear${START.warn}${START.info}${END}`;
  const output = stdout.inspectSync(() => info(text, use('warn', `My${use('error', 'Dear')}`)));
  expect(output).toStrictEqual([`${result}\n`]);
});

test('Simple overriding with extend()...', () => {
  expect('info' in clr).toBeTruthy();
  extend({
    info: 'magenta'
  });
  expect(nclr.info).not.toBe(info);
  expect('info' in clr).toBeTruthy();
  const initialInfo = `${START.info}${text}${END}`,
    overridenInfo = `\u001b[35m${text}${END}`;

  const outInfo = stdout.inspectSync(() => process.stdout.write(clr.info(text)));
  expect(outInfo).not.toStrictEqual([initialInfo]);
  expect(outInfo).toStrictEqual([overridenInfo]);

  const resOut = stdout.inspectSync(() => info(text));
  expect(resOut).toStrictEqual([`${overridenInfo}\n`]); //Override on the destructured scope
  const resIn = stdout.inspectSync(() => nclr.info(text));
  expect(resIn).toStrictEqual([`${overridenInfo}\n`]); //Override on the module's scope
  expect(nclr.info(text)).toBeTruthy();
});

test('Overriding with extend()', () => {
  expect('warn' in clr).toBeTruthy();
  extend({
    warn: ['yellow', 'underline']
  });
  expect(nclr.warn).not.toBe(warn); //Overriden but becomes an anonymous function
  expect('warn' in clr).toBeTruthy();
  const initialWarn = `${START.warn}${text}${END}`,
    overrideWarn = `\u001b[4m${START.warn}${text}${END}\u001b[24m`;

  const outWarn = stdout.inspectSync(() => process.stdout.write(clr.warn(text)));
  expect(outWarn).not.toStrictEqual([initialWarn]);
  expect(outWarn).toStrictEqual([overrideWarn]);

  const resOut = stdout.inspectSync(() => warn(text));
  expect(resOut).toStrictEqual([`${overrideWarn}\n`]); //Override on the destructured scope
  const resIn = stdout.inspectSync(() => nclr.warn(text));
  expect(resIn).toStrictEqual([`${overrideWarn}\n`]); //Override on the module's scope
  expect(nclr.warn(text)).toBeTruthy();
});

test('Extend and use', () => {
  extend({
    cust: 'red'
  });

  expect('cust' in nclr).toBeTruthy();
  const result = `${START.error}${text}${END}`;
  const res = stdout.inspectSync(() => log(use('cust', text)));
  expect(res).toStrictEqual([result]);
  expect(use('cust', text)).toStrictEqual(result);
});