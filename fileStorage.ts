export interface CrudOperations<T> {
    getAll(tenantId?: number): T[];
    getById(id: number, tenantId?: number): T | undefined;
    create(item: Omit<T, 'id'> & { tenant_id?: number }): T;
    update(id: number, item: Partial<T>, tenantId?: number): T | undefined;
    delete(id: number, tenantId?: number): boolean;
}

export class FileStorage<T extends { id: number; tenant_id?: number }> implements CrudOperations<T> {
    private storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = storageKey;
    }

    private readData(): T[] {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Error reading ${this.storageKey}:`, error);
            return [];
        }
    }

    private writeData(data: T[]): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error(`Error writing ${this.storageKey}:`, error);
        }
    }

    getAll(tenantId?: number): T[] {
        const data = this.readData();
        return tenantId ? data.filter(item => item.tenant_id === tenantId) : data;
    }

    getById(id: number, tenantId?: number): T | undefined {
        const data = this.getAll(tenantId);
        return data.find(item => item.id === id);
    }

    create(item: Omit<T, 'id'> & { tenant_id?: number }): T {
        const data = this.readData();
        const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
        const newItem = { ...item, id: newId } as T;
        data.push(newItem);
        this.writeData(data);
        return newItem;
    }

    update(id: number, item: Partial<T>, tenantId?: number): T | undefined {
        const data = this.readData();
        const index = data.findIndex(d => d.id === id && (!tenantId || d.tenant_id === tenantId));
        if (index !== -1) {
            data[index] = { ...data[index], ...item };
            this.writeData(data);
            return data[index];
        }
        return undefined;
    }

    delete(id: number, tenantId?: number): boolean {
        const data = this.readData();
        const index = data.findIndex(d => d.id === id && (!tenantId || d.tenant_id === tenantId));
        if (index !== -1) {
            data.splice(index, 1);
            this.writeData(data);
            return true;
        }
        return false;
    }
}
