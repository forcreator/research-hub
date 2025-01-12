import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [field, setField] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/workspace');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-white to-pink-100 p-6">
      <div className="relative w-full max-w-lg p-8 bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHByb2plY3R8ZW58MHx8fHwxNjYyMjY0NzY0&ixlib=rb-1.2.1&q=80&w=400)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px) brightness(0.6)',
            zIndex: '-1',
          }}
        ></div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="relative z-10">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
            Start Your New Project
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Define your project details to kickstart your workspace.
          </p>

          {/* Project Name */}
          <div className="mb-6">
            <label
              htmlFor="project-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Project Name
            </label>
            <input
              type="text"
              id="project-name"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm transition duration-200"
              required
            />
          </div>

          {/* Scientific Field */}
          <div className="mb-6">
            <label
              htmlFor="field"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Scientific Field
            </label>
            <select
              id="field"
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-3 px-4 bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm transition duration-200"
              required
            >
              <option value="">Select a field</option>
              <option value="Biology">Biology</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Physics">Physics</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Medicine">Medicine</option>
              <option value="Psychology">Psychology</option>
              <option value="Environmental Science">
                Environmental Science
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-md transition duration-300"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};
