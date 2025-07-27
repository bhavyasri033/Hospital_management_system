import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pages.css';

const Inventory = ({ userRole = 'admin' }) => {
  const [inventory, setInventory] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: '',
    expiry: '',
    supplier: '',
    minStock: '',
    status: 'In Stock',
  });
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/inventory')
      .then(res => setInventory(res.data))
      .catch(err => console.error('Error fetching inventory:', err));
  }, []);

  const categories = [
    'Pain Relief', 'Antibiotics', 'Diabetes', 'Cardiovascular', 'Respiratory',
    'Controlled Substances', 'Surgical Supplies', 'Medical Devices'
  ];
  const suppliers = [
    'PharmaCorp Ltd', 'MediSupply Co', 'DiabeCare Inc', 'SecureMed Ltd',
    'Global Pharma', 'HealthCare Supplies'
  ];

  // Add item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const item = {
        ...newItem,
        quantity: parseInt(newItem.quantity),
        minStock: parseInt(newItem.minStock),
        expiry: newItem.expiry || undefined,
        status: getStockStatus(parseInt(newItem.quantity), parseInt(newItem.minStock)),
      };
      await axios.post('http://localhost:5000/api/inventory', item);
      const refreshed = await axios.get('http://localhost:5000/api/inventory');
      setInventory(refreshed.data);
      setNewItem({ name: '', category: '', quantity: '', expiry: '', supplier: '', minStock: '', status: 'In Stock' });
      setShowAddForm(false);
    } catch (err) {
      alert('Error adding item: ' + (err.response?.data?.error || err.message));
    }
  };

  // Edit item
  const handleEditItem = (item) => {
    setEditItem({ ...item });
    setShowAddForm(true);
  };

  // Update item
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const item = {
        ...editItem,
        quantity: parseInt(editItem.quantity),
        minStock: parseInt(editItem.minStock),
        expiry: editItem.expiry || undefined,
        status: getStockStatus(parseInt(editItem.quantity), parseInt(editItem.minStock)),
      };
      await axios.put(`http://localhost:5000/api/inventory/${editItem._id}`, item);
      const refreshed = await axios.get('http://localhost:5000/api/inventory');
      setInventory(refreshed.data);
      setEditItem(null);
      setShowAddForm(false);
    } catch (err) {
      alert('Error updating item: ' + (err.response?.data?.error || err.message));
    }
  };

  // Delete item
  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      setInventory(inventory.filter(item => item._id !== id));
    } catch (err) {
      alert('Error deleting item: ' + (err.response?.data?.error || err.message));
    }
  };

  const getStockStatus = (quantity, minStock) => {
    if (quantity <= minStock * 0.3) return 'Critical';
    if (quantity <= minStock) return 'Low Stock';
    return 'In Stock';
  };

  const filteredInventory = inventory.filter(item => {
    const nameMatch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    return nameMatch && categoryMatch && statusMatch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Stock': return 'in-stock';
      case 'Low Stock': return 'low-stock';
      case 'Critical': return 'critical';
      case 'Out of Stock': return 'out-of-stock';
      case 'Expired': return 'expired';
      default: return 'in-stock';
    }
  };

  const getExpiryStatus = (expiry) => {
    if (!expiry) return 'valid';
    const today = new Date();
    const expiryDate = new Date(expiry);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring-soon';
    return 'valid';
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Inventory Management</h1>
        {(userRole === 'pharma' || userRole === 'pharmaceutical_admin') && (
          <button 
            className="btn-primary"
            onClick={() => { setShowAddForm(true); setEditItem(null); }}
          >
            + Add New Item
          </button>
        )}
      </div>

      {userRole === 'admin' && (
        <div className="read-only-badge">
          <span className="lock-icon" role="img" aria-label="lock">🔒</span>
          Read-only mode: You can view and search inventory, but cannot add, edit, or order items.
        </div>
      )}

      <div className="inventory-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-section">
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Critical">Critical</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="inventory-table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Min Stock</th>
              <th>Supplier</th>
              <th>Expiry</th>
              <th>Status</th>
              {(userRole === 'pharma' || userRole === 'pharmaceutical_admin') && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan={userRole === 'pharma' || userRole === 'pharmaceutical_admin' ? 8 : 7}>
                  <div className="empty-inventory-state">
                    <div className="empty-illustration" aria-label="No inventory items">📦</div>
                    <div className="empty-message">No inventory items found.</div>
                    {(userRole === 'pharma' || userRole === 'pharmaceutical_admin') && (
                      <button className="btn-primary" onClick={() => { setShowAddForm(true); setEditItem(null); }}>
                        + Add Your First Item
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredInventory.map(item => (
                <tr key={item._id} className={`inventory-row ${getStatusColor(item.status)}-row ${getExpiryStatus(item.expiry)}`}
                  tabIndex={0} aria-label={`Inventory item: ${item.name}`}
                >
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.minStock}</td>
                  <td>{item.supplier}</td>
                  <td>
                    {item.expiry ? (
                      <span className={`expiry-badge ${getExpiryStatus(item.expiry)}`}>{item.expiry.slice(0, 10)}
                        {getExpiryStatus(item.expiry) === 'expired' && <span className="expiry-label"> (Expired)</span>}
                        {getExpiryStatus(item.expiry) === 'expiring-soon' && <span className="expiry-label"> (Expiring Soon)</span>}
                      </span>
                    ) : '--'}
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(item.status)}`}>{item.status}</span>
                  </td>
                  {(userRole === 'pharma' || userRole === 'pharmaceutical_admin') && (
                    <td>
                      <button className="btn-secondary" onClick={() => handleEditItem(item)} aria-label={`Edit ${item.name}`}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDeleteItem(item._id)} aria-label={`Delete ${item.name}`}>Delete</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(showAddForm && (userRole === 'pharma' || userRole === 'pharmaceutical_admin')) && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
              <button onClick={() => { setShowAddForm(false); setEditItem(null); }}>×</button>
            </div>
            <form onSubmit={editItem ? handleUpdateItem : handleAddItem} className="inventory-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" value={editItem ? editItem.name : newItem.name} onChange={e => editItem ? setEditItem({ ...editItem, name: e.target.value }) : setNewItem({ ...newItem, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select value={editItem ? editItem.category : newItem.category} onChange={e => editItem ? setEditItem({ ...editItem, category: e.target.value }) : setNewItem({ ...newItem, category: e.target.value })} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity *</label>
                  <input type="number" value={editItem ? editItem.quantity : newItem.quantity} onChange={e => editItem ? setEditItem({ ...editItem, quantity: e.target.value }) : setNewItem({ ...newItem, quantity: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Min Stock *</label>
                  <input type="number" value={editItem ? editItem.minStock : newItem.minStock} onChange={e => editItem ? setEditItem({ ...editItem, minStock: e.target.value }) : setNewItem({ ...newItem, minStock: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Supplier</label>
                  <select value={editItem ? editItem.supplier : newItem.supplier} onChange={e => editItem ? setEditItem({ ...editItem, supplier: e.target.value }) : setNewItem({ ...newItem, supplier: e.target.value })}>
                    <option value="">Select Supplier</option>
                    {suppliers.map(sup => <option key={sup} value={sup}>{sup}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="date" value={editItem ? (editItem.expiry ? editItem.expiry.slice(0, 10) : '') : newItem.expiry} onChange={e => editItem ? setEditItem({ ...editItem, expiry: e.target.value }) : setNewItem({ ...newItem, expiry: e.target.value })} />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => { setShowAddForm(false); setEditItem(null); }} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editItem ? 'Update Item' : 'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory; 