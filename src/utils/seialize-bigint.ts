export const serializeBigInt = (data: any): any => {
    if (typeof data === 'bigint') {
        return data.toString();
    }

    if (data instanceof Date) {
        return data.toISOString(); // Convert Date to ISO string format
    }

    if (Array.isArray(data)) {
        return data.map(serializeBigInt);
    }

    if (data !== null && typeof data === 'object') {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, serializeBigInt(value)])
        );
    }

    return data;
};