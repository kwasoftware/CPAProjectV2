import { describe, expect, it, beforeEach, beforeAll, afterAll, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CareerPathAnalysis from '../components/CareerPathAnalysis';

// Mock the entire CareerPathVisual component
jest.mock('../components/CareerPathVisual', () => ({
  __esModule: true,
  default: () => <div data-testid="mocked-visual">Mocked Visual Component</div>,
}));

// Mock the CareerCallAPI
const mockGetShortestPath = jest.fn();
jest.mock('../components/CareerCallAPI', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getShortestPath: mockGetShortestPath,
  })),
}));

// Skip testing anything related to ReactFlow
let originalError;
beforeAll(() => {
  originalError = console.error;
  console.error = (...args) => {
    if (/Warning.*ReactFlow/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

describe('CareerPathAnalysis', () => {
  const expectedPathResponse = [
    {
      start: { title: '3D Artist' },
      end: { title: 'Visual Designer' },
      segments: [
        { start: { title: '3D Artist' }, relationship: { type: 'max', months: 161 }, end: { title: 'Freelance Graphic Designer' } },
        { start: { title: 'Freelance Graphic Designer' }, relationship: { type: 'max', months: 141 }, end: { title: 'Visual Designer' } },
      ],
    },
    {
      start: { title: '3D Artist' },
      end: { title: 'Visual Designer' },
      segments: [
        { start: { title: '3D Artist' }, relationship: { type: 'max', months: 12 }, end: { title: 'Graphic Designer' } },
        { start: { title: 'Graphic Designer' }, relationship: { type: 'max', months: 75 }, end: { title: 'Visual Designer' } },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetShortestPath.mockResolvedValue(expectedPathResponse);
  });

  it('renders the initial form correctly', () => {
    render(<CareerPathAnalysis />);
    expect(screen.getByText('Career Path Analysis')).toBeInTheDocument();
    expect(screen.getByLabelText(/Starting Job/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ending Job/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Paths/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Path/i })).toBeInTheDocument();
  });

  it('handles form submission with 3D Artist to Visual Designer path', async () => {
    const user = userEvent.setup();
    render(<CareerPathAnalysis />);

    await user.type(screen.getByLabelText(/Starting Job/i), '3D Artist');
    await user.type(screen.getByLabelText(/Ending Job/i), 'Visual Designer');
    await user.type(screen.getByLabelText(/Number of Paths/i), '2');
    await user.click(screen.getByRole('button', { name: /Generate Path/i }));

    await waitFor(() => {
      expect(mockGetShortestPath).toHaveBeenCalledWith(
        '3D Artist',
        'Visual Designer',
        'max',
        2
      );
    });
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<CareerPathAnalysis />);

    await user.click(screen.getByRole('button', { name: /Generate Path/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please fill in all fields/i)).toBeInTheDocument();
    });
  });
});