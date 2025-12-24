export default function handler(req, res) {
  const mockProducts = [
    { id: 90001, name: 'EXide', price: 15000, category: 'Battery', description: 'High capacity battery' },
    { id: 90002, name: 'Solar Panel 100W', price: 8000, category: 'Solar', description: 'Monocrystalline solar panel' }
  ];

  if (req.method === 'GET') {
    res.status(200).json({ result: mockProducts, err: false });
  } else if (req.method === 'POST') {
    const newProduct = { id: Date.now(), ...req.body };
    res.status(200).json({ result: newProduct, err: false });
  } else {
    res.status(405).json({ err: 'Method not allowed' });
  }
}