/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('traveler');

const r = db.getCollection('random')

// const data = new Array(10000).fill(1).map((_, i) => ({
//     id: `##${i}`,
//     v: Math.floor(497 * Math.random())
// }));

// r.insertMany(data)
// // Insert a few documents into the sales collection.
// r.aggregate([
//     {
//         $set: {
//             me: {
//                 $eq: ['$id', 'vickscarlet9']
//             }
//         }
//     },
//     {
//         $group: {
//             _id: {
//                 me: '$me',
//                 v: '$v',
//             },
//             count: {
//                 $sum: 1
//             }
//         }
//     },
//     {
//         $group: {
//             _id: {
//                 me: '$_id.me'
//             },
//             data: {
//                 $addToSet: {
//                     k: {
//                         $toString: '$_id.v',
//                     },
//                     v: '$count'
//                 }
//             }
//         }
//     },
//     {
//         $project: {
//             _id: 0,
//             me: '$_id.me',
//             data: {
//                 $arrayToObject: '$data'
//             }
//         }
//     }
// ])
//     .toArray()

r.find({}, { _id: 0 })