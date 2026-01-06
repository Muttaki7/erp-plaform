import React, { useState, useEffect } from 'react';

interface Document {
    id: number;
    name: string;
    description: string;
    category: string;
    file_path: string;
    uploaded_by: number;
    upload_date: string;
    tenant_id: number;
}

const DocumentList: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const { FileStorage } = require('../../utils/fileStorage');
    const documentStorage = new FileStorage<Document>('documents');

    useEffect(() => {
        loadDocuments();
    }, [tenantId]);

    const loadDocuments = () => {
        const data = documentStorage.getAll(tenantId);
        setDocuments(data);
    };

    const handleSave = (documentData: Omit<Document, 'id'>) => {
        if (editingDocument) {
            documentStorage.update(editingDocument.id, documentData, tenantId);
        } else {
            documentStorage.create(documentData);
        }
        loadDocuments();
        setShowForm(false);
        setEditingDocument(null);
    };

    const handleEdit = (document: Document) => {
        setEditingDocument(document);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            documentStorage.delete(id, tenantId);
            loadDocuments();
        }
    };

    return (
        <div className="container mt-4">
            <h2>Document Management</h2>
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
                <DocumentForm
                    document={editingDocument}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingDocument(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Uploaded By</th>
                            <th>Upload Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map(document => (
                            <tr key={document.id}>
                                <td>{document.id}</td>
                                <td>{document.name}</td>
                                <td>{document.description}</td>
                                <td>{document.category}</td>
                                <td>{document.uploaded_by}</td>
                                <td>{document.upload_date}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(document)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(document.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingDocument(null); setShowForm(true); }}>Add New Document</button>
        </div>
    );
};

interface DocumentFormProps {
    document: Document | null;
    onSave: (document: Omit<Document, 'id'>) => void;
    onCancel: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ document, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: document?.name || '',
        description: document?.description || '',
        category: document?.category || '',
        file_path: document?.file_path || '',
        uploaded_by: document?.uploaded_by || 1,
        upload_date: document?.upload_date || new Date().toISOString().split('T')[0],
        tenant_id: document?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{document ? 'Edit Document' : 'Add New Document'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter document name"
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
                                <label className="form-label">File Path</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter file path"
                                    value={formData.file_path}
                                    onChange={(e) => setFormData({ ...formData, file_path: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">Uploaded By</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter user ID"
                                    value={formData.uploaded_by}
                                    onChange={(e) => setFormData({ ...formData, uploaded_by: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Upload Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={formData.upload_date}
                            onChange={(e) => setFormData({ ...formData, upload_date: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default DocumentList;
