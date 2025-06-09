import { useState, useEffect } from 'react';
import { FaPlay, FaCode, FaSave, FaFork, FaShare } from 'react-icons/fa';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

export default function ProgrammingEnv() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [environments, setEnvironments] = useState([]);
  const [currentEnv, setCurrentEnv] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [envTitle, setEnvTitle] = useState('');
  const [envDescription, setEnvDescription] = useState('');

  const languages = [
    { 
      id: 'javascript', 
      name: 'JavaScript', 
      template: '// Write your JavaScript code here\nconsole.log("Hello, World!");' 
    },
    { 
      id: 'python', 
      name: 'Python', 
      template: '# Write your Python code here\nprint("Hello, World!")' 
    },
    { 
      id: 'java', 
      name: 'Java', 
      template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' 
    },
    { 
      id: 'cpp', 
      name: 'C++', 
      template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}' 
    },
    { 
      id: 'c', 
      name: 'C', 
      template: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}' 
    },
    { 
      id: 'html', 
      name: 'HTML', 
      template: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>' 
    },
    { 
      id: 'css', 
      name: 'CSS', 
      template: '/* Write your CSS code here */\nbody {\n    font-family: Arial, sans-serif;\n    background-color: #f0f0f0;\n}' 
    },
  ];

  useEffect(() => {
    fetchEnvironments();
    handleLanguageChange('javascript');
  }, []);

  const fetchEnvironments = async () => {
    try {
      const response = await api.getProgrammingEnvs();
      setEnvironments(response.data.environments || []);
    } catch (error) {
      console.error('Failed to fetch environments:', error);
    }
  };

  const handleLanguageChange = (langId) => {
    setSelectedLanguage(langId);
    const language = languages.find(lang => lang.id === langId);
    setCode(language.template);
    setOutput('');
    setCurrentEnv(null);
  };

  const runCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setIsRunning(true);
    try {
      let envId = currentEnv?._id;
      
      // If no current environment, create a temporary one
      if (!envId) {
        const tempEnv = await api.createProgrammingEnv({
          title: `Temp ${selectedLanguage} Environment`,
          language: selectedLanguage,
          code: code,
          isPublic: false
        });
        envId = tempEnv.data._id;
      }

      const result = await api.executeCode(envId, { code, input });
      
      if (result.data.error) {
        setOutput(`Error: ${result.data.error}`);
      } else {
        setOutput(result.data.output || 'Code executed successfully (no output)');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Execution failed';
      setOutput(`Error: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const saveEnvironment = async () => {
    if (!envTitle.trim()) {
      toast.error('Please enter a title for your environment');
      return;
    }

    try {
      if (currentEnv) {
        await api.updateProgrammingEnv(currentEnv._id, {
          title: envTitle,
          description: envDescription,
          code: code
        });
        toast.success('Environment updated successfully!');
      } else {
        const newEnv = await api.createProgrammingEnv({
          title: envTitle,
          description: envDescription,
          language: selectedLanguage,
          code: code,
          isPublic: false
        });
        setCurrentEnv(newEnv.data);
        toast.success('Environment saved successfully!');
      }
      
      setShowSaveModal(false);
      fetchEnvironments();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save environment';
      toast.error(errorMessage);
    }
  };

  const loadEnvironment = async (env) => {
    try {
      const response = await api.getProgrammingEnvById(env._id);
      const envData = response.data;
      
      setCurrentEnv(envData);
      setSelectedLanguage(envData.language);
      setCode(envData.code);
      setEnvTitle(envData.title);
      setEnvDescription(envData.description || '');
      setOutput('');
      toast.success('Environment loaded successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load environment';
      toast.error(errorMessage);
    }
  };

  const forkEnvironment = async (env) => {
    try {
      const forkedEnv = await api.forkEnvironment(env._id, {
        title: `Fork of ${env.title}`,
        description: `Forked from ${env.title}`
      });
      
      setCurrentEnv(forkedEnv.data);
      setSelectedLanguage(forkedEnv.data.language);
      setCode(forkedEnv.data.code);
      setEnvTitle(forkedEnv.data.title);
      setEnvDescription(forkedEnv.data.description || '');
      setOutput('');
      
      toast.success('Environment forked successfully!');
      fetchEnvironments();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fork environment';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Programming Environment</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowSaveModal(true)}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <FaSave className="mr-2" />
                Save
              </button>
              {currentEnv && (
                <button
                  onClick={() => forkEnvironment(currentEnv)}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FaFork className="mr-2" />
                  Fork
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
          {/* Sidebar with environments */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4">My Environments</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {environments.map(env => (
                <div key={env._id} className="border rounded p-3 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{env.title}</h4>
                      <p className="text-xs text-gray-500">{env.language}</p>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => loadEnvironment(env)}
                        className="text-blue-500 hover:text-blue-700 text-xs"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => forkEnvironment(env)}
                        className="text-green-500 hover:text-green-700 text-xs"
                      >
                        Fork
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main coding area */}
          <div className="lg:col-span-3 space-y-4">
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

            {currentEnv && (
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm">
                  <strong>Current Environment:</strong> {currentEnv.title}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Code Editor */}
              <div className="border rounded-lg">
                <div className="bg-gray-100 p-2 border-b">
                  <span className="font-medium">Code Editor</span>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-96 p-4 font-mono text-sm focus:outline-none resize-none"
                  placeholder={`Write your ${selectedLanguage} code here...`}
                />
              </div>

              {/* Input/Output */}
              <div className="space-y-4">
                {/* Input */}
                <div className="border rounded-lg">
                  <div className="bg-gray-100 p-2 border-b">
                    <span className="font-medium">Input</span>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full h-32 p-4 font-mono text-sm focus:outline-none resize-none"
                    placeholder="Enter input for your program..."
                  />
                </div>

                {/* Output */}
                <div className="border rounded-lg">
                  <div className="bg-gray-100 p-2 border-b">
                    <span className="font-medium">Output</span>
                  </div>
                  <div className="h-56 p-4 font-mono text-sm overflow-auto bg-black text-green-400">
                    {output || 'Output will appear here...'}
                  </div>
                </div>
              </div>
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
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {currentEnv ? 'Update Environment' : 'Save Environment'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={envTitle}
                  onChange={(e) => setEnvTitle(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                  placeholder="Enter environment title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={envDescription}
                  onChange={(e) => setEnvDescription(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-primary focus:border-primary"
                  rows="3"
                  placeholder="Enter environment description"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEnvironment}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                {currentEnv ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}