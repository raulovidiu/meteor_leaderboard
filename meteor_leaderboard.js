// Create a MongoDB Collection which works on the client and also on the server, like a "global variable"
PlayersList = new Mongo.Collection('players');

if(Meteor.isClient) {
    // Helper functions execute code within templates
    Template.leaderboard.helpers({
        'player': function() {
            var currentUserId = Meteor.userId();
            // Retrieve all of the data from the "PlayersList" collection
            return PlayersList.find({}, {sort: {score: -1, name: 1}});
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
        },

        'showSelectedPlayer': function() {
            var selectedPlayer = Session.get('selectedPlayer');
            return PlayersList.findOne(selectedPlayer);
        }
    });

    Template.leaderboard.events({
        'click .player': function() {
            // Retrieve the unique ID of the player that's been clicked
            var playerId = this._id;
            // Sessions are used to store small pieces of data that isn’t saved to the database
            // and won’t be remembered on return visits.
            // Create a session to store the unique ID of the clicked player
            Session.set('selectedPlayer', playerId);
        },

        'click .increment': function() {
            var selectedPlayer = Session.get('selectedPlayer');
            PlayersList.update(selectedPlayer, {$inc: {score: 5}});
        },

        'click .decrement': function() {
            var selectedPlayer = Session.get('selectedPlayer');
            PlayersList.update(selectedPlayer, {$inc: {score: -3}});
        },

        'click .remove': function() {
            var selectedPlayer = Session.get('selectedPlayer');
            PlayersList.remove(selectedPlayer);
        }
    });

    Template.addPlayerForm.events({
        'submit form': function(event) {
            event.preventDefault();
            var playerNameVar = event.target.playerName.value;
            var currentUserId = Meteor.userId();
            PlayersList.insert({
                name: playerNameVar,
                score: 0,
                createdBy: currentUserId
            });
        }
    });

    Meteor.subscribe('thePlayers');
};



if(Meteor.isServer) {
    Meteor.publish('thePlayers', function() {
        var currentUserId = this.userId;
        return PlayersList.find({createdBy: currentUserId});
    });
};
