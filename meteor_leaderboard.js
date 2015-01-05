// Create a MongoDB Collection which works on the client and also on the server, like a "global variable"
PlayerList = new Mongo.Collection('players');

if(Meteor.isClient) {

    // Helper functions execute code within templates
    Template.leaderboard.helpers({
        'player': function() {
            // Retrieve all of the data from the "PlayersList" collection
            return PlayerList.find();
        }
    });

};



if(Meteor.isServer) {

};
