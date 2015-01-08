PlayersList = new Mongo.Collection('players');

if(Meteor.isClient) {
    // Helper functions execute code within templates
    Template.leaderboard.helpers({
        'player': function() {
            var currentUserId = Meteor.userId();
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
            Meteor.call('modifyPlayerScore', selectedPlayer, 5);
        },

        'click .decrement': function() {
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('modifyPlayerScore', selectedPlayer, -5);
        },

        'click .remove': function() {
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('removePlayerData', selectedPlayer);
        }
    });

    Template.addPlayerForm.events({
        'submit form': function(event) {
            event.preventDefault();
            var playerNameVar = event.target.playerName.value;
            Meteor.call('insertPlayerData', playerNameVar);
        }
    });

    Meteor.subscribe('thePlayers');
};



if(Meteor.isServer) {
    Meteor.publish('thePlayers', function() {
        var currentUserId = this.userId;
        return PlayersList.find({createdBy: currentUserId});
    });

    Meteor.methods({
        'insertPlayerData': function(playerNameVar) {
            var currentUserId = Meteor.userId();
            PlayersList.insert({
                name: playerNameVar,
                score: 0,
                createdBy: currentUserId
            });
        },

        'removePlayerData': function(selectedPlayer) {
            PlayersList.remove(selectedPlayer);
        },

        'modifyPlayerScore': function(selectedPlayer, scoreValue) {
            PlayersList.update(selectedPlayer, {$inc: {score: scoreValue}});
        }
    });
};
