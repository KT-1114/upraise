const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

module.exports = (supabase) => {
  const router = express.Router();
  router.use(authMiddleware); // Protect all routes using auth middleware

  // Utility: Generate codename
  const codenames = ["The Nightingale", "The Kraken", "The Wraith", "The Phantom", "The Falcon", "The Viper", "The Shadow", "The Spectre", "The Raven", "The Lynx", "The Cheetah", "The Falcon", "The Eagle", "The Wolf", "The Tiger", "The Panther", "The Cobra", "The Scorpion", "The Mantis", "The Chameleon", "The Gecko"];
  const generateCodename = () => codenames[Math.floor(Math.random() * codenames.length)];

  // Utility: Generate mission success probability
  const getRandomSuccessProbability = () => Math.floor(Math.random() * 31) + 70;

  // Utility: Generate confirmation code
  const generateConfirmationCode = () => Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code

  // GET /gadgets?status=Available
  router.get('/', async (req, res) => {
    const { status } = req.query;

    let query = supabase.from('gadgets').select('*');
    if (status) query = query.eq('status', status); //check whether status is provided or not

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });

    // Add mission success probability
    const gadgetsWithProbability = data.map(gadget => ({
      ...gadget,
      mission_success_probability: `${getRandomSuccessProbability()}%`
    }));

    res.json(gadgetsWithProbability);
  });

  // POST /gadgets
  // Status of enum type with valid set of values: available, deployed, destroyed, decommissioned and is case sensitive.
  router.post('/', async (req, res) => {
    const { status } = req.body;
    const name = generateCodename();

    const { data, error } = await supabase.from('gadgets').insert([{ name, status }]).select();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(data[0]);
  });

  // PATCH /gadgets/:id
  router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = {
      ...req.body,
      last_updated_at: new Date().toISOString(), //time can be updated using triggers also
    };

    const { data, error } = await supabase.from('gadgets').update(updates).eq('id', id).select();

    if (error) return res.status(500).json({ error: error.message });

    res.json(data[0]);
  });

  // DELETE /gadgets/:id
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase.from('gadgets')
      .update({ status: 'decommissioned', decommissioned_at: new Date().toISOString() }) //time can be updated using triggers also
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: `Gadget ${id} decommissioned.`, data: data[0] });
  });

  // POST /gadgets/:id/self-destruct
  router.post('/:id/self-destruct', async (req, res) => {
    const { id } = req.params;
    const code = generateConfirmationCode();

    // This is just simulation
    res.json({
      message: `Self-destruct sequence initiated for gadget ${id}.`,
      confirmation_code: code
    });
  });

  return router;
};
