/*
This is the main file of the website and it handles how everything looks:
. write code that is easy to read
. try to move the style to css
. complains at const [section1Collapsed, setSection1Collapsed] = useState(false);
                const [section2Collapsed, setSection2Collapsed] = useState(false);
*/



import { useState } from 'react';
import { ChevronDown, ChevronUp, Send, Award, Map } from 'lucide-react';
import CareerCallAPI from './CareerCallAPI';
import CareerPathVisual from './CareerPathVisual';
import JobSearchInput from './JobSearchInput';
import 'reactflow/dist/style.css';

export default function CareerPathAnalysis() {
  const [startJob, setStartJob] = useState('');
  const [endJob, setEndJob] = useState('');
  const [numPaths, setNumPaths] = useState('5');
  const [pathType, setPathType] = useState('max');
  const [section1Collapsed, setSection1Collapsed] = useState(false);
  const [section2Collapsed, setSection2Collapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pathResult, setPathResult] = useState(null);
  const [activeView, setActiveView] = useState('graph');
  
  const api = new CareerCallAPI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPathResult(null);
  
    try {
      // consider writing a method instead of this below
      if (!startJob || !endJob || !numPaths) {
        throw new Error('Please fill in all fields');
      }
  
      const pathData = await api.getShortestPath(startJob, endJob, pathType, parseInt(numPaths));
      if (!pathData || pathData.length === 0) {
        throw new Error('No path found between these jobs');
      }
  
      setPathResult(pathData);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || 'An error occurred while fetching the path');
    } finally {
      setLoading(false);
    }
  };
  
  const renderPathResult = () => {
    if (!pathResult) return null;
    
    // consider making the view in the css file instead 
    return (
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-indigo-900">Career Path Found:</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('graph')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeView === 'graph'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Graph View
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeView === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List View
            </button>
          </div>
        </div>
  
        {activeView === 'graph' ? (
          <CareerPathVisual pathResult={pathResult} pathType={pathType} />
        ) : (
          <div className="space-y-8">
            {pathResult.map((path, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="text-lg font-semibold text-indigo-900 mb-2">
                  Path {index + 1}
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="font-medium text-gray-800 mb-3">
                    From: {path.start.title}<br />
                    To: {path.end.title}
                  </div>
                  <div className="space-y-4">
                    {path.segments && path.segments.map((segment, segIndex) => (
                      <div key={segIndex} className="ml-4">
                        <div className="text-gray-700">
                          Transition: {segment.start.title} → {segment.end.title}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {pathType.charAt(0).toUpperCase() + pathType.slice(1)} Value: {segment.relationship.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-900 mb-4">
            Career Path Analysis
          </h1>
          <p className="text-lg text-indigo-600">
            Navigate Your Professional Journey
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button 
              onClick={() => setSection1Collapsed(!section1Collapsed)}
              className="w-full flex justify-between items-center p-6 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Award className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-semibold text-indigo-900">What is the Career Path Analysis?</h2>
              </div>
              {section1Collapsed ? <ChevronDown className="w-6 h-6 text-indigo-600" /> : <ChevronUp className="w-6 h-6 text-indigo-600" />}
            </button>
            
            {!section1Collapsed && (
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  Unlock your professional potential with our Career Pathway Analysis tool. 
                  Designed for ambitious individuals seeking a clear trajectory in their career, 
                  our platform seamlessly maps out the journey from your current job to your dream role.
                  View your career paths in an interactive graph or detailed list format.
                </p>
              </div>
            )}
          </section>

          <section className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button 
              onClick={() => setSection2Collapsed(!section2Collapsed)}
              className="w-full flex justify-between items-center p-6 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Map className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-semibold text-indigo-900">How do you use the Career Path Analysis?</h2>
              </div>
              {section2Collapsed ? <ChevronDown className="w-6 h-6 text-indigo-600" /> : <ChevronUp className="w-6 h-6 text-indigo-600" />}
            </button>
            
            {!section2Collapsed && (
              <div className="p-8 h-auto min-h-[450px]">
                <p className="text-gray-700 leading-relaxed mb-6">
                  To utilize our Career Pathway Analysis tool, please enter your current job, 
                  desired job, and number of pathways. Upon submission, we will generate your 
                  personalized career roadmap with an interactive visualization.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="startJob" className="block text-sm font-medium text-gray-700 mb-1">
                        Starting Job
                      </label>
                      <JobSearchInput
                        value={startJob}
                        onChange={setStartJob}
                        placeholder="e.g. 3D Artist"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="endJob" className="block text-sm font-medium text-gray-700 mb-1">
                        Ending Job
                      </label>
                      <JobSearchInput
                        value={endJob}
                        onChange={setEndJob}
                        placeholder="e.g. Visual Designer"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="numPaths" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Paths
                      </label>
                      <input 
                        type="number" 
                        id="numPaths"
                        value={numPaths}
                        onChange={(e) => setNumPaths(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g. 5"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <select 
                      value={pathType}
                      onChange={(e) => setPathType(e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      disabled={loading}
                    >
                      <option value="max">Max Path</option>
                      <option value="median">Median Path</option>
                      <option value="mean">Mean Path</option>
                      <option value="min">Min Path</option>
                      <option value="count">Count Path</option>
                    </select>
                    
                    <button 
                      type="submit" 
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                      disabled={loading}
                    >
                      <span>{loading ? 'Processing...' : 'Generate Path'}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600">{error}</p>
                      <p className="text-sm text-red-500 mt-1">
                        If this persists, please try:
                        <ul className="list-disc ml-5 mt-1">
                          <li>Checking if both job titles are spelled correctly</li>
                          <li>Refreshing the page</li>
                          <li>Trying again in a few minutes</li>
                        </ul>
                      </p>
                    </div>
                  )}

                  {renderPathResult()}
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}