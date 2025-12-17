export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ data: [] });
  } else if (req.method === 'POST') {
    // Handle customer creation
    const customerData = req.body;
    // Add ID and return success
    const newCustomer = { ...customerData, id: Date.now() };
    res.status(201).json({ result: newCustomer });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}