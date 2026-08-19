fetch('http://localhost:3000/api/verify-client', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ clientId: 'f00904b4902' })
}).then(r => r.json()).then(console.log).catch(console.error);
