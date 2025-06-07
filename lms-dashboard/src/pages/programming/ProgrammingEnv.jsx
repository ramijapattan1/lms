import { useState } from 'react';
import ReactPlayer from 'react-player';
import { FaPlay, FaCode } from 'react-icons/fa';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function ProgrammingEnv() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const languages = [
    { id: 'javascript', name: 'JavaScript', template: '// Write your JavaScript code here\n' },
    { id: 'python', name: 'Python', template: '# Write your Python code here\n' },
    { id: 'html', name: 'HTML', template: '<!-- Write your HTML code here -->\n' },
    { id: 'css', name: 'CSS', template: '/* Write your CSS code here */\n' },
  ];

  const handleLanguageChange = (langId) => {
    setSelectedLanguage(langId);
    setCode(languages.find(lang => lang.id === langId).template);
    setOutput('');
  };

  const runCode = async () => {
    setIsRunning(true);
    try {
      // In a real implementation, this would make an API call to execute the code
      setOutput('Code execution is not implemented in this demo version.');
    } catch (error) {
      setOutput('Error executing code: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b p-4">
          <h1 className="text-2xl font-bold">Programming Environment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {languages.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedLanguage === lang.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <FaCode className="inline-block mr-2" />
                  {lang.name}
                </button>
              ))}
            </div>

            <div className="border rounded-lg">
              <div className="bg-gray-100 p-2 border-b">
                <span className="font-medium">Editor</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 p-4 font-mono text-sm focus:outline-none"
                placeholder={`Write your ${selectedLanguage} code here...`}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                <FaPlay className="mr-2" />
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg">
              <div className="bg-gray-100 p-2 border-b">
                <span className="font-medium">Output</span>
              </div>
              <div className="h-96 p-4 font-mono text-sm overflow-auto">
                {output || 'Output will appear here...'}
              </div>
            </div>

            <div className="border rounded-lg">
              <div className="bg-gray-100 p-2 border-b">
                <span className="font-medium">Tutorial Video</span>
              </div>
              <div className="p-4">
                <ReactPlayer
                  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  width="100%"
                  height="200px"
                  controls
                />
              </div>
            </div>

            <div className="border rounded-lg">
              <div className="bg-gray-100 p-2 border-b">
                <span className="font-medium">Example Code</span>
              </div>
              <div className="p-4">
                <SyntaxHighlighter language={selectedLanguage} style={docco}>
                  {`// Example ${selectedLanguage} code
function example() {
  console.log("Hello, World!");
}
`}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}