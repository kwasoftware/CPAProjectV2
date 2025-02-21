// // src/__tests__/CareerCallAPI.test.js
// src/__tests__/CareerCallAPI.test.js
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import CareerCallAPI from '../components/CareerCallAPI.jsx';

// Mock fetch globally
globalThis.fetch = jest.fn();

describe('CareerCallAPI', () => {
  let api;
  let consoleSpy;
  
  // Real expected response data based on actual API response
  const expectedPathResponse = [
    {
      start: { title: "3D Artist" },
      end: { title: "Visual Designer" },
      segments: [
        {
          start: { title: "3D Artist" },
          relationship: { type: "max", months: 161 },
          end: { title: "Freelance Graphic Designer" }
        },
        {
          start: { title: "Freelance Graphic Designer" },
          relationship: { type: "max", months: 141 },
          end: { title: "Visual Designer" }
        }
      ]
    },
    {
      start: { title: "3D Artist" },
      end: { title: "Visual Designer" },
      segments: [
        {
          start: { title: "3D Artist" },
          relationship: { type: "max", months: 12 },
          end: { title: "Graphic Designer" }
        },
        {
          start: { title: "Graphic Designer" },
          relationship: { type: "max", months: 75 },
          end: { title: "Visual Designer" }
        }
      ]
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api = new CareerCallAPI();
    // Mock console.error and console.log before each test
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error and console.log after each test
    consoleSpy.mockRestore();
    jest.restoreAllMocks();
  });

  describe('getShortestPath', () => {
    it('successfully fetches correct career path data for 3D Artist to Visual Designer', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => expectedPathResponse
      });

      const result = await api.getShortestPath('3D Artist', 'Visual Designer', 'max', 2);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/shortestPath') &&
        expect.stringContaining('currentJobTitle=3D%20Artist') &&
        expect.stringContaining('targetJobTitle=Visual%20Designer') &&
        expect.stringContaining('shortestPathType=max') &&
        expect.stringContaining('numberOfPaths=2'),
        expect.any(Object)
      );

      expect(result[0].segments[0].start.title).toBe('3D Artist');
      expect(result[0].segments[0].end.title).toBe('Freelance Graphic Designer');
      expect(result[0].segments[0].relationship.months).toBe(161);
      
      expect(result[0].segments[1].start.title).toBe('Freelance Graphic Designer');
      expect(result[0].segments[1].end.title).toBe('Visual Designer');
      expect(result[0].segments[1].relationship.months).toBe(141);

      // Verify exact path details for second path
      expect(result[1].segments[0].start.title).toBe('3D Artist');
      expect(result[1].segments[0].end.title).toBe('Graphic Designer');
      expect(result[1].segments[0].relationship.months).toBe(12);
      
      expect(result[1].segments[1].start.title).toBe('Graphic Designer');
      expect(result[1].segments[1].end.title).toBe('Visual Designer');
      expect(result[1].segments[1].relationship.months).toBe(75);
    });

    it('handles API errors appropriately', async () => {
      globalThis.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(api.getShortestPath('3D Artist', 'Visual Designer', 'max', 2))
        .rejects
        .toThrow('Unable to fetch career path data. Please try again later.');
    });

    it('handles network errors appropriately', async () => {
      globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.getShortestPath('3D Artist', 'Visual Designer', 'max', 2))
        .rejects
        .toThrow('Unable to fetch career path data. Please try again later.');
    });
  });
});


// import { describe, expect, it, beforeEach, jest } from '@jest/globals';
// import CareerCallAPI from '../components/CareerCallAPI.jsx';

// // Mock fetch globally
// globalThis.fetch = jest.fn();

// describe('CareerCallAPI', () => {
//   let api;
  
//   // Real expected response data based on actual API response
//   const expectedPathResponse = [
//     {
//       start: { title: "3D Artist" },
//       end: { title: "Visual Designer" },
//       segments: [
//         {
//           start: { title: "3D Artist" },
//           relationship: { type: "max", months: 161 },
//           end: { title: "Freelance Graphic Designer" }
//         },
//         {
//           start: { title: "Freelance Graphic Designer" },
//           relationship: { type: "max", months: 141 },
//           end: { title: "Visual Designer" }
//         }
//       ]
//     },
//     {
//       start: { title: "3D Artist" },
//       end: { title: "Visual Designer" },
//       segments: [
//         {
//           start: { title: "3D Artist" },
//           relationship: { type: "max", months: 12 },
//           end: { title: "Graphic Designer" }
//         },
//         {
//           start: { title: "Graphic Designer" },
//           relationship: { type: "max", months: 75 },
//           end: { title: "Visual Designer" }
//         }
//       ]
//     }
//   ];

//   beforeEach(() => {
//     jest.clearAllMocks();
//     api = new CareerCallAPI();
//   });

//   describe('getShortestPath', () => {
//     it('successfully fetches correct career path data for 3D Artist to Visual Designer', async () => {
//       globalThis.fetch.mockResolvedValueOnce({
//         ok: true,
//         json: async () => expectedPathResponse
//       });

//       const result = await api.getShortestPath('3D Artist', 'Visual Designer', 'max', 2);

//       expect(fetch).toHaveBeenCalledWith(
//         expect.stringContaining('/api/shortestPath') &&
//         expect.stringContaining('currentJobTitle=3D%20Artist') &&
//         expect.stringContaining('targetJobTitle=Visual%20Designer') &&
//         expect.stringContaining('shortestPathType=max') &&
//         expect.stringContaining('numberOfPaths=2'),
//         expect.any(Object)
//       );

//       expect(result[0].segments[0].start.title).toBe('3D Artist');
//       expect(result[0].segments[0].end.title).toBe('Freelance Graphic Designer');
//       expect(result[0].segments[0].relationship.months).toBe(161);
      
//       expect(result[0].segments[1].start.title).toBe('Freelance Graphic Designer');
//       expect(result[0].segments[1].end.title).toBe('Visual Designer');
//       expect(result[0].segments[1].relationship.months).toBe(141);

//       // Verify exact path details for second path
//       expect(result[1].segments[0].start.title).toBe('3D Artist');
//       expect(result[1].segments[0].end.title).toBe('Graphic Designer');
//       expect(result[1].segments[0].relationship.months).toBe(12);
      
//       expect(result[1].segments[1].start.title).toBe('Graphic Designer');
//       expect(result[1].segments[1].end.title).toBe('Visual Designer');
//       expect(result[1].segments[1].relationship.months).toBe(75);
//     });

//     it('handles API errors appropriately', async () => {
//       globalThis.fetch.mockResolvedValueOnce({
//         ok: false,
//         status: 500
//       });

//       await expect(api.getShortestPath('3D Artist', 'Visual Designer', 'max', 2))
//         .rejects
//         .toThrow('Unable to fetch career path data. Please try again later.');
//     });

//     it('handles network errors appropriately', async () => {
//       globalThis.fetch.mockRejectedValueOnce(new Error('Network error'));

//       await expect(api.getShortestPath('3D Artist', 'Visual Designer', 'max', 2))
//         .rejects
//         .toThrow('Unable to fetch career path data. Please try again later.');
//     });
//   });
// });


//         // expect(result[0].segments[0].start.title).toBe('3D Artist');
//         //       expect(result[0].segments[0].end.title).toBe('Freelance Graphic Designer');
//         //       expect(result[0].segments[0].relationship.months).toBe(161);
            
//         //       expect(result[0].segments[1].start.title).toBe('Freelance Graphic Designer');
//         //       expect(result[0].segments[1].end.title).toBe('Visual Designer');
//         //       expect(result[0].segments[1].relationship.months).toBe(141);

//         //       // Verify exact path details for second path
//         //       expect(result[1].segments[0].start.title).toBe('3D Artist');
//         //       expect(result[1].segments[0].end.title).toBe('Graphic Designer');
//         //       expect(result[1].segments[0].relationship.months).toBe(12);
            
//         //       expect(result[1].segments[1].start.title).toBe('Graphic Designer');
//         //       expect(result[1].segments[1].end.title).toBe('Visual Designer');
//         //       expect(result[1].segments[1].relationship.months).toBe(75);