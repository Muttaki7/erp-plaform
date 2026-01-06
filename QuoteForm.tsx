import React, { useState, useEffect } from 'react';

interface Quote {
    id: number;
    quote_number: string;
    customer_id: number;
    valid_until: string;
    items: QuoteItem[];
    total_amount: number;
    status: 'draft' | 'sent' | 'accepted' | 'rejected';
    tenant_id: number;
}

interface QuoteItem {
    id: number;
    item_id: number;
    quantity: number;
    unit_price: number;
    total: number;
}

interface Customer {
    id: number;
    name: string;
    tenant_id: number;
}

interface InventoryItem {
    id: number;
    name: string;
    unit_price: number;
    tenant_id: number;
}

const QuoteForm: React.FC = () => {
    const [formData, setFormData] = useState({
        quote_number: '',
        customer_id: 0,
        valid_until: new Date().toISOString().split('T')[0],
        items: [] as QuoteItem[],
        total_amount: 0,
        status: 'draft' as 'draft' | 'sent' | 'accepted' | 'rejected',
        tenant_id: 1
    });
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

    const { FileStorage } = require('../../utils/fileStorage');
    const quoteStorage = new FileStorage<Quote>('quotes');
    const customerStorage = new FileStorage<Customer>('customers');
    const itemStorage = new FileStorage<InventoryItem>('inventoryItems');

    useEffect(() => {
        const customerData = customerStorage.getAll(formData.tenant_id);
        setCustomers(customerData);
        const itemData = itemStorage.getAll(formData.tenant_id);
        setInventoryItems(itemData);
    }, [formData.tenant_id]);

    const addItem = () => {
        const newItem: QuoteItem = {
            id: Date.now(),
            item_id: 0,
            quantity: 1,
            unit_price: 0,
            total: 0
        };
        setFormData({ ...formData, items: [...formData.items, newItem] });
    };

    const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
        const updatedItems = [...formData.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        if (field === 'item_id') {
            const selectedItem = inventoryItems.find(item => item.id === value);
            if (selectedItem) {
                updatedItems[index].unit_price = selectedItem.unit_price;
            }
        }
        updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unit_price;
        const totalAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);
        setFormData({ ...formData, items: updatedItems, total_amount: totalAmount });
    };

    const removeItem = (index: number) => {
        const updatedItems = formData.items.filter((_, i) => i !== index);
        const totalAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);
        setFormData({ ...formData, items: updatedItems, total_amount: totalAmount });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        quoteStorage.create(formData);
        // Reset form
        setFormData({
            quote_number: '',
            customer_id: 0,
            valid_until: new Date().toISOString().split('T')[0],
            items: [],
            total_amount: 0,
            status: 'draft',
            tenant_id: 1
        });
        alert('Quote created successfully!');
    };

    return (
        <div className="container mt-4">
            <h2>Create Quote</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Quote Number</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter quote number"
                                value={formData.quote_number}
                                onChange={(e) => setFormData({ ...formData, quote_number: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Customer</label>
                            <select
                                className="form-select"
                                title="Select customer"
                                value={formData.customer_id}
                                onChange={(e) => setFormData({ ...formData, customer_id: parseInt(e.target.value) })}
                                required
                            >
                                <option value={0}>Select Customer</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Valid Until</label>
                            <input
                                type="date"
                                className="form-control"
                                value={formData.valid_until}
                                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Tenant ID</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter tenant ID"
                                value={formData.tenant_id}
                                onChange={(e) => setFormData({ ...formData, tenant_id: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Items</label>
                    {formData.items.map((item, index) => (
                        <div key={item.id} className="row mb-2">
                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    title="Select item"
                                    value={item.item_id}
                                    onChange={(e) => updateItem(index, 'item_id', parseInt(e.target.value))}
                                >
                                    <option value={0}>Select Item</option>
                                    {inventoryItems.map(invItem => (
                                        <option key={invItem.id} value={invItem.id}>{invItem.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Unit Price"
                                    value={item.unit_price}
                                    onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    value={item.total.toFixed(2)}
                                    readOnly
                                />
                            </div>
                            <div className="col-md-1">
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(index)}>Remove</button>
                            </div>
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>Add Item</button>
                </div>
                <div className="mb-3">
                    <label className="form-label">Total Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.total_amount.toFixed(2)}
                        readOnly
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Quote</button>
            </form>
        </div>
    );
};

export default QuoteForm;
