import { NodeSha256Hasher } from 'src/utils/crypto/hash/NodeSha256Hasher';
import { createHash } from 'crypto';

describe('NodeSha256Hasher', () => {
	let hasher: NodeSha256Hasher;

	beforeEach(() => {
		hasher = new NodeSha256Hasher();
	});

	describe('Capability Methods', () => {
		it('should support synchronous hashing', () => {
			expect(hasher.supportsSynchronousHashing()).toBe(true);
		});
	});

	describe('Synchronous Methods', () => {
		describe('sha256Sync()', () => {
			it('should hash string input correctly', () => {
				// Arrange
				const input = 'Hello, World!';

				// Act
				const result = hasher.sha256Sync(input);

				// Assert - Compare with Node.js crypto module directly
				const expected = createHash('sha256').update(input, 'utf8').digest('hex');
				expect(result).toBe(expected);
			});

			it('should hash Uint8Array input correctly', () => {
				// Arrange
				const input = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"

				// Act
				const result = hasher.sha256Sync(input);

				// Assert
				const expected = createHash('sha256').update(Buffer.from(input)).digest('hex');
				expect(result).toBe(expected);
			});

			it('should hash ArrayBuffer input correctly', () => {
				// Arrange
				const input = new ArrayBuffer(5);
				const view = new Uint8Array(input);
				view.set([87, 111, 114, 108, 100]); // "World"

				// Act
				const result = hasher.sha256Sync(input);

				// Assert
				const expected = createHash('sha256').update(Buffer.from(input)).digest('hex');
				expect(result).toBe(expected);
			});

			it('should produce consistent results for same input', () => {
				// Arrange
				const input = 'test-consistency';

				// Act
				const result1 = hasher.sha256Sync(input);
				const result2 = hasher.sha256Sync(input);

				// Assert
				expect(result1).toBe(result2);
			});

			it('should produce different results for different inputs', () => {
				// Arrange
				const input1 = 'test-input-1';
				const input2 = 'test-input-2';

				// Act
				const result1 = hasher.sha256Sync(input1);
				const result2 = hasher.sha256Sync(input2);

				// Assert
				expect(result1).not.toBe(result2);
			});

			it('should handle empty string', () => {
				// Arrange
				const input = '';

				// Act
				const result = hasher.sha256Sync(input);

				// Assert
				const expected = createHash('sha256').update('', 'utf8').digest('hex');
				expect(result).toBe(expected);
			});
		});

		describe('sha256BytesSync()', () => {
			it('should return Uint8Array with correct hash bytes', () => {
				// Arrange
				const input = 'test-bytes';

				// Act
				const result = hasher.sha256BytesSync(input);

				// Assert
				expect(result).toBeInstanceOf(Uint8Array);
				expect(result.length).toBe(32); // SHA-256 produces 32 bytes

				// Compare with Node.js crypto module
				const expected = createHash('sha256').update(input, 'utf8').digest();
				expect(result).toEqual(new Uint8Array(expected));
			});

			it('should handle Uint8Array input', () => {
				// Arrange
				const input = new Uint8Array([1, 2, 3, 4, 5]);

				// Act
				const result = hasher.sha256BytesSync(input);

				// Assert
				expect(result).toBeInstanceOf(Uint8Array);
				expect(result.length).toBe(32);

				const expected = createHash('sha256').update(Buffer.from(input)).digest();
				expect(result).toEqual(new Uint8Array(expected));
			});

			it('should handle ArrayBuffer input', () => {
				// Arrange
				const buffer = new ArrayBuffer(4);
				const view = new Uint8Array(buffer);
				view.set([10, 20, 30, 40]);

				// Act
				const result = hasher.sha256BytesSync(buffer);

				// Assert
				expect(result).toBeInstanceOf(Uint8Array);
				expect(result.length).toBe(32);

				const expected = createHash('sha256').update(Buffer.from(buffer)).digest();
				expect(result).toEqual(new Uint8Array(expected));
			});
		});
	});

	describe('Asynchronous Methods', () => {
		describe('sha256()', () => {
			it('should return same result as synchronous version', async () => {
				// Arrange
				const input = 'async-test';

				// Act
				const asyncResult = await hasher.sha256(input);
				const syncResult = hasher.sha256Sync(input);

				// Assert
				expect(asyncResult).toBe(syncResult);
			});

			it('should handle all input types asynchronously', async () => {
				// Arrange
				const stringInput = 'string-test';
				const uint8Input = new Uint8Array([1, 2, 3]);
				const bufferInput = new ArrayBuffer(2);
				new Uint8Array(bufferInput).set([4, 5]);

				// Act & Assert
				await expect(hasher.sha256(stringInput)).resolves.toBeDefined();
				await expect(hasher.sha256(uint8Input)).resolves.toBeDefined();
				await expect(hasher.sha256(bufferInput)).resolves.toBeDefined();
			});
		});

		describe('sha256Bytes()', () => {
			it('should return same result as synchronous version', async () => {
				// Arrange
				const input = 'async-bytes-test';

				// Act
				const asyncResult = await hasher.sha256Bytes(input);
				const syncResult = hasher.sha256BytesSync(input);

				// Assert
				expect(asyncResult).toEqual(syncResult);
			});
		});
	});

	describe('Real-world Test Vectors', () => {
		it('should match known SHA-256 test vectors', () => {
			// Test vectors from NIST
			const testVectors = [
				{
					input: '',
					expected: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
				},
				{
					input: 'abc',
					expected: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
				},
				{
					input: 'message digest',
					expected: 'f7846f55cf23e14eebeab5b4e1550cad5b509e3348fbc4efa3a1413d393cb650'
				}
			];

			testVectors.forEach(({ input, expected }) => {
				const result = hasher.sha256Sync(input);
				expect(result).toBe(expected);
			});
		});
	});

	describe('Edge Cases', () => {
		it('should handle very long strings', () => {
			// Arrange
			const longString = 'a'.repeat(10000);

			// Act
			const result = hasher.sha256Sync(longString);

			// Assert
			expect(result).toBeDefined();
			expect(result.length).toBe(64); // 32 bytes = 64 hex characters

			// Verify with Node.js crypto
			const expected = createHash('sha256').update(longString, 'utf8').digest('hex');
			expect(result).toBe(expected);
		});

		it('should handle large Uint8Array', () => {
			// Arrange
			const largeArray = new Uint8Array(10000);
			largeArray.fill(42);

			// Act
			const result = hasher.sha256BytesSync(largeArray);

			// Assert
			expect(result).toBeInstanceOf(Uint8Array);
			expect(result.length).toBe(32);

			const expected = createHash('sha256').update(Buffer.from(largeArray)).digest();
			expect(result).toEqual(new Uint8Array(expected));
		});

		it('should handle unicode strings correctly', () => {
			// Arrange
			const unicodeString = '🔒🔑 Unicode test 中文 العربية';

			// Act
			const result = hasher.sha256Sync(unicodeString);

			// Assert
			const expected = createHash('sha256').update(unicodeString, 'utf8').digest('hex');
			expect(result).toBe(expected);
		});
	});

	describe('Performance Characteristics', () => {
		it('should handle repeated operations efficiently', () => {
			// Arrange
			const input = 'performance-test';
			const iterations = 1000;

			// Act
			const startTime = process.hrtime.bigint();
			for (let i = 0; i < iterations; i++) {
				hasher.sha256Sync(input);
			}
			const endTime = process.hrtime.bigint();

			// Assert - Just ensure it completes in reasonable time
			const durationMs = Number(endTime - startTime) / 1000000;
			expect(durationMs).toBeLessThan(5000); // Should complete within 5 seconds
		});
	});
});
