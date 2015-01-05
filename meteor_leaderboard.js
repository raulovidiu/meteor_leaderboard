// Create a MongoDB Collection which works on the client and also on the server, like a "global variable"
PlayersList = new Mongo.Collection('players');

if(Meteor.isClient) {
    // Helper functions execute code within templates
    Template.leaderboard.helpers({
        'player': function() {
            // Retrieve all of the data from the "PlayersList" collection
            return PlayersList.find();
        }
    });

    // Events trigger code when certain actions are taken
    Template.leaderboard.events({
        'click .player': function() {
            console.log("clicked on a li from the .player class");
        }
    });
};



if(Meteor.isServer) {

};
