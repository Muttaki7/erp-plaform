import React, { useState, useEffect } from 'react';
import { FileStorage } from '../../utils/fileStorage';

interface DocumentCategory {
    id: number;
    name: string;
    description: string;
    tenant_id: number;
}

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<DocumentCategory[]>([]);
    const [editingCategory, setEditingCategory] = useState<DocumentCategory | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const categoryStorage = new FileStorage<DocumentCategory>('documentCategories');

    useEffect(() => {
        loadCategories();
    }, [tenantId]);

    const loadCategories = () => {
        const data = categoryStorage.getAll(tenantId);
        setCategories(data);
    };

    const handleSave = (categoryData: Omit<DocumentCategory, 'id'>) => {
        if (editingCategory) {
            categoryStorage.update(editingCategory.id, categoryData, tenantId);
        } else {
            categoryStorage.create(categoryData);
        }
        loadCategories();
        setShowForm(false);
        setEditingCategory(null);
    };

    const handleEdit = (category: DocumentCategory) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            categoryStorage.delete(id, tenantId);
            loadCategories();
        }
    };

    return (
        <div className="container mt-4" style={{ marginLeft: '250px' }}>
            <h2>Document Category Management</h2>
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
                <CategoryForm
                    category={editingCategory}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingCategory(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(category)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(category.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingCategory(null); setShowForm(true); }}>Add New Category</button>
        </div>
    );
};

interface CategoryFormProps {
    category: DocumentCategory | null;
    onSave: (category: Omit<DocumentCategory, 'id'>) => void;
    onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        description: category?.description || '',
        tenant_id: category?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{category ? 'Edit Category' : 'Add New Category'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter category name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
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
                    <button type="submit" className="btn btn-primary me-2">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default CategoryManagement;
