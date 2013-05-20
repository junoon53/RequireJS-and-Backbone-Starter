var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('localhost', 'testing_invitees');
 
var userSchema = new Schema({
    firstName: String
});
var users = mongoose.model('users', userSchema);
 
var eventMemberSchema = new Schema ({   
    user: { type : Schema.ObjectId, ref : 'users' },
});
var eventSchema = new Schema({
    invitees : [eventMemberSchema]
});
 
 
var events = mongoose.model('events', eventSchema);
 
mongoose.connection.on('open', function () {

  var user = new users({ firstName: 'aaron' });
  user.save(function (err) {
    if (err) throw err; 
 
    var event = new events;
    event.invitees = [{ user: user._id }];
    event.save(function (err, data) {
      if (err) return console.error(err.stack||err);
 
      events.find({ 'invitees._id': data.invitees[0]._id })
      .populate('invitees.user')
      .exec(function (err, docs) {
        if (err) console.error(err.stack||err);
        console.error('populated user of first result', docs[0].invitees[0]);
 
        mongoose.connection.db.dropDatabase(function () {
          mongoose.connection.close();
        });    
      });
    })
  });
});
