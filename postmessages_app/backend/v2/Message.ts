
import mongoose = require('mongoose');


// A message has some text content, a list of tags and a timestamp
//
export interface Message {
    tags: string[],
    content: string,
    timestamp: Date
}


// User defined type guard
// Type checking cannot be performed during the execution (we don't have the Message interface anyway)
// but we can create a function to check if the supplied parameter is compatible with a given type
//
// A better approach is to use JSON schema
//
export function isMessage(arg: any): arg is Message {
    return arg && arg.content && typeof(arg.content) == 'string' && arg.tags && Array.isArray(arg.tags) && arg.timestamp && arg.timestamp instanceof Date;
}


// We use Mongoose to perform the ODM between our application and
// mongodb. To do that we need to create a Schema and an associated
// data model that will be mapped into a mongodb collection
//
// Type checking cannot be enforced at runtime so we must take care
// of correctly matching the Message interface with the messageSchema 
//
// Mongoose Schema
const messageSchema = new mongoose.Schema( {
    tags: {
        type: [mongoose.SchemaTypes.String],
        required: true
    },
    content:  {
        type: mongoose.SchemaTypes.String,
        required: true 
    },
    timestamp: {
        type: mongoose.SchemaTypes.Date,
        required: true
    }
    // Note: by default, Mongose adds an _id (type: ObjectId) property to each schema
})



// Mongoose Models are responsible for creating and reading 
// documents from the underlying MongoDB database.
//
// A model is "compiled" from a schema definition. The
// first parameter is the "singular name" of the collection
// to use. Mongoose will use the plural, lowercase
// version of the model name.
// 
// In our case, the database will contain a collection
// named 'messages' (which is the plural lowercase of 'Message')

// An instance of a model is called a document, and can be 
// directly saved to the database (see postmessages.ts)

const messageModel = mongoose.model('Message', messageSchema )


export function getModel()  { // export messageModel as a singleton
    return messageModel;
}