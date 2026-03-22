/**
 * Cloudflare Worker - Remove.bg Proxy
 * Receives image from browser, forwards to remove.bg API, returns result
 */

const REMOVE_BG_API_KEY = REMOVE_BG_API_KEY;
const API_URL = 'https://api.remove.bg/v1.0/removebg';

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const formData = await request.formData();
      const imageFile = formData.get('image_file');

      if (!imageFile) {
        return jsonResponse({ error: 'No image provided' }, 400);
      }

      // Forward to remove.bg
      const rbFormData = new FormData();
      rbFormData.append('image_file', imageFile);
      rbFormData.append('size', 'auto');
      rbFormData.append('format', 'png');

      const rbResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'X-Api-Key': REMOVE_BG_API_KEY,
        },
        body: rbFormData,
      });

      if (!rbResponse.ok) {
        const errorText = await rbResponse.text();
        return jsonResponse({ error: `remove.bg error: ${errorText}` }, rbResponse.status);
      }

      const resultBuffer = await rbResponse.arrayBuffer();

      return new Response(resultBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (err) {
      return jsonResponse({ error: err.message }, 500);
    }
  },
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
