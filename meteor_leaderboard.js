// Create a MongoDB Collection which works on the client and also on the server, like a "global variable"
PlayersList = new Mongo.Collection('players');

if(Meteor.isClient) {
    // Helper functions execute code within templates
    Template.leaderboard.helpers({
        'player': function() {
            // Retrieve all of the data from the "PlayersList" collection
            return PlayersList.find();
        },
        'selectedClass': function() {
            // Get the ID of the player being iterated through
            var playerId = this._id;
            // Get the ID of the player that's been clicked
            var selectedPlayer = Session.get('selectedPlayer');
            // If these IDs match, return and aply a css class
            if(playerId === selectedPlayer) {
                return "selected";
            }
        }
    });

    Template.leaderboard.events({
        'click .player': function() {
            var playerId = this._id;
            // Sessions are used to store small pieces of data that isn’t saved to the database
            // and won’t be remembered on return visits.
            Session.set('selectedPlayer', playerId);
        }
    });
};



if(Meteor.isServer) {

};
