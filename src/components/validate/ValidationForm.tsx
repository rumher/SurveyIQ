'use client';

import { useState } from 'react';
import { Upload, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function ValidationForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Validation failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Data Validation</h2>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <Upload className="w-10 h-10 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">
            {file ? file.name : 'Click to upload CSV or drag and drop'}
          </span>
          <span className="text-xs text-gray-500 mt-1">CSV files only</span>
        </label>
      </div>

      {/* Action Button */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Validate Data'}
        </button>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${result.validation.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2">
                {result.validation.isValid ? <CheckCircle className="text-green-600" /> : <XCircle className="text-red-600" />}
                <span className="font-semibold text-gray-900">Status</span>
              </div>
              <p className="mt-2 text-lg font-bold">{result.validation.isValid ? 'Valid' : 'Invalid'}</p>
            </div>

            <div className="p-4 rounded-lg border bg-white">
              <p className="text-sm text-gray-500">Total Rows</p>
              <p className="mt-2 text-lg font-bold text-gray-900">{result.totalRows}</p>
            </div>

            <div className="p-4 rounded-lg border bg-white">
              <p className="text-sm text-gray-500">Errors Found</p>
              <p className="mt-2 text-lg font-bold text-red-600">{result.validation.errorCount}</p>
            </div>
          </div>

          {/* Detailed Errors List */}
          {result.validation.errors.length > 0 && (
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-red-50 px-4 py-3 border-b">
                <h3 className="font-semibold text-red-800">Critical Errors</h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-4 py-2">Row</th>
                      <th className="px-4 py-2">Column</th>
                      <th className="px-4 py-2">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.validation.errors.map((err: any, i: number) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 font-mono">{err.row}</td>
                        <td className="px-4 py-2 text-gray-600">{err.column || '-'}</td>
                        <td className="px-4 py-2 text-red-600">{err.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Warnings List */}
          {result.validation.warnings.length > 0 && (
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="bg-yellow-50 px-4 py-3 border-b flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Warnings ({result.validation.warningCount})</h3>
              </div>
              <div className="max-h-40 overflow-y-auto">
                <ul className="divide-y">
                  {result.validation.warnings.slice(0, 5).map((warn: any, i: number) => (
                    <li key={i} className="px-4 py-2 text-sm text-gray-600 flex justify-between">
                      <span>Row {warn.row}: {warn.message}</span>
                    </li>
                  ))}
                  {result.validation.warnings.length > 5 && (
                    <li className="px-4 py-2 text-xs text-gray-400 italic">...and more</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}