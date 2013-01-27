var games = new Meteor.Collection('games');
var elements = [
{
    element_id: 'esparadrapo'
}, 
{
    element_id: 'bisturi'
}, 
{
    element_id: 'seringa'
}, 
{
    element_id: 'sangue'
}, 
{
    element_id: 'desfibrila'
}, 
{
    element_id: 'pote'
}];

function randomize() {
    return elements[parseInt(Math.random()*elements.length)].element_id;
}