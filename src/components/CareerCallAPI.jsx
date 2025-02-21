/*
This is the file that connects to the API functions on Azure
*/

class CareerCallAPI {
    constructor() {
      this.baseUrls = {
        contains: 'https://callneo4japiv3.azurewebsites.net/api/contains',
        count: 'https://callneo4japiv3.azurewebsites.net/api/count',
        returnJSON: 'https://callneo4japiv3.azurewebsites.net/api/returnJSON',
        shortestPath: 'https://callneo4japiv3.azurewebsites.net/api/shortestPath',
        shortestPathBasic: 'https://callneo4japiv3.azurewebsites.net/api/shortestPathBasic',
        searchSuggestions: 'https://callneo4japiv3.azurewebsites.net/api/searchSuggestions'
      };
    }

    async getShortestPath(startJob, endJob, pathType, numPaths) {
      try {
        const url = `${this.baseUrls.shortestPath}?currentJobTitle=${encodeURIComponent(startJob)}&targetJobTitle=${encodeURIComponent(endJob)}&shortestPathType=${pathType.toLowerCase()}&numberOfPaths=${numPaths}`;
        
        console.log('Requesting URL:', url);
  
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Response data:', data);
        return data;
  
      } catch (error) {
        console.error('API call error:', error);
        throw new Error('Unable to fetch career path data. Please try again later.');
      }
    }
    
     // Add this new method
     async getJobSuggestions(searchText) {
      try {
          const url = `${this.baseUrls.contains}?jobTitle=${encodeURIComponent(searchText)}`;
          const response = await fetch(url);
          const data = await response.json();
          return data.map(job => job.properties.title);
      } catch (error) {
          console.error('API call error:', error);
          return [];
      }
  }

    // Seems like we don't really need the rest of these?
    async checkJobExists(jobTitle) {
      try {
        const url = `${this.baseUrls.contains}?jobTitle=${encodeURIComponent(jobTitle)}`;
        console.log('Requesting URL:', url);
  
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Response data:', data);
        return data;
  
      } catch (error) {
        console.error('API call error:', error);
        if (error.message === 'Failed to fetch') {
          throw new Error('Network error. Please check your connection and try again.');
        }
        throw error;
      }
    }
  
    async getPathCount(startJob, endJob) {
      try {
        const url = `${this.baseUrls.count}?currentJobTitle=${encodeURIComponent(startJob)}&targetJobTitle=${encodeURIComponent(endJob)}`;
        console.log('Requesting URL:', url);
  
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Response data:', data);
        return data;
  
      } catch (error) {
        console.error('API call error:', error);
        if (error.message === 'Failed to fetch') {
          throw new Error('Network error. Please check your connection and try again.');
        }
        throw error;
      }
    }
  
    async getPathData(startJob, endJob) {
      try {
        const url = `${this.baseUrls.returnJSON}?currentJobTitle=${encodeURIComponent(startJob)}&targetJobTitle=${encodeURIComponent(endJob)}`;
        console.log('Requesting URL:', url);
  
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Response data:', data);
        return data;
  
      } catch (error) {
        console.error('API call error:', error);
        if (error.message === 'Failed to fetch') {
          throw new Error('Network error. Please check your connection and try again.');
        }
        throw error;
      }
    }
  
    async getShortestPathBasic(startJob, endJob, numPaths) {
        try {
          const url = `${this.baseUrls.shortestPathBasic}?currentJobTitle=${encodeURIComponent(startJob)}&targetJobTitle=${encodeURIComponent(endJob)}&numberOfPaths=${numPaths}`;
          console.log('Requesting URL:', url);
    
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            }
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data = await response.json();
          console.log('Response data:', data);
          return data;
    
        } catch (error) {
          console.error('API call error:', error);
          if (error.message === 'Failed to fetch') {
            throw new Error('Network error. Please check your connection and try again.');
          }
          throw error;
        }
      }
    }
  
  export default CareerCallAPI;


