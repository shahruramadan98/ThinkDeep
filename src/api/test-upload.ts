/**
 * Test Upload Functions
 * Alternative approaches to debug n8n webhook issues
 */

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || 'http://localhost:5678/webhook/ThinkDeep';

/**
 * Test 1: Upload WITHOUT the 'type' field
 * Sometimes n8n has issues when mixing form fields with binary data
 */
export async function testUploadWithoutType(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file, file.name); // Explicitly add filename

    console.log('Test 1: Upload without type field');

    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    return await response.text();
}

/**
 * Test 2: Upload with 'data' as field name instead of 'file'
 * n8n sometimes expects specific field names
 */
export async function testUploadDataField(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('data', file, file.name);

    console.log('Test 2: Upload with data field name');

    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    return await response.text();
}

/**
 * Test 3: Upload with explicit Content-Type boundary
 * Sometimes helps with parsing
 */
export async function testUploadWithHeaders(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    console.log('Test 3: Upload with file field');

    // Let browser set Content-Type automatically with boundary
    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        // No explicit headers - browser adds multipart/form-data with boundary
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.text();
}

/**
 * Test 4: Simple ping test to verify webhook is accessible
 */
export async function testWebhookPing(): Promise<boolean> {
    try {
        // Send a simple JSON request
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'chat',
                message: 'ping',
            }),
        });

        console.log('Ping test status:', response.status);
        return response.ok;
    } catch (error) {
        console.error('Ping test failed:', error);
        return false;
    }
}

/**
 * Test 5: Check what n8n webhook actually receives
 */
export async function debugWebhookReceive(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('type', 'upload');
    formData.append('file', file);

    console.log('Debug: Sending to', WEBHOOK_URL);

    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
    });

    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text:', text);

    if (!response.ok) {
        console.error('Full response object:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            body: text,
        });
    }

    return {
        status: response.status,
        ok: response.ok,
        body: text,
    };
}
