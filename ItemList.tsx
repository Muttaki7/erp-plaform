import React, { useState, useEffect } from 'react';
import { FileStorage } from '../../utils/fileStorage';

interface InventoryItem {
    id: number;
    name: string;
    description: string;
    quantity: number;
    unit_price: number;
    category: string;
    tenant_id: number;
}

const ItemList: React.FC = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const itemStorage = new FileStorage<InventoryItem>('inventoryItems');

    useEffect(() => {
        loadItems();
    }, [tenantId]);

    const loadItems = () => {
        const data = itemStorage.getAll(tenantId);
        setItems(data);
    };

    const handleSave = (itemData: Omit<InventoryItem, 'id'>) => {
        if (editingItem) {
            itemStorage.update(editingItem.id, itemData, tenantId);
        } else {
            itemStorage.create(itemData);
        }
        loadItems();
        setShowForm(false);
        setEditingItem(null);
    };

    const handleEdit = (item: InventoryItem) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            itemStorage.delete(id, tenantId);
            loadItems();
        }
    };

    return (
        <div className="container mt-4">
            <h2>Inventory Items</h2>
            <div className="mb-3">
                <label className="form-label">Tenant ID</label>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Enter tenant ID"
                    value={tenantId}
                    onChange={(e) => setTenantId(parseInt(e.target.value))}
                />
            </div>
            {showForm && (
                <ItemForm
                    item={editingItem}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingItem(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.quantity}</td>
                                <td>${item.unit_price.toFixed(2)}</td>
                                <td>{item.category}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(item)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingItem(null); setShowForm(true); }}>Add New Item</button>
        </div>
    );
};

interface ItemFormProps {
    item: InventoryItem | null;
    onSave: (item: Omit<InventoryItem, 'id'>) => void;
    onCancel: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        description: item?.description || '',
        quantity: item?.quantity || 0,
        unit_price: item?.unit_price || 0,
        category: item?.category || '',
        tenant_id: item?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{item ? 'Edit Item' : 'Add New Item'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter item name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter quantity"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Unit Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Enter unit price"
                                    value={formData.unit_price}
                                    onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default ItemList;
