import { describe, it, expect } from 'vitest';
import { evaluateGuess } from './evaluateGuess';

const statuses = (r: ReturnType<typeof evaluateGuess>) => r.map((x) => x.status);

describe('evaluateGuess', () => {
	it('all correct when guess equals target', () => {
		expect(statuses(evaluateGuess('hello', 'hello'))).toEqual([
			'correct',
			'correct',
			'correct',
			'correct',
			'correct',
		]);
	});

	it('all absent when no letters overlap', () => {
		expect(statuses(evaluateGuess('xyzab', 'wkmnp'))).toEqual([
			'absent',
			'absent',
			'absent',
			'absent',
			'absent',
		]);
	});

	it('marks present for correct letter in wrong position', () => {
		// target r a z o r / guess c r a n e
		expect(statuses(evaluateGuess('crane', 'razor'))).toEqual([
			'absent',
			'present',
			'present',
			'absent',
			'absent',
		]);
	});

	it('handles duplicates: greens take priority over yellows', () => {
		// target a p p l e / guess p a p e r
		expect(statuses(evaluateGuess('paper', 'apple'))).toEqual([
			'present',
			'present',
			'correct',
			'present',
			'absent',
		]);
	});

	it('does not double-count a letter that only appears once in target', () => {
		// target h o u s e / guess s h e e p — only one 'e' in target
		expect(statuses(evaluateGuess('sheep', 'house'))).toEqual([
			'present',
			'present',
			'present',
			'absent',
			'absent',
		]);
	});

	it('is case-insensitive', () => {
		expect(statuses(evaluateGuess('HELLO', 'hello'))).toEqual([
			'correct',
			'correct',
			'correct',
			'correct',
			'correct',
		]);
	});

	it('throws when lengths differ', () => {
		expect(() => evaluateGuess('hi', 'hello')).toThrow();
	});
});
