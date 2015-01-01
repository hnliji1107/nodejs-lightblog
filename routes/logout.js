module.exports = function(req, res) {
	if (req.session.user) {
		req.session.user = null;
	}
	res.redirect('/');
}