const {userData}=require('../models');

exports.getVideoCallUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userData = await userData.findByPk(id);
        if (!userData) {
            return res.status(404).json({ error: 'user not found' });
        }
       return res.status(200).json({data: userData,success: 'Message deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
exports.addVideoCallUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userData = await userData.findByPk(id);
        if (!userData) {
            return res.status(404).json({ error: 'user not found' });
        }
       return res.status(200).json({data: userData,success: 'Message deleted successfully' });
      }catch (err) {
        return res.status(500).json({ error: err.message });
   }
};