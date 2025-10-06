// src/test/hook/useNote.test.jsx
import { renderHook, act } from '@testing-library/react';
import { useNotes } from '../../hook/useNote';
import '@testing-library/jest-dom';

// Mock complet de useInstanceAxios
jest.mock('../../hook/useInstanceAxios', () => ({
	useInstanceAxios: () => ({
		get: jest.fn(() => Promise.resolve({ data: [] })),
		post: jest.fn(() => Promise.resolve({ data: {} })),
		patch: jest.fn(() => Promise.resolve({ status: 200 })),
		delete: jest.fn(() => Promise.resolve({ status: 200 })),
	}),
}));

describe('useNotes hook', () => {
	test('initial state', () => {
		const { result } = renderHook(() => useNotes());

		expect(result.current.notes).toEqual([]);
		expect(result.current.error).toBeNull();
		expect(result.current.loading).toBe(false);
	});

	test('getNotes updates notes state', async () => {
		const { result } = renderHook(() => useNotes());

		await act(async () => {
			const response = await result.current.getNotes();
			expect(response.data).toEqual([]);
		});

		expect(result.current.notes).toEqual([]);
		expect(result.current.loading).toBe(false);
	});

	test('createNotes calls API and resolves', async () => {
		const { result } = renderHook(() => useNotes());

		await act(async () => {
			const response = await result.current.createNotes({ title: 'Test', content: 'Content' });
			expect(response.data).toEqual({});
		});
	});

	test('updateNotes calls API and resolves', async () => {
		const { result } = renderHook(() => useNotes());

		await act(async () => {
			const response = await result.current.updateNotes({ id: 1, title: 'Test', content: 'Content' });
			expect(response.status).toBe(200);
		});
	});

	test('deleteNote calls API and resolves', async () => {
		const { result } = renderHook(() => useNotes());

		await act(async () => {
			const response = await result.current.deleteNote(1);
			expect(response.status).toBe(200);
		});
	});
});
