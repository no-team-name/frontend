import React, { useState } from 'react';

const TableModal = ({ isOpen, onClose, onInsert }) => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);

  const handleInsert = () => {
    onInsert(rows, cols);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 1100 }}>
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Insert Table</h2>
        <div className="mb-4">
          <label className="block mb-2">Rows:</label>
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="border p-2 rounded w-full"
            min="1"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Columns:</label>
          <input
            type="number"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="border p-2 rounded w-full"
            min="1"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableModal;