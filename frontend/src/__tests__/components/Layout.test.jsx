import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import Layout from '../../components/Layout/Layout';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Layout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children correctly', () => {
    // Arrange
    const testContent = 'Test Content';

    // Act
    renderWithRouter(
      <Layout>
        <div>{testContent}</div>
      </Layout>
    );

    // Assert
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('should apply dark theme background', () => {
    // Arrange
    const testContent = 'Test Content';

    // Act
    const { container } = renderWithRouter(
      <Layout>
        <div>{testContent}</div>
      </Layout>
    );

    // Assert
    const layoutElement = container.firstChild;
    expect(layoutElement).toHaveClass('min-h-screen', 'bg-gradient-to-br', 'from-gray-900', 'via-gray-800', 'to-black');
  });

  it('should render with proper structure', () => {
    // Arrange
    const testContent = 'Test Content';

    // Act
    const { container } = renderWithRouter(
      <Layout>
        <div>{testContent}</div>
      </Layout>
    );

    // Assert
    const layoutElement = container.firstChild;
    expect(layoutElement).toHaveClass('min-h-screen');
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });
});
