'use client';

import { useState, useEffect } from 'react';

export default function DemoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('zh-CN');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    'idle' | 'requesting' | 'granted' | 'denied'
  >('idle');

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    setLocationStatus('requesting');

    navigator.geolocation.getCurrentPosition(
      position => {
        setLongitude(position.coords.longitude.toString());
        setLatitude(position.coords.latitude.toString());
        setLocationStatus('granted');
      },
      error => {
        console.log('Location access denied:', error);
        setLocationStatus('denied');
        // Leave coordinates empty when denied
        setLongitude('');
        setLatitude('');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('language', language);
      formData.append('longitude', longitude);
      formData.append('latitude', latitude);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Menu Analysis Demo
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Location Status */}
          <div className="mb-6 p-4 rounded-md border">
            <h3 className="text-sm font-medium mb-2">Location Status:</h3>
            {locationStatus === 'requesting' && (
              <p className="text-blue-600">Requesting location permission...</p>
            )}
            {locationStatus === 'granted' && (
              <p className="text-green-600">✓ Location access granted</p>
            )}
            {locationStatus === 'denied' && (
              <div className="space-y-2">
                <p className="text-orange-600">
                  ⚠ Location access denied or unavailable
                </p>
                <p className="text-sm text-gray-600">
                  You can manually enter coordinates or leave them empty.
                </p>
                <button
                  onClick={requestLocation}
                  className="text-blue-600 hover:text-blue-800 text-sm underline">
                  Try again
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="zh-CN">Chinese (Simplified)</option>
                <option value="en">English</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                  <span className="text-gray-500 text-xs ml-1">(optional)</span>
                </label>
                <input
                  type="text"
                  value={longitude}
                  onChange={e => setLongitude(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="116.4074 or leave empty"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                  <span className="text-gray-500 text-xs ml-1">(optional)</span>
                </label>
                <input
                  type="text"
                  value={latitude}
                  onChange={e => setLatitude(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="39.9042 or leave empty"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Analyzing...' : 'Analyze Menu'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-lg font-medium text-green-800 mb-3">
                Analysis Result
              </h3>
              <div className="space-y-2">
                <p>
                  <strong>Status:</strong> {result.status}
                </p>
                <p>
                  <strong>File ID:</strong> {result.uploadedFile?.id}
                </p>
                <p>
                  <strong>File Name:</strong> {result.uploadedFile?.name}
                </p>
                <p>
                  <strong>File Size:</strong> {result.uploadedFile?.size} bytes
                </p>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-green-700 font-medium">
                  Full Response
                </summary>
                <pre className="mt-2 p-3 bg-white border rounded text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {file && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Selected Image Preview
              </h3>
              <img
                src={URL.createObjectURL(file)}
                alt="Selected"
                className="max-w-full h-auto max-h-64 rounded-md border"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
