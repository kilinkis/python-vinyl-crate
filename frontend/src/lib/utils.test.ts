import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names correctly when standard string classes are provided', () => {
    // Arrange
    const classA = 'px-4';
    const classB = 'py-2';
    const classC = 'bg-amber-500';
    const expected = 'px-4 py-2 bg-amber-500';

    // Act
    const result = cn(classA, classB, classC);

    // Assert
    expect(result).toBe(expected);
  });

  it('should handle conditional class names when truthy and falsy values are passed', () => {
    // Arrange
    const isPrimary = true;
    const isSecondary = false;
    const expected = 'font-bold text-amber-400';

    // Act
    const result = cn(
      'font-bold',
      isPrimary && 'text-amber-400',
      isSecondary && 'text-zinc-400',
      undefined,
      null
    );

    // Assert
    expect(result).toBe(expected);
  });

  it('should handle object notation with boolean flags', () => {
    // Arrange
    const classObject = {
      'btn-active': true,
      'btn-disabled': false,
      'shadow-lg': true,
    };
    const expected = 'btn btn-active shadow-lg';

    // Act
    const result = cn('btn', classObject);

    // Assert
    expect(result).toBe(expected);
  });
});
